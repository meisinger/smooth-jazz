import { BehaviorSubject, combineLatest } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import DataSubject from './DataSubject'

const search = (predicate) => (collection, term) => {
  const term_fix = term.toUpperCase()
  return (!predicate)
    ? collection
    : collection.filter(_ => predicate(_, term_fix))
}

export default class extends BehaviorSubject {
  constructor(items, {
    predicate,
    filtering = [],
    sorting = [],
    exclusive_filters = [],
    exclusive_sorts = []
  } = {}) {
    super(items)

    this._activeFilters = new DataSubject({
      active: false,
      sequence: [],
      entries: filtering.map(_ => Object.assign({}, _, {
        exclusive: exclusive_filters
          .filter(x => x.some(y => y === _.name))
          .flat()
          .filter(x => x !== _.name)
      }))
    })

    this._activeSorts = new DataSubject({
      active: false,
      sequence: [],
      entries: sorting.map(_ => Object.assign({}, _, {
        exclusive: exclusive_sorts
          .filter(x => x.some(y => y === _.name))
          .flat()
          .filter(x => x !== _.name)
      }))
    })

    this._activeTerm = new DataSubject({
      active: false,
      term: undefined,
      query: search(predicate)
    })
  }

  get collection() {
    return combineLatest(this, this._activeTerm, this._activeFilters, this._activeSorts)
      .pipe(
        map(([list, searching, filtering, sorting]) => {

          let data = list
          if (searching.active)
            data = searching.query(data, searching.term)

          if (filtering.active) {
            data = filtering.sequence
              .reduce((agg, name) => {
                const index = filtering.entries.findIndex(x => x.name === name)
                if (index !== -1)
                  agg.push(filtering.entries[index])
                return agg
              }, [])
              .reduce((agg, entry) => (
                agg.filter(x => entry.predicate(x))
              ), data)
          }

          if (sorting.active) {
            data = sorting.sequence
              .reduce((agg, name) => {
                const index = sorting.entries.findIndex(x => x.name === name)
                if (index !== -1)
                  agg.push(sorting.entries[index])
                return agg
              }, [])
              .reduce((agg, entry) => (
                [...agg].sort(entry.func)
              ), data)
          }

          return data
        })
      )
  }

  get filters() {
    return this._activeFilters.pipe(
      map(({ sequence, entries }) => (
        entries.map(entry => {
          const { predicate, ...filter } = entry
          const active_index = sequence.findIndex(x => x == filter.name)
          return Object.assign(filter, {
            active: (active_index !== -1)
          })
        })
      ))
    )
  }

  get sorts() {
    return this._activeSorts.pipe(
      map(({ sequence, entries }) => (
        entries.map(entry => {
          const { func, ...sort } = entry
          const active_index = sequence.findIndex(x => x == sort.name)
          return Object.assign(sort, {
            active: (active_index !== -1)
          })
        })
      ))
    )
  }

  get activeFilters() {
    return this.filters.pipe(
      map(entries => entries.filter(x => x.active))
    )
  }

  get activeSorts() {
    return this.sorts.pipe(
      map(entries => entries.filter(x => x.active))
    )
  }

  search = (term) => {
    this._activeTerm.set({
      active: (!!term && term.length),
      term: term
    })
  }

  filter = (name) => {
    const { sequence = [], entries = []} = this._activeFilters.value
    const entry_index = entries.findIndex(x => x.name === name)
    if (entry_index === -1)
      return

    const entry = entries[entry_index]
    const active_index = sequence.findIndex(x => x === name)
    const concerns = (active_index === -1)
      ? sequence.concat([name]).filter(x => !entry.exclusive.some(y => y === x))
      : sequence.filter(x => x !== name)

    this._activeFilters.set({
      active: !!(concerns && concerns.length),
      sequence: concerns
    })
  }

  sort = (name) => {
    const { sequence = [], entries = []} = this._activeSorts.value
    const entry_index = entries.findIndex(x => x.name === name)
    if (entry_index === -1)
      return

    const entry = entries[entry_index]
    const active_index = sequence.findIndex(x => x === name)
    const concerns = (active_index === -1)
      ? sequence.concat([name]).filter(x => !entry.exclusive.some(y => y === x))
      : sequence.filter(x => x !== name)

    this._activeSorts.set({
      active: !!(concerns && concerns.length),
      sequence: concerns
    })
  }

  clear = () => {
    this._activeTerm.set({ active: false, term: undefined })
    this._activeFilters.set({ active: false, sequence: [] })
    this._activeSorts.set({ active: false, sequence: [] })
  }
}