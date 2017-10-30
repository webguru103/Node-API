(function () {
  angular
    .module("app")
    .constant("events", {
      betslip: {
        updated: 'betslip:updated',
      }
    })
})();