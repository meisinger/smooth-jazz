import 'react-native';
import { InputSubject } from '../logic/subjects'

describe('input subject', () => {
  describe('dirty flag', () => {
    it('should be false when initialized', () => {
      const input = new InputSubject('initial value')
      expect(input.value.dirty).toBe(false)
    })

    it('should be true when value changed', () => {
      const input = new InputSubject('initial value')
      expect(input.value.dirty).toBe(false)

      input.changed('new value')
      expect(input.value.dirty).toBe(true)
    })

    it('should be false when value equals initial', () => {
      const input = new InputSubject('initial value')
      expect(input.value.dirty).toBe(false)

      input.changed('new value')
      expect(input.value.dirty).toBe(true)

      input.changed('initial value')
      expect(input.value.dirty).toBe(false)
    })
  })

  describe('when as required', () => {
    it('should be in error when empty', () => {
      const input = new InputSubject(null)
      input.asRequired('Value is required')
      input.validate()

      expect(input.value.error).toBe(true)
      expect(input.value.errorMessage).toBe('Value is required')
    })

    it('should not valid when not empty', () => {
      const input = new InputSubject(null)
      input.asRequired('Value is required')
      input.changed('new value')

      expect(input.value.error).toBe(false)
    })
  })

  describe('when as email', () => {
    it('should be in error when value is not an email', () => {
      const input = new InputSubject(null)
      input.asEmail('Invalid email address')
      input.changed('clearly-not-valid')

      expect(input.value.error).toBe(true)
      expect(input.value.errorMessage).toBe('Invalid email address')
    })

    it('should be valid with proper email', () => {
      const input = new InputSubject(null)
      input.asEmail('Invalid email address')
      input.changed('mock@mock.net')

      expect(input.value.error).toBe(false)
    })
  })

  describe('when as matching', () => {
    it('should be in error when values do not match', () => {
      const input_source = new InputSubject(null)
      const input_match = new InputSubject(null)
      input_match.asMatch(input_source, 'Values must match')

      input_source.changed('new value one')
      input_match.changed('new value two')

      expect(input_match.value.error).toBe(true)
      expect(input_match.value.errorMessage).toBe('Values must match')
    })

    it('should be valid when values match', () => {
      const input_source = new InputSubject(null)
      const input_match = new InputSubject(null)
      input_match.asMatch(input_source, 'Values must match')

      input_source.changed('new value')
      input_match.changed('new value')

      expect(input_match.value.error).toBe(false)
    })
  })

})