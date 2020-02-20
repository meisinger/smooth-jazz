import 'react-native';
import { skip, takeWhile, map } from 'rxjs/operators'
import { UsersLogic, UsersTypes } from '../logic'
import { default as UsersRepository } from '../logic/repos/Users'

jest.mock('../logic/repos/Users')

const mock_list = jest.fn()
UsersRepository.prototype.list = mock_list

const users_success = Promise.resolve([
  { userId: 1, firstName: 'mike' },
  { userId: 2, firstName: 'bob' }
])

describe('with users logic', () => {
  let stream$ = undefined

  beforeEach(() => {
  })

  afterEach(() => {
    stream$.unsubscribe()
    UsersLogic.dispose()
  })

  test('the initial state is "empty"', done => {
    stream$ = UsersLogic.controller
      .subscribe(data => {
        expect(data).toStrictEqual({
          type: UsersTypes.EMPTY,
          list: []
        })
        done()
      })
  })

  describe('list logic', () => {
    test('has state of "listed" after', async done => {
      mock_list.mockReturnValueOnce(users_success)
      await UsersLogic.list()

      stream$ = UsersLogic.controller
        .subscribe({
          next: (data) => {
            const { type, list } = data
            expect(type).toBe(UsersTypes.LISTED)
            done()
          },
        })

    })
  })

})
