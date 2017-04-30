'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // collection of home items to display
    $scope.alerts = [
      {
        icon:'glyphicon-user',
        color:'btn-success',
        value:'1',
        description:'amount of users'
      },
      {
        icon:'glyphicon-calendar',
        color:'btn-primary',
        value:'100',
        description:'amount of events'
      },
      {
        icon:'glyphicon-edit',
        color:'btn-info',
        value:'1000',
        description:'spots to check'
      },
      {
        icon:'glyphicon-eye-open',
        color:'btn-warning',
        value:'1',
        description:'follow ups'
      }
    ]
  }
]);
