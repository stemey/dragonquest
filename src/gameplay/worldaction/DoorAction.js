import Phaser from 'phaser'

const DoorAction = (layerObject, world) => {
  const zones = world.physics.add.group({ classType: Phaser.GameObjects.Zone })
  const zone = zones.create(layerObject.x + layerObject.width / 2, layerObject.y + layerObject.height / 2, layerObject.width, layerObject.height)
  world.graphics.fillStyle(0x031f4c, 0.5)
  world.graphics.fillRect(layerObject.x, layerObject.y, zone.width, zone.height)
  let passingThrough = false
  world.physics.add.overlap(world.player, zone, (player, zone) => {
      if (!passingThrough && !player.body.touching.none) {
        passingThrough = true
        world.stopPlayer = true
        const down = player.body.touching.down ? 1 : -1
        world.cameras.main.stopFollow()
        const x = world.player.x
        const y = world.player.y
        player.visible = false
        const height = (layerObject.height + world.player.body.height + 2)
        console.log('moving ' + y + '  ' + down + ' ' + height)
        world.player.body.setVelocity(0)
        player.anims.stop()
        world.player.y = y + height * down
        world.cameras.main.pan(x, world.player.y, 500, undefined, false, (camery, progress) => {
          if (progress === 1) {
            world.cameras.main.startFollow(world.player)
            passingThrough = false
            player.visible = true
            world.stopPlayer = false
            console.log('reached ' + player.y)
          }

        })
      }

    }
    , this)

}

export default DoorAction
