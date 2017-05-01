(function () {
  'use strict';

  // Spots controller
  angular
    .module('spots')
    .controller('SpotsController', SpotsController);

  SpotsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'spotResolve'];

  function SpotsController ($scope, $state, $window, Authentication, spot) {
    var vm = this;

    vm.authentication = Authentication;
    vm.spot = spot;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Spot
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.spot.$remove($state.go('spots.list'));
      }
    }

    // Save Spot
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.spotForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.spot._id) {
        vm.spot.$update(successCallback, errorCallback);
      } else {
        vm.spot.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('spots.view', {
          spotId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
