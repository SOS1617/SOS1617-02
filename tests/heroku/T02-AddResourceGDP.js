describe('Add result', function () {
	it('should add a new result', function (){
		browser.get('https://sos1617-02.herokuapp.com/#!/gdp/');

	element.all(by.repeater('country in countries')).then(function (initialStats){
				
	
				browser.driver.sleep(4000);
	
	            //Escribimos en los inputs
				element(by.model('newCountry.country')).sendKeys('Gran Bretaña');
				element(by.model('newCountry.year')).sendKeys('2014');
				element(by.model("newCountry['gdp-year']")).sendKeys('7654321');
				element(by.model("newCountry['population-year']")).sendKeys('1234567');
				
				//Hacemos click en add stat
				element(by.buttonText('Add Country')).click().then(function (){

					element.all(by.repeater('stat in stats')).then(function (stats){
						expect(stats.length).toEqual(initialStats.length+1);
					});
				
				});
			
		});
	});
	
});