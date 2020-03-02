import { map } from 'rxjs/operators'
import { DataSubject } from './subjects'
import { ApiContext, UsersRepository } from './repos'
import { UserSearchForm } from './forms'

export const UsersTypes = {
  EMPTY: 'users.empty',
  ERROR: 'users.error',
  LISTED: 'users.listed'
}

export default new class {
  constructor() {
    this.API_CONTEXT = 'api.users.context'

    this._repository = new UsersRepository()
    this._form = new UserSearchForm()

    this._controller = new DataSubject({
      type: UsersTypes.EMPTY,
      list: []
    })

    this._controller
      .pipe(map(x => x.list))
      .subscribe(list => this._form.data = list)
  }

  get controller() {
    return this._controller
  }

  get form() {
    return this._form
  }

  dispose = async () => {
    this._form.clear()
    this._controller.next({
      type: UsersTypes.EMPTY,
      list: []
    })
  }

  list = async () => {
    await ApiContext.execute(this.API_CONTEXT, async () =>
      this._repository.list()
      .then((data) => {
        this._controller.set({
          type: UsersTypes.LISTED,
          list: data
        })
      })
      .catch((_) => {
        console.log(_)
        this._controller.set({
          type: UsersTypes.ERROR
        })
      })
    )
  }
}
