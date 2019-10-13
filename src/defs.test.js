import test from 'ava'
import { functor, applicative, monad } from './defs'
import { instantiate, module as mod, minimalDef } from './module'
import { IntSum, Fn } from '@masaeedu/fp'

const identityF_ = (() => {
  const map = f => a => f(a)
  return { map }
})()

const identityA_ = (() => {
  const of = a => a
  const ap = fab => fa => fab(fa)
  return { of, ap }
})()

const identityM_ = (() => {
  const of = a => a
  const chain = afb => fa => afb(fa)
  return { of, chain }
})()

const identityF = instantiate(functor)(identityF_)
const identityA = instantiate(applicative)(identityA_)
const identityM = instantiate(monad)(identityM_)

test("functor", t => {
  t.snapshot(identityF)
  t.is(5, identityF.map(a => a + 1)(4))
})

test("applicative", t => {
  t.snapshot(identityA)
  t.is(5, identityA.map(a => a + 1)(4))
  t.is(10, identityA.lift2(a => b => a + b)(5)(5))
  t.is(5, identityA.of(5))
})

test("monad", t => {
  t.snapshot(identityM)
  t.is(5, identityM.map(a => a + 1)(4))
  t.is(10, identityM.lift2(a => b => a + b)(5)(5))
  t.is("foo", identityM['*>'](100)('foo'))
  t.is(10, identityM.of(10))
  t.is(10, identityM.join(10))
  t.is(10, identityM.chain(x => x + 5)(5))
})

const arr_ = (() => {
  const map = f => xs => xs.map(f)
  const join = xxs => xxs.reduce((acc, x) => acc.concat(x), [])
  const of = a => [a]
  const foldl = f => a => xs => xs.reduce((acc, x) => f(acc)(x), a)

  return mod.defModule({
    name: "Arr",
    mdef: minimalDef.empty,
    methods: () => ({
      map, join, of, foldl
    }),
  })
})()

const arr = instantiate(mod.append(arr_)(monad))({})

test("arr", t => {
  t.snapshot(arr)
  t.true(arr.hasOwnProperty('lift2'))
  t.deepEqual([1,1,2,2,3,3], arr.lift2(Fn.const)([1,2,3])([1,2]))
  t.deepEqual([2,3,3,4,4,5], arr.chain(a => [a + 1, a + 2])([1,2,3]))
})