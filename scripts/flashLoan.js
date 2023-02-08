const { ethers } = require("hardhat")
const hre = require("hardhat")
const { FLASH_LOAN_DEPLOYED, DAI } = require("../config")

async function flashLoan() {
    const flashLoan = await ethers.getContractAt(FLASH_LOAN_DEPLOYED)
    const token = await ethers.getContractAt("IERC20", DAI)

    // Get some DAI using a swap on Uniswap (swapExample.sol)
    // Perhaps I'll need to get some WETH to send to Uniswap
    // Send DAI to flashLoaon to pay the premium

    const flashLoanBalanceBefore = token.balanceOf(FLASH_LOAN_DEPLOYED)
    console.log(`Flash Loan balance before:${flashLoanBalanceBefore} DAI`)

    const flashLoanBalanceAfter = token.balanceOf(FLASH_LOAN_DEPLOYED)
    console.log(`Flash Loan balance after:${flashLoanBalanceAfter} DAI`)

    await flashLoan.createFlashloan(DAI, 2000)

    const flashLoanEndBalance = token.balanceOf(FLASH_LOAN_DEPLOYED)
    console.log(`Flash Loan balance after:${flashLoanEndBalance} DAI`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
