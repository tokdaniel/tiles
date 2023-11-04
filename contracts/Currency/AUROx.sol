// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SuperTokenBase} from "../Utils/SuperTokenBase.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract AUROx is SuperTokenBase, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function initialize(address factory) external {
        _initialize(factory, "Super Auro", "AUROx");
    }

    function mint(
        address receiver,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        _mint(receiver, amount, "");
    }
}
