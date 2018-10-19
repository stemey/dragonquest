import Phaser from 'phaser'
import LayerObject from './LayerObject'

const GatewayAction = (layerObject, world) => {
  const target = new LayerObject(layerObject).getProp('target')
  const zones = world.physics.add.group({ classType: Phaser.GameObjects.Zone })
  const zone = zones.create(layerObject.x, layerObject.y, layerObject.width, layerObject.height)
  world.physics.add.overlap(world.player, zone, (player, zone) => {
      world.scene.sleep()
      if (world.scene.isSleeping(target)) {
        world.scene.wake(target)
      } else {
        world.scene.launch(target)
      }
    }
    , this)

}

export default GatewayAction
