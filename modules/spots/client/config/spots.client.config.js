(function () {
  'use strict';

  angular
    .module('spots')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Spots',
      state: 'spots',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'spots', {
      title: 'List Spots',
      state: 'spots.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'spots', {
      title: 'Create Spot',
      state: 'spots.create',
      roles: ['user']
    });
  }
}());
