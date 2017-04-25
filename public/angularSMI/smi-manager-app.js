angular.module("SMIManagerApp",["ngRoute"]).config(function($routeProvider){
    
    
    $routeProvider
    .when("/",{
        templateUrl:"/angularSMI/list.html",
        controller: "ListCtrl"
    })
    .when("/smi/:country",{
        templateUrl: "/angularSMI/edit.html",
        controller: "EditCtrl"
    })
    
    
    
    console.log("App initialized!");
});
            