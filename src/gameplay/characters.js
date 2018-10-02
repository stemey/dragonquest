const knight = {
  name: 'Knight',
  armor: 12,
  maxHp: 30,
  attacks: [
    {
      name: 'sword',
      strength: 10,
      damage: 10
    },
    {
      name: 'axe',
      strength: 15,
      damage: 5
    }
  ]

}

const wizard = {
  name: 'Wizard',
  armor: 4,
  maxHp: 30,
  healing: 10,
  attacks: [
    {
      name: 'fireball',
      strength: 100,
      magical: true,
      damage: 4
    },
    {
      name: 'healing',
      strength: 100,
      damage: -4
    }
  ]

}

const dragon = {
  name: 'Dragon',
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
  villains: {
    dragon
  }

}
