import 'react-native';
import { TrueSubject } from '../logic/subjects'

describe('true subject', () => {
  describe('dirty flag', () => {
    it('should be false when initialized', () => {
      const input = new TrueSubject()
      expect(input.value.dirty).toBe(false)
    })

    it('should be true when value changed', () => {
      const input = new TrueSubject()
      expect(input.value.dirty).toBe(false)

      input.changed(true)
      expect(input.value.dirty).toBe(true)
    })

    it('should be false when value equals initial', () => {
      const input = new TrueSubject()
      expect(input.value.dirty).toBe(false)

      input.changed(true)
      expect(input.value.dirty).toBe(true)

      input.changed(false)
      expect(input.value.dirty).toBe(false)
    })
  })

  describe('validation', () => {
    it('should be in error when false', () => {
      const input = new TrueSubject('Should be true')
      input.validate()

      expect(input.value.error).toBe(true)
      expect(input.value.errorMessage).toBe('Should be true')
    })

    it('should be valid when true', () => {
      const input = new TrueSubject('Should be true')
      input.changed(true)
      
      expect(input.value.error).toBe(false)
    })
  })

})