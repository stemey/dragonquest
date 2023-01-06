# DragonQuest

## Development

1. start the continuous build:

`yarn watch`

This will do the following:
- generate json schema from typescript
- resolve references n json files and copy to generated folder
- removes $schema refs from json files

2. Start the game:

`yarn start`


3. Open the Browser in `localhost:3000`. Append `?debug=true` to display debug information.


# Game development

## Level

### Add a new level

1. To add a new level run `yarn add:level -n NAME`

2. Open Tiled to work on the new level map which is located in __/assets/level/NAME/map.json__.


3. Start editing the level configuration located in __/src/config/level/NAME/level.json__

### Contents of levels

Levels contain the following named objects, which are usually referenced in tile maps created by tiled:

-  Loot is an array of drop items (e.g. weapons, gold or keys). Weapons are defined in the global powers configuration.
-  Monsters are a list of character names from the global characters configuration.
-  Dialogs define communication which include:
   -  messages
   -  user input
   -  actions which change the game state
- Events are triggered when the game state changes (e.g. a named enemy was killed or an item acquired)


__Tools:__

Level configurations can be split into multiple files arbitrarily by replacing the sub tree of the json document with a ref `{"$ref":"./extracted-sub-doc.json"}`

Each json doc should start with the json schema references to enable validation in an editor (e.g. `"$schema":"../../../../generated/schemas/level.json"`)



## Global

Characters and Powers are defined globally in __src/config/gobal__


# Game state

The game state is important to trigger events (e.g. freeing a person by killing an enemy triggers a dialog). The items found in chests and other available interactive elements can also depend on game state. The game state consists of multiple components:

1. Player state

The main character has a class (e.g. Wizard or Knight) and a level.

2. Level state

Level state contains the following components:

- firedEvents is the list of events already fired
- flags is just a collection of flags which can be set in a Dialog
- monsters contains the state of the monsters (e.g. dead)
- dialogs contains the state of dialogs (e.g. finished)


# Gotchas

- Currently only one tileset per layer is supported. 

