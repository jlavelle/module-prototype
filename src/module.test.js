import test from 'ava'
import { Maybe, Fn, Arr } from '@masaeedu/fp'
import { module, minimalDef as def, instantiate, restrictKeys, refoldlUntil, sameKeys, mapMaybe, sameWeights } from './module'

// Same shape as Foldable; only one impl. is required
const testMDef = def.define({
  baz: [ 
    def.depend(["bar"])(({ t, bar }) => () => "baz from " + bar()),
    def.depend(["foo"])(({ t, foo }) => () => "baz from " + foo())
  ],
  foo: [ 
    def.depend(["bar"])(({ t, bar }) => () => "foo from " + bar()),
    def.depend(["baz"])(({ t, baz }) => () => "foo from " + baz())
  ],
  bar: [ 
    def.depend(["foo"])(({ t, foo }) => () => "bar from " + foo()),
    def.depend(["baz"])(({ t, baz }) => () => "bar from " + baz())
  ]
})

const testModule = module.defModule({
  name: "Test",
  mdef: testMDef,
  methods: ({ foo, bar, baz }) => {
    const quux = () => foo() + " " + bar() + " " + baz()

    return {
      quux
    }
  }
})

const testMDef2 = def.define({
  qud: [
    def.depend(["bar"])(({ bar }) => () => "qud from " + bar())
  ],
  bob: [
    def.depend(["qud"])(({ qud }) => () => qud())
  ]
})

const testModule2 = module.defModule({
  name: "Test2",
  mdef: testMDef2,
  methods: ({ quux, qud, fud }) => {
    const quuz = () => quux() + ' - 2'

    return {
      quuz
    }
  }
})

test("module monoid idempotent/commutative", t => {
  const appended1 = module.append(testModule)(testModule2)
  const appended2 = module.append(testModule2)(testModule)
  const folded = Arr.fold(module)([testModule, testModule2, testModule, appended1, appended2])
  const props = ["contains", "mdef"]
  props.forEach(prop => {
    t.deepEqual(testModule[prop], module.append(testModule)(testModule)[prop])
    t.deepEqual(testModule[prop], module.append(module.empty)(testModule)[prop])
    t.deepEqual(testModule[prop], module.append(testModule)(module.empty)[prop])

    t.deepEqual(appended1[prop], appended2[prop])
    t.deepEqual(appended2[prop], folded[prop])
  })

  const ms = [appended1, appended2, folded]
  const mins = ["foo", "bar", "baz"]
  const all = Arr.append(mins)(["quux", "qud", "bob"])
  mins.forEach(n => {
    const d = { [n]: () => 'a ' + n }
    const [m1, m2, m3] = Arr.map(m => instantiate(m)(d))(ms)
    all.forEach(m => {
      t.deepEqual(m1[m](), m2[m]())
      t.deepEqual(m2[m](), m3[m]())
    })
  })
})

test("instantiate", t => {
  const ns = ["foo", "bar", "baz"]
  ns.forEach(n => {
    const m = instantiate(testModule)({ [n]: () => 'a ' + n })
    ns.forEach(n => t.snapshot(m[n]()))
    t.snapshot(m.quux())
  })
})

test("restrictKeys", t => {
  const x = { foo: 1, bar: 2, baz: 3 }
  const y = restrictKeys(["foo"])(x)
  const z = restrictKeys(["bar", "baz"])(x)
  t.deepEqual({ foo: 1 }, y)
  t.deepEqual({ bar: 2, baz: 3 }, z)
})

test("refoldlUntil", t => {
  const pred = a => b => a === b
  const f = acc => x => acc >= 20 ? acc : acc + x
  const res = refoldlUntil(pred)(f)(0)([1,1,1])
  t.is(20, res)
})

test("sameKeys", t => {
  const x = { foo: 1, bar: 2, baz: 3 }
  const y = { foo: 1, bar: 2 }
  const z = { f: 1, g: 2 }
  const w = { f: 1 }
  t.true(sameKeys(x)(x))
  t.false(sameKeys(x)(y))
  t.false(sameKeys(z)(w))
})

test("sameWeights", t => {
  const x = { foo: [1, 'a'], bar: [2, 'b' ]}
  const y = { foo: [3, 'a'], bar: [4, 'b' ]}
  t.true(sameWeights(x)(x))
  t.false(sameWeights(x)(y))
})

test("mapMaybe", t => {
  const { Just, Nothing } = Maybe
  const x = [Just(10), Nothing, Just(20)]
  t.deepEqual([10, 20], mapMaybe(Fn.id)(x))
})
