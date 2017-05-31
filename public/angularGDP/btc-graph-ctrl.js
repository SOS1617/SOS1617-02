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
                var smallDataPoint = {label: $scope.data[i].name,  y: Number($scope.data[i].market_cap_usd)};
                
                dataPoints.push(smallDataPoint);
                
                }
            console.log(dataPoints);
        
        
                var chart = new CanvasJS.Chart("chartContainer", {
        		theme: "theme2",//theme1
        		title:{
        			text: "TOP 10 Cryptocurrencies by market cap in USD"              
        		},
        		animationEnabled: false,   // change to true
        		data: [              
        		{
        			// Change type to "bar", "area", "spline", "pie",etc.
        			type: "column",
        			dataPoints: dataPoints
        		}
        		]
        	});
        	chart.render();

        
        
        
        
        
        
        
        
       });
        
}]);