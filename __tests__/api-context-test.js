import 'react-native';
import { takeWhile, map } from 'rxjs/operators'
import { ApiContext, ApiContextTypes, UsersLogic } from '../logic'
import { default as UsersRepository } from '../logic/repos/Users'

jest.mock('../logic/repos/Users')

const mock_list = jest.fn()
UsersRepository.prototype.list = mock_list

describe('with api context', () => {
  let stream$ = undefined

  beforeEach(() => {
  })

  afterEach(() => {
    stream$.unsubscribe()
    UsersLogic.dispose()
  })

  test('the initial state is "idle"', done => {
    stream$ = ApiContext.state
      .subscribe(data => {
        const { type } = data
        expect(type).toBe(ApiContextTypes.IDLE)
        done()
      })
  })

  test('the state changes to "waiting"', async done => {
    UsersLogic.list()

    stream$ = ApiContext.state
      .pipe(
        takeWhile(x => x.type !== ApiContextTypes.IDLE)
      )
      .subscribe({
        next: data => {
          const { type } = data
          expect(type).toBe(ApiContextTypes.WAITING)
        },
        complete: done
      })
  })

  test('waiting indicates state correctly', async done => {
    UsersLogic.list()

    stream$ = ApiContext.waiting()
      .pipe(
        takeWhile(x => !!x)
      )
      .subscribe({
        next: state => {
          expect(state).toBe(true)
        },
        complete: done
      })
  })

  test('waiting by context indicates state correctly', async done => {
    UsersLogic.list()

    stream$ = ApiContext.waiting(UsersLogic.API_CONTEXT)
      .pipe(
        takeWhile(x => !!x)
      )
      .subscribe({
        next: state => {
          expect(state).toBe(true)
        },
        complete: done
      })
  })

})
