import { DragonQuest } from './DragonQuest'
import MonsterAction from './worldaction/MonsterAction'

export const initDragonQuest = () => {
  DragonQuest.worldActionRegistry['monster'] = MonsterAction
  // DragonQuest.worldActionRegistry['gateway'] = new GatewayFactory()
}
