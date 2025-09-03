module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Page name (e.g., "user-profile"):',
    validate: function(value) {
      if (!value.length) {
        return 'Page name is required'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'backRoute',
    message: 'Back route (default: /):',
    default: '/'
  },
  {
    type: 'input',
    name: 'nextRoute',
    message: 'Next route (default: /):',
    default: '/'
  },
  {
    type: 'input',
    name: 'translationKey',
    message: 'Translation key for title (optional):'
  },
  {
    type: 'input',
    name: 'translationDescKey',
    message: 'Translation key for description (optional):'
  },
  {
    type: 'input',
    name: 'actionTextKey',
    message: 'Translation key for action button (optional):'
  }
]
