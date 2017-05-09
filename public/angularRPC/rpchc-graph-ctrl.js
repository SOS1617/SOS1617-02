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
            
            
            //RPC en 2014
            Highcharts.chart('container',{
                title: {
                    text: 'WORLD RPC 2014'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: $scope.categorias
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
                            capitalizeFirstLetter(this.x) + ': ' + this.y+ '€';
                    }
                },
                series:[{
                    name: 'RPC Year',
                    data: $scope.rpcyear
                }]
            });
            
            //VAriacion rpc 2013 2014
            Highcharts.chart('container1',{
                title: {
                    text: 'RPC VARIATION 2013 to 2014'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: $scope.categorias
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
                            capitalizeFirstLetter(this.x) + ': ' + this.y + '%';
                    }
                },
                series:[ {
                    name: 'RPC Year Variation',
                    data: $scope.rpcvariation
                }]
            });
    });
}]);