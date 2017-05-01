(function () {
  'use strict';

  describe('Spots Route Tests', function () {
    // Initialize global variables
    var $scope,
      SpotsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SpotsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SpotsService = _SpotsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('spots');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/spots');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SpotsController,
          mockSpot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('spots.view');
          $templateCache.put('modules/spots/client/views/view-spot.client.view.html', '');

          // create mock Spot
          mockSpot = new SpotsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spot Name'
          });

          // Initialize Controller
          SpotsController = $controller('SpotsController as vm', {
            $scope: $scope,
            spotResolve: mockSpot
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:spotId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.spotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            spotId: 1
          })).toEqual('/spots/1');
        }));

        it('should attach an Spot to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockSpot._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/spots/client/views/view-spot.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SpotsController,
          mockSpot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('spots.create');
          $templateCache.put('modules/spots/client/views/form-spot.client.view.html', '');

          // create mock Spot
          mockSpot = new SpotsService();

          // Initialize Controller
          SpotsController = $controller('SpotsController as vm', {
            $scope: $scope,
            spotResolve: mockSpot
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.spotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/spots/create');
        }));

        it('should attach an Spot to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockSpot._id);
          expect($scope.vm.spot._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/spots/client/views/form-spot.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SpotsController,
          mockSpot;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('spots.edit');
          $templateCache.put('modules/spots/client/views/form-spot.client.view.html', '');

          // create mock Spot
          mockSpot = new SpotsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spot Name'
          });

          // Initialize Controller
          SpotsController = $controller('SpotsController as vm', {
            $scope: $scope,
            spotResolve: mockSpot
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:spotId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.spotResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            spotId: 1
          })).toEqual('/spots/1/edit');
        }));

        it('should attach an Spot to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockSpot._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/spots/client/views/form-spot.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
