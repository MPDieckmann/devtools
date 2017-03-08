(function () {
  "use strict";

  function get_properties(object) {
    if (typeof object != "object" && typeof object != "function") {
      return null;
    };
    if (object == null) {
      return null;
    };

    var descs = [];
    (function iterate(target) {
      var props = Object.getOwnPropertyNames(target);
      var syms = Object.getOwnPropertySymbols(target);

      props.forEach(function (key) {
        var desc = Object.getOwnPropertyDescriptor(target, key);
        var type;
        if ("value" in desc && target === object) {
          type = toType(desc.value);
          descs.push({
            key: key,
            keyText: toString(key),
            keyType: typeof key,
            value: desc.value,
            text: toString(desc.value),
            type: type,
            enumerable: desc.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
        if ("get" in desc && target === object) {
          type = toType(desc.get);
          descs.push({
            key: key,
            keyText: "get " + toString(key),
            keyType: toType(key),
            value: desc.get,
            text: toString(desc.get),
            type: type,
            enumerable: descs.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
        if ("get" in desc) {
          descs.push({
            key: key,
            keyText: toString(key),
            keyType: toType(key),
            value: function () {
              var value = desc.get.call(object);
              var type = toType(value);
              return {
                value: value,
                text: toString(value),
                type: type,
                expandable: type == "object" || type == "array" || type == "function" || type == "regex"
              };
            },
            text: "(...)",
            type: null,
            enumerable: descs.enumerable === true
          });
        };
        if ("set" in desc && target === object) {
          type = toType(desc.set);
          descs.push({
            key: key,
            keyText: "set " + toString(key),
            keyType: toType(key),
            value: desc.get,
            text: toString(desc.get),
            type: type,
            enumerable: descs.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
      });

      syms.forEach(function (key) {
        var desc = Object.getOwnPropertyDescriptor(target, key);
        var desc = Object.getOwnPropertyDescriptor(target, key);
        var type;
        if ("value" in desc && target === object) {
          type = toType(desc.value);
          descs.push({
            key: key,
            keyText: toString(key),
            keyType: typeof key,
            value: desc.value,
            text: toString(desc.value),
            type: type,
            enumerable: desc.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
        if ("get" in desc && target === object) {
          type = toType(desc.get);
          descs.push({
            key: key,
            keyText: "get " + toString(key),
            keyType: toType(key),
            value: desc.get,
            text: toString(desc.get),
            type: type,
            enumerable: descs.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
        if ("get" in desc) {
          descs.push({
            key: key,
            keyText: toString(key),
            keyType: toType(key),
            value: function () {
              var value = desc.get.call(object);
              var type = toType(value);
              return {
                value: value,
                text: toString(value),
                type: type,
                expandable: type == "object" || type == "array" || type == "function" || type == "regex"
              };
            },
            text: "(...)",
            type: null,
            enumerable: descs.enumerable === true
          });
        };
        if ("set" in desc && target === object) {
          type = toType(desc.set);
          descs.push({
            key: key,
            keyText: "set " + toString(key),
            keyType: toType(key),
            value: desc.get,
            text: toString(desc.get),
            type: type,
            enumerable: descs.enumerable === true,
            expandable: type == "object" || type == "array" || type == "function" || type == "regex"
          });
        };
      });
      var __proto__ = Object.getPrototypeOf(target);
      if (__proto__) {
        iterate(__proto__);
      };
    })(object);
    return descs.sort(function (a, b) {
      var c = toString(a.key),
        d = toString(b.key);
      if (a.keyType == "symbol" && b.keyType != "symbol") {
        return 1;
      } else if (a.keyType != "symbol" && b.keyType == "symbol") {
        return -1;
      };
      if (c[0] == "_" && d[0] != "_") {
        return 1;
      } else if (c[0] != "_" && d[0] == "_") {
        return -1;
      };
      if (c < d) {
        return -1;
      } else if (c > d) {
        return 1
      };
      return 0;
    });
  };
  DeveloperTools.get_properties = get_properties;

  function toString() {
    var mixed = arguments.length > 0 ? arguments[0] : this;
    var type = toType(mixed);
    if (type == "null") {
      if (mixed === null) {
        return "null";
      } else {
        return "undefined";
      };
    };
    return toString[type].call(mixed);
  };
  DeveloperTools.toString = toString;

  toString.symbol = Symbol.prototype.toString;
  toString.string = String.prototype.toString;
  toString.regex = RegExp.prototype.toString;
  toString.number = Number.prototype.toString;
  toString.boolean = Boolean.prototype.toString;
  toString.function = Function.prototype.toString;
  toString.object = (function (toString) {
    return function () {
      return toString.apply(this, arguments).replace(/\[object (.*)\]/g, "$1");
    };
  })(Object.prototype.toString);
  toString.array = (function (toString, toObjectString) {
    return function () {
      var a = 0,
        b = this.length,
        c = "";
      for (a; a < b; a++) {
        if (toType(this[a]) == "array") {
          c += "," + toObjectString.call(this[a]) + "[" + this[a].length + "]";
        } else {
          c += "," + toString(this[a]);
        };
      };
      return c.replace(/^\,/, "[") + "]";
    };
  })(toString, toString.object);

  function toType() {
    var mixed = arguments.length > 0 ? arguments[0] : this;
    var type = typeof mixed;
    var newObj = new Object(mixed);
    if (mixed === null || mixed === undefined) {
      return "null";
    };
    if (type == "object" && newObj instanceof RegExp) {
      return "regex";
    };
    if (type == "object" && typeof mixed.length == "number" && typeof mixed.splice == "function") {
      return "array";
    };
    return type;
  };
  DeveloperTools.toType = toType;

  function Expander(desc) {
    var get_props = arguments[1];
    if (typeof get_props != "function") {
      get_props = get_properties;
    };
    var expanded = false;
    var details = document.createElement("div");
    details.classList.add("dt-expander");

    function Expand(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (desc.expandable) {
        if (!expanded) {
          expanded = true;
          var array = get_props(desc.value);
          if (!array) {
            return;
          };
          array.map(function (desc) {
            details.appendChild(Expander(desc, get_props));
          });
        };
        if (details.hasAttribute("data-open")) {
          details.removeAttribute("data-open");
        } else {
          details.setAttribute("data-open", "");
        };
      };
    };
    details.addEventListener("click", Expand);

    var summary = document.createElement("div");
    summary.classList.add("dt-entry");
    if (desc.enumerable != false) {
      summary.setAttribute("data-enumerable", "");
    };
    if (desc.keyType) {
      var key = document.createElement("span");
      key.classList.add("dt-key", desc.keyType);
      key.setAttribute("data-type", desc.keyType);
      key.title = "keyText" in desc ? desc.keyText : desc.key;
      key.appendChild(document.createTextNode("keyText" in desc ? desc.keyText : desc.key));
      summary.appendChild(key);
      summary.appendChild(document.createTextNode(": "));
    };
    var value = document.createElement("span");
    value.classList.add("dt-value");
    value.setAttribute("data-type", desc.type);
    value.title = "text" in desc ? desc.text : desc.value;
    value.appendChild(document.createTextNode("text" in desc ? desc.text : desc.value));
    if (desc.type == null) {
      value.addEventListener("click", function onclick(event) {
        try {
          desc = desc.value();
        } catch (e) {
          desc.value = e;
          desc.text = "[Uncaught: " + e + "]";
          desc.type = "uncaught";
          desc.expandable = true;
        };
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        };
        this.setAttribute("data-type", desc.type);
        this.title = "text" in desc ? desc.text : desc.value;
        value.appendChild(document.createTextNode("text" in desc ? desc.text : desc.value));
        this.removeEventListener("click", onclick);
        if (desc.expandable) {
          summary.setAttribute("data-expandable", "");
        } else {
          summary.removeAttribute("data-expandable", "");
        };

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      });
    };
    summary.appendChild(value);

    details.appendChild(summary);
    if (desc.expandable) {
      summary.setAttribute("data-expandable", "");
    };

    return details;
  };

  DeveloperTools.Expander = Expander;
})();