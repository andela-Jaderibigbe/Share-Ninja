'use strict';

app.controller('TaskController', function($scope, $location, $routeParams, Task, Auth, toaster) {

  $scope.createTask = function() {
    $scope.task.status = 'open';
    $scope.task.gravatar = Auth.user.profile.gravatar;
    $scope.task.name = Auth.user.profile.name;
    $scope.task.poster = Auth.user.uid;

    Task.createTask($scope.task).then(function(ref) {
      toaster.pop('success', 'Task created successfully!');
      $scope.task = {};
      $scope.task.status = 'open';
      $location.path('/browse/' + ref.key());
    }, function() {
      toaster.pop('error', 'Oops, something went wrong')
    })
  };

  $scope.editTask = function(task) {
    Task.editTask(task).then(function() {
      toaster.pop('success', 'Task updated successfully');
    })
  }
})
