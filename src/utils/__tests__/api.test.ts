import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  websitesAPI,
  analyticsAPI,
  alertsAPI,
  ipManagementAPI,
} from '../api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock
    localStorage.clear();
  });

  describe('websitesAPI', () => {
    it('should fetch all websites successfully', async () => {
      const mockWebsites = [{ id: '1', name: 'Test Site', url: 'https://test.com' }];
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWebsites,
      });

      const result = await websitesAPI.getAll();
      expect(result).toEqual(mockWebsites);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/websites'),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should handle API errors correctly', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to fetch' }),
      });

      await expect(websitesAPI.getAll()).rejects.toThrow('Failed to fetch websites');
    });

    it('should create website successfully', async () => {
      const mockResponse = { id: '1', name: 'New Site', url: 'https://newsite.com' };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await websitesAPI.create('New Site', 'https://newsite.com');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/websites'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Site', url: 'https://newsite.com' }),
        })
      );
    });

    it('should delete website successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await websitesAPI.delete('123');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/websites/123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('analyticsAPI', () => {
    it('should fetch overview data successfully', async () => {
      const mockOverview = {
        totalClicks: 1000,
        fraudulentClicks: 50,
        blockedIPs: 10,
        savingsEstimate: 500,
        activeWebsites: 3,
        totalWebsites: 5,
      };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOverview,
      });

      const result = await analyticsAPI.getOverview();
      expect(result).toEqual(mockOverview);
    });

    it('should return default data on error', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Error occurred',
      });

      const result = await analyticsAPI.getOverview();
      expect(result).toHaveProperty('overview');
      expect(result.overview.totalClicks).toBe(0);
    });
  });

  describe('alertsAPI', () => {
    it('should fetch all alerts successfully', async () => {
      const mockAlerts = [{ id: '1', message: 'Test alert' }];
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await alertsAPI.getAll();
      expect(result).toEqual(mockAlerts);
    });

    it('should create alert successfully', async () => {
      const alertData = {
        type: 'warning',
        message: 'Test alert',
        severity: 'medium',
      };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', ...alertData }),
      });

      const result = await alertsAPI.createAlert(alertData);
      expect(result).toHaveProperty('id');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/alerts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(alertData),
        })
      );
    });
  });

  describe('ipManagementAPI', () => {
    it('should fetch IP lists successfully', async () => {
      const mockIPs = {
        whitelist: ['1.2.3.4'],
        blacklist: ['5.6.7.8'],
      };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIPs,
      });

      const result = await ipManagementAPI.getAll();
      expect(result).toEqual(mockIPs);
    });

    it('should add IP successfully', async () => {
      const ipEntry = {
        ip: '1.2.3.4',
        type: 'blacklist',
        reason: 'Fraud detected',
      };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', ...ipEntry }),
      });

      const result = await ipManagementAPI.addIP(ipEntry);
      expect(result).toHaveProperty('id');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/ip-management'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(ipEntry),
        })
      );
    });
  });
});

