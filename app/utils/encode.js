function fileEncode (obj) {
  if (typeof(obj) === 'string') {
    return btoa(unescape(encodeURIComponent(obj)))
  }
  else {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj, undefined, '\t'))))
  }
}

export { fileEncode }
