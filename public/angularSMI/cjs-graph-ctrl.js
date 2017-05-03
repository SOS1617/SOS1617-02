/*global angular*/
angular
    .module("G2ManagerApp")
    .controller("SMICJSGraphCtrl",["$scope","$http",function ($scope, $http){
        
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
            
            //////////////////////////////
            /////CHART JS////////////
            //////////////////////////////
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: $scope.categorias,
                    datasets: [{
                        label: 'SMI Year',
                        data: $scope.smiyear,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
            });
    }]);