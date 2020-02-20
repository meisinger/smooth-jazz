import Service from './Core'

export default class {
  list = async () => {
    const client = Service.authorized()

    try {
      const { data } = await client.get('/api/users/')
      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(data)
    }
  }
}
