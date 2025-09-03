module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Hook name (without "use" prefix, e.g., "local-storage"):',
    validate: function(value) {
      if (!value.length) {
        return 'Hook name is required'
      }
      return true
    }
  },
  {
    type: 'confirm',
    name: 'updateIndex',
    message: 'Update lib/hooks/index.ts?',
    default: true
  }
]
