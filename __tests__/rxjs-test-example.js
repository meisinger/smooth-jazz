import { of } from 'rxjs'

test('of observable works well', done => {
  of('hello').subscribe(data => {
    expect(data).toBe('hello')
    done()
  })
})
