angular.module("GdpManagerApp",["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
      .when("/",{
         templateUrl : "/angularGDP/list.html",
         controller: "gdp-list-ctrl"
      })
      .when("/country/:name",{
         templateUrl : "/angularGDP/edit.html",
         controller: "gdp-edit-ctrl"
      });
    
console.log("GdpManagerApp initialized and configured successfully!");
});