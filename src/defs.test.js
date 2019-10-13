import test from 'ava'
import { applicative } from './defs'
import { instantiate } from './module'

const identity_ = (() => {
  const ap = fab => fa => fab(fa)
  const of = a => a

  return {
    ap, of
  }
})()

const identity = instantiate(applicative)(identity_)

test("applicative", t => {
  t.is(5, identity.map(x => x + 1)(4))
  t.is(10, identity.lift2(a => b => a + b)(5)(5))
})