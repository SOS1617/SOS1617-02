/*global angular*/

angular.module("SMIManagerApp",["ngRoute"]).config(function($routeProvider){
    
    
    $routeProvider
    .when("/",{
        templateUrl:"/angularSMI/list.html",
        controller: "SMIListCtrl"
    })
    .when("/smi/:country",{
        templateUrl: "/angularSMI/edit.html",
        controller: "SMIEditCtrl"
    });
    
    console.log("App SMIManagerApp initialized!");
});
            