import test from 'ava'
import { Maybe, Fn } from '@masaeedu/fp'
import { module, minimalDef as def, instantiate, restrictKeys, refoldlUntil, sameKeys, mapMaybe } from './module'

// Same shape as Foldable; only one impl. is required
const testMDef = def.define({
  baz: [ def.depend(["bar"])(({ t, bar }) => () => t.f() + "baz from " + bar()),
          def.depend(["foo"])(({ t, foo }) => () => t.f() + "baz from " + foo())
        ],
  foo: [ def.depend(["bar"])(({ t, bar }) => () => t.f() + "foo from " + bar()),
          def.depend(["baz"])(({ t, baz }) => () => t.f() + "foo from " + baz())
        ],
  bar: [ def.depend(["foo"])(({ t, foo }) => () => t.f() + "bar from " + foo()),
          def.depend(["baz"])(({ t, baz }) => () => t.f() + "bar from " + baz())
        ]
})

const testParam = {
  f: () => "This is: "
}

const testModule = module.defModule({
  name: "Test",
  mdef: testMDef,
  methods: ({ t, foo, bar, baz }) => {
    const quux = () => t.f() + foo() + bar() + baz()

    return {
      quux
    }
  }
})

test("instantiate", t => {
  const ns = ["foo", "bar", "baz"]
  ns.forEach(n => {
    const m = instantiate(testModule)({ t: testParam, [n]: () => 'a ' + n})
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
  t.true(sameKeys(x)(x))
  t.false(sameKeys(x)(y))
})

test("mapMaybe", t => {
  const { Just, Nothing } = Maybe
  const x = [Just(10), Nothing, Just(20)]
  t.deepEqual([10, 20], mapMaybe(Fn.id)(x))
})
