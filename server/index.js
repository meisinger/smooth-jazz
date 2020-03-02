const express = require('express')
const parser = require('body-parser')

const app = express()
const port = process.env.PORT || 5001

let user_call_counter = 0

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

app.post('/api/auth', (req, res) => {
  setTimeout((() => {
    res.send(Object.assign({}, {
      access_token: 'ABCDEF',
      refresh_token: '123456',
      user_name: 'mock.user@mock.net'
    }))
  }), 1500)
})

app.get('/api/users', (_, res) => {
  if (user_call_counter % 2 === 0) {
    setTimeout((() => {
      res.send([
        { id: 1, firstName: 'Bob', lastName: 'Smith', active: true },
        { id: 2, firstName: 'Steve', lastName: 'Castle', active: true },
        { id: 3, firstName: 'Charlie', lastName: 'Wanka', active: true },
        { id: 4, firstName: 'Victor', lastName: 'Parsnips', active: false }
      ])
    }), 2800)
  } else {
    res.send([
      { id: 1, firstName: 'Bob', lastName: 'Smith', active: true },
      { id: 2, firstName: 'Steve', lastName: 'Castle', active: true }
    ])
  }

  user_call_counter += 1
})

app.listen(port, 
  () => console.log(`Listening on port ${port}`))
