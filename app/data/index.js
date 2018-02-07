var data = require('./data.json')

if (process.env.NODE_ENV === 'production') {
  data = require('./data.production.json')
}

export default data
