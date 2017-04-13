//Obtengo el modulo y creo el controlador sobre él
angular
    .module("SMIManagerApp")
    .controller("ListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/smi-stats";
        $scope.apikey = "?apikey=rXD8D2b1vP";
        console.log("Controller initialized split");
        function refresh(){
        $http
            .get($scope.url+ $scope.apikey)
            .then(function(response){
                 $scope.stats = response.data;
            });
            
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addStats = function(){
            $http
            //$scope.newContact guarda el contacto que le estoy metiendo
                .post($scope.url+ $scope.apikey, $scope.newStat)
                .then(function(response){
                    console.log("Country stats added");
                    refresh();
                });
        }  
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllStats = function(){
            $http
                .delete($scope.url+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        }
        
        //MÉTODO PARA BORRAR UN PAÍS
        $scope.deleteOneCountry = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey=rXD8D2b1vP")
                .then(function(response){
                    console.log("Country stats delete: "+ country);
                    refresh();
                });
        } 
    }  
     
     refresh();           
}]);  