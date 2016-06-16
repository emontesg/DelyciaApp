function NotificationService($rootScope){

	var self = this;

	self.createNotification = function(id, dishName, date)
	{
		var message = 'Hey, acuerdese de ir por ' + dishName + 'hoy';
	    
		cordova.plugins.notification.local.schedule({
			id: id,
			text: message,
			at: date,
			led: "FF0000",
			sound: null
		});
	};

	self.cancelNotification = function(id)
	{
		cordova.plugins.notification.local.cancel(id, function () {
    	// Notification was cancelled
		}, scope);
	};

	return self;
}

module.exports = ['$rootScope', NotificationService];