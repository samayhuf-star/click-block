import { describe, it, expect, vi } from 'vitest';
import {
  exportEnhancedRefundRequestToExcel,
  generateEnhancedInvalidClickData,
  generateEnhancedRefundRequest,
  type EnhancedRefundRequestData,
} from '../excelExport';

describe('Excel Export Utility', () => {
  describe('generateEnhancedInvalidClickData', () => {
    it('should generate correct number of click data entries', () => {
      const data = generateEnhancedInvalidClickData(10);
      expect(data).toHaveLength(10);
    });

    it('should generate data with all required fields', () => {
      const data = generateEnhancedInvalidClickData(1);
      const click = data[0];
      
      expect(click).toHaveProperty('timestamp');
      expect(click).toHaveProperty('ip');
      expect(click).toHaveProperty('clickCost');
      expect(click).toHaveProperty('fraudType');
      expect(click).toHaveProperty('userAgent');
      expect(click).toHaveProperty('location');
      expect(click).toHaveProperty('asn');
      expect(click).toHaveProperty('isp');
      expect(click).toHaveProperty('ipType');
      expect(click).toHaveProperty('vpnScore');
      expect(click).toHaveProperty('deviceFingerprint');
      expect(click).toHaveProperty('webdriverDetected');
      expect(click).toHaveProperty('timeOnSite');
      expect(click).toHaveProperty('mouseMovement');
    });

    it('should generate valid IP addresses', () => {
      const data = generateEnhancedInvalidClickData(5);
      data.forEach(click => {
        const ipParts = click.ip.split('.');
        expect(ipParts).toHaveLength(4);
        ipParts.forEach(part => {
          const num = parseInt(part);
          expect(num).toBeGreaterThanOrEqual(0);
          expect(num).toBeLessThanOrEqual(255);
        });
      });
    });

    it('should generate valid click costs', () => {
      const data = generateEnhancedInvalidClickData(10);
      data.forEach(click => {
        expect(click.clickCost).toBeGreaterThan(0);
        expect(click.clickCost).toBeLessThan(10);
      });
    });
  });

  describe('generateEnhancedRefundRequest', () => {
    it('should generate complete refund request data', () => {
      const request = generateEnhancedRefundRequest(
        'REQ-123',
        'Test Campaign',
        { start: '2024-01-01', end: '2024-01-31' },
        50
      );

      expect(request.requestId).toBe('REQ-123');
      expect(request.campaign).toBe('Test Campaign');
      expect(request.invalidClicks).toBe(50);
      expect(request.detailedData).toHaveLength(50);
      expect(request.estimatedAmount).toBeGreaterThan(0);
      expect(request.fraudConfidence).toBeGreaterThanOrEqual(0);
      expect(request.fraudConfidence).toBeLessThanOrEqual(100);
    });

    it('should calculate correct estimated amount', () => {
      const request = generateEnhancedRefundRequest(
        'REQ-123',
        'Test Campaign',
        { start: '2024-01-01', end: '2024-01-31' },
        10
      );

      const calculatedAmount = request.detailedData.reduce(
        (sum, click) => sum + click.clickCost,
        0
      );
      expect(request.estimatedAmount).toBeCloseTo(calculatedAmount, 2);
    });

    it('should have zero revenue for fraud clicks', () => {
      const request = generateEnhancedRefundRequest(
        'REQ-123',
        'Test Campaign',
        { start: '2024-01-01', end: '2024-01-31' },
        20
      );

      expect(request.totalRevenue).toBe(0);
      expect(request.netLoss).toBe(request.estimatedAmount);
      expect(request.fraudConversionRate).toBe(0);
    });
  });

  describe('exportEnhancedRefundRequestToExcel', () => {
    beforeEach(() => {
      // Mock document.createElement and URL.createObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();
      
      const mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        style: {},
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
    });

    it('should create download link for CSV export', () => {
      const request: EnhancedRefundRequestData = generateEnhancedRefundRequest(
        'REQ-TEST',
        'Test Campaign',
        { start: '2024-01-01', end: '2024-01-31' },
        5
      );

      exportEnhancedRefundRequestToExcel(request);

      expect(document.createElement).toHaveBeenCalledWith('a');
      const linkElement = (document.createElement as any).mock.results[0].value;
      expect(linkElement.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('REQ-TEST'));
      expect(linkElement.click).toHaveBeenCalled();
    });

    it('should generate CSV with all required sections', () => {
      const request: EnhancedRefundRequestData = generateEnhancedRefundRequest(
        'REQ-TEST',
        'Test Campaign',
        { start: '2024-01-01', end: '2024-01-31' },
        3
      );

      // Mock Blob constructor to capture CSV content
      let capturedContent = '';
      global.Blob = class MockBlob {
        constructor(parts: any[]) {
          capturedContent = parts[0];
        }
      } as any;

      exportEnhancedRefundRequestToExcel(request);

      expect(capturedContent).toContain('EXECUTIVE SUMMARY');
      expect(capturedContent).toContain('DETAILED CLICK DATA');
      expect(capturedContent).toContain('NETWORK INTELLIGENCE');
      expect(capturedContent).toContain('BEHAVIORAL ANALYSIS');
      expect(capturedContent).toContain('PATTERN ANALYSIS');
      expect(capturedContent).toContain('GOOGLE ADS SUBMISSION INSTRUCTIONS');
    });
  });
});

