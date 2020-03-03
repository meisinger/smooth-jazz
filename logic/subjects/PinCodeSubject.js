import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

export default class extends BehaviorSubject {
  constructor(length) {
    super({
      count: 0,
      valid: false
    })

    this._controller = new BehaviorSubject([])
    this._controller
      .pipe(map(x => x.length))
      .subscribe(x => {
        this.next({ count: x, valid: x === length })
      })

    this.length = length
  }

  dispose = () => {
    this._controller.next([])
  }

  changed = (value) => {
    const { value: current } = this
    if (current.valid)
      return

    const { value: data } = this._controller
    this._controller.next([...data, { value: value }])
  }
}
