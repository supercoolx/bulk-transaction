const fs = require('fs');
const { ethers } = require('hardhat');
const address = require('../jsons/address.json');
const wallets = require('../jsons/wallets.json');
const erc20ABI = require('../jsons/erc20.abi.json');

const tokenAddress = address[process.env.NETWORK].token;
const contractAddress = address[process.env.NETWORK].contract;

const amount = 10;      // send 10 tokens to address.
const countAtOnce = 100; // send to 20 addresses in a transaction.

const successAddressesFilePath = "./jsons/success.txt";
const failAddressesFilePath = "./jsons/fail.txt";

async function main() {
    const network = process.env.NETWORK;
    console.log(`This script is running on ${network} network...`);

    const [owner] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    console.log('Owner wallet:', ownerAddress);

    const beforeBalance = await ethers.provider.getBalance(ownerAddress);
    console.log('Owner balance:', ethers.formatEther(beforeBalance));

    console.log('Wallets:', wallets.length);

    const BatchTransfer = await ethers.getContractAt('BatchTransfer', contractAddress);
    const Token = await ethers.getContractAt(erc20ABI, tokenAddress);

    const balance = await Token.balanceOf(ownerAddress);
    console.log('Token Balance:', ethers.formatEther(balance));

    const allowance = await Token.allowance(ownerAddress, contractAddress);
    console.log('Token Allowance:', ethers.formatEther(allowance));

    if (allowance < BigInt(amount) * BigInt(wallets.length) * BigInt('1000000000000000000')) {
        const allowanceAmount = amount * wallets.length;
        console.log(`Insufficient allowance. Approving ${allowanceAmount} ...`);

        const approvalTx = await Token.approve(contractAddress, ethers.parseEther(allowanceAmount.toString()));
        await approvalTx.wait();
        console.log('Approved successfully. Transaction hash:', approvalTx.transactionHash);
    }

    for(let i = 0; i < wallets.length; i += countAtOnce) {
        let addresses = wallets.slice(i, i + countAtOnce).map(w => w.address);
        let output = addresses.map((address, index) => `${i + index} ${address}\n`);
        
        try {
            let transferTx = await BatchTransfer.batchTransfer(
                tokenAddress,
                addresses,
                new Array(countAtOnce).fill(BigInt(amount) * BigInt('1000000000000000000'))
            );
            await transferTx.wait();
            console.log(...output);
            fs.appendFileSync(successAddressesFilePath, output.join(''));
        } catch (err) {
            fs.appendFileSync(failAddressesFilePath, output.join(''));
        }

    }

    const afterBalance = await ethers.provider.getBalance(ownerAddress);
    console.log('Owner balance:', ethers.formatEther(afterBalance));

    const totalSpent = beforeBalance - afterBalance;
    console.log('Total spent:', ethers.formatEther(totalSpent), 'BNB');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
