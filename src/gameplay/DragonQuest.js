import { characters } from './characters'
import Unit from '../sprites/Unit'

class DragonQuestType {
  constructor (characters) {
    this.villains = characters.villains
    this.heroes = {}

    Object.keys(characters.heroes).forEach((key) => {
      this.heroes[key] = new Unit(characters.heroes[key])
    })
  }

  getVillainById (id) {
    const filtered = Object.values(this.villains).filter((villain, key) => villain.id === id)
    return filtered && filtered.length > 0 ? filtered[0] : undefined
  }
}

export const DragonQuest = new DragonQuestType(characters)
