/**
 *  This script will calculate the constructor arguments for the `verify` function and call it.
 *  You can use this script to verify the contract on etherscan.io.
 */

require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const starlist = require('./starlist.js')

const Name = 'Stardust Generation'
const Symbol = 'STRDST'
const BASE_URI = 'ipfs://QmP5v1r9M1LqCju7M3cobRjUsm8G5ffyQcAdzCvavTZQEa/'
const metaSuffix = '.json'
const withdrawAddress = ['0xe5012a95963f6B98408B58f199413DF1D84E25a8']

async function main() {
  // Calculate merkle root from the starlist array
  const leafNodes = starlist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()

  await hre.run('verify:verify', {
    address: '0x8955a961EbF558E1838adE37A27D938920c8ecf3', // Deployed contract address
    constructorArguments: [
      Name,
      Symbol,
      BASE_URI,
      metaSuffix,
      root,
      withdrawAddress,
    ]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
 
  // npx hardhat verify --constructor-args arguments.js 0xAA22ec0b51B56Fa278d2D889D1ef92154C32a52a