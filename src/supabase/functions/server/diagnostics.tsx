import * as kv from "./kv_store.tsx";
import { sanitizeUrl } from "./url_helper.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

export interface DiagnosticResult {
  category: string;
  status: "pass" | "warning" | "error";
  message: string;
  details?: any;
}

/**
 * Comprehensive diagnostic check for the entire system
 */
export async function runDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // 1. Check Supabase Connection
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string
    );
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      results.push({
        category: "Supabase Auth",
        status: "warning",
        message: "Auth client created but session check returned error",
        details: { error: error.message }
      });
    } else {
      results.push({
        category: "Supabase Auth",
        status: "pass",
        message: "Supabase Auth client initialized successfully"
      });
    }
  } catch (error) {
    results.push({
      category: "Supabase Auth",
      status: "error",
      message: "Failed to initialize Supabase client",
      details: { error: error.message }
    });
  }

  // 2. Check KV Store Connectivity
  try {
    const testKey = "diagnostic:test";
    const testValue = { timestamp: Date.now(), test: true };
    
    await kv.set(testKey, testValue);
    const retrieved = await kv.get(testKey);
    await kv.del(testKey);
    
    if (retrieved && retrieved.test === true) {
      results.push({
        category: "KV Store",
        status: "pass",
        message: "KV Store read/write operations working correctly"
      });
    } else {
      results.push({
        category: "KV Store",
        status: "error",
        message: "KV Store data retrieval failed",
        details: { expected: testValue, received: retrieved }
      });
    }
  } catch (error) {
    results.push({
      category: "KV Store",
      status: "error",
      message: "KV Store connection failed",
      details: { error: error.message }
    });
  }

  // 3. Check Website URLs for malformed data
  try {
    const websites = await kv.getByPrefix("website:");
    const malformedUrls: any[] = [];
    const validUrls: any[] = [];
    
    for (const website of websites) {
      const url = website.url || "";
      
      // Check for common malformations
      const hasProtocolError = url.includes("ps://") || 
                              url.includes("htps://") || 
                              url.includes("htp://") ||
                              url.includes("://://");
      
      const hasValidProtocol = url.startsWith("http://") || url.startsWith("https://");
      
      if (hasProtocolError || !hasValidProtocol) {
        malformedUrls.push({
          id: website.id,
          name: website.name,
          url: url,
          issue: hasProtocolError ? "malformed protocol" : "missing protocol",
          suggestedFix: sanitizeUrl(url)
        });
      } else {
        // Additional validation - can it be parsed as URL?
        try {
          new URL(url);
          validUrls.push({ id: website.id, name: website.name, url });
        } catch {
          malformedUrls.push({
            id: website.id,
            name: website.name,
            url: url,
            issue: "invalid URL format",
            suggestedFix: sanitizeUrl(url)
          });
        }
      }
    }
    
    if (malformedUrls.length === 0) {
      results.push({
        category: "Website URLs",
        status: "pass",
        message: `All ${websites.length} website URLs are properly formatted`,
        details: { total: websites.length, valid: validUrls.length }
      });
    } else {
      results.push({
        category: "Website URLs",
        status: "warning",
        message: `Found ${malformedUrls.length} malformed URLs out of ${websites.length} total`,
        details: { 
          malformed: malformedUrls,
          valid: validUrls.length,
          total: websites.length
        }
      });
    }
  } catch (error) {
    results.push({
      category: "Website URLs",
      status: "error",
      message: "Failed to check website URLs",
      details: { error: error.message }
    });
  }

  // 4. Check Analytics Data Integrity
  try {
    const websites = await kv.getByPrefix("website:");
    const analyticsData = await kv.getByPrefix("analytics:");
    
    const websitesWithoutAnalytics: string[] = [];
    
    for (const website of websites) {
      const analyticsKey = `analytics:${website.id}`;
      const hasAnalytics = analyticsData.some((a: any) => a.id === analyticsKey);
      
      if (!hasAnalytics) {
        websitesWithoutAnalytics.push(website.name || website.id);
      }
    }
    
    if (websitesWithoutAnalytics.length === 0) {
      results.push({
        category: "Analytics Data",
        status: "pass",
        message: `All ${websites.length} websites have analytics data initialized`,
        details: { websites: websites.length, analytics: analyticsData.length }
      });
    } else {
      results.push({
        category: "Analytics Data",
        status: "warning",
        message: `${websitesWithoutAnalytics.length} websites missing analytics data`,
        details: { 
          missing: websitesWithoutAnalytics,
          total: websites.length
        }
      });
    }
  } catch (error) {
    results.push({
      category: "Analytics Data",
      status: "error",
      message: "Failed to check analytics data integrity",
      details: { error: error.message }
    });
  }

  // 5. Check System Stats
  try {
    const stats = await kv.get("system:request_stats");
    
    if (stats) {
      const errorRate = stats.requestCount > 0 
        ? ((stats.errorCount / stats.requestCount) * 100).toFixed(2)
        : "0";
      
      const avgResponseTime = stats.requestCount > 0
        ? (stats.totalResponseTime / stats.requestCount).toFixed(2)
        : "0";
      
      const status = parseFloat(errorRate) > 10 ? "warning" : "pass";
      
      results.push({
        category: "System Stats",
        status,
        message: `Request tracking active - ${errorRate}% error rate`,
        details: {
          totalRequests: stats.requestCount,
          errors: stats.errorCount,
          errorRate: `${errorRate}%`,
          avgResponseTime: `${avgResponseTime}ms`,
          lastReset: new Date(stats.lastReset).toISOString()
        }
      });
    } else {
      results.push({
        category: "System Stats",
        status: "warning",
        message: "System stats not initialized",
        details: { note: "This is normal for a new installation" }
      });
    }
  } catch (error) {
    results.push({
      category: "System Stats",
      status: "error",
      message: "Failed to retrieve system stats",
      details: { error: error.message }
    });
  }

  // 6. Check Environment Variables
  const requiredEnvVars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY"
  ];
  
  const missingEnvVars: string[] = [];
  const presentEnvVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (Deno.env.get(envVar)) {
      presentEnvVars.push(envVar);
    } else {
      missingEnvVars.push(envVar);
    }
  }
  
  if (missingEnvVars.length === 0) {
    results.push({
      category: "Environment Variables",
      status: "pass",
      message: `All ${requiredEnvVars.length} required environment variables are set`,
      details: { present: presentEnvVars }
    });
  } else {
    results.push({
      category: "Environment Variables",
      status: "error",
      message: `Missing ${missingEnvVars.length} required environment variables`,
      details: { missing: missingEnvVars, present: presentEnvVars }
    });
  }

  // 7. Check User Accounts
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );
    
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      results.push({
        category: "User Accounts",
        status: "error",
        message: "Failed to retrieve user accounts",
        details: { error: error.message }
      });
    } else {
      const totalUsers = data.users.length;
      const superAdmins = data.users.filter((u: any) => 
        u.user_metadata?.role === "super_admin"
      ).length;
      
      results.push({
        category: "User Accounts",
        status: "pass",
        message: `${totalUsers} user accounts found (${superAdmins} super admins)`,
        details: { 
          total: totalUsers,
          superAdmins,
          regularUsers: totalUsers - superAdmins
        }
      });
    }
  } catch (error) {
    results.push({
      category: "User Accounts",
      status: "error",
      message: "Failed to check user accounts",
      details: { error: error.message }
    });
  }

  // 8. Check Verification Queue
  try {
    const verifyQueue = await kv.get("queue:verification");
    
    if (verifyQueue) {
      const totalProcessed = verifyQueue.completed + verifyQueue.failed;
      const successRate = totalProcessed > 0 
        ? ((verifyQueue.completed / totalProcessed) * 100).toFixed(2)
        : "100";
      
      const avgProcessingTime = verifyQueue.completed > 0
        ? (verifyQueue.totalProcessingTime / verifyQueue.completed).toFixed(2)
        : "0";
      
      results.push({
        category: "Verification Queue",
        status: "pass",
        message: `Verification queue active - ${successRate}% success rate`,
        details: {
          pending: verifyQueue.pending,
          processing: verifyQueue.processing,
          completed: verifyQueue.completed,
          failed: verifyQueue.failed,
          successRate: `${successRate}%`,
          avgProcessingTime: `${avgProcessingTime}ms`
        }
      });
    } else {
      results.push({
        category: "Verification Queue",
        status: "warning",
        message: "Verification queue not initialized",
        details: { note: "Will be created on first verification" }
      });
    }
  } catch (error) {
    results.push({
      category: "Verification Queue",
      status: "error",
      message: "Failed to check verification queue",
      details: { error: error.message }
    });
  }

  // Summary
  const passCount = results.filter(r => r.status === "pass").length;
  const warningCount = results.filter(r => r.status === "warning").length;
  const errorCount = results.filter(r => r.status === "error").length;
  
  return [
    {
      category: "Overall Summary",
      status: errorCount > 0 ? "error" : warningCount > 0 ? "warning" : "pass",
      message: `${passCount} passed, ${warningCount} warnings, ${errorCount} errors`,
      details: { 
        passed: passCount,
        warnings: warningCount,
        errors: errorCount,
        total: results.length,
        timestamp: new Date().toISOString()
      }
    },
    ...results
  ];
}
