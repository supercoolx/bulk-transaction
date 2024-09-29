const { ethers } = require("hardhat");
const address = require("../results/deployments.json");
const accounts = require("../results/addresses.json");

async function main() {
    // Get network data from Hardhat config (see hardhat.config.ts).
    const network = process.env.NETWORK;
    const batchTransferAddress = address[process.env.NETWORK];
    // Check if the network is supported.
    console.log(`This script is running on ${network} network...`);

    const BatchTransfer = await ethers.getContractAt("BatchTransfer", batchTransferAddress);
    const meowAddress = "0x10C10Bc11C2bdaA2d73BD587873cF1512F3E373D";
    const MeowToken = await ethers.getContractAt([{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}] , meowAddress);

    // const approvalTx = await MeowToken.approve(batchTransferAddress, ethers.parseEther("1000000"));
    // await approvalTx.wait();
    // console.log('Approved successfully. Transaction hash:', approvalTx.transactionHash);

    const gasEstimate = await BatchTransfer.batchTransfer.estimateGas(
        meowAddress,
        accounts.map(a => a.address),
        accounts.map(a => a.amount)
    );
    
    console.log(`Estimated gas for batch transfer: ${gasEstimate.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
