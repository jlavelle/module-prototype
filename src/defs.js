import { Fn, Arr } from '@masaeedu/fp'
import { module as mod, minimalDef } from './module'

const { define, depend } = minimalDef

const functor = (() => {

  const mdef = (() => {
    const mapFromAp = ({ ap, of }) => f => a => ap(of(f))(a)
    const mapFromChain = ({ chain, of }) => f => a => chain(x => of(f(x)))(a)
    
    return define({
      map: [ 
        depend(["ap", "of"])(mapFromAp),
        depend(["chain", "of"])(mapFromChain)
      ]
    })
  })()

  const methods = ({ map }) => {
    let _f = {}
    _f['$>'] = f => a => map(_ => a)(f)
    _f['<$'] = a => f => map(_ => a)(f)
    return {
      ..._f
    }
  }

  return mod.defModule({
    name: "Functor",
    mdef,
    methods
  })
})()

const applicative = (() => {
  const mdef = (() => {
    const apFromLift2 = ({ lift2 }) => fab => fa => lift2(x => x)(fab)(fa)
    const lift2FromMapAp = ({ ap, map }) => f => fa => fb => ap(map(f)(fa))(fb)
    const apFromChain = ({ of, chain }) => fab => fa => chain(ab => chain(a => of(ab(a)))(fa))(fab)

    return define({
      ap: [
        depend(["of", "chain"])(apFromChain),
        depend(["lift2"])(apFromLift2)
      ],
      lift2: [
        depend(["ap", "map"])(lift2FromMapAp)
      ],
      of: []
    })
  })()

  const methods = F => {
    let _f = {}
    _f['*>'] = fa => fb => F.lift2(a => b => b)(fa)(fb)
    _f['<*'] = fa => fb => F.lift2(a => b => a)(fa)(fb)

    const liftN = f => xs => F.map(Fn.uncurry(f))(Arr.sequence(F)(xs))

    return {
      ..._f,
      liftN
    }
  }

  return mod.append(mod.defModule({
    name: "Applicative",
    mdef,
    methods
  }))(functor)
})()

const monad = (() => {
  const mdef = (() => {
    const chainFromJoin = ({ join, map }) => afb => fa => join(map(afb)(fa))
    const joinFromChain = ({ chain }) => ffa => chain(Fn.id)(ffa)
    
    return define({
      chain: [
        depend(["join", "map"])(chainFromJoin)
      ],
      join: [
        depend(["chain"])(joinFromChain)
      ]
    })
  })()

  const methods = F => {
    return {}
  }

  return mod.append(mod.defModule({
    name: "Monad",
    mdef,
    methods
  }))(applicative)
})()

export {
  functor,
  applicative,
  monad
}