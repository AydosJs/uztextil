module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Component name (e.g., "awesome-button"):',
    validate: function(value) {
      if (!value.length) {
        return 'Component name is required'
      }
      return true
    }
  },
  {
    type: 'confirm',
    name: 'withVariants',
    message: 'Include component variants (cva)?',
    default: false
  },
  {
    type: 'confirm',
    name: 'updateIndex',
    message: 'Update components/ui/index.ts?',
    default: true
  }
]
