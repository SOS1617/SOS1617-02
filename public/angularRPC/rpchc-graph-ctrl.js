/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCHCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.rpcyear = [];
        $scope.rpcvariation = [];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data =dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.rpcyear.push(Number($scope.data[i]["rpc-year"]));
                $scope.rpcvariation.push(Number($scope.data[i]["rpc-variation"]));
                
                
                console.log($scope.data[i].country);

            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
            
            Highcharts.chart('container', {
    chart: {
        type: 'line',
        inverted: false
    },
    title: {
        text: 'Browser market shares. January, 2015 to May, 2015'
    },
    subtitle: {
        text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
    },
    xAxis: {
                    categories: $scope.categorias
                },
                yAxis: {
            title: {
                countries: $scope.rpcyear
            }   
                },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series:[{
                    name: 'RPC Year',
                    data: $scope.rpcyear
                }],
    
});


            
            //RPC en 2014
            Highcharts.chart('container',{
                title: {
                    text: 'WORLD RPC 2014'
                },
                chart: {
                    type: 'line',
                    inverted: false
                },
                xAxis: {
                    categories: $scope.categorias
                },
                yAxis: {
            title: {
                countries: $scope.rpcyear
            }   
                },
                 tooltip: {
        valueSuffix: '€'
    },

    plotOptions: {
        columnrange: {
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y + '°€';
                }
            }
        }
    },
                
                legend: {
        enabled: false
    },
                
                series:[{
                    name: 'RPC Year',
                    data: $scope.rpcyear
                }]
            });
            
            //VAriacion rpc 2013 2014
            Highcharts.chart('container1',{
               title: {
                    text: 'WORLD RPC VARIATION 2013 TO 2014'
                },
                chart: {
                    type: 'line',
                    inverted: false
                },
                xAxis: {
                    categories: $scope.categorias
                },
                yAxis: {
            title: {
                countries: $scope.rpcvariation
            }   
                },
                 tooltip: {
        valueSuffix: '€'
    },

    plotOptions: {
        columnrange: {
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y + '°€';
                }
            }
        }
    },
                
                legend: {
        enabled: false
    },
                
                series:[{
                    name: 'RPC Year Variation',
                    data: $scope.rpcvariation
                }]
            });
    });
}]);