// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VoterRegistry
 * @dev Manages voter registration and status for the e-voting system
 * @notice This contract handles voter registration, authorization, and status tracking
 */
contract VoterRegistry is Ownable, Pausable, ReentrancyGuard {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        string cin;        // National ID number
        string fullName;
        uint256 registeredAt;
    }

    mapping(address => Voter) public voters;
    mapping(address => bool) public authorizedContracts;
    mapping(string => bool) private usedCINs;  // Track used CINs to prevent duplicates
    uint256 public totalVoters;
    uint256 public constant MAX_VOTERS = 1000000;  // Reasonable limit for scalability

    event VoterRegistered(address indexed voterAddress, string cin, string fullName, uint256 timestamp);
    event VoterStatusUpdated(address indexed voterAddress, bool hasVoted, uint256 timestamp);
    event ContractAuthorized(address indexed contractAddress, uint256 timestamp);
    event ContractDeauthorized(address indexed contractAddress, uint256 timestamp);
    event RegistrationPaused(address indexed by, uint256 timestamp);
    event RegistrationUnpaused(address indexed by, uint256 timestamp);

    error InvalidAddress();
    error InvalidCIN();
    error InvalidName();
    error VoterAlreadyRegistered();
    error CINAlreadyUsed();
    error MaxVotersReached();
    error NotAuthorized();
    error VoterNotRegistered();

    constructor() Ownable() Pausable() ReentrancyGuard() {}

    modifier validAddress(address _address) {
        if (_address == address(0)) revert InvalidAddress();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner() && !authorizedContracts[msg.sender]) revert NotAuthorized();
        _;
    }

    /**
     * @dev Authorizes a contract to update voter status
     * @param _contract Address of the contract to authorize
     */
    function authorizeContract(address _contract) 
        external 
        onlyOwner 
        validAddress(_contract) 
    {
        authorizedContracts[_contract] = true;
        emit ContractAuthorized(_contract, block.timestamp);
    }

    /**
     * @dev Removes authorization from a contract
     * @param _contract Address of the contract to deauthorize
     */
    function deauthorizeContract(address _contract) 
        external 
        onlyOwner 
        validAddress(_contract) 
    {
        authorizedContracts[_contract] = false;
        emit ContractDeauthorized(_contract, block.timestamp);
    }

    /**
     * @dev Registers a new voter
     * @param _voterAddress Address of the voter
     * @param _cin National ID number
     * @param _fullName Full name of the voter
     */
    function registerVoter(
        address _voterAddress,
        string calldata _cin,
        string calldata _fullName
    ) 
        external 
        onlyOwner 
        whenNotPaused 
        validAddress(_voterAddress)
        nonReentrant 
    {
        // Input validation
        if (voters[_voterAddress].isRegistered) revert VoterAlreadyRegistered();
        if (bytes(_cin).length == 0) revert InvalidCIN();
        if (bytes(_fullName).length == 0) revert InvalidName();
        if (usedCINs[_cin]) revert CINAlreadyUsed();
        if (totalVoters >= MAX_VOTERS) revert MaxVotersReached();

        // Register voter
        voters[_voterAddress] = Voter({
            isRegistered: true,
            hasVoted: false,
            cin: _cin,
            fullName: _fullName,
            registeredAt: block.timestamp
        });

        usedCINs[_cin] = true;
        totalVoters++;

        emit VoterRegistered(_voterAddress, _cin, _fullName, block.timestamp);
    }

    /**
     * @dev Updates voter's voting status
     * @param _voterAddress Address of the voter
     * @param _hasVoted New voting status
     */
    function updateVoterStatus(address _voterAddress, bool _hasVoted) 
        external 
        onlyAuthorized 
        whenNotPaused 
        validAddress(_voterAddress)
        nonReentrant 
    {
        if (!voters[_voterAddress].isRegistered) revert VoterNotRegistered();
        
        voters[_voterAddress].hasVoted = _hasVoted;
        emit VoterStatusUpdated(_voterAddress, _hasVoted, block.timestamp);
    }

    /**
     * @dev Checks if an address is registered as a voter
     * @param _voterAddress Address to check
     * @return isRegistered True if the address is registered
     */
    function isVoterRegistered(address _voterAddress) 
        external 
        view 
        validAddress(_voterAddress) 
        returns (bool isRegistered) 
    {
        return voters[_voterAddress].isRegistered;
    }

    /**
     * @dev Checks if a voter has already voted
     * @param _voterAddress Address of the voter
     * @return hasVoted True if the voter has voted
     */
    function hasVoterVoted(address _voterAddress) 
        external 
        view 
        validAddress(_voterAddress) 
        returns (bool hasVoted) 
    {
        return voters[_voterAddress].hasVoted;
    }

    /**
     * @dev Gets voter details
     * @param _voterAddress Address of the voter
     * @return isRegistered Whether the voter is registered
     * @return hasVoted Whether the voter has already voted
     * @return cin The national ID number of the voter
     * @return fullName The full name of the voter
     */
    function getVoterDetails(address _voterAddress) 
        external 
        view 
        validAddress(_voterAddress)
        returns (
            bool isRegistered,
            bool hasVoted,
            string memory cin,
            string memory fullName
        ) 
    {
        Voter memory voter = voters[_voterAddress];
        return (
            voter.isRegistered,
            voter.hasVoted,
            voter.cin,
            voter.fullName
        );
    }

    /**
     * @dev Pauses voter registration and status updates
     */
    function pause() external onlyOwner {
        _pause();
        emit RegistrationPaused(msg.sender, block.timestamp);
    }

    /**
     * @dev Unpauses voter registration and status updates
     */
    function unpause() external onlyOwner {
        _unpause();
        emit RegistrationUnpaused(msg.sender, block.timestamp);
    }
}
