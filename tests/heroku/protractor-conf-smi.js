exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadResourcesSMI.js','T02-AddResourceSMI.js','T01-LoadResourcesGDP.js','T02-AddResourceGDP.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};