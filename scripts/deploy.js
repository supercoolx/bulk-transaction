const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    // Get network data from Hardhat config (see hardhat.config.ts).
    const network = process.env.NETWORK;
    // Check if the network is supported.
    console.log(`Deploying to ${network} network...`);

    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    const contract = await BatchTransfer.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("BatchTransfer contract deployed to:", address);

    let data;
    const path = "./jsons/address.json";

    if (fs.existsSync(path)) {
        // Read and parse the JSON file
        const fileContent = fs.readFileSync(path, 'utf-8');
        data = JSON.parse(fileContent);
    } else {
        data = {
            testnet: {
                contract: "",
                token: ""
            },
            mainnet: {
                contract: "",
                token: ""
            }
        };
    }
    data[`${network}`]["contract"] = address;

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
