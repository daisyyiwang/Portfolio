(function () {
  var STORAGE_KEY = "portfolio_unlocked";
  var UNLOCK_PATH = "/unlock.html";
  var path = window.location.pathname;
  var isUnlockPage = path === UNLOCK_PATH || path.endsWith("/unlock.html");

  if (isUnlockPage) {
    return;
  }

  if (window.localStorage.getItem(STORAGE_KEY) === "true") {
    return;
  }

  var next = path + window.location.search + window.location.hash;
  var target = "";

  // Support both hosted and local file:// browsing.
  if (window.location.protocol === "file:") {
    target = (path.indexOf("/projects/") !== -1 ? "../unlock.html" : "unlock.html") +
      "?next=" + encodeURIComponent(next);
  } else {
    var base = window.location.origin && window.location.origin !== "null" ? window.location.origin : "";
    target = base + UNLOCK_PATH + "?next=" + encodeURIComponent(next);
  }

  window.location.replace(target);
})();
