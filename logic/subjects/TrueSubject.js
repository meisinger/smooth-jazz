import InputSubject from './InputSubject'

export default class extends InputSubject {
  constructor(message) {
      super(false)

      this.validators.push((changed) => {
         if (!changed)
            return { error: true, errorMessage: message || 'Value must be true'} 
      })
  }
}
