export default class LayerObject {
  constructor (obj) {
    this.obj = obj
  }

  getProp (key) {
    if (!this.obj.properties) {
      return null
    }
    const props = this.obj.properties.filter((prop) => prop.name === key)
    if (props.length > 0) {
      const prop = props[0]

      return prop.value
    }
    return null
  }

  getKeys () {
    return this.obj.properties.map((obj) => obj.name)
  }

  getListProp (key) {
    const prop = this.getProp(key)
    if (prop !== null) {
      return prop.split(',').map((el) => el.trim())
    }
    return null
  }

  toItemJson () {
    const item = { name: this.obj.name }
    this.getKeys().forEach((key) => {
      item[key] = this.getProp(key)
    })
    return item
  }

  get x () {
    return this.obj.x
  }

  get y () {
    return this.obj.y
  }
}
