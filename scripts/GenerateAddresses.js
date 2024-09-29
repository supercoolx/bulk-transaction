const { ethers } = require('hardhat');
const fs = require('fs');

// Function to generate 1000 BNB addresses
async function generateAddresses() {
  let addresses = [];

  for (let i = 0; i < 20; i++) {
    console.log(i);
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    // Get the address from the wallet
    addresses.push({
      address: wallet.address,
      privateKey: wallet.privateKey, // Optionally, you can store the private key
      amount: '10000000000000000000'
    });
  }

  // Convert the addresses array to JSON format
  const json = JSON.stringify(addresses, null, 2);

  // Write the JSON to a file
  fs.writeFileSync('./results/addresses.json', json);

  console.log('Generated 1000 BNB addresses and saved to ./scripts/addresses.json');
}

// Call the function to generate and save addresses
generateAddresses();
