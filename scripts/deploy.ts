import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract } from "ethers";

async function main() {
  try {
    console.log("Starting deployment process...");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with account: ${deployer.address}`);

    // Deploy VoterRegistry
    console.log("\nDeploying VoterRegistry...");
    const VoterRegistry = await ethers.getContractFactory("VoterRegistry");
    const voterRegistry = (await VoterRegistry.deploy()) as unknown as {
      authorizeContract(address: string): Promise<any>;
      getAddress(): Promise<string>;
      waitForDeployment(): Promise<any>;
    };
    await voterRegistry.waitForDeployment();
    
    const voterRegistryAddress = await voterRegistry.getAddress();
    console.log(`VoterRegistry deployed to: ${voterRegistryAddress}`);

    // Deploy Ballot
    console.log("\nDeploying Ballot...");
    const Ballot = await ethers.getContractFactory("Ballot");
    const ballot = await Ballot.deploy(voterRegistryAddress);
    await ballot.waitForDeployment();
    
    const ballotAddress = await ballot.getAddress();
    console.log(`Ballot deployed to: ${ballotAddress}`);

    // Authorize Ballot contract in VoterRegistry
    console.log("\nAuthorizing Ballot contract in VoterRegistry...");
    const authTx = await voterRegistry.authorizeContract(ballotAddress);
    await authTx.wait();
    console.log("Ballot contract authorized successfully");

    // Print deployment summary
    console.log("\nDeployment Summary:");
    console.log("-------------------");
    console.log(`VoterRegistry: ${voterRegistryAddress}`);
    console.log(`Ballot: ${ballotAddress}`);
    
    // Print verification commands
    console.log("\nTo verify contracts on explorer, run:");
    console.log("-----------------------------------");
    console.log(`npx hardhat verify --network amoy ${voterRegistryAddress}`);
    console.log(`npx hardhat verify --network amoy ${ballotAddress} "${voterRegistryAddress}"`);

    console.log("\nDeployment completed successfully!");
  } catch (error) {
    console.error("\nDeployment failed!");
    console.error(error);
    throw error;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Unhandled error:", error);
      process.exit(1);
    });
}
