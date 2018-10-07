import { DragonQuest } from '../DragonQuest'
import Unit from '../../sprites/Unit'
import MonsterActionState from './MonsterActionState'
import Phaser from 'phaser'

const MonsterAction = (layerObject, scene) => {
  const monsters = []
  const monsterIds = layerObject.getListProp('monster')
  if (monsterIds) {
    const container = scene.physics.add.group({ classType: Phaser.GameObjects.Container })
    const enemies = monsterIds.map((id) => DragonQuest.getVillainByName(id)).filter((villain) => !!villain).map((villain) => new Unit(villain))
    monsterIds.filter((monsterId) => monsterId.length > 0)
      .forEach((monsterId, idx) => {
        const villain = DragonQuest.getVillainByName(monsterId)
        if (villain) {
          const sprite = scene.make.sprite({ x: layerObject.x + Math.round(idx * 30), y: layerObject.y + Math.round(idx * 5), key: villain.image })
          monsters.push(sprite)
          container.add(sprite)
          sprite.enemies = enemies
          sprite.enemyId = enemies[idx].id
        } else {
          console.error(`cannot find villain with name ${monsterId}`)
        }
      })
  }
  const state = new MonsterActionState(monsters, scene)
  monsters.forEach((child) => {
    scene.physics.add.overlap(scene.player, child, state.onMeetEnemy, false, state)
  })
}

export default MonsterAction
