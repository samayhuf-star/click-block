/**
 * Validation utilities for production-ready input validation
 */

export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  // Trim whitespace
  const trimmed = url.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  // Add protocol if missing
  let urlToValidate = trimmed;
  if (!trimmed.match(/^https?:\/\//i)) {
    urlToValidate = `https://${trimmed}`;
  }

  try {
    const urlObj = new URL(urlToValidate);
    
    // Validate protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' };
    }

    // Validate hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { valid: false, error: 'Invalid hostname' };
    }

    // Basic hostname validation (no spaces, valid characters)
    if (!/^[a-zA-Z0-9.-]+$/.test(urlObj.hostname)) {
      return { valid: false, error: 'Invalid characters in hostname' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email cannot be empty' };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check length
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

export function validateIPAddress(ip: string): { valid: boolean; error?: string } {
  if (!ip || typeof ip !== 'string') {
    return { valid: false, error: 'IP address is required' };
  }

  const trimmed = ip.trim();
  
  // IPv4 regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  
  // CIDR notation regex
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  
  // Wildcard regex (e.g., 192.168.1.*)
  const wildcardRegex = /^(\d{1,3}\.){3}\*$/;
  
  if (ipv4Regex.test(trimmed)) {
    // Validate each octet is 0-255
    const parts = trimmed.split('.');
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) {
        return { valid: false, error: 'Invalid IP address range' };
      }
    }
    return { valid: true };
  }
  
  if (cidrRegex.test(trimmed)) {
    const [ipPart, cidrPart] = trimmed.split('/');
    const cidr = parseInt(cidrPart, 10);
    if (cidr < 0 || cidr > 32) {
      return { valid: false, error: 'Invalid CIDR notation' };
    }
    return validateIPAddress(ipPart);
  }
  
  if (wildcardRegex.test(trimmed)) {
    return { valid: true };
  }
  
  return { valid: false, error: 'Invalid IP address format' };
}

export function sanitizeString(input: string, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Remove null bytes and control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

export function sanitizeURL(url: string): string {
  const validation = validateURL(url);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid URL');
  }
  
  let sanitized = url.trim();
  
  // Add protocol if missing
  if (!sanitized.match(/^https?:\/\//i)) {
    sanitized = `https://${sanitized}`;
  }
  
  // Remove trailing slashes (except for root)
  sanitized = sanitized.replace(/\/+$/, '') || sanitized;
  
  return sanitized;
}

export function validateWebsiteName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Website name is required' };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Website name cannot be empty' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Website name is too long (max 100 characters)' };
  }

  // Check for dangerous characters
  if (/[<>\"'&]/.test(trimmed)) {
    return { valid: false, error: 'Website name contains invalid characters' };
  }

  return { valid: true };
}

