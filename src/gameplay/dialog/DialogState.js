export default class {
  constructor (dialog) {
    this.data = dialog
    this.state = 'start'
    this.conversing = false
    if (!this.data.start) {
      console.error('dialog has no start note')
    }
  }

  stop () {
    this.conversing = false

  }

  chooseOption (idx) {
    const next = this.data[this.state]
    if (!next) {
      console.error('cannot find state ' + this.state)
      return
    }

    const option = next.options[idx]
    console.log('you choose: ' + option.message)
    this.state = option.next
    this.resumeConversation()
  }

  resume (player, npc) {
    window.gameDialog = this
    if (!this.conversing && (!this.endTime || Date.now() - this.endTime > 1000)) {

      this.conversing = true
      this.resumeConversation()
    }
    this.endTime = Date.now()
  }

  resumeConversation () {
    const next = this.data[this.state]
    if (!next) {
      console.error('cannot find state ' + this.state)
      return
    }
    if (next.npcMessage) {
      console.log('npc: ' + next.npcMessage)
    }
    if (next.message) {
      console.log('you: ' + next.message)
    }
    if (next.options) {
      console.log('choose one of: ')
      next.options.forEach((opt, idx) => {
        console.log(idx + ' : ' + opt.message)
      })
    }
    if (next.end) {
      console.log('end conversation')
      this.conversing = false
      this.endTime = Date.now()
    }
    if (next.next) {

      this.state = next.next

      if (this.conversing) {
        this.resumeConversation()
      }
    }
  }
}
