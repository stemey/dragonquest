export const StrangerDialog = {
  start: {
    message: 'hi',
    next: 'hi'
  },
  hi: {
    npcMessage: 'How are you?',
    next: 'question'
  },
  question: {
    options: [{
      message: 'Where is the secret gem?',
      next: 'secretGem'
    }, {
      message: 'Bye',
      next: 'end'
    }]
  },
  end: { npcMessage: 'bye', end: true, next: 'askAgain' },
  secretGem: { npcMessage: 'It is in the northern woods', next: 'askAgain' },
  askAgain: {
    options: [{
      message: 'Can you explain it to me again?',
      next: 'secretGem'
    }, {
      message: 'Bye',
      next: 'end'

    }]
  }

}
