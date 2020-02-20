import storage from '@react-native-community/async-storage'
import axios from 'axios'

let refreshing = false
let requests = []

const token_refreshed = (token) => {
  requests = requests.filter(cb => cb(token))
}

const token_error = () => {
  requests = requests.filter(cb => cb())
}

const token_callback = (cb) => 
  requests.push(cb)

const token_refresh = async (token) => {
  const client = Service.anonymous()

  try {
    const { data } = await client.post(`/api/auth/${token}/refresh`)
    const { access_token, refresh_token } = data
    await storage.setItem('access-token', access_token)
    await storage.setItem('refresh-token', refresh_token)

    return Promise.resolve(data)
  }
  catch (err) {
    return Promise.reject(err)
  }
}

const Service = new class {
  escape = (data) => Object.keys(data)
    .reduce((pairs, key) => {
      for (let value of [].concat(data[key]))
        pairs.push([`${key}`, `${value}`])
      return pairs
    }, [])
    .map(pair => pair.map(encodeURIComponent).join('='))
    .join('&')

  resource = (config = {}) => {
    return axios.create(config)
  }

  anonymous = (config = {}, headers = {}) => {
    const request_config = Object.assign({
      baseURL: '',
      timeout: 30000,
      headers: Object.assign({
        'X-Api-Client': 'React-Native'
      }, headers)
    }, config)

    return axios.create(request_config)
  }

  authorized = async (config = {}) => {
    const access_token = await storage.getItem('access-token')
    const request_config = Object.assign({
      baseURL: '',
      timeout: 30000,
      headers: Object.assign({
        'Authorization': `bearer ${access_token}`,
        'X-Api-Client': 'React-Native'
      }),
    }, config)

    const request = axios.create(request_config)
    request.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response: { status }} = error
        const original = config

        if (status === 401) {
          if (!refreshing) {
            refreshing = true

            const refresh_token = await storage.getItem('refresh-token')
            token_refresh(refresh_token)
              .then(({ access_token }) => {
                refreshing = false
                token_refreshed(access_token)
              })
              .catch(() => {
                token_error()
              })
          }

          return new Promise(
            (resolve) => {
              token_callback((access_token) => {
                original.headers.Authorization = `bearer ${access_token}`
                resolve(axios(original))
              })
            }
          )
        }

        return Promise.reject(error)
      }
    )

    return request
  }
}

export default Service
