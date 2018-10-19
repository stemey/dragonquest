import LayerObject from '../gameplay/worldaction/LayerObject'

export default class TileLayerFactory {

  constructor (mapKey, scene) {
    this.tileSetImages = {}
    this.mapKey = mapKey
    this.scene = scene
    const data = scene.cache.tilemap.get(mapKey)
    this.mapConfig = data.data
    this.tileSets = this.mapConfig.tilesets.map((tileset) => {
      return {
        name: tileset.name,
        first: tileset.firstgid,
        count: tileset.tilecount,
        original: tileset
      }
    })

    this.layers = this.mapConfig.layers.map((layer) => {
      if (layer.type === 'tilelayer') {
        let tileSets = this.findTilesetList(layer.data)
        const uniqueTileSet = {}
        tileSets.forEach((ts) => {
          uniqueTileSet[ts.name] = ts
        })
        tileSets = Object.values(uniqueTileSet)
        if (tileSets.length === 0) {
          console.warn(`no tileset found for layer ${layer.name}`)
          return null
        } else if (tileSets.length > 1) {
          console.warn(`more than one tileset found for layer ${layer.name} ${tileSets.map((t) => t.name).join(', ')}`)
        }
        return { name: layer.name, tileSet: tileSets[0], layer, properties: new LayerObject(layer) }
      } else {
        return { type: layer.type, name: layer.name, layer, properties: new LayerObject(layer) }
      }
    })

    this.actions = {}
  }

  findTileset (gid) {
    let tileSets = this.tileSets.filter((tileSet) => {
      return tileSet.first <= gid && tileSet.first + tileSet.count > gid
    })
    if (tileSets.length === 1) {
      return tileSets[0]
    }
    return null
  }

  findTilesetList (gids) {
    if (!gids) {
      return []
    }
    return gids.map((gid) => this.findTileset(gid)).filter((tileSet) => !!tileSet)
  }

  boot () {
    this.tileSets.forEach((ts) => {
      this.scene.load.image(ts.name, 'assets/map/' + ts.name + '.png')
    })
  }

  getType (props) {
    let type = props.getProp('type')
    if (!type && props.getProp('monster')) {
      type = 'monster'
    }
    return type
  }

  create () {
    this.map = this.scene.make.tilemap({ key: this.mapKey })
    this.tileSets.forEach((ts) => {
      this.tileSetImages[ts.name] = this.map.addTilesetImage(ts.name, ts.name)
    })

    this.layers.forEach((layer) => {
      if (layer.type === 'objectgroup') {
        layer.layer.objects.forEach((layerObject) => {
          const props = new LayerObject(layerObject)
          const type = this.getType(props)
          const action = this.actions[type]
          if (action) {
            action(layerObject, this.scene)
          }
        })
      } else if (layer.properties.getProp('collide')) {
        const theLayer = this.map.createStaticLayer(layer.name, this.tileSetImages[layer.tileSet.name], 0, 0)
        theLayer.setCollisionByExclusion([-1])
        this.scene.physics.add.collider(this.scene.player, theLayer)
      } else if (layer.properties.getProp('type')) {
        const type = layer.properties.getProp('type')

        const action = this.actions[type]
        if (action) {
          const tiles = this.map.createStaticLayer(layer.name, this.tileSetImages[layer.tileSet.name], 0, 0)
          action(this.map, layer, this.scene)
          tiles.visible = false
        }
      } else {
        this.map.createStaticLayer(layer.name, this.tileSetImages[layer.tileSet.name], 0, 0)
      }
    })
  }
}
