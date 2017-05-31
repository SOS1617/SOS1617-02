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
            
            
            
        
            var dataPoints = [];
            
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.names.push($scope.data[i].name);
                $scope.marketcap.push(Number($scope.data[i].market_cap_usd));
                
                var smallDataPoint = {label: $scope.data[i].name,  y: Number($scope.data[i].market_cap_usd)};
                
                dataPoints.push(smallDataPoint);
                
                }
            console.log(dataPoints);
        
        	
        	 var trace1 = {
                  x: $scope.names, 
                  y:  $scope.marketcap, 
                  name: 'USD', 
                  type: 'bar'
                };

                var data = [trace1];
                
                var layout = {barmode: 'group'};
                
                Plotly.newPlot('chartContainer', data, layout);

        
        
        
        
        
        
        
        
       });
        
}]);