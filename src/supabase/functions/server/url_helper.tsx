/**
 * Sanitizes a URL by removing any protocol prefix and normalizing it
 * Handles common typos like ps://, htps://, htp://, etc.
 * 
 * @param url - The URL string to sanitize
 * @returns The sanitized URL with https:// protocol
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";
  
  let sanitized = url.trim();
  
  // Remove ANY protocol prefix using a more robust pattern
  // This handles: https://, http://, ps://, htps://, htp://, ftp://, etc.
  // Match any sequence of letters followed by :// or :/ or :\
  sanitized = sanitized.replace(/^[a-zA-Z]+:[\/\\]+/g, '');
  
  // Remove leading slashes and backslashes
  sanitized = sanitized.replace(/^[\/\\]+/, '');
  
  // Remove www. prefix if present
  sanitized = sanitized.replace(/^www\./i, '');
  
  // Remove any remaining weird characters at the start
  sanitized = sanitized.replace(/^[:\\/]+/, '');
  
  // Add https protocol
  sanitized = "https://" + sanitized;
  
  return sanitized;
}
