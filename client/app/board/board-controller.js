'use strict';

angular.module('rocketBoardApp').controller('BoardController', function(Socket, $rootScope, $scope, RepositoryManager, IssueManager, BoardManager) {
  // That's why I hate ui-select
  $scope.multipleOptions = {};
  $scope.multipleOptions.selectedRepositories = [];
  $scope.multipleOptions.selectedIssues = [];

  // Put on login ?
  RepositoryManager.findList().then(function(res) {
    $scope.board = BoardManager.makeBoard(res.data);
  });

  // Just for tests and fun
  $scope.trigger = function(){
    triggerRocketAnimation();
  };

  $scope.assignMe = function(issue) {
    if (issue.assignee && issue.assignee.id === $rootScope.user.id){
      return;
    }

    IssueManager.assignToUser(issue, $rootScope.user);
    BoardManager.updateIssue(issue);
  };

  $scope.$watch('multipleOptions.selectedRepositories', function() {
    if ($scope.board){
      RepositoryManager.populateRepositoriesIssues($scope.multipleOptions.selectedRepositories).then(function() {
        BoardManager.changeRepositories($scope.multipleOptions.selectedRepositories);
      });}
  });

  $scope.boardSortOptions = {
    containment: '#board',
    itemMoved: function(event) {

      var issue = event.source.itemScope.issue;
      var status;

      if (event.dest.sortableScope.$id === 5) {
        status = '5 - Done';
        triggerRocketAnimation();
      } else {
        status = event.dest.sortableScope.$parent.column.status;
      }

      IssueManager.changeStatus(issue, status);
      BoardManager.updateIssue(issue, status);
    },
    orderChanged: function() {

    },
    dragEnd: function() {}
  };

});