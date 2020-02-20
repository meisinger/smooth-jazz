import { BehaviorSubject } from 'rxjs'

export default class extends BehaviorSubject {
  constructor(value) {
    super(value)
  }

  set = (value) => 
    this.next(Object.assign(this.value, value))
}
