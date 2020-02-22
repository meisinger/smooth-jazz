import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { InputSubject } from '../subjects'

export default class {
  constructor() {
    this._username = new InputSubject(null)
    this._password = new InputSubject(null)

    this._username.asRequired('Email is required.')
    this._username.asEmail('Email is invalid.')
    this._password.asRequired('Password is required.')
  }

  get username() { return this._username }
  get password() { return this._password }

  payload = () => Object.assign({
    Username: this._username.payload,
    Password: this._password.payload
  })

  reset = () => {
    this._username.clear()
    this._password.clear()
  }

  clear = () => {
    this._password.clear()
  }

  valid = () => combineLatest(this._username, this._password)
    .pipe(map(result => {
      const errors = result
        .map(x => x.validate(x.data))
        .some(x => x.error)
      return !errors
    }))
}
