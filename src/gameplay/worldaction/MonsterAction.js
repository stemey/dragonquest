import { DragonQuest } from '../DragonQuest'
import Unit from '../../sprites/Unit'
import MonsterActionState from './MonsterActionState'
import Phaser from 'phaser'
import LayerObject from './LayerObject'

const MonsterAction = (layerObject, world) => {
  const monsters = []
  const monsterIds = new LayerObject(layerObject).getListProp('monster')
  if (monsterIds) {
    const container = world.physics.add.group({ classType: Phaser.GameObjects.Container })
    const enemies = monsterIds.map((id) => DragonQuest.getVillainByName(id)).filter((villain) => !!villain).map((villain) => new Unit(villain))
    monsterIds.filter((monsterId) => monsterId.length > 0)
      .forEach((monsterId, idx) => {
        const villain = DragonQuest.getVillainByName(monsterId)
        if (villain) {
          const sprite = world.make.sprite({ x: layerObject.x + Math.round(idx * 30), y: layerObject.y + Math.round(idx * 5), key: villain.image })
          monsters.push(sprite)
          container.add(sprite)
          sprite.enemies = enemies
          sprite.enemyId = enemies[idx].id
        } else {
          console.error(`cannot find villain with name ${monsterId}`)
        }
      })
  }
  const state = new MonsterActionState(monsters, world)
  monsters.forEach((sprite) => {
    world.physics.add.overlap(world.player, sprite, state.onMeetEnemy, false, state)
    world.events.on('battleFinished', (data) => {

      if (data && data.deadEnemies) {
        data.deadEnemies.forEach((enemy) => {
            if (sprite.enemyId === enemy) {
              sprite.destroy()
            }
          }
        )
      }
    }, this)

  })

}

export default MonsterAction
