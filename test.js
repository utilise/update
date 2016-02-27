var versioned = require('versioned').default
  , expect = require('chai').expect
  , update = require('./')
  , last = require('utilise.last')

describe('update', function() {

  it('should update - vanilla', function() {
    expect(update(0, 'bar')(['foo'])).to.be.eql(['bar'])
  })

  it('should update - array', function(){
    var changes = []
      , o = versioned(['foo', 'bar', 'baz']).on('log', function(diff){ changes.push(diff) })

    expect(o).to.eql(['foo', 'bar', 'baz'])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql(['foo', 'bar', 'baz'])
    expect(changes).to.eql([])

    expect(update(1, 'lol')(o)).to.eql(o)
    expect(o).to.eql(['foo', 'lol', 'baz'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '1', value: 'lol', type: 'update' })
    expect(last(o.log).value.toJS()).to.eql(['foo', 'lol', 'baz'])
    expect(changes).to.eql(o.log.slice(1).map(function(d) { return d.diff }))
  })
    
  it('should update - object', function(){
    var changes = []
      , o = versioned({ foo: 'bar' }).on('log', function(diff){ changes.push(diff) })

    expect(o).to.eql({ foo: 'bar' })
    expect(o.log.length).to.eql(1)
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql({ foo: 'bar' })
    expect(changes).to.eql([])

    expect(update('foo', 'baz')(o)).to.eql(o)
    expect(o).to.eql({ foo: 'baz' })
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: 'foo', value: 'baz', type: 'update' })
    expect(last(o.log).value.toJS()).to.eql({ foo: 'baz' })
    expect(changes).to.eql(o.log.slice(1).map(function(d) { return d.diff }))
  })

  it('should skip gracefully', function(){
    expect(update('foo', 'bar')(true)).to.be.eql(true)
    expect(update('foo', 'bar')(5)).to.be.eql(5)
  })

  it('should work deeply', function() {
    var changes = []
      , o = versioned({ a: { b: { c: 5 }}}).on('log', function(diff){ changes.push(diff) })

    update('a.b.c', 10)(o)
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: 'a.b.c', value: 10, type: 'update' })
    expect(last(o.log).value.toJS()).to.eql({ a: { b: { c: 10 }}})
    expect(changes).to.eql([
      { key: 'a.b.c', value: 10, type: 'update' }
    ])
  })

})