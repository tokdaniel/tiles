// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Pointy top hexagonal directions
// Axes:  x(-NorthWest, +SouthEast), y(+NorthEast, -SouthWest), z(-East, +West)
enum Direction {
    NorthEast,
    SouthWest,
    NorthWest,
    SouthEast,
    East,
    West
}

struct Coordinates {
    int64 x;
    int64 y;
    int64 z;
}

library Geo {
    function origin() internal pure returns (Coordinates memory o) {}

    function geohash(Coordinates memory c) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(c.x, c.y, c.z));
    }

    function neighbors(
        Coordinates calldata c
    ) internal pure returns (Coordinates[6] memory) {
        // X axis
        Coordinates memory northEast = Coordinates(c.x - 1, c.y, c.z);
        Coordinates memory southWest = Coordinates(c.x + 1, c.y, c.z);

        // Y axis
        Coordinates memory northWest = Coordinates(c.x, c.y + 1, c.z);
        Coordinates memory southEast = Coordinates(c.x, c.y - 1, c.z);

        // Z axis
        Coordinates memory east = Coordinates(c.x, c.y, c.z - 1);
        Coordinates memory west = Coordinates(c.x, c.y, c.z + 1);

        return [northEast, southWest, northWest, southEast, east, west];
    }
}
