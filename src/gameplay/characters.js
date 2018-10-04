const knight = {
  name: 'Knight',
  armor: 12,
  image: 'player',
  maxHp: 30,
  attacks: [
    {
      name: 'sword',
      strength: 10,
      damage: 10
    },
    {
      name: 'axe',
      strength: 20,
      damage: 7
    }
  ]

}

const wizard = {
  name: 'Wizard',
  armor: 4,
  image: 'player',
  maxHp: 30,
  attacks: [
    {
      name: 'fireball',
      strength: 100,
      magical: true,
      damage: 3
    },
    {
      name: 'healing',
      type: 'heal',
      healing: 4
    }
  ]

}

const redmonster = {
  name: 'Kiri',
  image: 'redmonster',
  armor: 18,
  maxHp: 11,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 10,
      damage: 3
    }
  ]

}

const monster = {
  name: 'Rumps',
  image: 'monster',
  armor: 8,
  maxHp: 10,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 3,
      damage: 20
    }
  ]

}

const schaere = {
  name: 'Goldi',
  image: 'goldenhand',
  armor: 8,
  maxHp: 30,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 10,
      damage: 10
    }
  ]

}

const stampfi = {
  name: 'Stampfi',
  image: 'greenstampfer',
  armor: 8,
  maxHp: 30,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 10,
      damage: 10
    }
  ]

}

export const characters = {
  heroes: {
    wizard,
    knight
  },
  villains: [
    schaere,
    redmonster,
    monster,
    stampfi
  ]

}
