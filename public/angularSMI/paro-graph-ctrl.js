/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("PAROGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataParo= {};
        $scope.dataSMI = {};
        var dataCacheParo = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //PARO
        $scope.paro = [];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

    console.log("Controler PARO GRAPH initialized!");
            ////////////////////
            /////DATOS PARO/////
            ////////////////////
                
     $http.get("/api/v1/smi-stats/proxy3/" + "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheParo = response.data;
                $scope.dataParo =dataCacheParo;
                
                for(var i=0; i<6; i++){
                    $scope.categorias.push($scope.dataParo[i].Año);
                    $scope.paro.push(Number($scope.dataParo[i]["Total paro registrado"]));

                }
                
                console.log("Datos PARO: "+$scope.dataParo);
                
            ////////////////////
            /////DATOS SMI/////
            ////////////////////
            $http.get("/api/v1/smi-stats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheSMI = response.data;
                $scope.dataSMI =dataCacheSMI;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataSMI[i].country);
                    $scope.smiyear.push(Number($scope.dataSMI[i]["smi-year"]));
                    $scope.smivariation.push(Number($scope.dataSMI[i]["smi-year-variation"]));
                }
                    console.log("Datos SMI: "+$scope.dataSMI);


                    ////////////////////////////
                    ////COMPARATIVA SMI 2017////
                    ////////////////////////////
                    new Chartist.Line('#chart1', {
                        labels: [$scope.categorias1],
                        series: [$scope.smiyear,$scope.paro]
                    }),{
                          high: 3,
                          low: -3,
                          showArea: true,
                          showLine: false,
                          showPoint: false,
                          fullWidth: true,
                          axisX: {
                            showLabel: false,
                            showGrid: false
                          }
                        };
        });//FIN GET SMI
         
     });//FIN GET PARO
               

}]);