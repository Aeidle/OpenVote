// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

contract VoterRegistry is Ownable, Pausable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        string cin;
        string fullName;
    }

    mapping(address => Voter) public voters;
    mapping(address => bool) public authorizedContracts;
    uint256 public totalVoters;

    event VoterRegistered(
        address indexed voterAddress,
        string cin,
        string fullName
    );
    event VoterStatusUpdated(address indexed voterAddress, bool hasVoted);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);

    constructor() Ownable() Pausable() {}

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedContracts[msg.sender],
            "Not authorized"
        );
        _;
    }

    function authorizeContract(address _contract) external onlyOwner {
        authorizedContracts[_contract] = true;
        emit ContractAuthorized(_contract);
    }

    function deauthorizeContract(address _contract) external onlyOwner {
        authorizedContracts[_contract] = false;
        emit ContractDeauthorized(_contract);
    }

    function registerVoter(
        address _voterAddress,
        string memory _cin,
        string memory _fullName
    ) external onlyOwner whenNotPaused {
        require(
            !voters[_voterAddress].isRegistered,
            "Voter already registered"
        );
        require(bytes(_cin).length > 0, "CIN cannot be empty");
        require(bytes(_fullName).length > 0, "Full name cannot be empty");

        voters[_voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            cin: _cin,
            fullName: _fullName
        });

        totalVoters++;

        emit VoterRegistered(_voterAddress, _cin, _fullName);
    }

    function updateVoterStatus(
        address _voterAddress,
        bool _hasVoted
    ) external onlyAuthorized whenNotPaused {
        require(voters[_voterAddress].isRegistered, "Voter not registered");
        voters[_voterAddress].hasVoted = _hasVoted;
        emit VoterStatusUpdated(_voterAddress, _hasVoted);
    }

    function isVoterRegistered(
        address _voterAddress
    ) external view returns (bool) {
        Voter memory voter = voters[_voterAddress];
        return voter.isRegistered;
    }

    function hasVoterVoted(address _voterAddress) external view returns (bool) {
        return voters[_voterAddress].hasVoted;
    }

    function getVoterDetails(
        address _voterAddress
    )
        external
        view
        returns (
            bool isRegistered,
            bool hasVoted,
            string memory cin,
            string memory fullName
        )
    {
        Voter memory voter = voters[_voterAddress];
        return (voter.isRegistered, voter.hasVoted, voter.cin, voter.fullName);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
