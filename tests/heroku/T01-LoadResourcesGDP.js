//Test sobre la carga de los datos

describe('Data is loaded', function () {
    
    
	it('should show a bunch of data', function (){
	    
		browser.get('https://sos1617-02.herokuapp.com/#!/gdp/');
		
		//Espera 10 segundos
	    browser.driver.sleep(10000);
		var smi = element.all(by.repeater('stat in stats'));

		expect(gdp.count()).toBeGreaterThan(1);
	});
});