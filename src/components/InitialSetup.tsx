import { useState } from "react";
import { 
  Shield, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  Database,
  Users,
  Globe,
  Play,
  Check,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
  details?: any;
}

export function InitialSetup({ onComplete }: { onComplete: () => void }) {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'super-admin',
      title: 'Create Super Admin Accounts',
      description: 'Initialize admin@clickblock.co and sam@sam.com',
      status: 'pending'
    },
    {
      id: 'demo-websites',
      title: 'Initialize Demo Websites',
      description: 'Create 3 sample websites for testing',
      status: 'pending'
    },
    {
      id: 'diagnostics',
      title: 'Run System Diagnostics',
      description: 'Verify all systems are operational',
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const updateStep = (id: string, updates: Partial<SetupStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const runSetup = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Step 1: Create Super Admin
    updateStep('super-admin', { status: 'running' });
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/create-super-admin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        updateStep('super-admin', { 
          status: 'success',
          details: data.results
        });
      } else {
        updateStep('super-admin', { 
          status: 'error',
          error: 'Failed to create admin accounts'
        });
      }
    } catch (error) {
      updateStep('super-admin', { 
        status: 'error',
        error: error.message
      });
    }

    // Wait a moment before next step
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStepIndex(1);

    // Step 2: Initialize Demo Websites
    updateStep('demo-websites', { status: 'running' });
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/init-websites`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        updateStep('demo-websites', { 
          status: 'success',
          details: data.websites
        });
      } else {
        updateStep('demo-websites', { 
          status: 'error',
          error: 'Failed to initialize websites'
        });
      }
    } catch (error) {
      updateStep('demo-websites', { 
        status: 'error',
        error: error.message
      });
    }

    // Wait a moment before next step
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStepIndex(2);

    // Step 3: Run Diagnostics
    updateStep('diagnostics', { status: 'running' });
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/diagnostics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        const summary = data.results.find((r: any) => r.category === "Overall Summary");
        updateStep('diagnostics', { 
          status: summary?.status === 'error' ? 'error' : 'success',
          details: summary?.details
        });
      } else {
        updateStep('diagnostics', { 
          status: 'error',
          error: 'Diagnostics failed'
        });
      }
    } catch (error) {
      updateStep('diagnostics', { 
        status: 'error',
        error: error.message
      });
    }

    setIsRunning(false);
    setCurrentStepIndex(-1);
  };

  const allSuccess = steps.every(s => s.status === 'success');
  const hasErrors = steps.some(s => s.status === 'error');

  const getStepIcon = (step: SetupStep) => {
    if (step.status === 'running') return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />;
    if (step.status === 'success') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (step.status === 'error') return <X className="w-5 h-5 text-red-400" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
  };

  const getStepColor = (step: SetupStep) => {
    if (step.status === 'running') return 'border-blue-500/30 bg-blue-500/10';
    if (step.status === 'success') return 'border-green-500/30 bg-green-500/10';
    if (step.status === 'error') return 'border-red-500/30 bg-red-500/10';
    return 'border-slate-700 bg-slate-800/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to ClickBlock</h1>
            <p className="text-slate-400 text-lg">
              New Supabase project detected. Let's set up your system.
            </p>
          </div>
        </div>

        {/* Setup Steps */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all ${getStepColor(step)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm mb-2">{step.description}</p>
                  
                  {step.status === 'running' && (
                    <div className="text-blue-400 text-sm">Processing...</div>
                  )}
                  
                  {step.status === 'error' && step.error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2 mt-2">
                      ⚠️ {step.error}
                    </div>
                  )}
                  
                  {step.status === 'success' && step.details && (
                    <div className="text-sm text-slate-400 mt-2">
                      {step.id === 'super-admin' && (
                        <div className="space-y-1">
                          {step.details.map((result: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-400" />
                              <span>{result.email}: {result.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {step.id === 'demo-websites' && (
                        <div className="space-y-1">
                          {step.details.map((site: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-400" />
                              <span>{site.name} - {site.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {step.id === 'diagnostics' && step.details && (
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          <div className="text-center p-2 bg-green-500/10 rounded">
                            <div className="text-lg font-bold text-green-400">{step.details.passed}</div>
                            <div className="text-xs text-slate-400">Passed</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-500/10 rounded">
                            <div className="text-lg font-bold text-yellow-400">{step.details.warnings}</div>
                            <div className="text-xs text-slate-400">Warnings</div>
                          </div>
                          <div className="text-center p-2 bg-red-500/10 rounded">
                            <div className="text-lg font-bold text-red-400">{step.details.errors}</div>
                            <div className="text-xs text-slate-400">Errors</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!isRunning && !allSuccess && (
            <Button
              onClick={runSetup}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white h-12"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Setup
            </Button>
          )}

          {allSuccess && (
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Continue to Dashboard
            </Button>
          )}

          {hasErrors && !isRunning && (
            <Button
              onClick={runSetup}
              variant="outline"
              className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-12"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Retry Failed Steps
            </Button>
          )}
        </div>

        {/* Credentials Info */}
        {allSuccess && (
          <Card className="bg-blue-500/10 border-blue-500/30 p-6">
            <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Super Admin Credentials
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-900/50 p-3 rounded font-mono">
                <div className="text-slate-400">Email:</div>
                <div className="text-white">admin@clickblock.co</div>
                <div className="text-slate-400 mt-2">Password:</div>
                <div className="text-white">ClickBlock2025!Admin</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded font-mono">
                <div className="text-slate-400">Email:</div>
                <div className="text-white">sam@sam.com</div>
                <div className="text-slate-400 mt-2">Password:</div>
                <div className="text-white">sam@sam.com</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
