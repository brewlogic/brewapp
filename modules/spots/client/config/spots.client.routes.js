(function () {
  'use strict';

  angular
    .module('spots')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('spots', {
        abstract: true,
        url: '/spots',
        template: '<ui-view/>'
      })
      .state('spots.list', {
        url: '',
        templateUrl: 'modules/spots/client/views/list-spots.client.view.html',
        controller: 'SpotsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Spots List'
        }
      })
      .state('spots.create', {
        url: '/create',
        templateUrl: 'modules/spots/client/views/form-spot.client.view.html',
        controller: 'SpotsController',
        controllerAs: 'vm',
        resolve: {
          spotResolve: newSpot
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Spots Create'
        }
      })
      .state('spots.edit', {
        url: '/:spotId/edit',
        templateUrl: 'modules/spots/client/views/form-spot.client.view.html',
        controller: 'SpotsController',
        controllerAs: 'vm',
        resolve: {
          spotResolve: getSpot
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Spot {{ spotResolve.name }}'
        }
      })
      .state('spots.view', {
        url: '/:spotId',
        templateUrl: 'modules/spots/client/views/view-spot.client.view.html',
        controller: 'SpotsController',
        controllerAs: 'vm',
        resolve: {
          spotResolve: getSpot
        },
        data: {
          pageTitle: 'Spot {{ spotResolve.name }}'
        }
      });
  }

  getSpot.$inject = ['$stateParams', 'SpotsService'];

  function getSpot($stateParams, SpotsService) {
    return SpotsService.get({
      spotId: $stateParams.spotId
    }).$promise;
  }

  newSpot.$inject = ['SpotsService'];

  function newSpot(SpotsService) {
    return new SpotsService();
  }
}());
