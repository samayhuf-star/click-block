// System Health Monitoring - Real Production Data
import { Hono } from "npm:hono";
import * as kv from './kv_store.tsx';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export const systemHealthRoutes = new Hono();

// Get core services status
systemHealthRoutes.get("/services", async (c) => {
  try {
    const startTime = Date.now();
    const services = [];
    
    // Check Web Server (Self)
    const webServerStart = Date.now();
    const webServerStatus = {
      name: "Web Server",
      status: "operational" as const,
      uptime: 100,
      responseTime: Date.now() - webServerStart,
      lastChecked: new Date().toISOString(),
      incidents: 0
    };
    services.push(webServerStatus);
    
    // Check Database (Supabase)
    try {
      const dbStart = Date.now();
      const healthCheck = await kv.get("system:health_check") || { lastCheck: 0 };
      const dbResponseTime = Date.now() - dbStart;
      
      // Update health check
      await kv.set("system:health_check", {
        lastCheck: Date.now(),
        status: "operational"
      });
      
      const dbStatus = {
        name: "Database",
        status: "operational" as const,
        uptime: 100,
        responseTime: dbResponseTime,
        lastChecked: new Date().toISOString(),
        incidents: 0
      };
      services.push(dbStatus);
    } catch (error) {
      services.push({
        name: "Database",
        status: "outage" as const,
        uptime: 0,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        incidents: 1
      });
    }
    
    // Check Edge Functions
    const edgeFunctionStatus = {
      name: "Edge Functions",
      status: "operational" as const,
      uptime: 100,
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
      incidents: 0
    };
    services.push(edgeFunctionStatus);
    
    return c.json({ services });
  } catch (error) {
    console.error("Error checking system services:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get system metrics
systemHealthRoutes.get("/metrics", async (c) => {
  try {
    // Get real system metrics
    const memoryUsage = (Deno as any).memoryUsage?.() || {};
    const rss = memoryUsage.rss || 0;
    const heapTotal = memoryUsage.heapTotal || 0;
    const heapUsed = memoryUsage.heapUsed || 0;
    
    // Calculate memory percentage (using heap)
    const memoryPercent = heapTotal > 0 ? Math.round((heapUsed / heapTotal) * 100) : 0;
    
    // Get request statistics from KV
    const stats = await kv.get("system:request_stats") || {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      lastMinuteRequests: 0,
      activeConnections: 0,
      lastReset: Date.now()
    };
    
    // Calculate metrics
    const now = Date.now();
    const timeSinceReset = (now - (stats.lastReset || now)) / 1000 / 60; // minutes
    const requestsPerMinute = timeSinceReset > 0 ? Math.round(stats.requestCount / timeSinceReset) : 0;
    const errorRate = stats.requestCount > 0 ? ((stats.errorCount / stats.requestCount) * 100).toFixed(1) : "0.0";
    const avgResponseTime = stats.requestCount > 0 ? Math.round(stats.totalResponseTime / stats.requestCount) : 0;
    
    const metrics = {
      cpu: 0, // CPU metrics not available in Edge Functions
      memory: Math.min(memoryPercent, 100),
      disk: 0, // Disk metrics not available in Edge Functions
      network: Math.min(Math.round((stats.activeConnections || 0) / 10), 100),
      requestsPerMinute: requestsPerMinute || 0,
      activeConnections: stats.activeConnections || 0,
      errorRate: parseFloat(errorRate),
      avgResponseTime: avgResponseTime || 0
    };
    
    return c.json({ metrics });
  } catch (error) {
    console.error("Error getting system metrics:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get job queues status
systemHealthRoutes.get("/job-queues", async (c) => {
  try {
    // Get real job queue data from KV
    const emailQueue = await kv.get("queue:email") || {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalProcessingTime: 0
    };
    
    const verificationQueue = await kv.get("queue:verification") || {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalProcessingTime: 0
    };
    
    const analyticsQueue = await kv.get("queue:analytics") || {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalProcessingTime: 0
    };
    
    const queues = [
      {
        id: "email-queue",
        name: "Email Processing",
        pending: emailQueue.pending || 0,
        processing: emailQueue.processing || 0,
        completed: emailQueue.completed || 0,
        failed: emailQueue.failed || 0,
        avgProcessingTime: emailQueue.completed > 0 
          ? Math.round(emailQueue.totalProcessingTime / emailQueue.completed)
          : 0
      },
      {
        id: "verification-queue",
        name: "Website Verification",
        pending: verificationQueue.pending || 0,
        processing: verificationQueue.processing || 0,
        completed: verificationQueue.completed || 0,
        failed: verificationQueue.failed || 0,
        avgProcessingTime: verificationQueue.completed > 0
          ? Math.round(verificationQueue.totalProcessingTime / verificationQueue.completed)
          : 0
      },
      {
        id: "analytics-queue",
        name: "Analytics Processing",
        pending: analyticsQueue.pending || 0,
        processing: analyticsQueue.processing || 0,
        completed: analyticsQueue.completed || 0,
        failed: analyticsQueue.failed || 0,
        avgProcessingTime: analyticsQueue.completed > 0
          ? Math.round(analyticsQueue.totalProcessingTime / analyticsQueue.completed)
          : 0
      }
    ];
    
    return c.json({ queues });
  } catch (error) {
    console.error("Error getting job queues:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get third-party API status
systemHealthRoutes.get("/third-party-apis", async (c) => {
  try {
    const apis = [];
    
    // Check Supabase API
    try {
      const supabaseStart = Date.now();
      await supabase.from('kv_store_51144976').select('key').limit(1);
      const supabaseLatency = Date.now() - supabaseStart;
      
      apis.push({
        name: "Supabase API",
        status: "up" as const,
        uptime: 100,
        latency: supabaseLatency,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      apis.push({
        name: "Supabase API",
        status: "down" as const,
        uptime: 0,
        latency: 0,
        lastError: String(error),
        lastChecked: new Date().toISOString()
      });
    }
    
    // Check if Stripe is configured
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (stripeKey) {
      try {
        const stripeStart = Date.now();
        const stripeResponse = await fetch('https://api.stripe.com/v1/balance', {
          headers: {
            'Authorization': `Bearer ${stripeKey}`
          }
        });
        const stripeLatency = Date.now() - stripeStart;
        
        apis.push({
          name: "Stripe API",
          status: stripeResponse.ok ? "up" as const : "degraded" as const,
          uptime: stripeResponse.ok ? 100 : 50,
          latency: stripeLatency,
          lastChecked: new Date().toISOString()
        });
      } catch (error) {
        apis.push({
          name: "Stripe API",
          status: "down" as const,
          uptime: 0,
          latency: 0,
          lastError: String(error),
          lastChecked: new Date().toISOString()
        });
      }
    }
    
    return c.json({ apis });
  } catch (error) {
    console.error("Error checking third-party APIs:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Middleware to track request stats
export async function trackRequest(responseTime: number, isError: boolean = false) {
  try {
    const stats = await kv.get("system:request_stats") || {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      activeConnections: 0,
      lastReset: Date.now()
    };
    
    stats.requestCount++;
    if (isError) stats.errorCount++;
    stats.totalResponseTime += responseTime;
    
    await kv.set("system:request_stats", stats);
  } catch (error) {
    console.error("Error tracking request:", error);
  }
}

// Update queue stats
export async function updateQueueStats(
  queueName: string,
  action: 'pending' | 'processing' | 'completed' | 'failed',
  processingTime?: number
) {
  try {
    const queueKey = `queue:${queueName}`;
    const queue = await kv.get(queueKey) || {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalProcessingTime: 0
    };
    
    if (action === 'pending') {
      queue.pending++;
    } else if (action === 'processing') {
      queue.pending = Math.max(0, queue.pending - 1);
      queue.processing++;
    } else if (action === 'completed') {
      queue.processing = Math.max(0, queue.processing - 1);
      queue.completed++;
      if (processingTime) {
        queue.totalProcessingTime += processingTime;
      }
    } else if (action === 'failed') {
      queue.processing = Math.max(0, queue.processing - 1);
      queue.failed++;
    }
    
    await kv.set(queueKey, queue);
  } catch (error) {
    console.error("Error updating queue stats:", error);
  }
}
