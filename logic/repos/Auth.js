import Service from './Core'

export default class {
  signin = async ({username, password}) => {
    const client = Service.anonymous()

    const payload = Service.escape({
      Username: username,
      Password: password
    })

    try {
      const { data } = await client.post('/api/auth', payload)
      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
