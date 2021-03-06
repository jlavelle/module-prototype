# Snapshot report for `src/defs.test.js`

The actual snapshot is saved in `defs.test.js.snap`.

Generated by [AVA](https://ava.li).

## applicative

> Snapshot 1

    {
      '$>': Function {},
      '*>': Function {},
      '<$': Function {},
      '<*': Function {},
      ap: Function ap {},
      lift2: Function {},
      liftN: Function liftN {},
      map: Function {},
      of: Function of {},
      [Symbol(moduleMeta)]: [
        {
          initial: {
            ap: Function ap {},
            of: Function of {},
          },
          module: {
            contains: [
              'Applicative',
              'Functor',
            ],
            mdef: {
              defs: {
                ap: [
                  {
                    f: Function apFromChain {},
                    names: [
                      'of',
                      'chain',
                    ],
                  },
                  {
                    f: Function apFromLift2 {},
                    names: [
                      'lift2',
                    ],
                  },
                ],
                lift2: [
                  {
                    f: Function lift2FromMapAp {},
                    names: [
                      'ap',
                      'map',
                    ],
                  },
                ],
                map: [
                  {
                    f: Function mapFromAp {},
                    names: [
                      'ap',
                      'of',
                    ],
                  },
                  {
                    f: Function mapFromChain {},
                    names: [
                      'chain',
                      'of',
                    ],
                  },
                ],
                of: [],
              },
            },
            methods: Function methods {},
          },
        },
      ],
    }

## arr

> Snapshot 1

    {
      '$>': Function {},
      '*>': Function {},
      '<$': Function {},
      '<*': Function {},
      ap: Function {},
      chain: Function {},
      foldl: Function foldl {},
      join: Function join {},
      lift2: Function {},
      liftN: Function liftN {},
      map: Function map {},
      of: Function of {},
      [Symbol(moduleMeta)]: [
        {
          initial: {},
          module: {
            contains: [
              'Applicative',
              'Arr',
              'Functor',
              'Monad',
            ],
            mdef: {
              defs: {
                ap: [
                  {
                    f: Function apFromChain {},
                    names: [
                      'of',
                      'chain',
                    ],
                  },
                  {
                    f: Function apFromLift2 {},
                    names: [
                      'lift2',
                    ],
                  },
                ],
                chain: [
                  {
                    f: Function chainFromJoin {},
                    names: [
                      'join',
                      'map',
                    ],
                  },
                ],
                join: [
                  {
                    f: Function joinFromChain {},
                    names: [
                      'chain',
                    ],
                  },
                ],
                lift2: [
                  {
                    f: Function lift2FromMapAp {},
                    names: [
                      'ap',
                      'map',
                    ],
                  },
                ],
                map: [
                  {
                    f: Function mapFromAp {},
                    names: [
                      'ap',
                      'of',
                    ],
                  },
                  {
                    f: Function mapFromChain {},
                    names: [
                      'chain',
                      'of',
                    ],
                  },
                ],
                of: [],
              },
            },
            methods: Function methods {},
          },
        },
      ],
    }

## functor

> Snapshot 1

    {
      '$>': Function {},
      '<$': Function {},
      map: Function map {},
      [Symbol(moduleMeta)]: [
        {
          initial: {
            map: Function map {},
          },
          module: {
            contains: [
              'Functor',
            ],
            mdef: {
              defs: {
                map: [
                  {
                    f: Function mapFromAp {},
                    names: [
                      'ap',
                      'of',
                    ],
                  },
                  {
                    f: Function mapFromChain {},
                    names: [
                      'chain',
                      'of',
                    ],
                  },
                ],
              },
            },
            methods: Function methods {},
          },
        },
      ],
    }

## monad

> Snapshot 1

    {
      '$>': Function {},
      '*>': Function {},
      '<$': Function {},
      '<*': Function {},
      ap: Function {},
      chain: Function chain {},
      join: Function {},
      lift2: Function {},
      liftN: Function liftN {},
      map: Function {},
      of: Function of {},
      [Symbol(moduleMeta)]: [
        {
          initial: {
            chain: Function chain {},
            of: Function of {},
          },
          module: {
            contains: [
              'Applicative',
              'Functor',
              'Monad',
            ],
            mdef: {
              defs: {
                ap: [
                  {
                    f: Function apFromChain {},
                    names: [
                      'of',
                      'chain',
                    ],
                  },
                  {
                    f: Function apFromLift2 {},
                    names: [
                      'lift2',
                    ],
                  },
                ],
                chain: [
                  {
                    f: Function chainFromJoin {},
                    names: [
                      'join',
                      'map',
                    ],
                  },
                ],
                join: [
                  {
                    f: Function joinFromChain {},
                    names: [
                      'chain',
                    ],
                  },
                ],
                lift2: [
                  {
                    f: Function lift2FromMapAp {},
                    names: [
                      'ap',
                      'map',
                    ],
                  },
                ],
                map: [
                  {
                    f: Function mapFromAp {},
                    names: [
                      'ap',
                      'of',
                    ],
                  },
                  {
                    f: Function mapFromChain {},
                    names: [
                      'chain',
                      'of',
                    ],
                  },
                ],
                of: [],
              },
            },
            methods: Function methods {},
          },
        },
      ],
    }
