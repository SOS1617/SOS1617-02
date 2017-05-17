/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCPROXYGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCacheMot = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        $scope.countries= [];
        $scope.years = [];
        $scope.teams =[];
        $scope.rpcyear = [];
        $scope.rpcvariation = [];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
        }
     
     
     
     
        ////////////////////
        /////DATOS DAVID/////
        ////////////////////
        
        $http.get("/api/v1/rpc-stats/proxy/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCacheMot = response.data;
            $scope.data =dataCacheMot;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias1.push(capitalizeFirstLetter($scope.data[i].pilot));
                $scope.countries.push(Number($scope.data[i].country));
                $scope.years.push(Number($scope.data[i].year));
                $scope.teams.push(Number($scope.data[i].team));
            }
            console.log("Datos David: "+$scope.data);
           console.log("Datos David: "+$scope.categorias1);
             ////////////////////
            /////DATOS RPC/////
            ////////////////////
            $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheRPC = response.data;
                $scope.data =dataCacheRPC;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                    $scope.rpcyear.push(Number($scope.data[i].rpcyear));
                    $scope.rpcvariation.push(Number($scope.data[i].rpcvariation));
                }
                 console.log("Datos RPC: "+$scope.data);
                
            ////////////////////////////
            ////COMPARATIVA RPC 2017////
            ////////////////////////////
 Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'WORLD RPC integrated with WORLD of motorcycling'
    },
    
    xAxis: {
        categories: $scope.categorias
    },
    
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Motorcycling',
        data: $scope.years
    }, {
        name: 'RPC Year',
        data: $scope.rpcyear
    }]
});



        }); 
    });
}]);