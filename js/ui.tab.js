UI.Tab = (function () {
  "use strict";

  function TabView() {
    var host,
      $this = this;
    if (arguments.length > 0) {
      host = document.getElementById(arguments[0]);
    };
    if (!host) {
      host = document.createElement("div");
    };
    this.host = host;
    host.UITarget = this;
    host.classList.add("tab-view");
    host.addEventListener("click", function (event) {
      if ($this.headers.indexOf(event.target) >= 0) {
        $this.active = {
          id: event.target.getAttribute("data-for")
        };
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      };
    });
    if (this.header == null) {
      if (host.firstChild == null) {
        host.appendChild(document.createElement("header"));
      } else {
        host.insertBefore(document.createElement("header"), host.firstChild);
      };
    };
    this.active = this.active;
  };

  Object.defineProperties(TabView.prototype, {
    header: {
      get: function () {
        var children = this.host && this.host.children,
          child,
          a = 0,
          b = children.length;
        for (a; child = children[a], a < b; a++) {
          if (child.tagName.toLowerCase() == "header") {
            return child;
          };
        };
        return null;
      },
      enumerable: true,
      configurable: false
    },
    headers: {
      get: function () {
        var children = this.header && this.header.children,
          child,
          list = [],
          a = 0,
          b = children.length;
        for (a; child = children[a], a < b; a++) {
          if (child.tagName.toLowerCase() == "button") {
            list.push(child);
          };
        };
        return list;
      },
      enumerable: true,
      configurable: false
    },
    sections: {
      get: function () {
        var children = this.host && this.host.children,
          child,
          list = [],
          a = 0,
          b = children.length;
        for (a; child = children[a], a < b; a++) {
          if (child.tagName.toLowerCase() == "section") {
            list.push(child);
          };
        };
        return list;
      },
      enumerable: true,
      configurable: false
    },
    add: {
      value: function (id, title) {
        var test = this.get(id);
        if (test.header != null || test.section != null) {
          throw "Already exists: " + id;
        };
        var header = document.createElement("button");
        header.setAttribute("data-for", id);
        header.innerHTML = title;
        this.header.appendChild(header);
        var section = document.createElement("section");
        section.setAttribute("data-id", id);
        this.host.appendChild(section);
        this.active = this.active;
        return {
          id: id,
          title: title,
          header: header,
          section: section
        };
      },
      writable: false,
      enumerable: true,
      configurable: false
    },
    get: {
      value: function (id) {
        var headers = this.headers,
          header,
          sections = this.sections,
          section,
          result = {
            id: id,
            title: null,
            header: null,
            section: null
          },
          a = 0,
          b = headers.length;
        for (a; header = headers[a], a < b; a++) {
          if (header.getAttribute("data-for") == id) {
            result.header = header;
            result.title = header.innerHTML;
            break;
          };
        };
        a = 0;
        b = sections.length;
        for (a; section = sections[a], a < b; a++) {
          if (section.getAttribute("data-id") == id) {
            result.section = section;
            break;
          };
        };
        return result;
      },
      writable: false,
      enumerable: true,
      configurable: false
    },
    remove: {
      value: function (id) {
        var tab = this.get(id);
        if (tab.header == null || tab.section == null) {
          throw "Does not exist: " + id;
        };
        this.header.removeChild(tab.header);
        this.host.removeChild(tab.section);
        this.active = this.active;
        return tab;
      },
      writable: false,
      enumerable: true,
      configurable: false
    },
    active: {
      get: function () {
        var headers = this.headers,
          header,
          a = 0,
          b = headers.length;
        for (a; header = headers[a], a < b; a++) {
          if (header.classList.contains("active")) {
            return this.get(header.getAttribute("data-for"));
          };
        };
        if (headers.length > 0) {
          header = headers[0];
          var tab = this.get(header.getAttribute("data-for"));
          tab.header.classList.add("active");
          tab.section.classList.add("active");
          return tab;
        };
        return {
          id: null,
          title: null,
          header: null,
          section: null
        };
      },
      set: function (obj) {
        var tab = this.get(obj && obj.id);
        if (tab.id == null) {
          return tab;
        };
        if (tab.header == null || tab.section == null) {
          throw "Not found: " + tab.id;
        };
        var current = this.active;
        if (current.id == tab.id) {
          return tab;
        };
        current.header.classList.remove("active");
        current.section.classList.remove("active");
        tab.header.classList.add("active");
        tab.section.classList.add("active");
        return tab;
      },
      enumerable: true,
      configurable: false
    }
  });

  return TabView;
})();