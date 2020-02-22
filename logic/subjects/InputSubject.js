import DataSubject from './DataSubject'
import * as Validators from './Validators'

const validate = (validators) => (value) => {
  const errors = validators.map(func => func(value))
    .filter(result => result && result.error)
    .map(result => result.errorMessage)

  return {
    error: (errors && !!errors.length),
    errorMessage: errors.shift()
  }
}

export default class extends DataSubject {
  constructor(data) {
    super({
      data: data,
      dirty: false,
      error: false,
      errorMessage: undefined,
      validate: undefined
    })

    this.validators = []
    this._initial = data
    super.value.validate = this._validate.bind(this, this.validators)
  }

  get asRequired() {
    return Validators.asRequired(this)
  }

  get asEmail() {
    return Validators.asEmail(this)
  }

  get asMatch() {
    return Validators.asMatch(this)
  }

  get changed() {
    return (value) => {
      const valid = this.value.validate(value)
      const data = Object.assign({
        data: value,
        dirty: (value !== this._initial)
      }, valid)

      this.set(data)
    }
  }

  get payload() {
    return this.value.data
  }

  clear = () => this.set(Object.assign({
    data: this.initial,
    dirty: false,
    error: false,
    errorMessage: undefined
  }))

  validate = () => {
    const { data, validate } = this.value
    this.set(validate(data))
  }

  _validate = (validators, value) => {
    const errors = validators.map(func => func(value))
      .filter(result => result && result.error)
      .map(result => result.errorMessage)

    return {
      error: (errors && !!errors.length),
      errorMessage: errors.shift()
    }
  }
}
