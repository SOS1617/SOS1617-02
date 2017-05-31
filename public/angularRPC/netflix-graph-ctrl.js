/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("NetflixGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.dataGoogle = {};
        $scope.dataRPC = {};
        var dataCacheGoogle = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Google
        $scope.areas = [];
       var rpcyear=[];
        //RPCrpc
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        
        console.log("Google graph initialized");
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS Google/////
            ////////////////////
                
     $http.get("https://netflixroulette.net/api/api.php?actor=Nicolas%20Cage").then(function(response){
                console.log("entro");
                dataCacheGoogle = response.data;
                $scope.dataGoogle =dataCacheGoogle;
                
                for(var i=0; i<5; i++){
                    $scope.categorias.push($scope.dataGoogle[i].show_title);
                    $scope.areas.push($scope.dataGoogle[i].show_id);
                    //$scope.bicis.push(Number($scope.dataGoogle[i].available_bikes));
                }
                
                console.log("Datos Google: "+$scope.dataGoogle[0]);
                
                  ////////////////////
            /////DATOS RPC/////
            ////////////////////
            $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheRPC = response.data;
                $scope.dataRPC =dataCacheRPC;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataRPC[i].country);
                    $scope.rpcyear.push(Number($scope.dataRPC[i].rpcyear));
                    $scope.rpcvariation.push(Number($scope.dataRPC[i].rpcvariation));
                }
                    console.log("Datos RPC: "+$scope.dataRPC);

               
                
                
                    ////////////////////////////
                    ////COMPARATIVA RPC 2017////
                    ////////////////////////////
                   zingchart.render({
        id: 'myChart',
        data: {
        type: 'bar',
        "legend": {
    "header": {
      "text": "Legend Header"
    },
    "draggable": true,
    "drag-handler": "icon"
  },
        series: [{
        values:$scope.rpcyear,text:"RPC Year"
        }, {
        values: $scope.areas,text:"Countries Areas"
                }]
            }
        });
                    });
                    
                    
                    
                    
});
     
     

}]);