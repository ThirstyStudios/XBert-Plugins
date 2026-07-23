/* XBert web analytics bootstrap for intelligence.xbert.io.
   Loads exactly three things: GA4, Leadfeeder, and HubSpot (whose loader is
   a separate tag in index.html). Self-hosted so the CSP needs no
   'unsafe-inline'.

   NO Google Tag Manager here, deliberately. www.xbert.io's two containers
   (GTM-KB86WSP, GTM-MM4W3Q9B) carry its full ad stack — AdRoll, Google Ads
   conversion tags, DoubleClick — plus inline custom-HTML tags. Mirroring
   them onto this site pulled in retargeting nobody asked for and produced a
   wall of CSP violations, since the strict policy blocked every one. GA4 is
   configured directly below instead, so analytics is unaffected.

   Also not here: LogRocket (session replay), Consent Pro (cookie banner),
   Intercom. If retargeting is ever wanted on this domain, add it
   deliberately AND resolve the cookie-consent question first — ad pixels
   without a consent layer is a compliance problem for UK/EU visitors. */
(function () {
  "use strict";

  // ---- GA4 (same measurement ID as www.xbert.io) ----
  window.dataLayer = window.dataLayer || [];
  var GA4_ID = "G-7N96HFWN89";
  var g = document.createElement("script");
  g.async = true;
  g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(g);
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("js", new Date());
  // Measurement only. The GA4 property has a Google Ads account linked, so by
  // default gtag also fires that account's remarketing and conversion tags —
  // DoubleClick, googleads, google.com/rmkt. We do not run ads on this domain
  // and there is no consent banner here, so those signals are turned off at
  // the source rather than allowlisted in the CSP.
  gtag("config", GA4_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

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
