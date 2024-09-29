const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BatchTransfer Contract", function () {
  let batchTransfer;
  let erc20Token;
  let owner;
  let recipients;
  let amounts;

  before('deploy contract', async function () {
    // Get signers (accounts)
    [owner, ...recipients] = await ethers.getSigners();

    // Deploy a mock ERC-20 token
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    erc20Token = await ERC20Mock.deploy("MockToken", "MTK", owner.address, ethers.parseEther("1000000"));
    await erc20Token.waitForDeployment();
    const erc20TokenAddress = await erc20Token.getAddress();
    console.log('MockToken contract deployed to ', erc20TokenAddress);

    // Deploy the BatchTransfer contract
    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    await batchTransfer.waitForDeployment();
    const batchTransferAddress = await batchTransfer.getAddress();
    console.log('BatchTransfer contract deployed to ', batchTransferAddress);

    // Set up recipients and amounts
    amounts = recipients.map(() => ethers.parseEther("10")); // Send 10 tokens to each
  });

  it("Should estimate gas for batch transfers", async function () {
    const recipientAddresses = recipients.map(r => r.address);
    const erc20TokenAddress = await erc20Token.getAddress();
    const batchTransferAddress = await batchTransfer.getAddress();
    
    // Approve the batch transfer contract to spend owner's tokens
    await erc20Token.approve(batchTransferAddress, ethers.parseEther("1000000"));

    // Estimate gas for batch transfer
    const gasEstimate = await batchTransfer.batchTransfer.estimateGas(
      erc20TokenAddress,
      recipientAddresses,
      amounts
    );

    // console.log(`Estimated gas for batch transfer: ${gasEstimate.toString()}`);
  });
});
