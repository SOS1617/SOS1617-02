exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadResourcesSMI.js','T02-AddResourcesSMI.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};