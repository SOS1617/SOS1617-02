angular.module("GdpManagerApp",["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    .when("/",{
       templateUrl : "/list.html",
       controller: "list-ctrl"
    })
    .when("/country/:name",{
       templateUrl : "edit.html",
       controller: "edit-ctrl"
    });
    
    
    
    
console.log("GdpManagerApp initialized and configured successfully!");
});