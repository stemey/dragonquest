import { StrangerDialog } from './dialog/StrangerDialog'

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
      damage: 6
    },
    {
      name: 'healing',
      type: 'heal',
      healing: 10
    }
  ]

}

const redmonster = {
  name: 'Kiri',
  image: 'redmonster',
  armor: 30,
  maxHp: 20,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 100,
      damage: 50
    }
  ]

}

const monster = {
  name: 'Rumps',
  image: 'monster',
  armor: 30,
  maxHp: 20,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 100,
      damage: 50
    }
  ]

}

const schaere = {
  name: 'Goldi',
  image: 'goldenhand',
  armor: 5,
  maxHp: 20,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 10,
      damage: 5
    }
  ]

}

const greeneyemage = {
  name: 'Greenie',
  image: 'bossmagequesttempel',
  armor: 10,
  maxHp: 20,
  healing: 0,
  attacks: [
    {
      name: 'beam',
      strength: 100,
      damage: 10
    }
  ]

}

const stampfi = {
  name: 'Stampfi',
  image: 'greenstampfer',
  armor: 30,
  maxHp: 20,
  healing: 0,
  attacks: [
    {
      name: 'claws',
      strength: 10,
      damage: 5
    }
  ],
  dropItems: [
    {
      type: 'gold',
      amount: 4000
    },
    {
      type: 'weapon',
      name: 'golden monsterslayer',
      image: 'sword',
      strength: 100,
      damage: 10
    },
    {
      type: 'key',
      name: 'golden key',
      image: 'bronce_key',
      id: 'noobpapanr1'
    }
  ]

}

const stranger = {
  type: 'dialog',
  name: 'Willibert',
  dialog: StrangerDialog,
  image: 'stranger',
  scale: 0.4
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
    stampfi,
    greeneyemage
  ],
  npc: {
    stranger
  }

}
