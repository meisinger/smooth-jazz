export const asRequired = (subject) => (message) => {
  subject.validators.push((changed) => {
    if (!changed) {
      return {
        error: true,
        errorMessage: message || 'Value is required'
      }
    }
  })
}

export const asRequiredRule = (subject) => (predicate, message) => {
  subject.validators.push((changed) => {
    if (!predicate(changed)) {
      return {
        error: true,
        errorMessage: message || 'Value is required'
      }
    }
  })
}

export const asEmail = (subject) => (message) => {
  subject.validators.push((changed) => {
    if (!changed)
      return

    const valid = changed.length < 256 && /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(changed)
    if (!valid) {
      return {
        error: true,
        errorMessage: message || 'Email is invalid'
      }
    }
  })
}

export const asMatch = (subject) => (source, message) => {
  subject.validators.push((changed) => {
    if (!changed)
      return

    const { value } = source
    const { data, dirty, error } = value
    if (!dirty || error)
      return

    if (data !== changed) {
      return {
        error: true,
        errorMessage: message || 'Values must match'
      }
    }
  })
}
