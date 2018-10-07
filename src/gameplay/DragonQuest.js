import { characters } from './characters'
import Unit from '../sprites/Unit'
import LayerObject from './worldaction/LayerObject'

class DragonQuestType {

  constructor (characters) {
    this.villains = characters.villains
    this.heroes = {}
    this.goldCount = 0

    Object.keys(characters.heroes).forEach((key) => {
      this.heroes[key] = new Unit(characters.heroes[key])
    })

    this.worldActionRegistry = {}
  }

  getVillainByName (name) {
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

  getWorldAction (object, physics, container, scene) {
    if (object.properties) {
      const layerObject = new LayerObject(object)
      if (object.type) {
        return this.worldActionRegistry[object.type](new LayerObject(object), physics, container, scene)
      } else if (layerObject.getProp('monster')) {
        return this.worldActionRegistry['monster'](new LayerObject(object), physics, container, scene)
      } else {
        console.log('unknown action')
      }
    }
  }
}

export const DragonQuest = new DragonQuestType(characters)
