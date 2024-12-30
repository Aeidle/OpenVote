import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "ethers";

describe("E-Voting System", function () {
  let voterRegistry: any;
  let ballot: any;
  let owner: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let unregisteredVoter: SignerWithAddress;
  let currentTime: number;
  let startTime: number;
  let endTime: number;

  beforeEach(async function () {
    // Get signers
    [owner, voter1, voter2, unregisteredVoter] = await hre.ethers.getSigners();

    // Deploy VoterRegistry
    const VoterRegistry = await hre.ethers.getContractFactory("VoterRegistry", owner);
    voterRegistry = await VoterRegistry.deploy();
    await voterRegistry.waitForDeployment();

    // Deploy Ballot
    const Ballot = await hre.ethers.getContractFactory("Ballot", owner);
    ballot = await Ballot.deploy(await voterRegistry.getAddress());
    await ballot.waitForDeployment();

    // Authorize Ballot contract to update voter status
    await voterRegistry.connect(owner).authorizeContract(await ballot.getAddress());

    // Get current block timestamp
    const latestBlock = await hre.ethers.provider.getBlock('latest');
    currentTime = Number(latestBlock?.timestamp);
    startTime = currentTime + 100; // Start in 100 seconds
    endTime = startTime + 3600; // End in 1 hour
  });

  describe("VoterRegistry", function () {
    it("Should register a voter", async function () {
      await voterRegistry.connect(owner).registerVoter(voter1.address, "CIN123", "John Doe");
      const voterDetails = await voterRegistry.getVoterDetails(voter1.address);
      expect(voterDetails.isRegistered).to.be.true;
      expect(voterDetails.cin).to.equal("CIN123");
      expect(voterDetails.fullName).to.equal("John Doe");
    });

    it("Should not register the same voter twice", async function () {
      await voterRegistry.connect(owner).registerVoter(voter1.address, "CIN123", "John Doe");
      await expect(
        voterRegistry.connect(owner).registerVoter(voter1.address, "CIN123", "John Doe")
      ).to.be.revertedWith("Voter already registered");
    });

    it("Should correctly identify unregistered voters", async function () {
      // Check unregistered voter
      const isRegistered = await voterRegistry.isVoterRegistered(unregisteredVoter.address);
      expect(isRegistered).to.be.false;

      // Register voter1
      await voterRegistry.connect(owner).registerVoter(voter1.address, "CIN123", "John Doe");
      
      // Check registered voter
      const isVoter1Registered = await voterRegistry.isVoterRegistered(voter1.address);
      expect(isVoter1Registered).to.be.true;

      // Double check unregistered voter is still unregistered
      const isStillUnregistered = await voterRegistry.isVoterRegistered(unregisteredVoter.address);
      expect(isStillUnregistered).to.be.false;
    });
  });

  describe("Ballot", function () {
    const electionName = "Presidential Election 2024";
    const electionDescription = "National Presidential Election";

    beforeEach(async function () {
      // Create election
      await ballot.connect(owner).createElection(
        electionName,
        electionDescription,
        startTime,
        endTime
      );

      // Add candidates
      await ballot.connect(owner).addCandidate("Candidate 1", "Party A", "image1.jpg");
      await ballot.connect(owner).addCandidate("Candidate 2", "Party B", "image2.jpg");

      // Register some voters (but not unregisteredVoter)
      await voterRegistry.connect(owner).registerVoter(voter1.address, "CIN123", "John Doe");
      await voterRegistry.connect(owner).registerVoter(voter2.address, "CIN456", "Jane Doe");
    });

    it("Should create an election with correct details", async function () {
      const electionInfo = await ballot.getElectionInfo();
      expect(electionInfo.name).to.equal(electionName);
      expect(electionInfo.description).to.equal(electionDescription);
      expect(electionInfo.startTime).to.equal(startTime);
      expect(electionInfo.endTime).to.equal(endTime);
    });

    it("Should add candidates correctly", async function () {
      const candidateCount = await ballot.getCandidateCount();
      expect(candidateCount).to.equal(2);

      const candidate1 = await ballot.getCandidate(0);
      expect(candidate1.name).to.equal("Candidate 1");
      expect(candidate1.party).to.equal("Party A");
    });

    it("Should not allow voting before election starts", async function () {
      await expect(
        ballot.connect(voter1).castVote(0)
      ).to.be.revertedWith("Election has not started");
    });

    it("Should not allow unregistered voters to vote", async function () {
      // Verify voter is not registered
      const isRegistered = await voterRegistry.isVoterRegistered(unregisteredVoter.address);
      console.log("Is voter registered:", isRegistered);
      console.log("Unregistered voter address:", unregisteredVoter.address);
      
      // Get voter details
      const voterDetails = await voterRegistry.getVoterDetails(unregisteredVoter.address);
      console.log("Voter details:", voterDetails);
      
      expect(isRegistered).to.be.false;
      
      // Increase time to start of election
      await hre.network.provider.send("evm_setNextBlockTimestamp", [startTime + 1]);
      await hre.network.provider.send("evm_mine", []);

      // Try to vote
      await expect(
        ballot.connect(unregisteredVoter).castVote(0)
      ).to.be.revertedWith("Voter not registered");
    });

    it("Should allow registered voters to vote successfully", async function () {
      // Increase time to start of election
      await hre.network.provider.send("evm_setNextBlockTimestamp", [startTime + 1]);
      await hre.network.provider.send("evm_mine", []);

      // Verify voter1 is registered and hasn't voted
      const isRegistered = await voterRegistry.isVoterRegistered(voter1.address);
      const hasVoted = await voterRegistry.hasVoterVoted(voter1.address);
      expect(isRegistered).to.be.true;
      expect(hasVoted).to.be.false;

      // Get initial vote count
      const initialVoteCount = (await ballot.getCandidate(0)).voteCount;

      // Cast vote
      await ballot.connect(voter1).castVote(0);

      // Verify vote was counted
      const finalVoteCount = (await ballot.getCandidate(0)).voteCount;
      expect(finalVoteCount).to.equal(initialVoteCount + BigInt(1));

      // Verify voter status was updated
      const hasVotedAfter = await voterRegistry.hasVoterVoted(voter1.address);
      expect(hasVotedAfter).to.be.true;

      // Verify voter cannot vote again
      await expect(
        ballot.connect(voter1).castVote(0)
      ).to.be.revertedWith("Voter has already voted");
    });

    it("Should not allow voting after election ends", async function () {
      // Move time to after election end
      await hre.network.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
      await hre.network.provider.send("evm_mine", []);

      // Try to vote
      await expect(
        ballot.connect(voter1).castVote(0)
      ).to.be.revertedWith("Election has ended");

      // End the election
      await ballot.connect(owner).endElection();

      // Verify election is no longer active
      const electionInfo = await ballot.getElectionInfo();
      expect(electionInfo.isActive).to.be.false;

      // Try to vote again
      await expect(
        ballot.connect(voter1).castVote(0)
      ).to.be.revertedWith("No active election");
    });
  });
});
