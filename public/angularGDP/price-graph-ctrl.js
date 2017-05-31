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
            
            var dates = $.map(bpi, function(value, index) {
                return [index];
            });
            
            console.log(array)
            exchange_rate_data = array;
            
           
           
           
           
           
           var ctx = document.getElementById('myChart').getContext('2d');
           
          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: dates,
                datasets: [{
                    label: "BTC/USD",
                    backgroundColor: 'rgb(149, 202, 237)',
                    borderColor: 'rgb(149, 202, 237)',
                    data: exchange_rate_data,
                }]
            },
        
            // Configuration options go here
            options: {}
        });
                       
            
        });
}]);