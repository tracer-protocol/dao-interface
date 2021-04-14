// available networks
// https://chainid.network/chains.json
export const networkConfig = {
  1: {
    preview_url: 'https://etherscan.io',
    contractAddresses: {
      tracerDao: '0xA84918F3280d488EB3369Cb713Ec53cE386b6cBa',
      tracerToken: '0x9C4A4204B79dd291D6b6571C5BE8BbcD0622F050',
      vestingContract: '0x2B79E11984514Ece5B2Db561F49c0466cC7659EA',
      airdropContract: '0x45eca81a5bfbdd58cafb225bd4c9c49c8db99754',
      dai: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    },
    graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-dao',
    daoMapUrl: 'https://initial-dao-mapping.herokuapp.com'
  },
  5: {
    preview_url: 'https://goerli.etherscan.io',
    contractAddresses: {
      tracerDao: '0x39dA2E38e7fb5cb512407EB3573693Dd346fc4A0',
      tracerToken: '0xfd33f527e7ef691384a9d4b9d754e87deb39f7e7',
      vestingContract: '0xBd340FC04e48F7d1D0Cc6d1FB97dEd53B39c767F',
      airdropContract: '0xED598CfEa84d46dC48c2dDca2eB32Cb713DBcB86',
      dai: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    },
    graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/goerlitracerdao',
    daoMapUrl: 'https://initial-dao-map.herokuapp.com'
  },
  1337 : {
    preview_url: 'https://etherscan.io',
    contractAddresses: {
      tracerDao: '0xd153b3102A7C89515dA929Afd9B60F8C13Dc2437',
      tracerToken: '0xe60dD3dae14F4F51cFEaef58dF91eB945BE9aeCd',
      airdropContract: '0xED598CfEa84d46dC48c2dDca2eB32Cb713DBcB86',
      vestingContract: '0x4e02eEe5eC229FDf4E9392B20b71c2Ff5c24Dd05',
      dai: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    },
    graphUri: 'http://127.0.0.1:8000/subgraphs/name/dospore/initial-dao',
    daoMapUrl: 'http://localhost:3002'
  },
  "none": {
    preview_url: 'https://etherscan.io',
    contractAddresses: {
      tracerDao: '0xA84918F3280d488EB3369Cb713Ec53cE386b6cBa',
      tracerToken: '0x9C4A4204B79dd291D6b6571C5BE8BbcD0622F050',
      vestingContract: '0x2B79E11984514Ece5B2Db561F49c0466cC7659EA',
      dai: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    },
    graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-dao',
    daoMapUrl: 'https://initial-dao-mapping.herokuapp.com'
  }
}