/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMIHCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.smiyear = [];
        $scope.smivariation = [];

        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data =dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.smiyear.push(Number($scope.data[i]["smi-year"]));
                $scope.smivariation.push(Number($scope.data[i]["smi-year-variation"]));
                
                console.log($scope.data[i].country);

            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
            ////////////////////////////
            ////COMPARATIVA SMI 2017////
            ////////////////////////////
            Highcharts.chart('container',{
                title: {
                    text: 'WORLD SMI 2017'
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
                    name: 'SMI Year',
                    data: $scope.smiyear
                }]
            });
            
            ////////////////////////////
            ////COMPARATIVA VARIACIÓN SMI////
            ////////////////////////////
            Highcharts.chart('container1',{
                title: {
                    text: 'SMI 2016 to 2017 VARIATION'
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
                    name: 'SMI Year Variation',
                    data: $scope.smivariation
                }]
            });
    });
}]);