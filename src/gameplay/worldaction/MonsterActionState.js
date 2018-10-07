export default class MonsterActionState {
  constructor (monsters, scene) {
    this.scene = scene
    this.monsters = monsters
    this.scene.events.on('wake', this.wake, this)
  }

  onMeetEnemy (player, monster) {
    player.body.setVelocity(0)
    this.scene.scene.sleep()
    if (this.scene.scene.isSleeping('BattleScene')) {
      this.scene.scene.wake('BattleScene', { enemies: monster.enemies })
    } else {
      this.scene.scene.launch('BattleScene', { enemies: monster.enemies })
    }
  }

  wake (data) {
    if (data.deadEnemies && data.deadEnemies.length > 0) {

      this.monsters.filter((sprite) =>
        data.deadEnemies.filter((enemy) =>
          sprite.enemyId === enemy.id
        ).length > 0
      ).forEach((sprite) => {
        sprite.destroy()
      })
    }
  }
}
