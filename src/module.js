import { Obj, Arr, Fn, Maybe, IntSum } from '@masaeedu/fp'

const minimalDef = (() => {

  // constructor
  // Defs -> MDef
  const define = defs => {
    return { defs }
  }

  const depend = names => f => {
    return { names, f }
  }

  const append = a => b => define(Obj.append(a.defs)(b.defs))

  const empty = define(Obj.empty)

  return {
    define,
    depend,
    append,
    empty
  }
})()

const module = (() => {
  
  // constructor
  const defModule = ({ name, mdef, methods }) => {
    return { name, mdef, methods }
  }

  // not really a monoid since the record types in `methods` are combined
  // at the type level
  const append = a => b => defModule({
    name: a.name + b.name,
    mdef: minimalDef.append(a.mdef)(b.mdef),
    methods: ms => Obj.append(a.methods(ms))(b.methods(ms))
  })

  const empty = defModule({
    name: '',
    mdef: minimalDef.empty,
    methods: x => Obj.empty
  })

  const rename = m => s => ({ ...m, name: s })

  return {
    defModule,
    append,
    empty,
    rename
  }
})()

// Given a module and a canditate dependency, attempt to construct
// the dict declared by the MDef and class methods
// Finds the shortest path to each eequivalent defintion by assigning 
// every function a weight and choosing the
// lowest weighted derivation when multiple possibilities exist
const instantiate = mod => funs => {
  const { defs } = mod.mdef

  const givenMembers = Obj.map(a => [1, a])(funs)
  const missing = Arr.filter(k => !Obj.hasKey(k)(givenMembers))(Obj.keys(defs))
  const dpred = a => b => sameKeys(a)(b) && sameWeights(a)(b)
  
  // Repeatedly attempt to derive until it is no longer productive
  const derived = Obj.map(second)(refoldlUntil(dpred)(acc => x => {
    return shortestPath(x)(acc)(defs[x])
  })(givenMembers)(missing))

  return Obj.append(derived)(mod.methods(derived))
}

// :: String -> WeightedDict -> [ EquivalentDef ] -> WeightedDict
const shortestPath = k => d => Fn.pipe([
  Arr.foldMap(weightedInsert)(({ names, f }) => {
    return hasKeys(names)(d)
    ? { [k]: [ sumDeps(d)(names) + 1, f(Obj.map(second)(d)) ]}
    : weightedInsert.empty
  }),
  weightedInsert.append(d)
])

const sumDeps = d => ns => Arr.foldMap(IntSum)(n => first(d[n]))(ns)

// A monoid on Compose Obj (Int,) that is biased to the lowest Int
// e.g. { foo: [1, 'a'] } <> { foo: [2, 'b'] } === { foo: [1, 'a'] }
const weightedInsert = {
  append: o1 => o2 => {
    const xs = Obj.zipWith(a => b => {
      const [w1] = a
      const [w2] = b
      return w1 <= w2 ? a : b
    })(o1)(o2)
    return Arr.fold(Obj)([o1, o2, xs])
  },
  empty: {}
}

// Feed the results of a foldl back into itself until a predicate
// on the current and previous result is satisfied
const refoldlUntil = pred => f => b => as => {
  const rec = nres => {
    const res1 = Arr.foldl(f)(nres)(as)
    const res2 = Arr.foldl(f)(res1)(as)
    if (pred(res1)(res2)) {
      return res2
    } else {
      return rec(res2)
    }
  }
  return rec(b)
}

const restrictKeys = ks => Obj.foldMapWithKey(Obj)(k => a => {
  if (ks.includes(k)) {
    return { [k]: a }
  } else {
    return {}
  }
})

const hasKeys = ks => o => Arr.foldMap(and)(k => Obj.hasKey(k)(o))(ks)

const sameKeys = o1 => o2 => {
  const a = sortedKeys(o1)
  const b = sortedKeys(o2)
  return Arr.fold(and)(Arr.zipWith(a => b => a === b)(a)(b))
}

const sameWeights = o1 => o2 => {
  return Obj.fold(and)(Obj.zipWith(a => b => first(a) === first(b))(o1)(o2))
}

const sortedKeys = o => Obj.keys(o).sort()

const mapMaybe = f => {
  const go = x => acc => Maybe.match({
    Just: v => Arr.Cons(v)(acc),
    Nothing: acc
  })(f(x))
  return Arr.foldr(go)([])
}

const and = (() => {
  const append = a => b => a && b
  const empty = true

  return { 
    append,
    empty
  }
})()

const sum = Arr.fold(IntSum)

const second = ([_, a]) => a
const first = ([a, _]) => a

export {
  minimalDef, instantiate, restrictKeys, refoldlUntil, sameKeys, mapMaybe, module, sameWeights
}
