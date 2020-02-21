import { InputSubject, SearchSubject } from '../subjects'

export default class {
  constructor() {
    const user_predicate = (user, term) => {
      return (
        (user.firstName.toUpperCase().indexOf(term) !== -1) ||
        (user.lastName.toUpperCase().indexOf(term) !== -1) ||
        (user.email.toUpperCase().indexOf(term) !== -1)
      )
    }

    this._input = new InputSubject(null)
    this._search = new SearchSubject([], {
      predicate: user_predicate,
      filtering: [
        { name: 'Active', predicate: (item) => item.active },
        { name: 'Inactive', predicate: (item) => !item.active }
      ],
      sorting: [
        { name: 'Active', func: (a, b) => 
          (a.active === b.active) ? 0 : (a.active < b.active) ? 1 : -1 },
        { name: 'First Name ASC', func: (a, b) =>
          (a.firstName === b.firstName) ? 0 : (a.firstName > b.firstName) ? 1 : -1 },
        { name: 'First Name DESC', func: (a, b) => 
          (a.firstName === b.firstName) ? 0 : (a.firstName < b.firstName) ? 1 : -1 },
        { name: 'Last Name ASC', func: (a, b) =>
          (a.lastName === b.lastName) ? 0 : (a.lastName > b.lastName) ? 1 : -1 },
        { name: 'Last Name DESC', func: (a, b) => 
          (a.lastName === b.lastName) ? 0 : (a.lastName < b.lastName) ? 1 : -1 }
      ],
      exclusive_filters: [
        ['Active', 'Inactive']
      ],
      exclusive_sorts: [
        ['First Name ASC', 'First Name DESC'],
        ['Last Name ASC', 'Last Name DESC']
      ]
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