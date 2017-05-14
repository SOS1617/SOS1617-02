/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMIPROXYGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.data = {};
        var dataCacheINV = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        $scope.population = [];
        $scope.riskpoverty = [];
        $scope.inveducation =[];
        $scope.smiyear = [];
        $scope.smivariation = [];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        ////////////////////
        /////DATOS IVAN/////
        ////////////////////
        
        $http.get("/api/v1/smi-stats/proxy/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCacheINV = response.data;
            $scope.data =dataCacheINV;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.population.push(Number($scope.data[i].population));
                $scope.riskpoverty.push(Number($scope.data[i].riskpoverty));
                $scope.inveducation.push(Number($scope.data[i].inveducation));
                
                console.log("Datos Ivan: "+$scope.data[i].country);

            }
        });
     
        ////////////////////
        /////DATOS SMI/////
        ////////////////////
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCacheSMI = response.data;
            $scope.data =dataCacheSMI;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias1.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.smiyear.push(Number($scope.data[i]["smi-year"]));
                $scope.smivariation.push(Number($scope.data[i]["smi-year-variation"]));
                
                console.log("Datos SMI: "+$scope.data[i].country);

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
                            capitalizeFirstLetter(this.x) + ': ' + this.y;
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