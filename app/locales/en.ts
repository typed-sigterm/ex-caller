import type { I18nRequiedText } from './utils';

export default {
  'confirm': 'Confirm',
  'cancel': 'Cancel',
  'error': 'Error',
  'done': 'Done',
  'guide': {
    welcome: {
      0: { title: 'Welcome to ExCaller', description: 'This is a simple random call tool.' },
      1: { title: 'Start calling', description: 'Click the green button to start calling.' },
      2: { title: 'Settings', description: 'Click the blue button to open the settings page.' },
      3: { title: 'That\'s it', description: 'Is it simple enough? (lol)' },
    },
    stopRolling: {
      0: { title: 'Stop rolling', description: 'Click the red button to stop rolling.' },
    },
    namelist: {
      0: { title: 'Namelist feature', description: 'It is what you think it is.' },
      1: { title: 'Batch import/export', description: 'You can batch add names, or import names from Excel. Of course, you can also export the list to a text file.' },
      2: { title: 'Multiple lists', description: 'You can create multiple lists, and different lists do not interfere with each other. Click the dropdown box to switch the currently effective list.' },
    },
    plan: {
      0: { title: 'Plan feature', description: 'You can enable Plan to control the next draws.' },
      1: { title: 'But to prevent abuse', description: 'After enabling the plan feature, the settings button will turn red.' },
    },
  },
  'next-step': 'Next',
  'prev-step': 'Prev',
  'progress-template': 'Step {0} / {1}',
} satisfies I18nRequiedText;
