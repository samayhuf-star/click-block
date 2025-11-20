import { toast } from "sonner@2.0.3";

/**
 * Centralized notification system for the ClickBlock platform
 * Provides consistent, user-friendly notifications with proper error handling
 */

export const notifications = {
  // Success notifications
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  // Error notifications
  error: (message: string, error?: unknown, description?: string) => {
    const errorMessage = description || (error instanceof Error ? error.message : 'An unexpected error occurred');
    
    console.error(`❌ ${message}:`, error);
    
    toast.error(message, {
      description: errorMessage,
      duration: 6000,
    });
  },

  // Warning notifications
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  // Info notifications
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  // Loading notifications (returns id to dismiss later)
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },

  // Dismiss a specific notification
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  // Promise-based notification (auto-handles success/error)
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  // Custom notification with action button
  action: (message: string, action: { label: string; onClick: () => void }, description?: string) => {
    toast(message, {
      description,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
      duration: 6000,
    });
  },

  // Specific use-case notifications
  websiteAdded: (websiteName: string) => {
    toast.success('Website added successfully!', {
      description: `${websiteName} is now protected. Install the tracking snippet to activate.`,
      duration: 5000,
    });
  },

  websiteDeleted: (websiteName: string) => {
    toast.success('Website removed', {
      description: `${websiteName} has been deleted from your account.`,
      duration: 4000,
    });
  },

  bulkWebsitesAdded: (count: number, failed: number = 0) => {
    if (failed === 0) {
      toast.success(`Successfully added ${count} websites!`, {
        description: 'Install tracking snippets to activate protection.',
        duration: 5000,
      });
    } else {
      toast.warning(`Added ${count - failed} of ${count} websites`, {
        description: `${failed} website(s) failed to add. Check console for details.`,
        duration: 6000,
      });
    }
  },

  ipAdded: (ip: string, listType: 'whitelist' | 'blacklist') => {
    toast.success(`IP added to ${listType}`, {
      description: `${ip} is now ${listType === 'whitelist' ? 'allowed' : 'blocked'}.`,
      duration: 4000,
    });
  },

  ipDeleted: (ip: string) => {
    toast.success('IP removed', {
      description: `${ip} has been removed from the list.`,
      duration: 4000,
    });
  },

  bulkIpsImported: (count: number, listType: 'whitelist' | 'blacklist') => {
    toast.success(`Imported ${count} IPs`, {
      description: `${count} IP(s) added to ${listType}.`,
      duration: 4000,
    });
  },

  exportSuccess: (type: string) => {
    toast.success('Export successful', {
      description: `${type} has been exported to your downloads.`,
      duration: 4000,
    });
  },

  settingsSaved: () => {
    toast.success('Settings saved', {
      description: 'Your changes have been applied successfully.',
      duration: 3000,
    });
  },

  subscriptionUpdated: () => {
    toast.success('Subscription updated', {
      description: 'Your subscription changes have been processed.',
      duration: 4000,
    });
  },

  paymentSuccess: (amount: string) => {
    toast.success('Payment successful!', {
      description: `Your payment of ${amount} has been processed.`,
      duration: 5000,
    });
  },

  paymentFailed: (reason?: string) => {
    toast.error('Payment failed', {
      description: reason || 'Please check your payment method and try again.',
      duration: 6000,
    });
  },

  networkError: () => {
    toast.error('Network error', {
      description: 'Please check your internet connection and try again.',
      duration: 5000,
    });
  },

  unauthorized: () => {
    toast.error('Unauthorized', {
      description: 'Please log in to continue.',
      duration: 5000,
    });
  },

  validationError: (field: string, issue: string) => {
    toast.error(`Invalid ${field}`, {
      description: issue,
      duration: 4000,
    });
  },

  copiedToClipboard: (item: string = 'Content') => {
    toast.success(`${item} copied!`, {
      description: 'Copied to clipboard.',
      duration: 2000,
    });
  },

  confirmDelete: (
    itemName: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    toast(`Delete ${itemName}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: onConfirm,
      },
      cancel: {
        label: 'Cancel',
        onClick: onCancel,
      },
      duration: 10000,
    });
  },
};

/**
 * Error handler utility
 * Logs errors and shows appropriate notifications
 */
export const handleError = (
  context: string,
  error: unknown,
  userMessage?: string
) => {
  const message = userMessage || 'An error occurred';
  const errorDetails = error instanceof Error ? error.message : String(error);
  
  console.error(`🚨 Error in ${context}:`, {
    error,
    message: errorDetails,
    timestamp: new Date().toISOString(),
    context,
  });

  notifications.error(message, error, errorDetails);
};

/**
 * Validation helper
 */
export const validateAndNotify = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifications.validationError('email', 'Please enter a valid email address.');
      return false;
    }
    return true;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      notifications.validationError('URL', 'Please enter a valid URL (e.g., https://example.com).');
      return false;
    }
  },

  ip: (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      notifications.validationError('IP address', 'Please enter a valid IP address (e.g., 192.168.1.1).');
      return false;
    }
    
    // Validate each octet is 0-255
    const octets = ip.split('.');
    const validOctets = octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
    
    if (!validOctets) {
      notifications.validationError('IP address', 'Each number must be between 0 and 255.');
      return false;
    }
    
    return true;
  },

  required: (value: string | null | undefined, fieldName: string): boolean => {
    if (!value || value.trim() === '') {
      notifications.validationError(fieldName, `${fieldName} is required.`);
      return false;
    }
    return true;
  },

  minLength: (value: string, minLength: number, fieldName: string): boolean => {
    if (value.length < minLength) {
      notifications.validationError(
        fieldName, 
        `${fieldName} must be at least ${minLength} characters.`
      );
      return false;
    }
    return true;
  },

  maxLength: (value: string, maxLength: number, fieldName: string): boolean => {
    if (value.length > maxLength) {
      notifications.validationError(
        fieldName,
        `${fieldName} must be no more than ${maxLength} characters.`
      );
      return false;
    }
    return true;
  },
};
