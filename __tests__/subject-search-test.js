import 'react-native';
import { SearchSubject } from '../logic/subjects'

const mock_data = [
  { id: 1, Phrase: 'Hello World', Active: false, Groups: [{ name: 'Novice' }]},
  { id: 2, Phrase: 'Fly with me', Active: true, Groups: [{ name: 'Song' }, { name: 'Novice' }]},
  { id: 3, Phrase: 'Goodbye World', Active: true, Groups: [{ name: 'Expert' }]},
  { id: 4, Phrase: 'Football', Active: false, Groups: [{ name: 'Sports' }, { name: 'Expert' }]}
]

describe('search subject', () => {
  describe('search term', () => {
    it('should uppercase the term for the predicate', done => {
      const search_term = 'world'
      const search_predicate = (_, term) => {
        expect(term).toBe(search_term.toUpperCase())
        return false
      }

      const subject = new SearchSubject(mock_data, {
        predicate: search_predicate
      })

      subject.search(search_term)
      subject.collection
        .subscribe(_ => done())
    })

    it('should use predicate to filter', done => {
      const search_term = 'world'
      const search_predicate = (item, term) => {
        return (item.Phrase.toUpperCase().indexOf(term) !== -1)
      }

      const subject = new SearchSubject(mock_data, {
        predicate: search_predicate
      })

      subject.search(search_term)
      subject.collection
        .subscribe(data => {
          expect(mock_data).toHaveLength(4)
          expect(data).toHaveLength(2)
          done()
        })
    })

    it('should not filter if term is empty', done => {
      const search_predicate = () => {
        throw "should not be called"
      }

      const subject = new SearchSubject(mock_data, {
        predicate: search_predicate
      })

      subject.search()
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          done()
        })
    })

    test('predicate is not required', done => {
      const subject = new SearchSubject(mock_data)

      subject.search()
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          done()
        })
    })
  })

  describe('filtering data', () => {
    it('should use predicate to filter', done => {
      const search_filter = {
        name: 'Test Filter',
        predicate: (item) => !!item.Active
      }

      const subject = new SearchSubject(mock_data, {
        filtering: [search_filter]
      })

      subject.filter('Test Filter')
      subject.collection
        .subscribe(data => {
          expect(mock_data).toHaveLength(4)
          expect(data).toHaveLength(2)
          done()
        })
    })

    it('should ignore filters not found', done => {
      const search_filter = {
        name: 'Simple',
        predicate: (_) => { throw "Should not be called." }
      }

      const subject = new SearchSubject(mock_data, {
        filtering: [search_filter]
      })

      subject.filter('Not Found')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          done()
        })
    })

    it('should allow multiple filters to be applied', done => {
      const filter_one = {
        name: 'Active',
        predicate: (item) => !!item.Active
      }
      const filter_two = {
        name: 'Inactive',
        predicate: (item) => !item.Active
      }

      const subject = new SearchSubject(mock_data, {
        filtering: [filter_one, filter_two]
      })

      subject.filter('Active')
      subject.filter('Inactive')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(0)
          done()
        })
    })

    it('should check for exclusive filters', done => {
      const filter_one = {
        name: 'Active',
        predicate: (item) => !!item.Active
      }
      const filter_two = {
        name: 'Inactive',
        predicate: (item) => !item.Active
      }

      const subject = new SearchSubject(mock_data, {
        filtering: [filter_one, filter_two],
        exclusive_filters: [['Active', 'Inactive']]
      })

      subject.filter('Active')
      subject.filter('Inactive')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(2)
          expect(data.every(x => !x.Active)).toBe(true)
          done()
        })
    })
  })

  describe('sorting data', () => {
    it('should use func to sort', done => {
      const search_sort = {
        name: 'Active First',
        func: (a, b) => (a.Active === b.Active) ? 0 : (a.Active < b.Active) ? 1 : -1
      }

      const subject = new SearchSubject(mock_data, {
        sorting: [search_sort]
      })

      subject.sort('Active First')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          expect(data.map(x => x.id)).toStrictEqual([2, 3, 1, 4])
          done()
        })
    })

    it('should ignore sorts not found', done => {
      const search_sort = {
        name: 'Active First',
        func: () => { throw "Should not be called" }
      }

      const subject = new SearchSubject(mock_data, {
        sorting: [search_sort]
      })

      subject.sort('Not found')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          expect(data.map(x => x.id)).toStrictEqual([1, 2, 3, 4])
          done()
        })
    })

    it('should allow multiple sorts to be applied', done => {
      const sort_one = {
        name: 'Active DESC',
        func: (a, b) => (a.Active === b.Active) ? 0 : (a.Active > b.Active) ? 1 : -1
      }
      const sort_two = {
        name: 'Phrase DESC',
        func: (a, b) => (a.Phrase === b.Phrase) ? 0 : (a.Phrase < b.Phrase) ? 1 : -1
      }

      const subject = new SearchSubject(mock_data, {
        sorting: [sort_one, sort_two]
      })

      subject.sort('Phrase DESC')
      subject.sort('Active DESC')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          expect(data.map(x => x.id)).toStrictEqual([1, 4, 3, 2])
          done()
        })
    })

    it('should check for exclusive sorts', done => {
      const sort_one = {
        name: 'Active DESC',
        func: (a, b) => (a.Active === b.Active) ? 0 : (a.Active > b.Active) ? 1 : -1
      }
      const sort_two = {
        name: 'Phrase DESC',
        func: (a, b) => (a.Phrase === b.Phrase) ? 0 : (a.Phrase < b.Phrase) ? 1 : -1
      }

      const subject = new SearchSubject(mock_data, {
        sorting: [sort_one, sort_two],
        exclusive_sorts: [['Active DESC', 'Phrase DESC']]
      })

      subject.sort('Phrase DESC')
      subject.sort('Active DESC')
      subject.collection
        .subscribe(data => {
          expect(data).toHaveLength(mock_data.length)
          expect(data.map(x => x.id)).toStrictEqual([1, 4, 2, 3])
          done()
        })
    })
  })

  describe('list filters', () => {
    it('should list all filters', done => {
      const subject = new SearchSubject(mock_data, {
        filtering: [
          { name: 'One', predicate: () => true },
          { name: 'Two', predicate: () => true },
          { name: 'Three', predicate: () => true }
        ]
      })

      subject.filters
        .subscribe(data => {
          expect(data).toHaveLength(3)
          expect(data.every(x => !x.active)).toBe(true)
          done()
        })
    })

    it('should report active filters', done => {
      const subject = new SearchSubject(mock_data, {
        filtering: [
          { name: 'One', predicate: () => true },
          { name: 'Two', predicate: () => true },
          { name: 'Three', predicate: () => true }
        ]
      })

      subject.filter('Two')
      subject.filters
        .subscribe(data => {
          expect(data).toHaveLength(3)
          expect(data.filter(x => x.active)).toHaveLength(1)
          expect(data.filter(x => !x.active)).toHaveLength(2)
          done()
        })
    })
  })

  describe('list active filters', () => {
    it('should only list active filters', done => {
      const subject = new SearchSubject(mock_data, {
        filtering: [
          { name: 'One', predicate: () => true },
          { name: 'Two', predicate: () => true },
          { name: 'Three', predicate: () => true }
        ]
      })

      subject.activeFilters
        .subscribe(data => {
          expect(data).toHaveLength(0)
          done()
        })
    })

    it('should not list inactive filters', done => {
      const subject = new SearchSubject(mock_data, {
        filtering: [
          { name: 'One', predicate: () => true },
          { name: 'Two', predicate: () => true },
          { name: 'Three', predicate: () => true }
        ]
      })

      subject.filter('Two')
      subject.activeFilters
        .subscribe(data => {
          expect(data).toHaveLength(1)
          expect(data.every(x => x.active)).toBe(true)
          expect(data.every(x => !x.active)).toBe(false)
          done()
        })
    })
  })

  describe('list active sorts', () => {
    it('should only list active sorts', done => {
      const subject = new SearchSubject(mock_data, {
        sorting: [
          { name: 'One', func: () => 0 },
          { name: 'Two', func: () => 0 },
          { name: 'Three', func: () => 0 }
        ]
      })

      subject.activeSorts
        .subscribe(data => {
          expect(data).toHaveLength(0)
          done()
        })
    })

    it('should not list inactive sorts', done => {
      const subject = new SearchSubject(mock_data, {
        sorting: [
          { name: 'One', func: () => 0 },
          { name: 'Two', func: () => 0 },
          { name: 'Three', func: () => 0 }
        ]
      })

      subject.sort('Two')
      subject.activeSorts
        .subscribe(data => {
          expect(data).toHaveLength(1)
          expect(data.every(x => x.active)).toBe(true)
          expect(data.every(x => !x.active)).toBe(false)
          done()
        })
    })
  })
})