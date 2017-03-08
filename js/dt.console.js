(function () {
  "use strict";
  DeveloperTools.register(function () {
    var $this = this;
    var consoleTab = this.host.UITarget.add("console", "Console");
    consoleTab.section.classList.add("dt-console");
    var menuBar = new UI.MenuBar();
    menuBar.host.classList.add("dt-menubar");
    var clear = menuBar.add("button", {
      click: function () {
        while (console.host.firstChild) {
          console.host.removeChild(console.host.firstChild);
        };
      }
    });
    consoleTab.section.appendChild(menuBar.host);
    var console = new Console();
    consoleTab.section.appendChild(console.host);
    this.console = function (type) {
      if (type == "clear") {
        console.clear();
      } else {
        console.add(type, arguments[1]);
      };
    };
    var input = document.createElement("div");
    input.classList.add("dt-input");
    var div = document.createElement("div");
    var textarea = document.createElement("textarea");
    textarea.placeholder = "Input JavaScript here ...";
    textarea.spellcheck = false;
    div.appendChild(textarea);
    input.appendChild(div);
    var button = document.createElement("button");
    button.addEventListener("click", function (event) {
      try {
        console.add("input", [textarea.value]);
        console.add("output", [$this.eval(textarea.value)]);
      } catch (e) {
        console.add("uncaught", [e]);
      };
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    });
    button.innerHTML = "&gt;";
    input.appendChild(button);
    consoleTab.section.appendChild(input);
  });
  Object.defineProperties(DeveloperTools.prototype, {
    ConsoleInterface: {
      value: function () {
        var $this = this;
        try {
          $this.console("clear");
        } catch (e) {};
        return {
          debug: function () {
            return $this.console("debug", arguments);
          },
          log: function () {
            return $this.console("log", arguments);
          },
          dir: function () {
            return $this.console("dir", arguments);
          },
          error: function () {
            return $this.console("error", arguments);
          },
          warn: function () {
            return $this.console("warn", arguments);
          },
          info: function () {
            return $this.console("info", arguments);
          },
          clear: function () {
            return $this.console("clear");
          }
        };
      },
      writable: false,
      enumerable: true,
      configurable: false
    }
  });

  function Console() {
    var host, $this = this;
    if (arguments.length > 0) {
      host = document.getElementById(arguments[0]);
    };
    if (!host) {
      host = document.createElement("div");
    };
    this.host = host;
    host.UITarget = this;
    host.classList.add("dt-output");
  };
  Object.defineProperties(Console.prototype, {
    add: {
      value: function (type, args) {
        var dtEntry = document.createElement("dt-entry");
        dtEntry.setAttribute("type", type);
        DeveloperTools.get_properties(args).forEach(function (a) {
          if (a.keyType != "symbol" && !isNaN(parseInt(a.key, 10))) {
            delete a.key;
            delete a.keyText;
            delete a.keyType;
            dtEntry.appendChild(new DeveloperTools.Expander(a));
          };
        });
        this.host.appendChild(dtEntry);
      },
      writable: false,
      enumerable: true,
      configurable: false
    },
    clear: {
      value: function () {
        while (this.host.firstChild) {
          this.host.removeChild(this.host.firstChild);
        };
        this.add("clear", ["Console was cleared"]);
      },
      writable: false,
      enumerable: true,
      configurable: false
    }
  });
})();