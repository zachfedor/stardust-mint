/**
 *  This script will calculate the constructor arguments for BoredApe.sol and deploy it.
 *  After deploying, you can access the contract on etherscan.io with the deployed contract address.
 */

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

  // Deploy the contract
  const StardustGeneration = await hre.ethers.getContractFactory('StardustGeneration')
  const stardustGeneration = await StardustGeneration.deploy(
    Name,
    Symbol,
    BASE_URI,
    metaSuffix,
    root,
    withdrawAddress,
  )

  await stardustGeneration.deployed()

  console.log('Stardust Generation deployed to:', stardustGeneration.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
