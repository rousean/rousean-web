function tplReplace(template, replaceObject) {
  return template.replace(/\{\{(.*?)\}\}/g, function (match, key) {
    return replaceObject[key]
  })
}

module.exports = {
  tplReplace,
}
