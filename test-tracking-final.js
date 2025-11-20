// Test tracking with correct project ID
const API_BASE = 'https://djuvnasyncdqhsrydkse.supabase.co/functions/v1/make-server-51144976';
const AUTH_HEADERS = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ',
  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdXZuYXN5bmNkcWhzcnlka3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjI3MTksImV4cCI6MjA3OTEzODcxOX0.g3NT-tQo88MdeyLbzAXWEol_SN6AmcFMWA94p6X_lmQ',
  'Content-Type': 'application/json'
};

async function testTracking() {
  try {
    // Get website
    console.log('📋 Fetching websites...');
    const websitesResponse = await fetch(`${API_BASE}/websites`, {
      headers: AUTH_HEADERS
    });
    
    const websitesData = await websitesResponse.json();
    const websites = websitesData.websites || [];
    
    if (websites.length === 0) {
      console.log('❌ No websites found.');
      return;
    }
    
    const website = websites[0];
    console.log(`✅ Using website: ${website.name}`);
    console.log(`   Snippet ID: ${website.snippetId}`);
    console.log('');
    
    // Simulate clicks
    console.log('🖱️  Simulating clicks...');
    const clicks = [
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', referrer: 'google.com', isAdClick: false, ip: '192.168.1.101' },
      { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', referrer: 'facebook.com', isAdClick: true, ip: '192.168.1.102' },
      { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15', referrer: 'direct', isAdClick: false, ip: '192.168.1.103' },
      { userAgent: 'Bot/1.0 (compatible; Googlebot/2.1)', referrer: 'direct', isAdClick: false, ip: '192.168.1.104' }, // Should be blocked
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', referrer: 'twitter.com', isAdClick: true, ip: '192.168.1.105' },
    ];

    let successCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < clicks.length; i++) {
      const click = clicks[i];
      await new Promise(resolve => setTimeout(resolve, 500));

      const trackingData = {
        snippetId: website.snippetId,
        ip: click.ip,
        userAgent: click.userAgent,
        referrer: click.referrer,
        timestamp: new Date().toISOString(),
        url: website.url,
        isAdClick: click.isAdClick
      };

      try {
        const trackResponse = await fetch(`${API_BASE}/track-click`, {
          method: 'POST',
          headers: AUTH_HEADERS,
          body: JSON.stringify(trackingData)
        });
        
        if (!trackResponse.ok) {
          const errorText = await trackResponse.text();
          console.log(`   ⚠️  Click ${i + 1}: HTTP ${trackResponse.status}`);
          continue;
        }

        const result = await trackResponse.json();
        
        if (result.blocked) {
          console.log(`   ❌ Click ${i + 1}: BLOCKED (Fraud detected)`);
          blockedCount++;
        } else {
          console.log(`   ✅ Click ${i + 1}: Tracked successfully`);
          successCount++;
        }
      } catch (error) {
        console.error(`   ⚠️  Click ${i + 1}: Error - ${error.message}`);
      }
    }

    console.log('');
    console.log(`📊 Click Summary:`);
    console.log(`   ✅ Legitimate clicks: ${successCount}`);
    console.log(`   ❌ Blocked clicks: ${blockedCount}`);
    console.log(`   📈 Total clicks: ${clicks.length}`);
    console.log('');

    // Fetch analytics
    console.log('📈 Fetching analytics...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analyticsResponse = await fetch(`${API_BASE}/analytics/${website.id}`, {
      headers: AUTH_HEADERS
    });

    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      const analytics = analyticsData.analytics || {};
      
      console.log('✅ Analytics Results:');
      console.log(`   Total Clicks: ${analytics.totalClicks || 0}`);
      console.log(`   Fraudulent Clicks: ${analytics.fraudulentClicks || 0}`);
      console.log(`   Blocked IPs: ${analytics.blockedIPs || 0}`);
      console.log(`   Legitimate Clicks: ${(analytics.totalClicks || 0) - (analytics.fraudulentClicks || 0)}`);
      console.log('');
      console.log('🎉 Test complete! Check your dashboard to see the analytics.');
    } else {
      console.log('⚠️  Could not fetch analytics');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTracking();

