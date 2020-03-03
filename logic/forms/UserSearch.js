import { default as Search } from './Search'

const predicate = (user, term) => {
  return (
    (user.firstName.toUpperCase().indexOf(term) !== -1) ||
    (user.lastName.toUpperCase().indexOf(term) !== -1)
  )
}

const filtering = [
  { name: 'Active', predicate: (item) => item.active },
  { name: 'Inactive', predicate: (item) => !item.active }
]

const sorting = [
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
]

const exclusive_filters = [
  ['Active', 'Inactive']
]

const exclusive_sorts = [
  ['First Name ASC', 'First Name DESC'],
  ['Last Name ASC', 'Last Name DESC']
]

export default class extends Search {
  constructor() {
    super({ predicate, filtering, sorting, exclusive_filters, exclusive_sorts })
  }
}
