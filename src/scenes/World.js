import Phaser from 'phaser'
import { characters } from '../gameplay/characters'
import Unit from '../sprites/Unit'
import CharacterDisplay from '../sprites/CharacterDisplay'
import { DragonQuest } from '../gameplay/DragonQuest'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'WorldScene' })
  }

  preload () {

  }

  create () {
    // create the map
    var map = this.make.tilemap({ key: 'map' })

    // first parameter is the name of the tilemap in tiled
    // var tiles = map.addTilesetImage('spritesheet', 'tiles')
    var terrain = map.addTilesetImage('terrain', 'terrain')
    var tiles1 = map.addTilesetImage('VX Architecture Tileset', 'VX Architecture Tileset')
    var tiles2 = map.addTilesetImage('VX BuildingsTileset', 'VX BuildingsTileset')
    var tiles3 = map.addTilesetImage('VX DungeonTileset', 'VX DungeonTileset')
    var tiles4 = map.addTilesetImage('VX Interior Tileset', 'VX Interior Tileset')
    var tiles5 = map.addTilesetImage('VX Plants Tileset', 'VX Plants Tileset')
    var tiles6 = map.addTilesetImage('VX Scenery Tileset', 'VX Scenery Tileset')
    var tiles7 = map.addTilesetImage('VX Shop Tileset', 'VX Shop Tileset')
    var tiles8 = map.addTilesetImage('VX Winter Tileset', 'VX Winter Tileset')
    // creating the layers
    var background = map.createStaticLayer('background', terrain, 0, 0)
    var background2 = map.createStaticLayer('background2', terrain, 0, 0)
    var water = map.createStaticLayer('water', terrain, 0, 0)
    var buildingbottom = map.createStaticLayer('buildingbottom', terrain, 0, 0)
    var buildingwall = map.createStaticLayer('buildingwall', tiles1, 0, 0)
    var terrainwall = map.createStaticLayer('terrainwall', terrain, 0, 0)
    var building = map.createStaticLayer('building', tiles2, 0, 0)
    var building2 = map.createStaticLayer('building2', tiles2, 0, 0)
    var plants = map.createStaticLayer('plants', tiles5, 0, 0)
    var gold = map.createStaticLayer('gold', tiles6, 0, 0)
    var food = map.createStaticLayer('food', tiles6, 0, 0)
    var deco = map.createStaticLayer('deco', tiles6, 0, 0)

    this.monsters = []
    const monsterLayer = map.getObjectLayer('monster')
    const container = this.physics.add.group({ classType: Phaser.GameObjects.Container })
    monsterLayer.objects.forEach((obj) => {
      if (obj.properties && obj.properties) {
        obj.properties.filter((prop) => prop.name === 'monster').forEach((prop) => {
          const monsterIds = prop.value.split(',')
          const enemies = monsterIds.map((id) => DragonQuest.getVillainByName(id)).filter((villain) => !!villain).map((villain) => new Unit(villain))
          monsterIds.filter((monsterId) => monsterId.length > 0)
            .forEach((monsterId, idx) => {
              const villain = DragonQuest.getVillainByName(monsterId)
              if (villain) {
                const sprite = this.make.sprite({ x: obj.x + Math.round(idx * 30), y: obj.y + Math.round(idx * 5), key: villain.image })
                this.monsters.push(sprite)
                container.add(sprite)
                sprite.enemies = enemies
                sprite.enemyId = enemies[idx].id
              } else {
                console.error(`cannot find villain with name ${monsterId}`)
              }
            })
        })
      }
    })

    // make all tiles in obstacles collidable
    water.setCollisionByExclusion([-1])
    building.setCollisionByExclusion([-1])
    buildingwall.setCollisionByExclusion([-1])
    terrainwall.setCollisionByExclusion([-1])
    this.events.on('wake', this.wake, this)

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1
    })

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14] }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 6, 0, 12] }),
      frameRate: 10,
      repeat: -1
    })

    // our player sprite created through the phycis system
    this.player = this.physics.add.sprite(2200, 600, 'player', 6)
    this.player.scaleX = 2
    this.player.scaleY = 2

    // don't go out of the map
    this.physics.world.bounds.width = map.widthInPixels
    this.physics.world.bounds.height = map.heightInPixels
    this.player.setCollideWorldBounds(true)

    // don't walk on trees
    // this.physics.add.collider(this.player, obstacles1)
    this.physics.add.collider(this.player, water)
    this.physics.add.collider(this.player, building)
    this.physics.add.collider(this.player, buildingwall)
    this.physics.add.collider(this.player, terrainwall)

    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.roundPixels = true // avoid tile bleed

    // user input
    this.cursors = this.input.keyboard.createCursorKeys()

    this.player.body.setVelocity(0)

    // 840, 841,902
    this.golds = this.physics.add.group({ classType: Phaser.GameObjects.Container })
    let goldSprites = map.createFromTiles(840, 840, { key: 'scenery', frame: 100 }, undefined, undefined, 'gold')
    goldSprites = goldSprites.concat(map.createFromTiles(841, 841, { key: 'scenery', frame: 101 }, undefined, undefined, 'gold'))
    goldSprites = goldSprites.concat(map.createFromTiles(890, 841, { key: 'scenery', frame: 102 }, undefined, undefined, 'gold'))
    goldSprites = goldSprites.concat(map.createFromTiles(902, 841, { key: 'scenery', frame: 103 }, undefined, undefined, 'gold'))
    gold.visible = false
    goldSprites.forEach((goldSprite) => {
      this.golds.add(goldSprite)
      this.physics.add.overlap(this.player, goldSprite, this.onGold, false, this)
    })

    this.foods = this.physics.add.group({ classType: Phaser.GameObjects.Container })
    let foodsSprites = map.createFromTiles(902, 902, { key: 'scenery', frame: 164 }, undefined, undefined, 'food')
    foodsSprites = foodsSprites.concat(map.createFromTiles(903, 903, { key: 'scenery', frame: 163 }, undefined, undefined, 'food'))
    foodsSprites = foodsSprites.concat(map.createFromTiles(904, 904, { key: 'scenery', frame: 162 }, undefined, undefined, 'food'))
    foodsSprites = foodsSprites.concat(map.createFromTiles(905, 905, { key: 'scenery', frame: 165 }, undefined, undefined, 'food'))
    food.visible = false
    foodsSprites.forEach((foodSprite) => {
      this.foods.add(foodSprite)
      this.physics.add.overlap(this.player, foodSprite, this.onFood, false, this)
    })

    this.monsters.forEach((child) => {
      this.physics.add.overlap(this.player, child, this.onMeetEnemy, false, this)
    })

  }

  onMeetEnemy (player, zone) {
    // we move the zone to some other location

    this.player.body.setVelocity(0)
    this.scene.sleep()
    if (this.scene.isSleeping('BattleScene')) {
      this.scene.wake('BattleScene', { enemies: zone.enemies })
    } else {
      this.scene.launch('BattleScene', { enemies: zone.enemies })
    }

    // start battle
  }

  onGold (player, gold) {
    if (gold.active) {
      gold.visible = false
      gold.active = false
      DragonQuest.foundGold(10)
    }
  }

  onFood (player, food) {
    if (food.active) {
      food.visible = false
      food.active = false
      DragonQuest.foundFood(10)
    }
  }

  update (time, delta) {
    //    this.controls.update(delta);

    this.player.body.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80)
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80)
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80)
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80)
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true)
      this.player.flipX = true
    }
    else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true)
      this.player.flipX = false
    }
    else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true)
    }
    else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true)
    }
    else {
      this.player.anims.stop()
    }
  }

  render () {
    this.debug.spriteInfo(this.monsters)
  }

  wake (sys, data) {
    if (data.deadEnemies && data.deadEnemies.length > 0) {

      this.monsters.filter((sprite) =>
        data.deadEnemies.filter((enemy) =>
          sprite.enemyId === enemy.id
        ).length > 0
      ).forEach((sprite) => {
        sprite.destroy()
      })
    }
    this.player.x = this.player.x + 100
    this.player.body.setVelocity(0)
    this.cursors.right.reset()
    this.cursors.left.reset()
    this.cursors.up.reset()
    this.cursors.down.reset()
  }

}
