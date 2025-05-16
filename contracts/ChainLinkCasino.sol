// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract ChainLinkCasino is VRFConsumerBaseV2 {
    enum Outcome { WIN, LOSS }

    event PlayRequested(address indexed player, uint256 requestId);
    event PlayResult(address indexed player, uint8 number);

    address public owner;
    VRFCoordinatorV2Interface public coordinator;

    uint64 public subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 200000; // Increased gas limit
    uint16 public requestConfirmations = 3;  // Increased confirmations
    uint32 public numWords = 1;

    mapping(uint256 => address) public requestToPlayer;

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        coordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        owner = msg.sender;
    }

    function play() external returns (uint256 requestId) {
        requestId = coordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        requestToPlayer[requestId] = msg.sender;
        emit PlayRequested(msg.sender, requestId);
    }

    // Add cleanup in fulfillRandomWords
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address player = requestToPlayer[requestId];
        uint8 number = uint8(randomWords[0] % 37);
        emit PlayResult(player, number);
        delete requestToPlayer[requestId]; // Cleanup
    }
}
