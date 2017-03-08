DeveloperTools.register(function () {
  var $this = this;
  var $eval;
  var previewTab = this.host.UITarget.add("preview", "Preview");
  var previewDiv = document.createElement("div");
  var previewFrame = document.createElement("iframe");
  var previewURL = document.createElement("pre");
  previewFrame.src = location.hash.replace(/^\#/, "");
  previewFrame.onload = function () {
    try {
      this.contentWindow.addEventListener("error", function (error) {
        $this.console("uncaught", [error]);
      });
      this.contentWindow.console = $this.ConsoleInterface();
      $eval = this.contentWindow.eval.bind(this.contentWindow);
      previewURL.textContent = this.contentWindow.location.href;
      location.hash = this.contentWindow.location.href;
    } catch (e) {
      $this.console("uncaught", [e]);
    };
  };
  previewTab.section.classList.add("dt-preview");
  previewDiv.appendChild(previewFrame);
  previewTab.section.appendChild(previewDiv);
  previewTab.section.appendChild(previewURL);
  Object.defineProperties(this, {
    contentWindow: {
      get: function () {
        return previewFrame.contentWindow;
      },
      enumerable: true,
      configurable: false
    },
    eval: {
      get: function () {
        return $eval;
      },
      enumerable: true,
      configurable: false
    }
  });
});