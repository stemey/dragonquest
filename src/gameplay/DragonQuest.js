import { characters } from './characters'
import Unit from '../sprites/Unit'

class DragonQuestType {
  constructor (characters) {
    this.villains = characters.villains
    this.heroes = {}
    this.goldCount = 0

    Object.keys(characters.heroes).forEach((key) => {
      this.heroes[key] = new Unit(characters.heroes[key])
    })
  }

  getVillainByName(name) {
    const filtered = Object.values(this.villains).filter((villain, key) => villain.name === name)
    return filtered && filtered.length > 0 ? filtered[0] : undefined
  }

  getVillainById (id) {
    const filtered = Object.values(this.villains).filter((villain, key) => villain.id === id)
    return filtered && filtered.length > 0 ? filtered[0] : undefined
  }

  foundGold (goldCount) {
    this.goldCount += goldCount
    console.log('gold ' + this.goldCount)
  }

  foundFood (foodCount) {
    const foodShare = foodCount / Object.keys(this.heroes).length
    Object.values(this.heroes).forEach((hero) => {
      hero.foundFood(foodShare)
    })
  }
}

export const DragonQuest = new DragonQuestType(characters)
