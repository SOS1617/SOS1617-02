
//TEST DE COMPORTAMIENTO
//DESCRIBES QUE ES LO QUE DEBE PASAR
describe('Data is loaded', function () {
    //DEBE MOSTRAR UNA LISTA DE DATOS
	it('should show a bunch of data', function (){
	    
	    
	    
		browser.get('https://sos1617-02.herokuapp.com/#!/smi/');
		
		//Espera 10 segundos
	    browser.driver.sleep(10000);
		var smi = element.all(by.repeater('stat in stats'));

		expect(smi.count()).toBeGreaterThan(1);
	});
});