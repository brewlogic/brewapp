(function () {
  'use strict';

  angular
    .module('spots')
    .controller('SpotsListController', SpotsListController);

  SpotsListController.$inject = ['SpotsService'];

  function SpotsListController(SpotsService) {
    var vm = this;

    vm.spots = SpotsService.query();
  }
}());
