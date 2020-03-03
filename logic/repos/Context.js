import { BehaviorSubject, merge } from 'rxjs'
import { map, skip, first, delay, distinctUntilChanged } from 'rxjs/operators'

export const ApiContextTypes = {
  IDLE: 'repo.api.context.idle',
  WAITING: 'repo.api.context.waiting',
  REQUEST: 'repo.api.context.request',
  SUCCESS: 'repo.api.context.success',
  FAILURE: 'repo.api.context.failure'
}

export default new class {
  constructor() {
    this._manager = new BehaviorSubject(false)
    this._stream_wait$ = undefined
    this._stream_idle$ = undefined
    this._stream$ = undefined

    this._handles = new BehaviorSubject([])
    this._controller = new BehaviorSubject({
      type: ApiContextTypes.IDLE
    })

    this._handles
      .pipe(map(_ => _.some(x => x.count > 0)))
      .subscribe(waiting => {
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

  get loading() {
    return this._manager
      .pipe(distinctUntilChanged())
  }

  request = (context) => {
    this._wait()

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

  _wait = async () => {
    if (this._stream$)
      return

    this._stream_wait$ = this._controller
      .pipe(
        skip(1),
        first(x => x.type === ApiContextTypes.WAITING),
        delay(750),
      )

    this._stream_idle$ = this._controller
      .pipe(
        skip(1),
        first(x => x.type === ApiContextTypes.IDLE),
      )

    this._stream$ = merge(this._stream_wait$, this._stream_idle$)
      .subscribe((state) => {
        this._manager.next((state.type === ApiContextTypes.WAITING))

        if (state.type === ApiContextTypes.IDLE)
          this._wait_cleanup()
      })
  }

  _wait_cleanup = async () => {
    this._stream_wait$.unsubscribe()
    this._stream_wait$ = undefined

    this._stream_idle$.unsubscribe()
    this._stream_idle$ = undefined

    this._stream$.unsubscribe()
    this._stream$ = undefined
  }
}
