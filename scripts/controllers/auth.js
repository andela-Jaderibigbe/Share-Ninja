'use strict';

app.controller('AuthController', function($scope, $location, Auth, toaster){

  if(Auth.signedIn()){
    $location.path('/');
  }

  $scope.register = function(user){
    Auth.register(user)
    .then(function(){
    toaster.pop('success', 'successfully registered');
      $location.path('/');
    }, function(err){
      toaster.pop('error', 'Oops something went wrong...')
    })
  };

  $scope.login = function(user){
    Auth.login(user)
    .then(function(){
    toaster.pop('success', 'Logged in successfully');
      $location.path('/');
    }, function(err){
      toaster.pop('error', 'Oops something went wrong...')
    })
  };

  $scope.changePass = function(user){
    Auth.changePassword(user)
    .then(function(){
    toaster.pop('success', 'Password changed successful');
      $scope.user = {};
      $location.path('/');
    }, function(err){
      toaster.pop('error', 'Oops something went wrong...')
    })
  }

});