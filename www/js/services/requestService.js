var RequestService = function($http, $location, $rootScope){

    var self = this;
    //var url = $location.absUrl(),
    var url = 'http://localhost/',
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
        },

        addFavorite : function(obj){
            var route = url + backEnd + 'addFavorite';
            data = {
                idPlatillo : obj.idPlatillo,
                idUsuario : obj.idUsuario
                };

            if (data) {
                return $http.post(route, data);
            }
        },

        
        loginUser : function(obj){
            var route = url + backEnd + 'loginUser';
            data = {
                id : obj.id,
                name : obj.name,
                last_name : obj.last_name,
                email: obj.email,
                pic: obj.pic
                };
                console.log(data);
                return $http.post(route, data);

        },

        getAllFavorites : function(idUsuario){
            var route = url + backEnd + 'getAllFavorites';
            data = {
                idUsuario : idUsuario
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        removeFavorite : function(obj){
            var route = url + backEnd + 'removeFavorite';
            data = {
                idPlatillo : obj.idPlatillo,
                idUsuario : obj.idUsuario
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        getAllReviews : function(idPlatillo){
            var route = url + backEnd + 'getAllReviews';
            data = {
                idPlatillo : idPlatillo
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        addReview : function (obj){
            var route = url + backEnd + 'addReview';
            data = {
                idPlatillo : obj.idPlatillo,
                rating : obj.rating,
                comentario : obj.comentario,
                idUsuario : obj.idUsuario,
                visible : obj.visible
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        getCantReviews : function(idPlatillo){
            var route = url + backEnd + 'getCantReviews';
            data = {
                idPlatillo : idPlatillo
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        getUserReview : function(obj){
            var route = url + backEnd + 'getUserReview';
            data = {
                idPlatillo : obj.idPlatillo,
                idUsuario : obj.idUsuario
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        setReminder : function(obj){
            var route = url + backEnd + 'setReminder';
            data = {
                idPlatillo : obj.idPlatillo,
                reminder : obj.reminder
            };
            if (data) {
                return $http.post(route, data);
            }
        },

        getAverageRatings: function(){
            var route = url + backEnd + 'getAverageRatings';
            return $http.get(route);
        },

        addAverageRating : function (obj){
            var route = url + backEnd + 'addAverageRating';
            data = {
                idPlatillo : obj.idPlatillo,
                promedio : obj.promedio,
                cantReviews : obj.cantReviews
            };
            if (data) {
                return $http.post(route, data);
            }
        },



    };

    return serviceFunctions;

};
module.exports = ['$http', '$location', '$rootScope',RequestService];
