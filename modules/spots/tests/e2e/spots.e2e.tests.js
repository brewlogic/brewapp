'use strict';

describe('Spots E2E Tests:', function () {
  describe('Test Spots page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/spots');
      expect(element.all(by.repeater('spot in spots')).count()).toEqual(0);
    });
  });
});
