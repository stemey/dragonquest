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

  getListProp (key) {
    const prop = this.getProp(key)
    if (prop !== null) {
      return prop.split(',').map((el) => el.trim())
    }
    return null
  }

  get x () {
    return this.obj.x
  }

  get y () {
    return this.obj.y
  }
}
