
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'stripe@17.5.0': 'stripe',
        'sonner@2.0.3': 'sonner',
        'react-hook-form@7.55.0': 'react-hook-form',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@jsr/supabase__supabase-js@2': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
  build: {
    target: 'esnext',
    outDir: 'build',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form'],
          'stripe-vendor': ['@stripe/stripe-js', 'stripe'],
          'supabase-vendor': ['@jsr/supabase__supabase-js'],
          // Feature chunks
          'dashboard': [
            './src/components/dashboard/Dashboard.tsx',
            './src/components/dashboard/DashboardOverview.tsx',
            './src/components/dashboard/WebsitesManager.tsx',
          ],
          'analytics': [
            './src/components/dashboard/Analytics.tsx',
            './src/components/dashboard/AnalyticsProduction.tsx',
            './src/components/dashboard/AdminAnalytics.tsx',
          ],
          'admin': [
            './src/components/dashboard/UsersAccounts.tsx',
            './src/components/dashboard/BillingSubscriptions.tsx',
            './src/components/dashboard/SystemHealth.tsx',
            './src/components/dashboard/UsageLimits.tsx',
          ],
        },
      },
    },
  },
    server: {
      port: 3000,
      open: true,
    },
  });