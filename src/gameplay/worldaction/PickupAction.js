import Phaser from 'phaser'

const PickUpAction = (imageIndices, pickupCallback) => {
  return (map, layer, scene) => {
    const tileSet = layer.tileSet
    const golds = scene.physics.add.group({ classType: Phaser.GameObjects.Container })
    imageIndices.forEach((imageIndex) => {
      const goldSprites = map.createFromTiles(imageIndex + tileSet.first, imageIndex + tileSet.first, { key: 'scenery', frame: imageIndex }, undefined, undefined, layer.name)
      goldSprites.forEach((goldSprite) => {
        golds.add(goldSprite)
        scene.physics.add.overlap(scene.player, goldSprite, pickupCallback, false, goldSprite)
      })
    })
  }
}

export default PickUpAction


