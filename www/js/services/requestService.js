var RequestService = function($http, $location){

    var self = this;
    //var url = $location.absUrl(),
    var url = 'http://localhost:8888/',
    backEnd = 'delycia/back-end/app/';

    self.myPublicFunction = function()
    {
        myPrivateFunction();  
    };
    
    function myPrivateFunction()
    {
        
    }

    var serviceFunctions = {

        getAll: function(){
            var route = url + backEnd + 'getAll';
            return $http.get(route);
        }

    };

    return serviceFunctions;

};
module.exports = ['$http', '$location',RequestService];