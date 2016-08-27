'use strict';

app.controller('BrowseController', function($scope, $routeParams, Auth, Task, toaster, Comment, Offer) {

  $scope.searchTask = '';
  $scope.tasks = Task.all;
  $scope.signedIn = Auth.signedIn;
  $scope.listMode = true;

  $scope.user = Auth.user;

  if ($routeParams.taskId) {
    var task = Task.getTask($routeParams.taskId).$asObject();
    $scope.listMode = false;
    setSelectedTask(task);
  };

  function setSelectedTask(task) {
    $scope.selectedTask = task;
    if ($scope.signedIn()) {

      $scope.isTaskCreator = Task.isCreator;

      $scope.isOpen = Task.isOpen;

      // Check if the currently signed in user has made an offer
      Offer.isOffered(task.$id).then(function(data){
        $scope.alreadyOffered = data;
      })

      $scope.isOfferMaker = Offer.isMaker;

      $scope.block = false;

    }

    $scope.offers = Offer.offers(task.$id)
    $scope.comments = Comment.allComments(task.$id);
  }

  $scope.cancelTask = function(taskId) {
    Task.cancelTask(taskId).then(function() {
      toaster.pop('success', 'Task is cancelled');
    })
  };

  $scope.addComment = function() {
    var comment = {
      content: $scope.content,
      name: $scope.user.profile.name,
      gravatar: $scope.user.profile.gravatar
    }

    Comment.addComment($scope.selectedTask.$id, comment).then(function() {
      $scope.content = ''
      toaster.pop('success', 'Comment added successfully')
    });
  };

  $scope.makeOffer = function() {
    var offer = {
      total: $scope.total,
      name: $scope.user.profile.name,
      gravatar: $scope.user.profile.gravatar,
      uid: $scope.user.uid
    }

    console.log(offer);

    Offer.makeOffer($scope.selectedTask.$id, offer).then(function() {
      $scope.total = '';
      $scope.block = true;
      $scope.alreadyOffered = true;
      toaster.pop('success', 'Offer placed successfully')
    });
  };

  $scope.cancelOffer = function(offerId){
    Offer.cancelOffer($scope.selectedTask.$id, offerId).then(function(){
      toaster.pop('success', 'Offer cancelled');
      $scope.alreadyOffered = false;
      $scope.block = false;
    })
  };

  $scope.acceptOffer = function(offerId, runnerId){
    Offer.acceptOffer($scope.selectedTask.$id, offerId, runnerId).then(function(){
      toaster.pop('success', 'Offer accepted');
      Offer.notifyRunner($scope.selectedTask.$id,runnerId)
    })
  }

})
