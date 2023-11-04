// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Libs
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Local
import {AUROx} from "../Currency/AUROx.sol";
import {Coordinates, Direction, Geo} from "../Utils/Geo.sol";
import {Tile} from "../Tile/Tile.sol";
import {TileRegistry} from "../Tile/TileRegistry.sol";

// Errors
import {Player_InsufficientFunds, Player_Missing} from "./Errors.sol";

struct Attributes {
    bytes32 name;
    Coordinates location;
    uint8 level;
    uint8 movement;
    uint16 xionite;
    uint16 yilium;
    uint16 zephin;
}

contract Player is ERC721 {
    event Player_Created(uint256 playerId, bytes32 name);
    event Player_Moved(uint256 playerId, Direction direction);

    TileRegistry public immutable tileRegistry;
    AUROx public immutable currency;

    uint256 public counter;
    uint256 public price;

    mapping(uint256 => Attributes) public attributes;
    mapping(address => uint256) public ownerToPlayerId;

    constructor(
        uint256 _price,
        address _currency,
        address _tileRegistry
    ) ERC721("Player", "PLAYER") {
        price = _price;
        currency = AUROx(payable(_currency));
        tileRegistry = TileRegistry(_tileRegistry);
    }

    function create(bytes32 name) public payable {
        if (msg.value < price) {
            revert Player_InsufficientFunds();
        }

        _mint(msg.sender, ++counter);
        currency.mint(msg.sender, price);

        attributes[counter] = Attributes({
            name: name,
            level: 1,
            location: Geo.origin(),
            movement: 10,
            xionite: 150,
            yilium: 150,
            zephin: 150
        });

        ownerToPlayerId[msg.sender] = counter;

        emit Player_Created(counter, name);
    }

    function move(Direction direction) public {
        uint256 playerId = playerOf(msg.sender);

        if (playerId == 0) {
            revert Player_Missing(msg.sender);
        }

        Attributes storage attr = attributes[playerId];

        Tile destination = tileRegistry.getOrCreate(attr.location, direction);

        attr.location = destination.coordinates();

        emit Player_Moved(playerId, direction);
    }

    function getAttributes(
        uint256 playerId
    ) public view returns (Attributes memory) {
        return attributes[playerId];
    }

    function playerOf(address owner) public view returns (uint256) {
        return ownerToPlayerId[owner];
    }
}
