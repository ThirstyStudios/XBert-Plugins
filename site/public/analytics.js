/* XBert web analytics bootstrap for plugins.xbert.io.
   Mirrors the tracking stack on www.xbert.io: two GTM containers, the GA4
   stream, Leadfeeder, and HubSpot (the HubSpot loader itself is a separate
   tag in index.html). Self-hosted file so the CSP needs no 'unsafe-inline'.

   Deliberately NOT carried over from www.xbert.io: AdRoll (retargeting),
   LogRocket (session replay), Consent Pro (cookie banner) and Intercom.
   If AdRoll or LogRocket are ever added — resolve the cookie-consent
   question first — the CSP in staticwebapp.config.json also needs
   script-src https://s.adroll.com https://cdn.lr-in-prod.com and
   connect-src https://*.adroll.com https://*.lr-in-prod.com
   https://*.logrocket.io, or they will be silently blocked. */
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

  // ---- Leadfeeder (same tracker as www.xbert.io) ----
  // B2B visitor identification. Loads its own tracker script, which then
  // reports page views itself — no per-route call needed below.
  window.ldfdr =
    window.ldfdr ||
    function () {
      (window.ldfdr._q = window.ldfdr._q || []).push([].slice.call(arguments));
    };
  var lf = document.createElement("script");
  lf.async = true;
  lf.src = "https://sc.lfeeder.com/lftracker_v1_ywVkO4XEJZxaZ6Bj.js";
  document.head.appendChild(lf);

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
