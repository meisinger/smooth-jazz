import Service from './Core'

export default class {
  signin = async ({Username, Password}) => {
    const client = Service.anonymous()

    const payload = Service.escape({
      Username: Username,
      Password: Password
    })

    try {
      const { data } = await client.post('api/auth', payload)
      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
