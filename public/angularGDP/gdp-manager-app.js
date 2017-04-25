angular.module("GdpManagerApp",["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
      .when("/country",{
         templateUrl : "edit.html",
         controller: "edit-ctrl.js"
      });
    
console.log("GdpManagerApp initialized and configured successfully!");
});