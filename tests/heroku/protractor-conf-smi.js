exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadResourcesSMI.js','T02-AddResourceSMI.js','T01-LoadResourcesGDP.js','T02-AddResourceGDP.js',
    'T01-LoadResourcesRPC.js','T02-AddResourceRPC.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};