// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Libs
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Reserve} from "../Reserve/Reserve.sol";

// Local
import {Tile} from "./Tile.sol";
import {Coordinates, Direction, Geo} from "../Utils/Geo.sol";

contract TileRegistry is AccessControl {
    using Geo for Coordinates;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    event TileRegistry_TileCreated(Tile tile);

    address public immutable implementation;

    address public immutable xionite;
    address public immutable yilium;
    address public immutable zephin;

    Reserve public immutable reserve;

    mapping(bytes32 => Tile) public tiles;

    constructor(
        address _implementation,
        Reserve _reserve,
        address _xionite,
        address _yilium,
        address _zephin
    ) AccessControl() {
        implementation = _implementation;
        reserve = _reserve;

        xionite = _xionite;
        yilium = _yilium;
        zephin = _zephin;

        createTile(Geo.origin());

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getOrCreate(
        Coordinates calldata c,
        Direction direction
    ) public onlyRole(OWNER_ROLE) returns (Tile tile) {
        Coordinates[6] memory neighbors = c.neighbors();

        Coordinates memory destination = neighbors[uint8(direction)];
        tile = this.lookup(destination);

        if (address(tile) == address(0)) {
            tile = createTile(destination);
        }
    }

    function getFlowRate(
        Coordinates memory c
    ) public pure returns (int96 x, int96 y, int96 z) {
        x = c.x >= 0 ? c.x : -c.x;
        y = c.y >= 0 ? c.y : -c.y;
        z = c.z >= 0 ? c.z : -c.z;
    }

    function getCost(
        Coordinates calldata c
    ) public pure returns (uint256 a, uint256 x, uint256 y, uint256 z) {
        (int96 xfr, int96 yfr, int96 zfr) = getFlowRate(c);

        x = 10 + uint96(xfr) * 100;
        y = 10 + uint96(yfr) * 100;
        z = 10 + uint96(zfr) * 100;

        a = x + y + z;
    }

    function lookup(Coordinates calldata c) public view returns (Tile) {
        return tiles[c.geohash()];
    }

    function createTile(Coordinates memory to) private returns (Tile tile) {
        tile = Tile(Clones.clone(implementation));
        bytes32 h = tile.initialize(to, xionite, yilium, zephin);

        tiles[h] = tile;

        emit TileRegistry_TileCreated(tile);

        (int96 x, int96 y, int96 z) = getFlowRate(to);

        if (x > 0 || y > 0 || z > 0) {
            reserve.startYield(address(tile), x, y, z);
        }
    }
}
