var DeveloperTools = (function () {
  "use strict";

  var registered = [];

  function DeveloperTools() {
    var tabView;
    if (arguments.length > 0) {
      tabView = new UI.Tab(document.getElementById(arguments[0]));
    } else {
      tabView = new UI.Tab();
    };
    this.host = tabView.host;
    this.host.classList.add("dt-view");

    // add other things to the header

    var $this = this;
    var $arguments = arguments;
    registered.forEach(function (func) {
      func.apply($this, $arguments);
    });
  };
  DeveloperTools.register = function (func) {
    if (typeof func == "function") {
      registered.push(func);
      return true;
    };
    return false;
  };

  return DeveloperTools;
})();
