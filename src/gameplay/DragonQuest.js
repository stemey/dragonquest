import { characters } from './characters'
import Unit from '../sprites/Unit'
import LayerObject from './worldaction/LayerObject'
import { observable } from 'mobx'

class DragonQuestType {

  constructor (characters) {
    this.villains = characters.villains
    this.heroes = {}
    this.goldCount = observable.box(0)
    this.items = observable.map({})

    Object.keys(characters.heroes).forEach((key) => {
      this.heroes[key] = new Unit(characters.heroes[key])
    })
    this.npc = characters.npc

    this.worldActionRegistry = {}
  }


  getVillainByName (name) {
    const filtered = Object.values(this.villains).filter((villain, key) => villain.name === name)
    return filtered && filtered.length > 0 ? filtered[0] : undefined
  }

  getNpcByName (name) {
    return this.npc[name]
  }

  getVillainById (id) {
    const filtered = Object.values(this.villains).filter((villain, key) => villain.id === id)
    return filtered && filtered.length > 0 ? filtered[0] : undefined
  }

  foundGold (goldCount) {
    this.goldCount.set(this.goldCount.get() + goldCount)
    console.log('gold ' + this.goldCount)
  }

  foundItem (item) {
    this.items.set(item.name, item)
  }

  foundItems (items) {
    items.forEach((item) => this.foundItem(item))
  }

  getItem (name) {
    return this.items.get(name)
  }

  hasItem (name) {
    return this.items.has(name)
  }

  foundFood (foodCount) {
    const foodShare = foodCount / Object.keys(this.heroes).length
    Object.values(this.heroes).forEach((hero) => {
      hero.foundFood(foodShare)
    })
  }

  logInventory () {
    this.items.values().forEach((item) => {
      console.log(item.type + ' ' + item.name)
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
window.DragonQuest = DragonQuest
