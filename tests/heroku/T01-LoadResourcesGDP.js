//Test sobre la carga de los datos

describe('Data is loaded', function () {
    
    
	it('should show a bunch of data', function (){
	    
		browser.get('https://sos1617-02.herokuapp.com/#!/gdp/');
		
		//Espera 10 segundos
	    browser.driver.sleep(10000);
		var gdp = element.all(by.repeater('country in countries'));

		expect(gdp.count()).toBeGreaterThan(1);
	});
});