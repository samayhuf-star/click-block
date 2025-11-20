import { websitesAPI, trackingAPI } from './api';

// Generate demo data for testing
export async function generateDemoWebsites() {
  try {
    const demoWebsites = [
      { name: "My E-commerce Store", url: "https://mystore.com" },
      { name: "Marketing Landing Page", url: "https://landing.example.com" }
    ];

    for (const site of demoWebsites) {
      try {
        await websitesAPI.create(site.name, site.url);
      } catch (error) {
        console.log("Website might already exist:", site.name);
      }
    }

    console.log("Demo websites created successfully");
  } catch (error) {
    console.error("Error generating demo websites:", error);
  }
}

// Simulate click tracking for demo purposes
export async function simulateClicks(snippetId: string, count: number = 10) {
  try {
    for (let i = 0; i < count; i++) {
      const isBot = Math.random() < 0.15; // 15% fraud rate
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      await trackingAPI.trackClick(
        snippetId,
        ip,
        isBot ? 'Bot/1.0' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'https://google.com',
      );
      
      // Small delay between clicks
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Simulated ${count} clicks for snippet ${snippetId}`);
  } catch (error) {
    console.error("Error simulating clicks:", error);
  }
}
