/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("RPCCORSGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "GVAODcH3";
        $scope.dataSU = {};
        $scope.dataRPC = {};
        var dataCacheSU = {};
        var dataCacheRPC = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Nacho
        $scope.years = [];
        $scope.totals = [];
        $scope.increases =[];
        $scope.investments =[];
        //RPC
        $scope.rpcyear = [];
        $scope.rpcvariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS IRENE/////
            ////////////////////
                
     $http.get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701").then(function(response){
                
                dataCacheSU = response.data;
                $scope.dataSU =dataCacheSU;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataSU[i].country);
                    $scope.years.push(Number($scope.dataSU[i].year));
                    $scope.totals.push(Number($scope.dataSU[i].total));
                    $scope.increases.push(Number($scope.dataSU[i].increase));
                    $scope.investments.push(Number($scope.dataSU[i].investment));
                }
                
                console.log("Datos Irene: "+$scope.dataSU);
                
                  ////////////////////
            /////DATOS RPC/////
            ////////////////////
            $http.get("/api/v1/rpc-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheRPC = response.data;
                $scope.dataRPC =dataCacheRPC;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataRPC[i].country);
                    $scope.rpcyear.push(Number($scope.dataRPC[i].rpcyear));
                    $scope.rpcvariation.push(Number($scope.dataRPC[i].rpcvariation));
                }
                    console.log("Datos RPC: "+$scope.dataRPC);


                    ////////////////////////////
                    ////COMPARATIVA RPC 2017////
                    ////////////////////////////
                    
                
                Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'World RPC stats ingrated with Start-ups stats'
    },
    xAxis: {
        categories: $scope.categorias,
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    toltip: {
        split: true,
        valueSuffix: ' millions'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        name: 'Increases',
        data: $scope.increases
    },  {
        name: 'Rpc Variation',
        data: $scope.rpcvariation
    },{
        name: 'Investments',
        data: $scope.investments
    },{
        name: 'Investments',
        data: $scope.investments
    },{
        name: 'Totals',
        data: $scope.totals
    }]
});

                
                
                
                
                
                
                
            });
         
     });
               

}]);