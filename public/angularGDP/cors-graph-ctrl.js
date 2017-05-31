/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GDPCORSGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        $scope.data2 = {};
        var dataCache = {};
        var dataCache2 = {};
        
        $scope.categorias = [];
        $scope.categorias2 = [];
        
        $scope.gdpyear = [];
        $scope.economicSituationStatsDebt = [];

            
        console.log("GDP CORS Controller initialized");
        
        $http.get("https://sos1617-05.herokuapp.com/api/v1/economic-situation-stats?apikey=cinco").then(function(response){
            
            
            dataCache = response.data;
            $scope.data = dataCache;
            //console.log($scope.data);
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push($scope.data[i].province);
                $scope.economicSituationStatsDebt.push(Number($scope.data[i].debt));
                
            }
                console.log($scope.categorias);
                console.log($scope.economicSituationStatsDebt);
            
            $http.get("/api/v2/gdp-population-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response1){
            
            
                    dataCache2 = response1.data;
                    $scope.data2 = dataCache2;
                    //console.log($scope.data2);
            
                    for(var i=0; i<response1.data.length; i++){
                         $scope.categorias2.push($scope.data2[i].country);
                         $scope.gdpyear.push(Number($scope.data2[i]["gdp-year"]));
                         
                     }
                     
                    Highcharts.chart('container', {
                        chart: {
                            type: 'scatter',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'GDP + DEBT integrated'
                        },
                        xAxis: {
                            categories: $scope.categorias
                        },
                        series: [{
                            name: 'GDP',
                            data: $scope.gdpyear,
                        }, {
                            name: 'DEBT',
                            data: $scope.economicSituationStatsDebt,
                        }]
                    });
                });
            });
    }]);