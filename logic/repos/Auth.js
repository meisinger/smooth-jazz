import Service from './Core'

export default class {
  signin = async ({username, password}) => {
    const client = Service.anonymous()

    const payload = Service.escape({
      Username: username,
      Password: password
    })

    try {
      // const { data } = await client.post('/api/auth', payload)
      const data = Object.assign({
        access_token: 'abcdef',
        refresh_token: '123456',
        user_name: 'hello@who.wrong'
      })

      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
