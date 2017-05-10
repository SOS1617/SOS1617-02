exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: [
    'T01-LoadResourcesRPC.js','T02-AddResourceRPC.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};