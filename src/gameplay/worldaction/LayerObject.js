export default class LayerObject {
  constructor (obj) {
    this.obj = obj
  }

  getProp (key) {
    const props = this.obj.properties.filter((prop) => prop.name === key)
    if (props.length > 0) {
      const prop = props[0]

      return prop
    }
    return null
  }

  getListProp (key) {
    const prop = this.getProp(key)
    if (prop !== null) {
      return prop.value.split(',').map((el) => el.trim())
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
