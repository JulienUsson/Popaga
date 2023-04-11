module.exports = {
  input: ['./src/**/*.{js,jsx,ts,tsx}'],
  sort: true,
  output: './',
  options: {
    debug: true,
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en', 'fr'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: function (lng, ns, key) {
      if (lng === 'en') {
        // Return key as the default value for English language
        return key
      }
      // Return empty string for other languages
      return ''
    },
    resource: {
      loadPath: 'src/i18n/{{lng}}.json',
      savePath: 'src/i18n/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false,
    keySeparator: false,
    removeUnusedKeys: true,
  },
}
