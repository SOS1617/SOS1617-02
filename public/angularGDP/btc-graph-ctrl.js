/*global angular*/
/*global graphdata*/

angular
    .module("G2ManagerApp")
    .controller("BTCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.names = [];
        $scope.marketcap = [];

        $http.get("/api/v2/gdp-population-stats/btcproxy" + "?apikey=" + $scope.apikey).then(function(response){
            
            
            
            var graphdata = [];
            
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                var smallarray = [];
                smallarray.push($scope.data[i].name);
                smallarray.push(Number($scope.data[i].market_cap_usd));
                console.log(smallarray);
                
                graphdata.push(smallarray);
                console.log(graphdata);
                }
            console.log(graphdata);
        
        
            Highcharts.chart('container',{
                title: {
                    text: 'Top 10 cryptocurrencies by market cap'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    verticalAlign: 'top',
                    align: 'right',
                    y: 0,
                    x: 0
                },
                
                series:[ {
                    name: 'Market cap in USD',
                    data: graphdata
                }]
            });
            
        });
        
      
        
        
        
}]);