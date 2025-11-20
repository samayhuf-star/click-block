(function() {
  'use strict';
  
  // Get snippet ID from data-id attribute
  var currentScript = document.currentScript || document.querySelector('script[src*="tracker.js"]');
  var snippetId = currentScript ? currentScript.getAttribute('data-id') : null;
  
  if (!snippetId) {
    console.warn('ClickBlock: No tracking ID found. Please add data-id attribute.');
    return;
  }
  
  // ClickBlock Configuration
  var CLICKBLOCK_CONFIG = {
    projectId: 'djuvnasyncdqhsrydkse',
    publicKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ'
  };
  
  console.log('ClickBlock Tracker Active - ID:', snippetId);
  
  // Track event
  function track(isAdClick) {
    var data = {
      snippetId: snippetId,
      ip: 'auto',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      screenResolution: screen.width + 'x' + screen.height,
      language: navigator.language,
      isAdClick: isAdClick || false
    };
    
    console.log('ClickBlock: Tracking event:', isAdClick ? 'Ad Click' : 'Page View');
    
    fetch('https://' + CLICKBLOCK_CONFIG.projectId + '.supabase.co/functions/v1/make-server-51144976/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + CLICKBLOCK_CONFIG.publicKey,
        'apikey': CLICKBLOCK_CONFIG.publicKey
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      if (result.blocked) {
        console.warn('ClickBlock: Fraudulent activity blocked!');
      } else {
        console.log('ClickBlock: Event tracked successfully');
      }
    })
    .catch(function(error) {
      console.error('ClickBlock error:', error);
    });
  }
  
  // Track page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      track(false);
    });
  } else {
    track(false);
  }
  
  // Track ad clicks
  document.addEventListener('click', function(e) {
    var el = e.target;
    var isAd = el.closest('a[href*="googleadservices.com"]') ||
               el.closest('a[href*="doubleclick.net"]') ||
               el.closest('a[href*="googlesyndication.com"]') ||
               el.closest('[data-ad]') ||
               el.closest('.ad') ||
               el.closest('.google-ad') ||
               el.closest('#google_ads');
    
    if (isAd) {
      track(true);
    }
  }, true);
})();
