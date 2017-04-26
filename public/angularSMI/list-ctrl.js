//Obtengo el modulo y creo el controlador sobre él
angular
    .module("SMIManagerApp")
    .controller("ListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/smi-stats";
        $scope.offset = 0;
        $scope.limit = 2;
        console.log("List controller initialized ");
        
        //CARGAR DATOS
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                $scope.errorMessage = bootbox.alert("Correct. All countries have been add.");
                console.log("Load initial data: OK");
                refresh();
            })
        }
        
    function refresh(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    
                    
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    console.log("all"+ JSON.stringify($scope.stats));
                });
    }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    console.log("APIKEY is correct.");
                    $scope.errorMessage = bootbox.alert("APIKEY Correct. All stats are sent.");
                    
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    console.log("All stats are send.");
                },function(response){
                    if(response.status==401){
                        $scope.errorMessage = bootbox.alert("APIKEY is necesary(401).");
                    }
                    if (response.status == 403) {
                        $scope.errorMessage = bootbox.alert("APIKEY is not correct(403)");
                    }
                    
                    
                });
            
        } 
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    $scope.errorMessage = bootbox.alert("Correct. The country "+$scope.newCountry.country+" have been add.");
                    console.log($scope.newCountry.country + "stats added." );
                    refresh();
                },function(response) {
                        $scope.stats = [];
                        if (response.status == 422) {
                            $scope.errorMessage = bootbox.alert("Fields cannot be empty ");
                        }
                        if (response.status == 409) {
                            $scope.errorMessage = bootbox.alert("Stats of "+$scope.newCountry.country+ " already exists");
                        }
             });
            
        } 
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.editStats = function(){
            $http
            //$scope.newCountry guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    $scope.errorMessage = bootbox.alert("Correct. The country "+$scope.newCountry.country+" have been updated.");
                    console.log( $scope.newCountry.country + " stats has been modified. "  );
                    refresh();
                },function(response){
                   
                        if (response.status == 422) {
                            $scope.errorMessage = bootbox.alert("Country empty");
                        }
                        if (response.status == 404) {
                            $scope.errorMessage = bootbox.alert("Country not exists");
                        } 
                    
                });
        }
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.errorMessage = bootbox.alert("Correct. All stats have been delete.");
                    console.log("All stats delete");
                    refresh();
                });
        }
        
        //MÉTODO PARA BORRAR UN PAÍS
        $scope.deleteOneCountry = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    $scope.errorMessage = bootbox.alert("Correct. The country "+country+" have been delete.");
                    console.log("Country stats delete: "+ country);
                    refresh();
                });
        } 
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
       $scope.searches = function(){
            var results = "";

            if ($scope.newCountry.country !== undefined && $scope.newCountry.country !== "") {
                results = results + "&country=" + $scope.newCountry.country;
            }
           
            if ($scope.newCountry.year !== undefined && $scope.newCountry.year !== "") {
                results = results + "&year=" + $scope.newCountry.year;
            }

            $http
                .get($scope.url+"?apikey="+$scope.apikey+results)
                .then(function(response){
                    console.log("The search of: "+$scope.newCountry.country +" in year "+ $scope.newCountry.year+ " works correctly");
                    var x = [];
                    x.push(response.data);
                  //  $scope.data = JSON.stringify(x, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats =x;
                  console.log($scope.stats);
                },
                function(response){
                   
                        if (response.status == 422) {
                            $scope.errorMessage = bootbox.alert("Country search empty");
                        }
                        if (response.status == 404) {
                            $scope.errorMessage = bootbox.alert("Country not exists");
                        } 
                    
                });
        }
        
        
        //PAGINACIÓN
     
        $scope.getPreviousPage = function(){
            $scope.offset -= 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data;
                    console.log("left Pagination: OK");
                });
        };
        
        $scope.getNextPage = function(){
            $scope.offset += 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.stats = response.data;
                    console.log("Right Pagination: OK");
                });
        };
           
}]);  