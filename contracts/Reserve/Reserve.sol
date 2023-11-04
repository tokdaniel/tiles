// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import {Xionite} from "../Resource/Xionite.sol";
import {Yilium} from "../Resource/Yilium.sol";
import {Zephin} from "../Resource/Zephin.sol";

import "hardhat/console.sol";

error Reserve_InvalidToken();
error Reserve_TileMissing();

contract Reserve is AccessControl {
    using SuperTokenV1Library for ISuperToken;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    Xionite public xionite;
    Yilium public yilium;
    Zephin public zephin;

    constructor(Xionite x, Yilium y, Zephin z) {
        xionite = x;
        yilium = y;
        zephin = z;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function initialize(
        address factory,
        address player
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        xionite.initialize(factory, address(this), player, "Xionite", "XION");
        yilium.initialize(factory, address(this), player, "Yilium", "YIL");
        zephin.initialize(factory, address(this), player, "Zephin", "ZEP");

        xionite.mint(type(uint128).max);
        yilium.mint(type(uint128).max);
        zephin.mint(type(uint128).max);
    }

    function startYield(
        address tile,
        int96 xfr,
        int96 yfr,
        int96 zfr
    ) public onlyRole(OWNER_ROLE) {
        if (tile == address(0)) {
            revert Reserve_TileMissing();
        }

        if (xfr > 0) {
            ISuperToken(address(xionite)).createFlow(tile, xfr);
        }

        if (yfr > 0) {
            ISuperToken(address(yilium)).createFlow(tile, yfr);
        }

        if (zfr > 0) {
            ISuperToken(address(zephin)).createFlow(tile, zfr);
        }
    }
}
