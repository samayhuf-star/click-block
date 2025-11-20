// Utility script to create super admin
// This will be called once to create the admin account

import { projectId, publicAnonKey } from './supabase/info';

export async function createSuperAdmin() {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-51144976/create-super-admin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Super Admin Created Successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', data.email);
      console.log('🔑 Password:', data.password);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  Please save these credentials securely!');
      return data;
    } else {
      console.error('❌ Error creating admin:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    return null;
  }
}

// Auto-run when imported
createSuperAdmin();
