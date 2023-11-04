// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Player} from "../Player/Player.sol";
import {Tile} from "../Tile/Tile.sol";
import {TileRegistry} from "../Tile/TileRegistry.sol";
import {AUROx} from "../Currency/AUROx.sol";

contract World {
    AUROx public immutable aurox;
    Player public immutable player;
    Tile public immutable tile;
    TileRegistry public immutable tileRegistry;

    constructor(
        address _aurox,
        address _player,
        address _tile,
        address _tileRegistry
    ) {
        aurox = AUROx(payable(_aurox));
        player = Player(_player);
        tile = Tile(_tile);
        tileRegistry = TileRegistry(_tileRegistry);
    }
}
