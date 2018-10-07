import Phaser from 'phaser'
import { DragonQuest } from '../gameplay/DragonQuest'
import { initDragonQuest } from '../gameplay/initDragonQuest'
import TileLayerFactory from '../tile/TileLayerFactory'
import PickUpAction from '../gameplay/worldaction/PickupAction'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'WorldScene' })
  }

  preload () {

  }

  create () {
    initDragonQuest()

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

    const smallmap = new TileLayerFactory('map', this)
    smallmap.actions['gold'] = PickUpAction([100, 101], (player, gold) => {
      if (gold.active) {
        gold.visible = false
        gold.active = false
        DragonQuest.foundGold(10)
      }
    })
    smallmap.actions['food'] = PickUpAction([162, 163, 164, 165], (player, gold) => {
      if (gold.active) {
        gold.visible = false
        gold.active = false
        DragonQuest.foundFood(10)
      }
    })
    smallmap.create()
    const map = smallmap.map
    this.children.bringToTop(this.player)

    // don't go out of the map
    this.physics.world.bounds.width = smallmap.map.widthInPixels
    this.physics.world.bounds.height = smallmap.map.heightInPixels
    this.player.setCollideWorldBounds(true)

    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.roundPixels = true // avoid tile bleed

    // user input
    this.cursors = this.input.keyboard.createCursorKeys()

    this.player.body.setVelocity(0)

    this.monsters = []
    const monsterLayer = map.getObjectLayer('monster')
    monsterLayer.objects.forEach((obj) => {
      DragonQuest.getWorldAction(obj, this)
    })
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
