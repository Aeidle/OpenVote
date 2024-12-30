// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import "./VoterRegistry.sol";

contract Ballot is Ownable, Pausable {
    struct Candidate {
        string name;
        string party;
        string imageUrl;
        uint256 voteCount;
    }

    struct Election {
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        uint256 totalVotes;
    }

    VoterRegistry public voterRegistry;
    Election public currentElection;
    
    event ElectionCreated(string name, string description, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionEnded(string name, uint256 totalVotes);

    constructor(address _voterRegistryAddress) Ownable() Pausable() {
        voterRegistry = VoterRegistry(_voterRegistryAddress);
    }

    modifier onlyDuringElection() {
        require(currentElection.isActive, "No active election");
        require(block.timestamp >= currentElection.startTime, "Election has not started");
        require(block.timestamp <= currentElection.endTime, "Election has ended");
        _;
    }

    function createElection(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyOwner whenNotPaused {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(!currentElection.isActive, "An election is already active");

        currentElection.name = _name;
        currentElection.description = _description;
        currentElection.startTime = _startTime;
        currentElection.endTime = _endTime;
        currentElection.isActive = true;
        currentElection.candidateCount = 0;
        currentElection.totalVotes = 0;

        emit ElectionCreated(_name, _description, _startTime, _endTime);
    }

    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _imageUrl
    ) external onlyOwner whenNotPaused {
        require(currentElection.isActive, "No active election");
        require(block.timestamp < currentElection.startTime, "Election has already started");

        uint256 candidateId = currentElection.candidateCount;
        Candidate storage newCandidate = currentElection.candidates[candidateId];
        
        newCandidate.name = _name;
        newCandidate.party = _party;
        newCandidate.imageUrl = _imageUrl;
        newCandidate.voteCount = 0;

        currentElection.candidateCount++;

        emit CandidateAdded(candidateId, _name, _party);
    }

    function castVote(uint256 _candidateId) external whenNotPaused onlyDuringElection {
        bool isRegistered = voterRegistry.isVoterRegistered(msg.sender);
        require(isRegistered, "Voter not registered");
        
        bool hasVoted = voterRegistry.hasVoterVoted(msg.sender);
        require(!hasVoted, "Voter has already voted");
        
        require(_candidateId < currentElection.candidateCount, "Invalid candidate");

        currentElection.candidates[_candidateId].voteCount++;
        currentElection.totalVotes++;
        
        voterRegistry.updateVoterStatus(msg.sender, true);

        emit VoteCast(msg.sender, _candidateId);
    }

    function endElection() external onlyOwner whenNotPaused {
        require(currentElection.isActive, "No active election");
        require(block.timestamp >= currentElection.endTime, "Election is still ongoing");

        currentElection.isActive = false;
        emit ElectionEnded(currentElection.name, currentElection.totalVotes);
    }

    function getCandidate(uint256 _candidateId) external view returns (
        string memory name,
        string memory party,
        string memory imageUrl,
        uint256 voteCount
    ) {
        require(_candidateId < currentElection.candidateCount, "Invalid candidate ID");
        Candidate storage candidate = currentElection.candidates[_candidateId];
        return (
            candidate.name,
            candidate.party,
            candidate.imageUrl,
            candidate.voteCount
        );
    }

    function getCandidateCount() external view returns (uint256) {
        return currentElection.candidateCount;
    }

    function getElectionInfo() external view returns (
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes
    ) {
        return (
            currentElection.name,
            currentElection.description,
            currentElection.startTime,
            currentElection.endTime,
            currentElection.isActive,
            currentElection.totalVotes
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
