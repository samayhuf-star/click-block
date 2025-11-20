import { describe, it, expect } from 'vitest';
import {
  PLANS,
  canAccessFeature,
  hasReachedLimit,
  getRemainingQuota,
  formatLimit,
  getUpgradeRecommendation,
  type UserPlan,
} from '../plans';

describe('Plans Utility Functions', () => {
  describe('PLANS', () => {
    it('should have all plan tiers defined', () => {
      expect(PLANS.trial).toBeDefined();
      expect(PLANS.starter).toBeDefined();
      expect(PLANS.professional).toBeDefined();
      expect(PLANS.enterprise).toBeDefined();
      expect(PLANS.ultimate).toBeDefined();
      expect(PLANS['lifetime-pro']).toBeDefined();
      expect(PLANS['lifetime-elite']).toBeDefined();
      expect(PLANS.reseller).toBeDefined();
      expect(PLANS.whitelabel).toBeDefined();
    });

    it('should have correct trial plan configuration', () => {
      const trial = PLANS.trial;
      expect(trial.price).toBe(1);
      expect(trial.trialDays).toBe(7);
      expect(trial.features.websites).toBe(3);
      expect(trial.features.clicksPerMonth).toBe(10000);
    });

    it('should have unlimited features for ultimate plan', () => {
      const ultimate = PLANS.ultimate;
      expect(ultimate.features.websites).toBe(-1);
      expect(ultimate.features.clicksPerMonth).toBe(-1);
      expect(ultimate.features.dataRetentionDays).toBe(-1);
    });
  });

  describe('canAccessFeature', () => {
    const mockUserPlan: UserPlan = {
      userId: 'test-user',
      planId: 'starter',
      status: 'active',
      startDate: new Date().toISOString(),
      autoRenew: true,
      websitesUsed: 1,
      clicksThisMonth: 5000,
    };

    it('should return true for features available in plan', () => {
      expect(canAccessFeature(mockUserPlan, 'realTimeDetection')).toBe(true);
      expect(canAccessFeature(mockUserPlan, 'vpnDetection')).toBe(true);
    });

    it('should return false for features not available in plan', () => {
      expect(canAccessFeature(mockUserPlan, 'advancedAnalytics')).toBe(false);
      expect(canAccessFeature(mockUserPlan, 'whiteLabel')).toBe(false);
    });
  });

  describe('hasReachedLimit', () => {
    it('should return true when website limit reached', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 3,
        clicksThisMonth: 5000,
      };
      expect(hasReachedLimit(userPlan, 'websites')).toBe(true);
    });

    it('should return false when under limit', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 2,
        clicksThisMonth: 5000,
      };
      expect(hasReachedLimit(userPlan, 'websites')).toBe(false);
    });

    it('should return false for unlimited plans', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'ultimate',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 100,
        clicksThisMonth: 1000000,
      };
      expect(hasReachedLimit(userPlan, 'websites')).toBe(false);
      expect(hasReachedLimit(userPlan, 'clicks')).toBe(false);
    });
  });

  describe('getRemainingQuota', () => {
    it('should return correct remaining websites', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 1,
        clicksThisMonth: 5000,
      };
      expect(getRemainingQuota(userPlan, 'websites')).toBe(2);
    });

    it('should return unlimited for ultimate plan', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'ultimate',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 100,
        clicksThisMonth: 1000000,
      };
      expect(getRemainingQuota(userPlan, 'websites')).toBe('unlimited');
      expect(getRemainingQuota(userPlan, 'clicks')).toBe('unlimited');
    });

    it('should return 0 when limit exceeded', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 5,
        clicksThisMonth: 5000,
      };
      expect(getRemainingQuota(userPlan, 'websites')).toBe(0);
    });
  });

  describe('formatLimit', () => {
    it('should format large numbers correctly', () => {
      expect(formatLimit(1000000)).toBe('1.0M');
      expect(formatLimit(50000)).toBe('50K');
      expect(formatLimit(100)).toBe('100');
    });

    it('should return "Unlimited" for -1', () => {
      expect(formatLimit(-1)).toBe('Unlimited');
    });
  });

  describe('getUpgradeRecommendation', () => {
    it('should recommend starter for trial users', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'trial',
        status: 'trial',
        startDate: new Date().toISOString(),
        autoRenew: false,
        websitesUsed: 1,
        clicksThisMonth: 1000,
      };
      expect(getUpgradeRecommendation(userPlan)).toBe('starter');
    });

    it('should recommend professional when starter limits reached', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 3,
        clicksThisMonth: 9000,
      };
      expect(getUpgradeRecommendation(userPlan)).toBe('professional');
    });

    it('should return null when no upgrade needed', () => {
      const userPlan: UserPlan = {
        userId: 'test',
        planId: 'starter',
        status: 'active',
        startDate: new Date().toISOString(),
        autoRenew: true,
        websitesUsed: 1,
        clicksThisMonth: 1000,
      };
      expect(getUpgradeRecommendation(userPlan)).toBeNull();
    });
  });
});

