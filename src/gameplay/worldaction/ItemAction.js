import { DragonQuest } from '../DragonQuest'
import LayerObject from './LayerObject'

const ItemAction = (layerObject, world) => {
  const item = world.make.sprite({ x: layerObject.x, y: layerObject.y, key: 'scenery', frame: 200 })
  world.physics.add.existing(item)
  world.physics.add.overlap(world.player, item, (player, item) => {
      if (item.active) {
        item.visible = false
        item.active = false
        console.log(new LayerObject(layerObject).getProp('message'))
        DragonQuest.foundItem(new LayerObject(layerObject).toItemJson())
      }
    }
    , this)

}

export default ItemAction
