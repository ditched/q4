var banModule = (function() {
  var methods = {};

  methods.isBanned = function(b, i) {
    if(!b.indexOf(i) > -1) {
      return false;
    }
    return true;
  };

  return methods;
})();

module.exports = banModule;