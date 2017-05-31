/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("GoogleGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.dataGoogle = {};
        $scope.dataRPC = {};
        var dataCacheGoogle = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Google
        $scope.areas = [];
        
        //RPCrpc
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
        var rpcvariationdata = [];
         
        console.log("Google graph initialized");
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS REST COUNTRIES API/////
            ////////////////////
                
     $http.get("https://restcountries.eu/rest/v2/all").then(function(response){
                console.log("entro");
                dataCacheGoogle = response.data;
                $scope.dataGoogle =dataCacheGoogle;
                
                for(var i=0; i<10; i++){
                    $scope.categorias.push($scope.dataGoogle[i].name);
                    $scope.areas.push($scope.dataGoogle[i].area);
                    
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
                    });
         
     });
     
     
     
    $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            //////////////////////////////
            /////GOOGLE CHARTS////////////
            //////////////////////////////
            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                function drawRegionsMap() {
                    var myData = [['Country','Area','RPC- Variation']];
                    var myData2=$scope.areas;
                    
                    
                    response.data.forEach(function (d,i){
                        myData.push([d.country,myData2[i],Number(d.rpcvariation)]);

                    });
                    var data = google.visualization.arrayToDataTable(myData);
                    var options = {
                        
                    };
                    var chart = new google.visualization.GeoChart(document.getElementById('map'));
                    chart.draw(data, options);
                }
            });
               

}]);