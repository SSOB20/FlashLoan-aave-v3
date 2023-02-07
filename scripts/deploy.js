const hre = require("hardhat")
const { POOL_ADDRESS_PROVIDER } = require("../config")

async function main() {
    const FlashLoan = await hre.ethers.getContractFactory("FlashLoan")
    const flashLoan = await FlashLoan.deploy(POOL_ADDRESS_PROVIDER)

    await flashLoan.deployed()

    console.log(`FlashLoan contract deployed to ${flashLoan.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
