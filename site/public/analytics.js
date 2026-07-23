/* XBert web analytics bootstrap for plugins.xbert.io.
   Mirrors the tracking stack on www.xbert.io: two GTM containers, the GA4
   stream, and HubSpot (the HubSpot loader itself is a separate tag in
   index.html). Self-hosted file so the CSP needs no 'unsafe-inline'. */
(function () {
  "use strict";

  // ---- Google Tag Manager (same containers as www.xbert.io) ----
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  ["GTM-KB86WSP", "GTM-MM4W3Q9B"].forEach(function (id) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + id;
    document.head.appendChild(s);
  });

  // ---- GA4 (same measurement ID as www.xbert.io) ----
  var GA4_ID = "G-7N96HFWN89";
  var g = document.createElement("script");
  g.async = true;
  g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(g);
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID);

  // ---- SPA page-view tracking (react-router changes the URL without a
  //      full page load, so re-report to GA4 + HubSpot on each navigation) ----
  function reportPageView() {
    var path = location.pathname + location.search;
    gtag("event", "page_view", {
      page_path: path,
      page_location: location.href,
      page_title: document.title,
    });
    var hsq = (window._hsq = window._hsq || []);
    hsq.push(["setPath", path]);
    hsq.push(["trackPageView"]);
  }
  var push = history.pushState;
  history.pushState = function () {
    push.apply(this, arguments);
    // Let the router render (and set document.title) before reporting.
    setTimeout(reportPageView, 50);
  };
  window.addEventListener("popstate", function () {
    setTimeout(reportPageView, 50);
  });
})();
