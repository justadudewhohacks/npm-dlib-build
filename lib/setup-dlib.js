const { exec, spawn, isWin } = require('./utils')
const findMsBuild = require('./find-msbuild')
const {
  rootDir,
  dlibRoot,
  dlibSrc,
  dlibBuild,
  dlibLocalLib
} = require('../constants')

function getIfExistsDirCmd(dirname, exists = true) {
  return isWin() ? `if ${!exists ? 'not ' : ''}exist ${dirname}` : ''
}

function getMkDirCmd(dirname) {
  return isWin() ? `${getIfExistsDirCmd(dirname, false)} mkdir ${dirname}` : `mkdir -p ${dirname}`
}

function getRmDirCmd(dirname) {
  return isWin() ? `${getIfExistsDirCmd(dirname)} rd /s /q ${dirname}` : `rm -rf ${dirname}`
}

function getRunBuildCmd() {
  if (isWin()) {
    return findMsBuild()
      .then(msbuild =>
        () => spawn(
          `${msbuild}`,
          ['./dlib/dlib.sln', '/property:Configuration=Release'],
          { cwd: dlibBuild }
        )
      )
  }
  return Promise.resolve(() => spawn('make', ['all'], { cwd: dlibBuild }))
}

function getCmakeFlags() {
  return [dlibSrc]
}

module.exports = function() {
  const repo = 'https://github.com/davisking/dlib.git'
  return getRunBuildCmd().then(runBuildCmd =>
    exec(getMkDirCmd('dlib'), { cwd: rootDir })
      .then(() => exec(getMkDirCmd('build'), { cwd: dlibRoot }))
      .then(() => exec(getRmDirCmd('dlib'), { cwd: dlibRoot }))
      .then(() => spawn('git', ['clone', '--progress', repo], { cwd: dlibRoot }))
      .then(() => spawn('git', ['checkout', 'tags/v19.8', '-b', 'v19.8'], { cwd: dlibSrc }))
      .then(() => spawn('cmake', getCmakeFlags(), { cwd: dlibBuild }))
      .then(runBuildCmd)
  )
}