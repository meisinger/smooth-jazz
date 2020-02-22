import { InputSubject, SearchSubject } from '../subjects'

export default class {
  constructor({
    predicate,
    filtering = [],
    sorting = [],
    exclusive_filters = [],
    exclusive_sorts = []} = {}) { 

    this._input = new InputSubject(null)
    this._search = new SearchSubject([], {
      predicate, filtering, sorting, exclusive_filters, exclusive_sorts
    })

    this._input.subscribe(state => {
      this._search.search(state.data)
    })
  }

  get filters() { return this._search.filters }
  get sorts() { return this._search.sorts }
  get input() { return this._input }

  get data() { return this._search.collection }
  set data(collection) { this._search.next(collection) }

  clear = () => {
    this._input.clear()
    this._search.clear()
  }

  filter = (name) => 
    this._search.filter(name)

  sort = (name) => 
    this._search.sort(name)

  search = (term) =>
    this._search.search(term)
}