const path = require('path')
const { isWin } = require('./lib/utils')

const rootDir = __dirname
const dlibRoot = path.join(rootDir, 'dlib')
const dlibSrc = path.join(dlibRoot, 'dlib')
const dlibBuild = path.join(dlibRoot, 'build')
const dlibLocalLib = isWin() ? path.join(dlibBuild, 'dlib/Release/dlib.lib') : path.join(dlibBuild, 'dlib/libdlib.so.19.8.0')

module.exports = {
  rootDir,
  dlibRoot,
  dlibSrc,
  dlibBuild,
  dlibLocalLib
}