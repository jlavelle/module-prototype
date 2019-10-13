import { Obj, Fn } from '@masaeedu/fp'
import { sameKeys } from "./module"

// const append = forall({ f: [applicative], a: [monoid] })(({ f, a }) => f.lift2(a.append))
// append.at({f : zipArr}).at({a: intSum})([1,2,3])([1,2,3]) === [2,4,6]

const forall = dicts => f => {
  return {
    dicts,
    at: dict => applyAt(dicts)(dict)(f)
  }
}

// TODO: Check to see if the supplied dicts satisfy the constraints
const applyAt = ds => d => f => {
  if (sameKeys(ds)(d)) {
    return f(d)
  } else {
    return forall(without(Obj.keys(d))(ds))(x => f(Obj.append(d)(x)))
  }
}

const without = ks => Obj.foldMapWithKey(Obj)(k => a => {
  if (!ks.includes(k)) {
    return { [k]: a }
  } else {
    return {}
  }
})

export {
  forall,
  applyAt,
  without
}