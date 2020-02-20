import 'react-native';
import { skip, takeWhile, map } from 'rxjs/operators'
import { AuthLogic, AuthTypes } from '../logic'
import { default as AuthRepository } from '../logic/repos/Auth'

jest.mock('../logic/repos/Auth')

const mock_signin = jest.fn()
AuthRepository.prototype.signin = mock_signin

const auth_success = Promise.resolve({
  access_token: 'ABC',
  refresh_token: 'DEF',
  user_name: 'mock@mock.net'
})

const auth_failure = Promise.reject({
  error: 'idiot'
})

describe('with auth logic', () => {
  let stream$ = undefined

  beforeEach(() => {
  })

  afterEach(() => {
    stream$.unsubscribe()
    AuthLogic.dispose()
  })

  test('the initial state is "not-authenticated"', done => {
    stream$ = AuthLogic.controller
      .subscribe(data => {
        expect(data).toStrictEqual({
          type: AuthTypes.NOT_AUTHENTICTED,
          profile: undefined
        })
        done()
      })
  })

  describe('signin logic', () => {
    test('has state of "signin" after login', done => {
      const form = AuthLogic.form
      form.username.changed('mock@mock.net')
      form.password.changed('password')

      mock_signin.mockReturnValueOnce(auth_success)
      AuthLogic.login()

      stream$ = AuthLogic.controller
        .pipe(
          takeWhile(x => 
            x.type !== AuthTypes.AUTHENTICATED &&
            x.type !== AuthTypes.NOT_AUTHENTICTED
          )
        )
        .subscribe({
          next: (data) => {
            expect(data).toStrictEqual({
              type: AuthTypes.SIGNIN,
              profile: undefined
            })
          }, 
          complete: () => done()
        })

    })

    test('has state of "authenticated" after login', done => {
      const form = AuthLogic.form
      form.username.changed('mock@mock.net')
      form.password.changed('password')

      mock_signin.mockReturnValueOnce(auth_success)
      AuthLogic.login()

      stream$ = AuthLogic.controller
        .pipe(skip(1))
        .subscribe(data => {
          expect(data).toStrictEqual({
            type: AuthTypes.AUTHENTICATED,
            profile: {
              access_token: 'ABC',
              refresh_token: 'DEF',
              auth: {
                user_name: 'mock@mock.net'
              }
            }
          })
          done()
        })
    })

    test('has state of "error" after login error', done => {
      const form = AuthLogic.form
      form.username.changed('mock@mock.net')
      form.password.changed('password')

      mock_signin.mockReturnValueOnce(auth_failure)
      AuthLogic.login()

      stream$ = AuthLogic.controller
        .pipe(
          skip(1),
          takeWhile(x => x.type === AuthTypes.NOT_AUTHENTICTED)
        )
        .subscribe({
          next: data => {
            expect(data).toStrictEqual({
              type: AuthTypes.ERROR,
              profile: undefined
            })
          },
          complete: () => done()
        })
    })
  })

  describe('signout logic', () => {
    test('has state of "signout" after logout', done => {
      AuthLogic.logout()

      stream$ = AuthLogic.controller
        .pipe(
          takeWhile(x => x.type === AuthTypes.NOT_AUTHENTICTED)
        )
        .subscribe({
          next: (data) => {
            expect(data).toStrictEqual({
              type: AuthTypes.SIGNOUT,
              profile: undefined
            })
          },
          complete: () => done()
        })

    })

    test('has state of "not authenticated" after login', done => {
      AuthLogic.logout()

      stream$ = AuthLogic.controller
        .pipe(skip(1))
        .subscribe(data => {
          expect(data).toStrictEqual({
            type: AuthTypes.NOT_AUTHENTICTED,
            profile: undefined
          })
          done()
        })
    })
  })

})
