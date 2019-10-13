import test from 'ava'
import { forall, applyAt, without } from './forall'
import { functor } from './defs'

const identity = {
  map: f => a => f(a)
}

test("applyAt", t => {
  const ds = {}
  const d = {}
  t.is(10, applyAt(ds)(d)(_ => 10))

  const ds2 = { f: [functor] }
  const d2 = { f: identity }
  t.is(10, applyAt(ds2)(d2)(({f}) => f.map(x => x + 5)(5)))

  const ds3 = { f: [functor], g: [functor] }
  const d3 = { f: identity }
  t.snapshot(applyAt(ds3)(d3)(({f, g}) => f.map(x => x + 5)(5)))
})

test("forall", t => {
  const ds = { f: [functor], g: [functor] }
  const x = forall(ds)(({ f, g }) => fn => fga => f.map(g.map(fn))(fga))
  t.snapshot(x)
  const x1 = x.at({f: identity})
  t.snapshot(x1)
  const x2 = x1.at({g: identity})
  t.is(5, x2(x => x + 1)(4))
})

test("without", t => {
  const x = { foo: 1, bar: 2, baz: 3 }
  t.deepEqual({ foo: 1 }, without(["bar", "baz"])(x))
})