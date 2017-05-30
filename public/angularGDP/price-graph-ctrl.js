/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("PRICEGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.gdpyear = [];

      
        console.log("GDP HC Controller initialized");
        $http.get("/api/v2/gdp-population-stats/priceproxy"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            var exchange_rate_data = [];
            
            var bpi = {};
            bpi = $scope.data.bpi;
            console.log(bpi);
            
            
            var array = $.map(bpi, function(value, index) {
                return [value];
            });
            
            console.log(array)
            exchange_rate_data = array;
            
           
           
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'BTC/USD exchange rate for the last 30 days'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    
                },
                yAxis: {
                    title: {
                        text: 'Exchange rate'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
        
                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    data: exchange_rate_data
                }]
            });
           
           
           
           
           
            
        });
}]);