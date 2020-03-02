import Service from './Core'

export default class {
  list = async () => {
    const client = await Service.authorized()

    try {
      const { data } = await client.get('api/users/')
      return Promise.resolve(data)
    }
    catch (err) {
      console.log('err => ', err)
      return Promise.reject()
    }
  }
}
