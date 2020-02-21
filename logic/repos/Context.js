import { BehaviorSubject, of } from 'rxjs'
import { mergeMap, map, filter } from 'rxjs/operators'

export const ApiContextTypes = {
  IDLE: 'repo.api.context.idle',
  WAITING: 'repo.api.context.waiting',
  REQUEST: 'repo.api.context.request',
  SUCCESS: 'repo.api.context.success',
  FAILURE: 'repo.api.context.failure'
}

export default new class {
  constructor() {
    this._handles = new BehaviorSubject([])
    this._controller = new BehaviorSubject({
      type: ApiContextTypes.IDLE
    })

    this._handles
      .subscribe((handles) => {
        const waiting = handles.some(x => x.count > 0)
        this._controller.next({
          type: (waiting)
            ? ApiContextTypes.WAITING
            : ApiContextTypes.IDLE
        })
      })
  }

  get state() {
    return this._controller
  }

  get waiting() {
    return (context) => this._handles
      .pipe(
        map(_ => _
          .filter(x => !context ? true : x.context === context)
          .some(x => x.count > 0))
      )
  }

  request = (context) => {
    const { value: handles = []} = this._handles
    const handle_entry = Object.assign({}, {
      type: ApiContextTypes.REQUEST,
      context: context,
      count: 1
    })

    const context_index = handles.findIndex(_ => _.context === context)
    if (context_index === -1) {
      this._handles.next([...handles, handle_entry])
      return
    }

    const update = handles.map((handle, i) => {
      return (i !== context_index)
        ? handle
        : Object.assign(handle, handle_entry, { count: handle.count + 1 })
    })

    this._handles.next(update)
  }

  success = (context) => {
    const { value: handles = []} = this._handles
    const context_index = handles.findIndex(_ => _.context === context)
    //TODO: this should be an error of some sort
    if (context_index === -1)
      return

    const handle_entry = Object.assign({}, {
      type: ApiContextTypes.SUCCESS,
      context: context,
      count: 0
    })

    const update = handles.map((handle, i) => {
      return (i !== context_index) ? handle
        : ((handle.count - 1) > 0)
          ? Object.assign(handle, { count: handle.count - 1 })
          : Object.assign(handle, handle_entry)
    })

    this._handles.next(update)
  }

  failure = (context) => {
    const { value: handles = []} = this._handles
    const context_index = handles.findIndex(_ => _.context === context)
    //TODO: this should be an error of some sort
    if (context_index === -1)
      return

    const handle_entry = Object.assign({}, {
      type: ApiContextTypes.FAILURE,
      context: context,
      count: 0
    })

    const update = handles.map((handle, i) => {
      return (i !== context_index) ? handle
        : ((handle.count - 1) > 0)
          ? Object.assign(handle, { count: handle.count - 1 })
          : Object.assign(handle, handle_entry)
    })

    this._handles.next(update)
  }

  execute = async (context, callback) => {
    this.request(context)

    try {
      await callback()
        .then(_ => this.success(context))
        .catch(_ => this.failure(context))
    }
    catch (err) {
      this.failure(context)
    }
  }
}
