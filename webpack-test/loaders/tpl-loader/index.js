const { tplReplace } = require("../util")

const { getOptions } = require("loader-utils")

function tplLoader(source) {
  source = source.replace(/\s+/g, "")
  const { log } = getOptions(this)
  const _log = log ? `console.log('正在编译tpl文件')` : ""

  return `
    export default (options) => {
      ${tplReplace.toString()}
      ${_log.toString()}
      return tplReplace('${source}', options)
    }
  `
}

module.exports = tplLoader
