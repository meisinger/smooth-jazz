import storage from '@react-native-community/async-storage'
import { BehaviorSubject } from 'rxjs'
import { DataSubject } from './subjects'
import { ApiContext, AuthRepository } from './repos'
import { AuthForm } from './forms'

export const AuthTypes = {
  ERROR: 'auth.status.error',
  SIGNIN: 'auth.status.signin',
  SIGNOUT: 'auth.status.signout',
  AUTHENTICATED: 'auth.authenticated',
  NOT_AUTHENTICTED: 'auth.not-authenticated'
}

export default new class {
  constructor() {
    this._repository = new AuthRepository()
    this._form = new AuthForm()

    this._form_valid = new BehaviorSubject(false)
    this._controller = new DataSubject({
      type: AuthTypes.NOT_AUTHENTICTED,
      profile: undefined
    })

    this._form.valid()
      .subscribe(this._form_valid)
  }

  get form() {
    return this._form
  }

  get controller() {
    return this._controller
  }

  dispose = async () => {
    this._form.reset()
    this._controller.next({
      type: AuthTypes.NOT_AUTHENTICTED,
      profile: undefined
    })
  }

  login = async () => {
    const { value: valid_form } = this._form_valid
    if (!valid_form) {
      this._controller.set({ type: AuthTypes.ERROR })
      return
    }

    const payload = this._form.payload()
    this._controller.set({ type: AuthTypes.SIGNIN })
    this._form.clear()

    await ApiContext.execute('API.AUTH', async () => 
      this._repository.signin(payload)
      .then(async (data) => {
        const { access_token, refresh_token, ...auth } = data
        await this._set_tokens(access_token, refresh_token)

        this._controller.set({
          type: AuthTypes.AUTHENTICATED,
          profile: Object.assign({
            access_token,
            refresh_token,
            auth
          })
        })
      })
      .catch(_ => {
        this._controller.set({
          type: AuthTypes.ERROR,
          profile: undefined
        })
      })
    )
  }
  
  logout = async () => {
    this._controller.set({ type: AuthTypes.SIGNOUT })
    await this._remove_tokens()

    this._form.reset()
    this._controller.set({ 
      type: AuthTypes.NOT_AUTHENTICTED, 
      profile: undefined 
    })
  }

  _set_tokens = async (access_token, refresh_token) => {
    await storage.setItem('access-token', access_token)
    await storage.setItem('refresh-token', refresh_token)
  }

  _remove_tokens = async () => {
    await storage.removeItem('access_token')
    await storage.removeItem('refresh_token')
  }
}
