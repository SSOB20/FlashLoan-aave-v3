const { expect, assert } = require("chai")
const hre = require("hardhat")

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config")

describe("Flash Loans", function () {
    it("Should take a flash loan and be able to return it", async function () {
        const FlashLoanExample = await hre.ethers.getContractFactory("FlashLoan")

        // Deploy FlashLoanExample
        const flashLoanExample = await FlashLoanExample.deploy(POOL_ADDRESS_PROVIDER)
        await flashLoanExample.deployed()

        // Fetch the DAI smart contract
        const token = await ethers.getContractAt("IERC20", DAI)

        // Send 2000 DAI from DAI_WHALE to our contract by impersonating them
        const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000")

        /// Two different ways: using request() or using getImpersonatedSigner() (easier) ///
        //request//
        // await hre.network.provider.request({
        //     method: "hardhat_impersonateAccount",
        //     params: [DAI_WHALE],
        // })

        //getImpersonatedSigner//
        const impersonatedSigner = await ethers.getImpersonatedSigner(DAI_WHALE)

        // If we use request(), we need to impersonate/simulate the account on  Mainnet with the address from DAI_WHALE
        // const signer = await ethers.getSigner(DAI_WHALE)

        // Check balance before sending 2000 DAI
        const signerBalance = await token.balanceOf(impersonatedSigner.address)
        console.log(`Signer balance: ${ethers.utils.formatEther(signerBalance.toString())} DAI`)

        let contractBalance = await token.balanceOf(flashLoanExample.address)
        console.log(`Contract balance before: ${ethers.utils.formatEther(contractBalance.toString())} DAI`)

        await token.connect(impersonatedSigner).transfer(flashLoanExample.address, BALANCE_AMOUNT_DAI) // Sends our contract 2000 DAI from the DAI_WHALE
        contractBalance = await token.balanceOf(flashLoanExample.address)
        console.log(`Contract balance after: ${ethers.utils.formatEther(contractBalance.toString())} DAI`)

        // Request and execute a flash loan of 10,000 DAI from Aave
        const txn = await flashLoanExample.createFlashLoan(DAI, 10000)
        await txn.wait()

        // Check that remaingBalance <2000 DAI because of the premium
        const remainingBalance = await token.balanceOf(flashLoanExample.address)
        assert.isBelow(remainingBalance, BALANCE_AMOUNT_DAI)
    })
})
