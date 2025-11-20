import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CheckCircle, Copy, Shield } from 'lucide-react';

export function AdminCreator() {
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const createAdmin = async () => {
    setLoading(true);
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
        setAdminData(data);
      } else {
        console.error('Error creating admin:', data);
        alert(data.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Failed to create super admin:', error);
      alert('Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (adminData) {
      const text = `Email: ${adminData.email}\nPassword: ${adminData.password}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
      <Card className="max-w-md w-full p-8 bg-slate-800 border-slate-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl mb-2 text-white">Create Super Admin</h1>
          <p className="text-slate-400">
            Click the button below to create a super admin account for ClickBlock
          </p>
        </div>

        {!adminData ? (
          <Button 
            onClick={createAdmin} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {loading ? 'Creating Admin...' : 'Create Super Admin'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Admin Created Successfully!</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Email:</label>
                  <div className="bg-slate-950 border border-slate-700 rounded px-3 py-2 mt-1 font-mono text-sm text-white">
                    {adminData.email}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Password:</label>
                  <div className="bg-slate-950 border border-slate-700 rounded px-3 py-2 mt-1 font-mono text-sm text-white">
                    {adminData.password}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={copyCredentials}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Credentials'}
            </Button>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-200">
                ⚠️ <strong>Important:</strong> Save these credentials securely. 
                You will need them to access the admin dashboard.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
