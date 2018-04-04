var object = require('json-templater/object')
var jsonfile = require('jsonfile')

var contentJSONPath = './content.json'

const generatedContent = object(
  require('./content.template.json'),
  { address: '1MzSDy3x8cFrt3P2YkXNN7ogYDFfKX6hnP' }
)

jsonfile.writeFile(contentJSONPath, generatedContent, {spaces: 2, EOL: '\r\n'}, () => {
  console.log('DONE')
})
