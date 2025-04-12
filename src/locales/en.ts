import type { I18nRequiedText } from '@/locales/utils';

export default {
  'confirm': 'Confirm',
  'cancel': 'Cancel',
  'error': 'Error',
  'done': 'Done',
  'guide': {
    welcome: [
      { title: 'Welcome to ExCaller', description: 'This is a simple random call tool.' },
      { title: 'Start calling', description: 'Click the green button to start calling.' },
      { title: 'Settings', description: 'Click the blue button to open the settings page.' },
      { title: 'That\'s it', description: 'Is it simple enough? (lol)' },
    ],
    stopRolling: [
      { title: 'Stop rolling', description: 'Click the red button to stop rolling.' },
    ],
    namelist: [
      { title: 'Namelist feature', description: 'It is what you think it is.' },
      { title: 'Batch import/export', description: 'You can batch add names, or import names from Excel. Of course, you can also export the list to a text file.' },
      { title: 'Multiple lists', description: 'You can create multiple lists, and different lists do not interfere with each other. Click the dropdown box to switch the currently effective list.' },
    ],
    group: [
      { title: 'Group feature', description: 'You can group names, and narrow down the range of names to be called.' },
      { title: 'Enable group calling', description: 'Limiting the range of names to be called within the group.' },
    ],
    plan: [
      { title: 'Plan feature', description: 'You can enable Plan to control the next draws.' },
      { title: 'But to prevent abuse', description: 'After enabling the plan feature, the settings button will turn red.' },
    ],
  },
  'next-step': 'Next',
  'prev-step': 'Prev',
  'progress-template': 'Step {0} / {1}',
  'namelist-n': 'Namelist {0}',
  'group-n': 'Group {0}',
} satisfies I18nRequiedText;
