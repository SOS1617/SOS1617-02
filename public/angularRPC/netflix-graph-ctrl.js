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
        
        //RPCrpc
        $scope.rpcyear = [];
        $scope.rpcvariation = [];
         $scope.clientid="I4TYHMO24EW5DPMRZYLFUJXYTEBPG5UGTLIK44CSXPIGT2IY";
         $scope.clientsecret="10LP4ALLHURZARQURW0JW5NKJGO40O50L55GHHOJ2IEXF4S4";
        console.log("Google graph initialized");
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS Google/////
            ////////////////////
                
     $http.get("http://netflixroulette.net/api/api.php?actor=Nicolas%20Cage").then(function(response){
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
                    Highcharts.chart('container',{
                        title: {
                            text: 'WORLD RPC integrated with SEVICI'
                        },
                        chart: {
                            type: 'area'
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
                            y: 20,
                            x: 0
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br/>' +
                                   this.x + ': ' + this.y;
                            }
                        },
                        series:[{
                            name: 'Countries:',
                            data: $scope.categorias,
                        },
                        {
                            name: 'Area',
                            data: $scope.areas,
                        },
                        {
                            name: 'RPC Year Variation',
                            data: $scope.rpcvariation
                        }]
                    });});
         
     });
               

}]);