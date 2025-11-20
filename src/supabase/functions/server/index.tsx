import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as stripeService from "./stripe.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sanitizeUrl } from "./url_helper.tsx";
import { fixAllDomains } from "./fix_domains.tsx";
import { runDiagnostics } from "./diagnostics.tsx";

// ClickBlock Server - Updated with diagnostics
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true
  }),
);

// Request tracking middleware
app.use("*", async (c, next) => {
  const startTime = Date.now();
  let isError = false;
  
  try {
    await next();
    isError = c.res.status >= 400;
  } catch (error) {
    isError = true;
    throw error;
  } finally {
    const responseTime = Date.now() - startTime;
    
    // Update stats asynchronously (don't wait)
    kv.get("system:request_stats").then((stats) => {
      const updated = stats || {
        requestCount: 0,
        errorCount: 0,
        totalResponseTime: 0,
        activeConnections: 0,
        lastReset: Date.now()
      };
      
      updated.requestCount++;
      if (isError) updated.errorCount++;
      updated.totalResponseTime += responseTime;
      
      kv.set("system:request_stats", updated);
    }).catch(() => {});
  }
});

// Health check endpoint
app.get("/make-server-51144976/health", (c) => {
  return c.json({ status: "ok" });
});

// Run comprehensive system diagnostics
app.get("/make-server-51144976/diagnostics", async (c) => {
  try {
    const results = await runDiagnostics();
    return c.json({ 
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error running diagnostics:", error);
    return c.json({ error: "Failed to run diagnostics" }, 500);
  }
});

// Fix malformed domain URLs (ps://, htps://, etc.)
app.post("/make-server-51144976/fix-domains", async (c) => {
  try {
    const result = await fixAllDomains();
    return c.json({ 
      success: true, 
      message: "Domain URLs fixed successfully",
      ...result
    });
  } catch (error) {
    console.error("Error fixing domains:", error);
    return c.json({ error: "Failed to fix domains" }, 500);
  }
});

// Initialize/Restore default websites (for demo/testing)
app.post("/make-server-51144976/init-websites", async (c) => {
  try {
    const websites = [
      {
        id: "website:1732000000001",
        name: "ClickBlock.co",
        url: "https://clickblock.co",
        snippetId: "AG-CLICKBLK1",
        status: "active",
        verified: true,
        lastVerified: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        clicks: 0,
        fraudClicks: 0,
        blockedIPs: []
      },
      {
        id: "website:1732000000002",
        name: "Marketing Site",
        url: "https://marketing.example.com",
        snippetId: "AG-MRKTSITE",
        status: "active",
        verified: true,
        lastVerified: new Date().toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        clicks: 0,
        fraudClicks: 0,
        blockedIPs: []
      },
      {
        id: "website:1732000000003",
        name: "E-commerce Store",
        url: "https://store.example.com",
        snippetId: "AG-ECOMSTR1",
        status: "active",
        verified: true,
        lastVerified: new Date().toISOString(),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        clicks: 0,
        fraudClicks: 0,
        blockedIPs: []
      }
    ];

    // Check if websites already exist
    const existingWebsites = await kv.getByPrefix("website:");
    
    for (const website of websites) {
      const exists = existingWebsites.some((w: any) => w.id === website.id);
      
      if (!exists) {
        // Add website
        await kv.set(website.id, website);
        
        // Initialize analytics
        await kv.set(`analytics:${website.id}`, {
          totalClicks: 0,
          fraudulentClicks: 0,
          blockedIPs: 0,
          clicksByDate: {},
          fraudByDate: {}
        });
        
        console.log(`Initialized website: ${website.name}`);
      } else {
        console.log(`Website already exists: ${website.name}`);
      }
    }

    return c.json({ 
      success: true, 
      message: "Websites initialized successfully",
      websites: websites.map(w => ({ name: w.name, status: w.status, verified: w.verified }))
    });
  } catch (error) {
    console.error("Error initializing websites:", error);
    return c.json({ error: "Failed to initialize websites" }, 500);
  }
});

// ============ AUTHENTICATION ROUTES ============

// Get all users (admin only)
app.get("/make-server-51144976/admin/users", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // Get all users from Supabase Auth
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }

    // Format users for frontend
    const users = data.users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "Unknown",
      role: user.user_metadata?.role || "customer",
      plan: user.user_metadata?.plan || "trial",
      status: user.email_confirmed_at ? "active" : "pending",
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at
    }));

    return c.json({ users });
  } catch (error) {
    console.error("Error in admin/users endpoint:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get user activity (admin only)
app.get("/make-server-51144976/admin/users/:userId/activity", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // For now, return mock activity data
    // In production, you would fetch this from your analytics/logs
    const activity = [
      {
        id: "1",
        action: "Sign In",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: "Successful login from 192.168.1.1"
      },
      {
        id: "2",
        action: "Website Added",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        details: "Added website: example.com"
      },
      {
        id: "3",
        action: "Plan Upgraded",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: "Upgraded to Professional plan"
      }
    ];

    return c.json({ activity });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return c.json({ error: "Failed to fetch user activity" }, 500);
  }
});

// Update user (admin only)
app.put("/make-server-51144976/admin/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const updates = await c.req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // Update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          name: updates.name,
          role: updates.role,
          plan: updates.plan
        }
      }
    );

    if (error) {
      console.error("Error updating user:", error);
      return c.json({ error: "Failed to update user" }, 500);
    }

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role,
        plan: data.user.user_metadata?.plan
      }
    });
  } catch (error) {
    console.error("Error in update user endpoint:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-51144976/admin/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return c.json({ error: "Failed to delete user" }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error in delete user endpoint:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// Create super admin (one-time setup)
app.post("/make-server-51144976/create-super-admin", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // Admin credentials
    const admins = [
      {
        email: "admin@clickblock.co",
        password: "ClickBlock2025!Admin",
        name: "Super Admin"
      },
      {
        email: "sam@sam.com",
        password: "sam@sam.com",
        name: "Sam (Super Admin)"
      }
    ];

    const results = [];

    for (const admin of admins) {
      // Check if admin already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const adminExists = existingUser?.users?.some((u: any) => u.email === admin.email);
      
      if (adminExists) {
        results.push({ 
          email: admin.email, 
          status: "already_exists" 
        });
        continue;
      }

      // Create super admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        user_metadata: { 
          name: admin.name,
          role: "super_admin",
          plan: "enterprise" 
        },
        email_confirm: true
      });

      if (error) {
        console.error(`Error creating super admin ${admin.email}:`, error);
        results.push({ 
          email: admin.email, 
          status: "error", 
          error: error.message 
        });
      } else {
        console.log("Super admin created successfully:", admin.email);
        results.push({ 
          email: admin.email, 
          status: "created",
          user_id: data.user.id
        });
      }
    }

    return c.json({ 
      success: true,
      message: "Super admin setup completed",
      results
    });
  } catch (error) {
    console.error("Error in create-super-admin endpoint:", error);
    return c.json({ error: "Failed to create super admin" }, 500);
  }
});

// Sign up
app.post("/make-server-51144976/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: "Password must be at least 8 characters" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // First check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some((u: any) => u.email === email);
    
    if (userExists) {
      return c.json({ error: "User with this email already exists" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, plan: 'trial' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Error creating user:", error);
      return c.json({ error: error.message || "Failed to create account" }, 400);
    }

    console.log("User created successfully:", email);

    // Now sign in the user to get a session
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string
    );

    const { data: sessionData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error("Error signing in after signup:", signInError);
      // User was created but signin failed - this is okay, they can sign in manually
      return c.json({ 
        user: data.user,
        message: "Account created successfully. Please sign in."
      });
    }

    return c.json({ 
      user: data.user,
      access_token: sessionData.session?.access_token
    });
  } catch (error) {
    console.error("Error in signup endpoint:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in
app.post("/make-server-51144976/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string
    );

    console.log("Attempting to sign in user:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Error signing in:", error);
      return c.json({ 
        error: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please check your credentials and try again."
          : error.message 
      }, 400);
    }

    if (!data.user) {
      return c.json({ error: "Failed to authenticate user" }, 400);
    }

    console.log("User signed in successfully:", email);

    return c.json({ 
      user: data.user,
      access_token: data.session?.access_token
    });
  } catch (error) {
    console.error("Error in signin endpoint:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// ============ WEBSITES ROUTES ============

// Get overview stats
app.get("/make-server-51144976/overview", async (c) => {
  try {
    // Get all websites
    const websites = await kv.getByPrefix("website:");
    
    // Get all analytics
    const analyticsKeys = websites.map((w: any) => `analytics:${w.id}`);
    const analyticsData = await kv.mget(analyticsKeys);
    
    // Calculate totals
    let totalClicks = 0;
    let fraudulentClicks = 0;
    let blockedIPs = 0;
    
    analyticsData.forEach((analytics: any) => {
      if (analytics) {
        totalClicks += analytics.totalClicks || 0;
        fraudulentClicks += analytics.fraudulentClicks || 0;
        blockedIPs += analytics.blockedIPs || 0;
      }
    });
    
    // Calculate percentages
    const fraudRate = totalClicks > 0 ? ((fraudulentClicks / totalClicks) * 100).toFixed(1) : "0.0";
    const savingsEstimate = (fraudulentClicks * 2.5).toFixed(2); // Estimate $2.50 per blocked click
    
    return c.json({
      totalClicks,
      fraudulentClicks,
      blockedIPs,
      fraudRate: parseFloat(fraudRate),
      savingsEstimate: parseFloat(savingsEstimate),
      activeWebsites: websites.filter((w: any) => w.status === "active").length,
      totalWebsites: websites.length
    });
  } catch (error) {
    console.error("Error fetching overview:", error);
    return c.json({ error: "Failed to fetch overview data" }, 500);
  }
});

// Get all websites
app.get("/make-server-51144976/websites", async (c) => {
  try {
    const websites = await kv.getByPrefix("website:");
    return c.json({ websites: websites || [] });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return c.json({ error: "Failed to fetch websites" }, 500);
  }
});

// Add new website
app.post("/make-server-51144976/websites", async (c) => {
  try {
    const { name, url } = await c.req.json();
    
    if (!name || !url) {
      return c.json({ error: "Name and URL are required" }, 400);
    }

    // Sanitize URL using helper function
    const sanitizedUrl = sanitizeUrl(url);

    // Basic URL validation
    try {
      new URL(sanitizedUrl);
    } catch (error) {
      return c.json({ error: "Invalid URL format. Please enter a valid website URL." }, 400);
    }

    const websiteId = `website:${Date.now()}`;
    const snippetId = `AG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    const website = {
      id: websiteId,
      name,
      url: sanitizedUrl,
      snippetId,
      status: "inactive",
      createdAt: new Date().toISOString(),
      clicks: 0,
      fraudClicks: 0,
      blockedIPs: []
    };

    await kv.set(websiteId, website);
    
    // Initialize analytics for this website
    await kv.set(`analytics:${websiteId}`, {
      totalClicks: 0,
      fraudulentClicks: 0,
      blockedIPs: 0,
      clicksByDate: {},
      fraudByDate: {}
    });

    return c.json({ website });
  } catch (error) {
    console.error("Error creating website:", error);
    return c.json({ error: "Failed to create website" }, 500);
  }
});

// Delete website
app.delete("/make-server-51144976/websites/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    await kv.del(`analytics:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting website:", error);
    return c.json({ error: "Failed to delete website" }, 500);
  }
});

// Verify website tracking snippet
app.post("/make-server-51144976/websites/:id/verify", async (c) => {
  const verifyStart = Date.now();
  try {
    // Track verification queue
    const verifyQueue = await kv.get("queue:verification") || { pending: 0, processing: 0, completed: 0, failed: 0, totalProcessingTime: 0 };
    verifyQueue.processing++;
    await kv.set("queue:verification", verifyQueue);
    
    const id = c.req.param("id");
    const website = await kv.get(id);
    
    if (!website) {
      // Update queue - failed
      verifyQueue.processing--;
      verifyQueue.failed++;
      await kv.set("queue:verification", verifyQueue);
      return c.json({ error: "Website not found" }, 404);
    }

    // Make HTTP request to the website to check for the tracking snippet
    try {
      // Sanitize and ensure URL has protocol
      const targetUrl = sanitizeUrl(website.url);
      
      console.log(`Verifying website: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'ClickBlock Verification Bot/1.0'
        },
        // Timeout after 15 seconds
        signal: AbortSignal.timeout(15000)
      });

      const html = await response.text();
      
      // Check if the tracking snippet or snippet ID exists in the HTML
      const snippetExists = html.includes(website.snippetId) || 
                           html.includes('cdn.clickblock.co/tracking.js') ||
                           html.includes('data-snippet-id');

      const verified = snippetExists;
      const lastVerified = new Date().toISOString();

      // Update website with verification status
      const updatedWebsite = {
        ...website,
        verified,
        lastVerified,
        status: verified ? "active" : "inactive"
      };

      await kv.set(id, updatedWebsite);
      
      // Update queue - completed
      verifyQueue.processing--;
      verifyQueue.completed++;
      verifyQueue.totalProcessingTime += (Date.now() - verifyStart);
      await kv.set("queue:verification", verifyQueue);

      return c.json({
        verified,
        lastVerified,
        message: verified 
          ? "Tracking snippet successfully detected!"
          : "Tracking snippet not found. Please ensure you've installed it correctly."
      });
    } catch (fetchError) {
      console.error("Error fetching website for verification:", fetchError);
      
      // Update queue - failed
      verifyQueue.processing--;
      verifyQueue.failed++;
      await kv.set("queue:verification", verifyQueue);
      
      // Check if it's a timeout error
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        return c.json({ 
          verified: false,
          message: "Website verification timed out (15s). Please ensure your website is accessible."
        }, 408);
      }
      
      return c.json({ 
        verified: false,
        message: `Unable to reach website (${website.url}): ${fetchError.message || 'Unknown error'}`
      }, 400);
    }
  } catch (error) {
    console.error("Error verifying website:", error);
    // Update queue - failed
    const verifyQueue = await kv.get("queue:verification") || { pending: 0, processing: 0, completed: 0, failed: 0, totalProcessingTime: 0 };
    verifyQueue.processing--;
    verifyQueue.failed++;
    await kv.set("queue:verification", verifyQueue);
    return c.json({ error: "Failed to verify website" }, 500);
  }
});

// ============ TRACKING ROUTES ============

// Track click/page view
app.post("/make-server-51144976/track-click", async (c) => {
  try {
    const trackingData = await c.req.json();
    const { snippetId, ip, userAgent, referrer, timestamp, url, isAdClick } = trackingData;
    
    if (!snippetId) {
      return c.json({ error: "Snippet ID is required" }, 400);
    }

    console.log(`Tracking click for snippet: ${snippetId}`);
    console.log(`Tracking data received:`, { snippetId, userAgent, referrer, url, isAdClick });

    // Find website by snippet ID (case-insensitive match)
    const websites = await kv.getByPrefix("website:");
    console.log(`Total websites found: ${websites.length}`);
    console.log(`Available snippet IDs:`, websites.map((w: any) => w.snippetId));
    
    const website = websites.find((w: any) => 
      w.snippetId && w.snippetId.toUpperCase() === snippetId.toUpperCase()
    );

    if (!website) {
      console.warn(`Website not found for snippet ID: ${snippetId}`);
      console.warn(`Available snippet IDs:`, websites.map((w: any) => w.snippetId));
      return c.json({ 
        blocked: false,
        message: `Website not found for snippet ID: ${snippetId}. Available IDs: ${websites.map((w: any) => w.snippetId).join(', ')}`,
        snippetId,
        availableSnippets: websites.map((w: any) => w.snippetId)
      });
    }

    console.log(`Found website: ${website.name} (${website.id})`);

    // Get client IP from request headers or use provided IP
    const clientIP = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
                     c.req.header("x-real-ip") ||
                     ip ||
                     "unknown";

    // Basic fraud detection (simplified)
    const isFraudulent = detectFraud(clientIP, userAgent, referrer, url);
    
    // Get current analytics
    const analyticsKey = `analytics:${website.id}`;
    let analytics = await kv.get(analyticsKey) || {
      totalClicks: 0,
      fraudulentClicks: 0,
      blockedIPs: 0,
      clicksByDate: {},
      fraudByDate: {}
    };

    // Update analytics
    analytics.totalClicks = (analytics.totalClicks || 0) + 1;
    
    const today = new Date().toISOString().split('T')[0];
    analytics.clicksByDate[today] = (analytics.clicksByDate[today] || 0) + 1;

    if (isFraudulent) {
      analytics.fraudulentClicks = (analytics.fraudulentClicks || 0) + 1;
      analytics.fraudByDate[today] = (analytics.fraudByDate[today] || 0) + 1;
      
      // Add to blocked IPs if not already there
      if (!website.blockedIPs.includes(clientIP)) {
        website.blockedIPs.push(clientIP);
        await kv.set(website.id, website);
      }
      analytics.blockedIPs = website.blockedIPs.length;
    }

    // Save updated analytics
    await kv.set(analyticsKey, analytics);

    // Update website clicks count
    website.clicks = analytics.totalClicks;
    website.fraudClicks = analytics.fraudulentClicks;
    await kv.set(website.id, website);

    console.log(`Click tracked: ${website.name} - Total: ${analytics.totalClicks}, Fraud: ${analytics.fraudulentClicks}`);

    return c.json({
      blocked: isFraudulent,
      message: isFraudulent ? "Fraudulent click detected and blocked" : "Click tracked successfully",
      snippetId,
      websiteId: website.id
    });
  } catch (error) {
    console.error("Error tracking click:", error);
    return c.json({ 
      blocked: false,
      error: "Failed to track click",
      message: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Simple fraud detection function
function detectFraud(ip: string, userAgent: string, referrer: string, url?: string): boolean {
  // Don't block localhost or unknown IPs
  if (ip === "unknown" || !ip || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")) {
    return false;
  }

  // Check for bot user agents
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /headless/i, /phantom/i, /selenium/i, /webdriver/i,
    /curl/i, /wget/i, /python/i, /java/i, /go-http/i,
    /httpclient/i, /scrapy/i, /mechanize/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }

  // Check for empty or suspicious user agents
  if (!userAgent || userAgent.length < 10) {
    return true;
  }

  // Check for suspicious referrer patterns
  if (referrer && (
    referrer.includes('click-fraud') || 
    referrer.includes('bot') ||
    referrer.includes('scraper')
  )) {
    return true;
  }

  // In production, you would:
  // 1. Check IP against threat intelligence databases
  // 2. Use MaxMind GeoIP2 for datacenter detection
  // 3. Check against VPN/proxy databases
  // 4. Analyze behavioral patterns
  // 5. Check click velocity and patterns
  
  return false; // Default to not fraudulent
}

// Get analytics for a specific website
app.get("/make-server-51144976/analytics/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Get website
    const website = await kv.get(id);
    if (!website) {
      return c.json({ error: "Website not found" }, 404);
    }

    // Get analytics
    const analyticsKey = `analytics:${website.id}`;
    const analytics = await kv.get(analyticsKey) || {
      totalClicks: 0,
      fraudulentClicks: 0,
      blockedIPs: 0,
      clicksByDate: {},
      fraudByDate: {}
    };

    return c.json({
      analytics: {
        totalClicks: analytics.totalClicks || 0,
        fraudulentClicks: analytics.fraudulentClicks || 0,
        blockedIPs: analytics.blockedIPs || 0,
        clicksByDate: analytics.clicksByDate || {},
        fraudByDate: analytics.fraudByDate || {}
      },
      website: {
        id: website.id,
        name: website.name,
        url: website.url,
        snippetId: website.snippetId
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// Get all analytics
app.get("/make-server-51144976/analytics", async (c) => {
  try {
    const websites = await kv.getByPrefix("website:");
    const analyticsKeys = websites.map((w: any) => `analytics:${w.id}`);
    const analyticsData = await kv.mget(analyticsKeys);
    
    const analytics = websites.map((website: any, index: number) => ({
      websiteId: website.id,
      websiteName: website.name,
      snippetId: website.snippetId,
      totalClicks: analyticsData[index]?.totalClicks || 0,
      fraudulentClicks: analyticsData[index]?.fraudulentClicks || 0,
      blockedIPs: analyticsData[index]?.blockedIPs || 0,
      clicksByDate: analyticsData[index]?.clicksByDate || {},
      fraudByDate: analyticsData[index]?.fraudByDate || {}
    }));

    return c.json({ analytics });
  } catch (error) {
    console.error("Error fetching all analytics:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// Test endpoint to simulate clicks (for testing/debugging)
app.post("/make-server-51144976/test-track", async (c) => {
  try {
    const { snippetId, count = 1 } = await c.req.json();
    
    if (!snippetId) {
      return c.json({ error: "Snippet ID is required" }, 400);
    }

    // Find website by snippet ID
    const websites = await kv.getByPrefix("website:");
    const website = websites.find((w: any) => w.snippetId === snippetId);

    if (!website) {
      return c.json({ error: "Website not found for snippet ID" }, 404);
    }

    const analyticsKey = `analytics:${website.id}`;
    let analytics = await kv.get(analyticsKey) || {
      totalClicks: 0,
      fraudulentClicks: 0,
      blockedIPs: 0,
      clicksByDate: {},
      fraudByDate: {}
    };

    const today = new Date().toISOString().split('T')[0];
    
    // Simulate clicks
    for (let i = 0; i < count; i++) {
      analytics.totalClicks = (analytics.totalClicks || 0) + 1;
      analytics.clicksByDate[today] = (analytics.clicksByDate[today] || 0) + 1;
      
      // Randomly mark some as fraud (10% chance)
      if (Math.random() < 0.1) {
        analytics.fraudulentClicks = (analytics.fraudulentClicks || 0) + 1;
        analytics.fraudByDate[today] = (analytics.fraudByDate[today] || 0) + 1;
      }
    }

    await kv.set(analyticsKey, analytics);
    
    // Update website
    website.clicks = analytics.totalClicks;
    website.fraudClicks = analytics.fraudulentClicks;
    await kv.set(website.id, website);

    return c.json({
      success: true,
      message: `Simulated ${count} click(s) for ${website.name}`,
      analytics: {
        totalClicks: analytics.totalClicks,
        fraudulentClicks: analytics.fraudulentClicks
      }
    });
  } catch (error) {
    console.error("Error in test-track:", error);
    return c.json({ error: "Failed to simulate clicks" }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);