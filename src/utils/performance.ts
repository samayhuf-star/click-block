// Performance optimization utilities

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results
 */
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return,
  keyFn?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy load images
 */
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
    img.src = src;
  } else {
    // Fallback for older browsers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  
  static mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }
  
  static measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure.duration;
      } catch (e) {
        console.warn('Performance measure failed:', e);
        return null;
      }
    }
    return null;
  }
  
  static getMarkTime(name: string): number | null {
    return this.marks.get(name) || null;
  }
  
  static clearMarks(): void {
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
    }
    this.marks.clear();
  }
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

/**
 * Virtual scrolling helper
 */
export function getVisibleRange(
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number
): { start: number; end: number } {
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(
    start + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems
  );
  return { start: Math.max(0, start - 1), end };
}

