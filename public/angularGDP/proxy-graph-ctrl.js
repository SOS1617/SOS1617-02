/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GDPPROXYGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        $scope.data2 = {};
        var dataCache = {};
        var dataCache2 = {};
        
        $scope.categorias = [];
        $scope.categorias2 = [];
        
        $scope.gdpyear = [];
        $scope.averageSalary = [];

            
        console.log("GDP CORS Controller initialized");
        
        $http.get("/api/v2/gdp-population-stats/proxy" + "?apikey=" + $scope.apikey).then(function(response){
            
            
            dataCache = response.data;
            $scope.data = dataCache;
            //console.log($scope.data);
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push($scope.data[i].country);
                $scope.averageSalary.push(Number($scope.data[i].averageSalary));
                
            }
                console.log($scope.categorias);
                console.log($scope.averageSalary);
            
            $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
                    dataCache2 = response.data;
                    $scope.data2 = dataCache2;
                    //console.log($scope.data2);
            
                    for(var i=0; i<response.data.length; i++){
                         $scope.categorias2.push($scope.data2[i].country);
                         $scope.gdpyear.push(Number($scope.data2[i]["gdp-year"]));
                         
                        
                    }
                    
                    Highcharts.chart('container', {
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: 'GDP + AV SALARIES integrated'
                        },
                        xAxis: {
                            categories: $scope.categorias
                        },
                        series: [{
                            name: 'GDP',
                            data: $scope.gdpyear,
                        }, {
                            name: 'DEBT',
                            data: $scope.averageSalary,
                        }],
                    });
                    console.log($scope.gdpyear);
                    console.log($scope.categorias2);
                    
                });
                     
                         
                     
                     
                    
                    
            
        });
}]);