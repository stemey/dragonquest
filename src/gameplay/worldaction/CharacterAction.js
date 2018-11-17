import { DragonQuest } from '../DragonQuest'
import Phaser from 'phaser'
import DialogState from '../dialog/DialogState'

const CharacterAction = (layerObject, world) => {
  const name = layerObject.name
  const characters = world.physics.add.group({ classType: Phaser.GameObjects.Container })
  const npc = DragonQuest.getNpcByName(name)
  if (npc) {
    const sprite = world.make.sprite({ x: layerObject.x, y: layerObject.y, key: npc.image })
    characters.add(sprite)
    sprite.scaleX = npc.scale || 1
    sprite.scaleY = npc.scale || 1
    if (npc.type === 'dialog' && npc.dialog) {
      const state = new DialogState(npc.dialog)
      world.physics.add.overlap(world.player, sprite, state.resume, false, state)
    }
  }

}

export default CharacterAction
