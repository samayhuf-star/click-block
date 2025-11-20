import * as kv from "./kv_store.tsx";
import { sanitizeUrl } from "./url_helper.tsx";

/**
 * Fixes all domains in the database that have malformed URLs (ps://, htps://, etc.)
 */
export async function fixAllDomains() {
  console.log("Starting domain fix process...");
  
  const websites = await kv.getByPrefix("website:");
  let fixedCount = 0;
  let alreadyGoodCount = 0;
  
  for (const website of websites) {
    const originalUrl = website.url;
    
    // Check if URL has malformed protocol
    if (originalUrl.includes("ps://") || !originalUrl.startsWith("https://")) {
      // Sanitize the URL
      const fixedUrl = sanitizeUrl(originalUrl);
      
      // Update the website
      website.url = fixedUrl;
      await kv.set(website.id, website);
      
      console.log(`Fixed: ${originalUrl} -> ${fixedUrl}`);
      fixedCount++;
    } else {
      alreadyGoodCount++;
    }
  }
  
  console.log(`Domain fix complete. Fixed: ${fixedCount}, Already correct: ${alreadyGoodCount}`);
  
  return {
    fixed: fixedCount,
    alreadyCorrect: alreadyGoodCount,
    total: websites.length
  };
}
