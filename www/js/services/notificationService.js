function NotificationService($rootScope){

	var self = this;

	self.createNotification = function(id, dishName, date)
	{
		var message = 'Hey, acuerdese de ir por ' + dishName;
	    
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
		}, $rootScope);
	};

	self.updateNotification = function(id, dishName, date)
	{
		self.cancelNotification(id);
		self.createNotification(id, dishName, date);
	};

	self.knowIsNotified = function(){
		cordova.plugins.notification.local.on("trigger", function(notification) {
	    	alert("triggered: " + notification.id);
	    	$rootScope.$broadcast('updateState',{ id: notification.id});
		});
	};

	return self;
}

module.exports = ['$rootScope', NotificationService];