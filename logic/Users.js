import { DataSubject } from './subjects'
import { UsersRepository } from './repos'

export const UsersTypes = {
  EMPTY: 'users.empty',
  ERROR: 'users.error',
  LISTED: 'users.listed'
}

export default new class {
  constructor() {
    this._repository = new UsersRepository()
    this._controller = new DataSubject({
      type: UsersTypes.EMPTY,
      list: []
    })
  }

  get controller() {
    return this._controller
  }

  dispose = async () => {
    this._controller.next({
      type: UsersTypes.EMPTY,
      list: []
    })
  }

  list = async () => {
    await this._repository.list()
      .then((data) => {
        this._controller.set({
          type: UsersTypes.LISTED,
          list: data
        })
      })
      .catch((_) => {
        this._controller.set({
          type: UsersTypes.ERROR
        })
      })
  }
}
