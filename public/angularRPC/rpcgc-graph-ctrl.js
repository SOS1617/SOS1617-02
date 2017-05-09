/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCGCGraphCtrl",["$scope","$http",function ($scope, $http){
        
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
                $scope.rpcyear.push(Number($scope.data[i]["rpcyear"]));
                $scope.rpcvariation.push(Number($scope.data[i]["rpcvariation"]));
                
                console.log($scope.data[i].country);

            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            //////////////////////////////
            /////GOOGLE CHARTS////////////
            //////////////////////////////
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                function drawRegionsMap() {
                    var myData = [['Country','RPC Year', 'RPC Variation']];
                    response.data.forEach(function (d){
                        myData.push([d.country,Number(d["rpc-year"]),Number(d["rpc-year-variation"])]);

                    });
                    var data = google.visualization.arrayToDataTable(myData);
                    var options = {
                        
                    };
                    var chart = new google.visualization.GeoChart(document.getElementById('map'));
                    chart.draw(data, options);
                }
            });
    }]);