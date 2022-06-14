require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'rinkeby',
  networks: {
    hardhat: {},
    // mainnet: {
    //   url: `${process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL}`,
    //   accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`]
    // },
    rinkeby: {
      url: `${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  }
}
