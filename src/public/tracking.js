(function() {
  'use strict';
  
  // Get snippet ID from the script tag
  // Try multiple methods to get snippet ID for dynamic loading support
  var snippetId = null;
  
  // Method 1: Try currentScript (works for inline scripts)
  var currentScript = document.currentScript;
  if (currentScript) {
    snippetId = currentScript.getAttribute('data-snippet-id');
  }
  
  // Method 2: Try to find script tag with data-snippet-id (works for dynamically loaded scripts)
  if (!snippetId) {
    var scripts = document.querySelectorAll('script[data-snippet-id]');
    if (scripts.length > 0) {
      snippetId = scripts[scripts.length - 1].getAttribute('data-snippet-id');
    }
  }
  
  // Method 3: Try to find script tag that loaded this file
  if (!snippetId) {
    var allScripts = document.querySelectorAll('script[src*="tracking.js"]');
    for (var i = 0; i < allScripts.length; i++) {
      var id = allScripts[i].getAttribute('data-snippet-id');
      if (id) {
        snippetId = id;
        break;
      }
    }
  }
  
  if (!snippetId) {
    console.warn('ClickBlock: No snippet ID found. Please ensure the script tag has data-snippet-id attribute.');
    return;
  }
  
  // ClickBlock Configuration
  var CLICKBLOCK_CONFIG = {
    projectId: 'djuvnasyncdqhsrydkse',
    publicKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ'
  };
  
  console.log('ClickBlock Tracking Active - Snippet ID:', snippetId);
  
  // Track page view or click
  function trackClick(isAdClick) {
    var data = {
      snippetId: snippetId,
      ip: 'auto', // Will be detected by server
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      screenResolution: screen.width + 'x' + screen.height,
      language: navigator.language,
      isAdClick: isAdClick || false
    };
    
    console.log('ClickBlock: Sending tracking data:', data);
    
    // Send tracking data
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
        console.warn('ClickBlock: Fraudulent click detected and blocked!', result.message);
      } else {
        console.log('ClickBlock: Click tracked successfully', result.message);
      }
    })
    .catch(function(error) {
      console.error('ClickBlock tracking error:', error);
    });
  }
  
  // Track on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackClick(false);
    });
  } else {
    trackClick(false);
  }
  
  // Track on ad clicks (Google Ads specific)
  document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Check if click is on an ad or ad-related element
    var isAd = target.closest('a[href*="googleadservices.com"]') ||
               target.closest('a[href*="doubleclick.net"]') ||
               target.closest('a[href*="googlesyndication.com"]') ||
               target.closest('[data-ad]') ||
               target.closest('.ad') ||
               target.closest('.google-ad') ||
               target.closest('#google_ads') ||
               target.closest('[id*="google_ad"]') ||
               target.closest('[class*="google-ad"]');
    
    if (isAd) {
      console.log('ClickBlock: Ad click detected');
      trackClick(true);
    }
  }, true);
  
  console.log('ClickBlock: Tracking initialized successfully');
})();
