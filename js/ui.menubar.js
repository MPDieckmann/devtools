UI.MenuBar = (function () {
  "use strict";

  function MenuBarView() {
    var host,
      $this = this;
    if (arguments.length > 0) {
      host = document.getElementById(arguments[0]);
    };
    if (!host) {
      host = document.createElement("ul");
    };
    this.host = host;
    host.UITarget = this;
    host.classList.add("ui-menubar");
    host.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      var target = event.target.UITarget;
      if (target && target.click) {
        try {
          target.click();
        } catch (e) {
          console.error("error in click:", e);
        };
      };
    });
  };

  Object.defineProperties(MenuBarView.prototype, {
    add: {
      value: function (type, options) {
        var types = "button".split(" "),
          element = document.createElement("div"),
          host = {
            host: element
          };
        if (types.indexOf(type) == -1) {
          return false;
        };
        this.host.appendChild(element);
        switch (type) {
          case "button":
            if (options.click) {
              host.click = options.click;
            };
            break;
        }
        return host;
      },
      writable: false,
      enumerable: true,
      configurable: false
    }
  });

  return MenuBarView;
})();