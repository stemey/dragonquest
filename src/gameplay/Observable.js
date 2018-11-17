export default class {

  constructor (source, path) {
    this.source = source
    let remainingPath = this.path
    this.path = []
    while (remainingPath.length > 0) {
      const result = remainingPath.match(/(\.([^[\.]+)|([^[\.]+)|\[([^[\.]+)\])/)
      if (result.length > 0) {
        remainingPath = remainingPath.substring(result[0].length)
        if (result[2]) {
          path.push({ type: 'prop', value: result[2] })
        } else if (result[3]) {
          path.push({ type: 'prop', value: result[3] })
        } else if (result[4]) {
          path.push({ type: 'index', value: parseInt(result[4]) })
        }
      }

    }
    get()
    {
      let value = this.source
      this.paths.forEach((path) => {
        if (value === null || value == undefined) {
          return
        }
        value = value[path.value]
      })

    }
    on(listener) {

    }
  }
  }
