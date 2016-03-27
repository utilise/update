var expect = require('chai').expect
  , update = require('./')
  , last = require('utilise.last')
  , set = require('utilise.set')

describe('update', function() {

  it('should update - vanilla', function() {
    expect(update(0, 'bar')(['foo'])).to.be.eql(['bar'])
  })

  it('should update - array', function(){
    var o = set()(['foo', 'bar', 'baz'])
    
    expect(update(1, 'lol')(o)).to.equal(o)
    expect(o).to.eql(['foo', 'lol', 'baz'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log)).to.eql({ key: '1', value: 'lol', type: 'update', time: 1 })
  })
    
  it('should update - object', function(){
    var o = set()({ foo: 'bar' })

    expect(update('foo', 'baz')(o)).to.equal(o)
    expect(o).to.eql({ foo: 'baz' })
    expect(o.log.length).to.eql(2)
    expect(last(o.log)).to.eql({ key: 'foo', value: 'baz', type: 'update', time: 1 })
  })

  it('should skip gracefully', function(){
    expect(update('foo', 'bar')(true)).to.be.eql(true)
    expect(update('foo', 'bar')(5)).to.be.eql(5)
  })

  it('should work deeply', function() {
    var change = []
      , o = set()({ a: { b: { c: 5 }}}).on('change', function(diff){ change = diff })

    update('a.b.c', 10)(o)
    expect(o.log.length).to.eql(2)
    expect(last(o.log)).to.eql({ key: 'a.b.c', value: 10, type: 'update', time: 1 })
    expect(change).to.eql(last(o.log))
  })

})