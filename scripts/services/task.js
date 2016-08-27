'use strict';

app.factory('Task', function($firebase, $firebaseAuth, FURL, Auth) {

  var ref = new Firebase(FURL);

  var tasks = $firebase(ref.child('tasks')).$asArray();

  var user = Auth.user;

  var Task = {

    all: tasks,

    getTask: function(taskId){
      return $firebase(ref.child('tasks').child(taskId));
    },

    createTask: function(task){
      task.datetime = Firebase.ServerValue.TIMESTAMP;      
      return tasks.$add(task).then(function(newTask){

        var nt = {
          taskId : newTask.key(),
          title: task.title,
          type: true
        }
        $firebase(ref.child('user_tasks').child(task.poster)).$push(nt);

        return newTask;
      });
    },

    createUserTask: function(taskId) {
      this.getTask(taskId).$asObject().$loaded().then(function(task){
        var ut = {
          taskId: taskId,
          title: task.title,
          type: false
        };
        return $firebase(ref.child('user_tasks').child(task.runner)).$push(ut);
      });
    },


    editTask: function(task){
      var t = this.getTask(task.$id);
      return t.$update({
        title: task.title,
        description: task.description,
        total: task.total
      })
    },

    cancelTask: function(taskId){
      var t = this.getTask(taskId);
      return t.$update({
        status: 'cancelled'
      })
    },

    isCreator : function(task){
      return (user && user.provider && user.uid === task.poster)
    },

    isOpen: function(task){
      return task.status === "open"
    }

  };

  return Task;
})
