import * as kv from "./kv_store.tsx";
import { sanitizeUrl } from "./url_helper.tsx";

export async function addWebsite(name: string, url: string) {
  // Sanitize URL using helper function
  const sanitizedUrl = sanitizeUrl(url);

  // Basic URL validation
  try {
    new URL(sanitizedUrl);
  } catch (error) {
    throw new Error("Invalid URL format. Please enter a valid website URL.");
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

  return website;
}
