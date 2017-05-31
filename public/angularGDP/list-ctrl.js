angular
    .module("G2ManagerApp")
    .controller("gdp-list-ctrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v2/gdp-population-stats";
        $scope.offset = 0;
        $scope.limit = 3;//pu here 100 for protractor tests to work
        $scope.apikey = "GVAODcH3";
        console.log("List controller initialized ");
        
        function checkApiKey(){
             if(!$scope.apikey){
             Materialize.toast('API key empty!', 4000, 'rounded');
                 
             }else{
                 if($scope.apikey != "GVAODcH3"){
                    Materialize.toast('Error: Incorrect API key', 4000, 'rounded');
                }
             }
        }
        
        function refresh(){
             $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        refresh();
        
        //Load initial data
        $scope.loadInitialData= function(){
            checkApiKey();
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                Materialize.toast('Load Initial data Complete!', 4000, 'rounded');
                refresh();
            })
        }
            
        //Get every element
        $scope.getAllData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    Materialize.toast('Get all data complete!', 4000, 'rounded');
                    console.log("GetAllData OK");
                });
            
        } 
      
        
        //Add an element
        $scope.addData = function(){
        $http
            .post($scope.url+"?apikey="+ $scope.apikey, $scope.newCountry)
            .then(function(response){
                console.log($scope.newCountry.country + "Data added." );
                 Materialize.toast('Data added', 4000, 'rounded'); 
                 refresh();
            });
        } 
        
        
        //Edit an element
        $scope.editData = function(){
            $http
                .put($scope.url +"/"+ $scope.newCountry.country + "?apikey="+ $scope.apikey, $scope.newCountry)
                .then(function(response){
                    console.log("editData OK");
                    Materialize.toast('Data updated', 4000, 'rounded'); 
                    refresh();
                });
        }
        
        
        //Delete every element
        $scope.deleteAllData = function(){
            checkApiKey();
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("deleteAllData OK");
                    Materialize.toast('All data was deleted', 4000, 'rounded'); 
                    refresh();
                });
        }
        
        //Delete an element
        $scope.deleteOneData = function(country,year){
            checkApiKey();
            $http
                .delete($scope.url +"/"+ country +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("deleteOneData OK");
                    Materialize.toast('Data was deleted', 4000, 'rounded'); 
                    refresh();
                });
        } 
        
        
        //Search
        $scope.search = function(){
            var results = "";

            if ($scope.newSearch.country !== undefined && $scope.newSearch.country !== ""
            && $scope.newSearch.year !== undefined && $scope.newSearch.year !== "") {
                
                results = results + "&country=" + $scope.newSearch.country;
                results = results + "&year=" + $scope.newSearch.year;
                
                $http
                .get($scope.url+"?apikey="+$scope.apikey+results)
                .then(function(response){
                
                    console.log("The search of: "+$scope.newSearch.country +" in year "+ $scope.newSearch.year+ " works correctly");
                    var x = [];
                    x.push(response.data);
                  
                    $scope.countries = x;
                    Materialize.toast('Country Found', 4000, 'rounded'); 
                    
                    
                  console.log($scope.stats);
                },
                function(response){
                   
                        if (response.status == 422) {
                            Materialize.toast("Country and year search empty", 4000, 'rounded');
                        }
                        if (response.status == 404) {
                            Materialize.toast("Country doesn't exists", 4000, 'rounded');
                        }
                        if (response.status == 403) {
                            Materialize.toast('APIKEY is not correct.', 4000, 'rounded');
                        }
                    
                });
            }
            
        };
    
           
           
        //Pagination
        
        $scope.getDataPaginated = function(){
           
            checkApiKey();
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
            
        };
        
        $scope.getPreviousPage = function(){
            if($scope.offset === 0){
                return;
            }
            $scope.offset -= 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        $scope.getNextPage = function(){
            $scope.offset += 2;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.countries = response.data;
                    console.log("getDataPaginated OK");
                });
        };
        
        
}]);  