/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMICORSGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataINV = {};
        $scope.dataSMI = {};
        var dataCacheINV = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Ivan
        $scope.population = [];
        $scope.riskpoverty = [];
        $scope.inveducation =[];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       /* function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        */
        ////////////////////
        /////DATOS IVAN/////
        ////////////////////
        
        $http.get("http://sos1617-03.herokuapp.com/api/v2/investmentseducation/?apikey=apisupersecreta").then(function(response){
            
            dataCacheINV = response.data;
            $scope.dataINV =dataCacheINV;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push($scope.dataINV[i].country);
                $scope.population.push(Number($scope.dataINV[i].population));
                $scope.riskpoverty.push(Number($scope.dataINV[i].riskpoverty));
                $scope.inveducation.push(Number($scope.dataINV[i].inveducation));
                
                console.log("Datos Ivan: "+$scope.dataINV[i].country);

            }
        });
     
        ////////////////////
        /////DATOS SMI/////
        ////////////////////
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCacheSMI = response.data;
            $scope.dataSMI =dataCacheSMI;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias1.push($scope.dataSMI[i].country);
                $scope.smiyear.push(Number($scope.dataSMI[i]["smi-year"]));
                $scope.smivariation.push(Number($scope.dataSMI[i]["smi-year-variation"]));
                
                console.log("Datos SMI: "+$scope.dataSMI[i].country);

            }
        }); 
        
            
        console.log("Controller initialized");
        $http.get("/api/v1/smi-stats/proxy/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
            ////////////////////////////
            ////COMPARATIVA SMI 2017////
            ////////////////////////////
            Highcharts.chart('container',{
                title: {
                    text: 'WORLD SMI integrated with Investments Education'
                },
                chart: {
                    type: 'area'
                },
                xAxis: {
                    categories: $scope.categorias,
                   // categories: $scope.categorias1
                },
                legend: {
                    layout: 'vertical',
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    //align: 'left',
                    verticalAlign: 'top',
                    align: 'right',
                    y: 0,
                    x: 0
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                           this.x + ': ' + this.y;
                    }
                },
                series:[{
                    name: 'Population',
                    data: $scope.population
                },
                {
                    name: 'SMI Year',
                    data: $scope.smiyear
                }]
            });
            
    });
}]);