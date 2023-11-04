// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SuperTokenBase} from "../Utils/SuperTokenBase.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Resource is SuperTokenBase, AccessControlUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    function initialize(
        address factory,
        address minter,
        address burner,
        string memory name,
        string memory symbol
    ) external initializer {
        __AccessControl_init();

        _initialize(factory, name, symbol);

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
    }

    function mint(uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(msg.sender, amount, "");
    }

    function burn(uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(msg.sender, amount, "");
    }
}
