// available networks
// https://chainid.network/chains.json
export const networkConfig = {
  1: {
    preview_url: 'https://etherscan.io',
    contractAddresses: {
      tracerDao: '0xA84918F3280d488EB3369Cb713Ec53cE386b6cBa',
      tracerToken: '0x9C4A4204B79dd291D6b6571C5BE8BbcD0622F050',
      vestingContract: '0x2B79E11984514Ece5B2Db561F49c0466cC7659EA'
    },
    graph_url: 'https://api.thegraph.com/subgraphs/name/mrpowerpoint/initial-dao',
    dao_map_url: 'https://initial-dao-map.herokuapp.com'
  },
  5: {
    preview_url: 'https://goerli.etherscan.io',
    contractAddresses: {
      tracerDao: '0x39dA2E38e7fb5cb512407EB3573693Dd346fc4A0',
      tracerToken: '0xfD33f527E7ef691384A9D4B9D754e87DEB39F7E7',
      vestingContract: '0x881A793F45F2866610aCA9ED5b67871f44791481'
    },
    graph_url: 'https://api.thegraph.com/subgraphs/name/mrpowerpoint/goerli-initial-dao',
    dao_map_url: 'https://initial-dao-map.herokuapp.com'
  },
  1337 : {
    preview_url: 'https://etherscan.io',
    contractAddresses: {
      tracerDao: '0xBF420C6B4A3757031AAe81B7dc7b27EA22F0B6c2',
      tracerToken: '0xCb3954356Bc42bB3f61F15f3D478276096664316',
      vestingContract: '0x26E552c66234542497A8E9a530d83a53f174DA19'
    },
    graph_url: 'https://api.thegraph.com/subgraphs/name/mrpowerpoint/initial-dao',
    dao_map_url: 'http://localhost:3002'
  },

}