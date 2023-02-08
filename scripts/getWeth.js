const { ethers } = require("hardhat")
const { WETH } = require("../config")

async function getWeth() {
    const weth = await ethers.getContractAt("IWeth", WETH)
}

module.exports = { getWeth }
