/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCCCGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.data = {};
        var dataCache = {};
        $scope.categorias = [];
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        $scope.res=[];
        
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data =dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.categorias.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.rpcyear.push(Number($scope.data[i].rpcyear));
                $scope.rpcvariation.push(Number($scope.data[i].rpcvariation));
                
                console.log($scope.data[i].country);

            }
            
            for(var j=0; j<response.data.length; j++){
                $scope.res.push({"label": $scope.categorias[j],  "y":Number($scope.rpcvariation[j])});
            }
            
            var chart = new CanvasJS.Chart("chartContainer", {
              title: {
                text: "RPC Year"
              },
              axisX: {
                title: "Countries"
              },
              axisY: {
                title: "Rpc variation"
              },
              data: [{
                type: "column",
                dataPoints:$scope.res
              }]
            });
            	chart.render();
            
        });    
           
        console.log("Controller initialized");
        
       
         
            
                }]);