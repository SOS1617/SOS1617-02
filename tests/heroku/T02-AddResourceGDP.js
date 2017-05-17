describe('Add result', function () {
	it('should add a new result', function (){
		browser.get('https://sos1617-02.herokuapp.com/#!/gdp/');
		//browser.get('https://sos161702-agc-sandbox-sos161702agc.c9users.io/#!/gdp/');

	element.all(by.repeater('country in countries')).then(function (initialStats){
				
				// at the top of the test spec:
			    var fs = require('fs');
			 
			    // abstract writing screen shot to a file
			    function writeScreenShot(data, filename) {
			        var stream = fs.createWriteStream(filename);
			        stream.write(new Buffer(data, 'base64'));
			        stream.end();
			    }
			 
			    
 
	
	
				browser.driver.sleep(4000);
	
	            //Escribimos en los inputs
	            // within a test:
			    browser.takeScreenshot().then(function (png) {
			        writeScreenShot(png, 'exception.png');
			    });
				element(by.model("newCountry.country")).sendKeys('Gran Bretaña');
				element(by.model("newCountry.year")).sendKeys('2014');
				element(by.model("newCountry['gdp-year']")).sendKeys('7654321');
				element(by.model("newCountry['population-year']")).sendKeys('1234567');
				
				//Hacemos click en add stat
				element(by.buttonText('Add Country')).click().then(function (){

					element.all(by.repeater('country in countries')).then(function (countries){
						expect(countries.length).toEqual(initialStats.length+1);
					});
				
				});
			
		});
	});
	
});