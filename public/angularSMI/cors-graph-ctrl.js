/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMICORSGraphCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "rXD8D2b1vP";
        $scope.dataEV = {};
        $scope.dataSMI = {};
        var dataCacheEV = {};
        var dataCacheSMI = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //Nacho
        $scope.pp = [];
        $scope.psoe = [];
        $scope.podemos =[];
        $scope.cs =[];
        //SMI
        $scope.smiyear = [];
        $scope.smivariation = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }


            ////////////////////
            /////DATOS NACHO/////
            ////////////////////
                
     $http.get("https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats?apikey=cinco").then(function(response){
                
                dataCacheEV = response.data;
                $scope.dataEV =dataCacheEV;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataEV[i].province);
                    $scope.pp.push(Number($scope.dataEV[i].pp));
                    $scope.psoe.push(Number($scope.dataEV[i].psoe));
                    $scope.podemos.push(Number($scope.dataEV[i].podemos));
                    $scope.cs.push(Number($scope.dataEV[i].cs));
                }
                
                console.log("Datos Nacho: "+$scope.dataEV);
                
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
                    Highcharts.chart('container',{
                        title: {
                            text: 'WORLD SMI integrated with Spain Elections Voting Stats 2016'
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
                            name: 'Votos PP',
                            data: $scope.pp,
                        },
                        {
                            name: 'Votos PSOE',
                            data: $scope.psoe,
                        },
                        {
                            name: 'Votos Podemos',
                            data: $scope.podemos,
                        },
                        {
                            name: 'Votos C´s',
                            data: $scope.cs,
                        },
                        {
                            name: 'SMI Year Variation',
                            data: $scope.smivariation
                        }]
                    });});
         
     });
               

}]);