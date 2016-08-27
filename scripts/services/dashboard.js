'use strict';

app.factory('Dashboard', function($firebase, FURL, $q) {

  var ref = new Firebase(FURL);
  
  var Dashboard = {

    getTasksForUsers : function(uid){
      var d = $q.defer();

      $firebase(ref.child('user_tasks').child(uid)).$asArray().$loaded().then(function(tasks){
        d.resolve(tasks);
      }, function(err){
        d.reject();
      });

      console.log(d.promise);
      return d.promise;
    }
  };

  return Dashboard;
})