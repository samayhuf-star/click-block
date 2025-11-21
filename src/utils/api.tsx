import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-51144976`;

// Get headers with user token if available
const getHeaders = (requireAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    'apikey': publicAnonKey  // Supabase also requires this header
  };
  
  // Only use user token if specifically required
  if (requireAuth) {
    const userSession = localStorage.getItem('clickblock_user_session');
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        if (session.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
        }
      } catch (e) {
        console.error('Error parsing user session:', e);
        // Clear invalid session
        localStorage.removeItem('clickblock_user_session');
      }
    }
  }
  
  return headers;
};

// Validate and clean up invalid sessions
const validateSession = () => {
  try {
    const userSession = localStorage.getItem('clickblock_user_session');
    if (userSession) {
      const session = JSON.parse(userSession);
      // Check if session has required fields
      if (!session.accessToken || !session.email) {
        console.warn('Invalid session structure, clearing...');
        localStorage.removeItem('clickblock_user_session');
        return false;
      }
      // Check if session is expired (if it has an expiry)
      if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
        console.warn('Session expired, clearing...');
        localStorage.removeItem('clickblock_user_session');
        return false;
      }
      return true;
    }
  } catch (e) {
    console.error('Error validating session:', e);
    localStorage.removeItem('clickblock_user_session');
    return false;
  }
  return false;
};

// Websites API
export const websitesAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/websites`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to fetch websites');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (getAll websites):', error);
      throw error;
    }
  },
  
  create: async (name: string, url: string) => {
    try {
      const res = await fetch(`${API_BASE}/websites`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, url })
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to create website');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (create website):', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/websites/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to delete website');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (delete website):', error);
      throw error;
    }
  },
  
  verify: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/websites/${id}/verify`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || error.message || 'Failed to verify website');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (verify website):', error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/websites/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to update website status');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (update status):', error);
      throw error;
    }
  },
  
  initializeDefaultWebsites: async () => {
    try {
      const res = await fetch(`${API_BASE}/init-websites`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to initialize websites');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (initialize websites):', error);
      throw error;
    }
  },
  
  getAnalytics: async (websiteId: string) => {
    try {
      const res = await fetch(`${API_BASE}/analytics/${websiteId}`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to fetch website analytics');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (get website analytics):', error);
      throw error;
    }
  }
};

// Protection Rules API
export const protectionAPI = {
  getRules: async () => {
    const res = await fetch(`${API_BASE}/protection-rules`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch protection rules');
    return res.json();
  },
  
  updateRules: async (rules: any) => {
    const res = await fetch(`${API_BASE}/protection-rules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(rules)
    });
    if (!res.ok) throw new Error('Failed to update protection rules');
    return res.json();
  }
};

// Analytics API
export const analyticsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`, { headers: getHeaders() });
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        console.error('Analytics API error:', errorText);
        // Return empty data instead of throwing to prevent UI from breaking
        return { analytics: [] };
      }
      const data = await res.json();
      // Ensure analytics is always an array
      return {
        analytics: Array.isArray(data.analytics) ? data.analytics : (data.analytics ? [data.analytics] : [])
      };
    } catch (error) {
      console.error('API Error (get analytics):', error);
      // Return empty data instead of throwing to prevent UI from breaking
      return { analytics: [] };
    }
  },
  
  getForWebsite: async (websiteId: string) => {
    try {
      const res = await fetch(`${API_BASE}/analytics/${websiteId}`, { headers: getHeaders() });
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        console.error('Website analytics API error:', errorText);
        throw new Error('Failed to fetch website analytics');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (get website analytics):', error);
      throw error;
    }
  },
  
  getOverview: async () => {
    try {
      console.log('Fetching overview from:', `${API_BASE}/overview`);
      const res = await fetch(`${API_BASE}/overview`, { headers: getHeaders() });
      console.log('Overview response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        console.error('Overview API error response:', errorText);
        // Return default data instead of throwing to prevent UI from breaking
        return {
          totalClicks: 0,
          fraudulentClicks: 0,
          blockedIPs: 0,
          savingsEstimate: 0,
          activeWebsites: 0,
          totalWebsites: 0
        };
      }
      
      const data = await res.json();
      console.log('Overview data received:', data);
      
      // Ensure we return data in the expected format
      if (data.error) {
        return {
          totalClicks: 0,
          fraudulentClicks: 0,
          blockedIPs: 0,
          savingsEstimate: 0,
          activeWebsites: 0,
          totalWebsites: 0
        };
      }
      
      return data;
    } catch (error) {
      console.error('API Error (get overview):', error);
      // Return default data instead of throwing to prevent UI from breaking
      return {
        totalClicks: 0,
        fraudulentClicks: 0,
        blockedIPs: 0,
        savingsEstimate: 0,
        activeWebsites: 0,
        totalWebsites: 0
      };
    }
  }
};

// Click Tracking API
export const trackingAPI = {
  trackClick: async (snippetId: string, ip: string, userAgent: string, referrer: string) => {
    const res = await fetch(`${API_BASE}/track-click`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        snippetId,
        ip,
        userAgent,
        referrer,
        timestamp: new Date().toISOString()
      })
    });
    if (!res.ok) throw new Error('Failed to track click');
    return res.json();
  }
};

// Alerts API
export const alertsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`, { headers: getHeaders() });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to fetch alerts');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (getAll alerts):', error);
      throw error;
    }
  },

  getRules: async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts/rules`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch alert rules');
      return res.json();
    } catch (error) {
      console.error('API Error (get alert rules):', error);
      throw error;
    }
  },

  updateRule: async (id: string, rule: any) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/rules/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(rule)
      });
      if (!res.ok) throw new Error('Failed to update alert rule');
      return res.json();
    } catch (error) {
      console.error('API Error (update alert rule):', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts/settings`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch alert settings');
      return res.json();
    } catch (error) {
      console.error('API Error (get alert settings):', error);
      throw error;
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/settings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update alert settings');
      return res.json();
    } catch (error) {
      console.error('API Error (update alert settings):', error);
      throw error;
    }
  },

  acknowledgeAlert: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/acknowledge`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to acknowledge alert');
      return res.json();
    } catch (error) {
      console.error('API Error (acknowledge alert):', error);
      throw error;
    }
  },

  clearAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to clear alerts');
      return res.json();
    } catch (error) {
      console.error('API Error (clear alerts):', error);
      throw error;
    }
  },

  createAlert: async (alertData: any) => {
    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(alertData)
      });
      if (!res.ok) throw new Error('Failed to create alert');
      return res.json();
    } catch (error) {
      console.error('API Error (create alert):', error);
      throw error;
    }
  }
};

// IP Management API
export const ipManagementAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/ip-management`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch IP lists');
      return res.json();
    } catch (error) {
      console.error('API Error (get IP lists):', error);
      throw error;
    }
  },

  addIP: async (entry: any) => {
    try {
      const res = await fetch(`${API_BASE}/ip-management`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(entry)
      });
      if (!res.ok) throw new Error('Failed to add IP');
      return res.json();
    } catch (error) {
      console.error('API Error (add IP):', error);
      throw error;
    }
  },

  deleteIP: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/ip-management/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete IP');
      return res.json();
    } catch (error) {
      console.error('API Error (delete IP):', error);
      throw error;
    }
  }
};

// Stripe Payments API
export const stripeAPI = {
  createCheckoutSession: async (planId: string, planName: string, amount: number, billingPeriod: string) => {
    try {
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ planId, planName, amount, billingPeriod })
      });
      if (!res.ok) throw new Error('Failed to create checkout session');
      return res.json();
    } catch (error) {
      console.error('API Error (create checkout session):', error);
      throw error;
    }
  }
};

// User Settings API
export const settingsAPI = {
  get: async () => {
    try {
      const res = await fetch(`${API_BASE}/user/settings`, {
        headers: getHeaders(true)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to fetch settings');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (get settings):', error);
      throw error;
    }
  },
  
  save: async (settings: any) => {
    try {
      const res = await fetch(`${API_BASE}/user/settings`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to save settings');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (save settings):', error);
      throw error;
    }
  }
};

// System Logs API
export const logsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE}/logs`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to fetch logs');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (get logs):', error);
      throw error;
    }
  },
  
  create: async (logData: {
    type: 'error' | 'warning' | 'info' | 'success';
    category: string;
    message: string;
    details?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(logData)
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to create log');
      }
      return res.json();
    } catch (error) {
      console.error('API Error (create log):', error);
      throw error;
    }
  }
};

// Reseller API
export const resellerAPI = {
  getClients: async () => {
    const res = await fetch(`${API_BASE}/reseller/clients`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },
  addClient: async (client: any) => {
    const res = await fetch(`${API_BASE}/reseller/clients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(client)
    });
    if (!res.ok) throw new Error('Failed to add client');
    return res.json();
  },
  getStats: async () => {
    const res = await fetch(`${API_BASE}/reseller/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};

// White Label API
export const whiteLabelAPI = {
  getConfig: async () => {
    const res = await fetch(`${API_BASE}/whitelabel/config`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  },
  saveConfig: async (config: any) => {
    const res = await fetch(`${API_BASE}/whitelabel/config`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to save config');
    return res.json();
  }
};

// Diagnostics API
export const diagnosticsAPI = {
  getSystemStatus: async () => {
    const res = await fetch(`${API_BASE}/system/diagnostics`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch diagnostics');
    return res.json();
  }
};