// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Libs
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

// Local
import {Coordinates, Geo} from "../Utils/Geo.sol";
import {Xionite} from "../Resource/Xionite.sol";
import {Yilium} from "../Resource/Yilium.sol";
import {Zephin} from "../Resource/Zephin.sol";

// Errors
import {Tile_InsufficientFunds, Tile_NotOnSale} from "./Errors.sol";

contract Tile is AccessControl {
    using Geo for Coordinates;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");

    address private xionite;
    address private yilium;
    address private zephin;

    Coordinates private _coordinates;

    constructor() AccessControl() {
        _setupRole(REGISTRY_ROLE, msg.sender);
    }

    uint256 public price;

    function initialize(
        Coordinates calldata c,
        address _xionite,
        address _yilium,
        address _zephin
    ) public returns (bytes32 geohash) {
        _grantRole(REGISTRY_ROLE, msg.sender);
        _grantRole(OWNER_ROLE, tx.origin);

        xionite = _xionite;
        yilium = _yilium;
        zephin = _zephin;

        _coordinates = c;
        geohash = c.geohash();
    }

    function sell(uint256 _price) public onlyRole(OWNER_ROLE) {
        price = _price;
    }

    function coordinates() public view returns (Coordinates memory) {
        return _coordinates;
    }
}
