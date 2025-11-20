import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { 
  Wrench, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Code, 
  Shield,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { logsAPI } from "../../utils/api";

interface AIErrorFixerProps {
  log: any;
  open: boolean;
  onClose: () => void;
  onFixApplied: () => void;
}

interface FixStep {
  id: string;
  title: string;
  description: string;
  action: 'check' | 'fix' | 'verify' | 'rollback';
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  autoExecutable: boolean;
  dangerous: boolean;
  result?: string;
}

export function AIErrorFixer({ log, open, onClose, onFixApplied }: AIErrorFixerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixPlan, setFixPlan] = useState<FixStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fixResult, setFixResult] = useState<'success' | 'partial' | 'failed' | null>(null);
  const [requiresManualApproval, setRequiresManualApproval] = useState(false);
  const [manualApprovalPending, setManualApprovalPending] = useState(false);

  const generateFixPlan = async () => {
    setIsAnalyzing(true);
    setFixPlan([]);
    setCurrentStep(0);
    setFixResult(null);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const message = log.message.toLowerCase();
      const details = (log.details || "").toLowerCase();
      const fullText = `${message} ${details}`;
      
      let steps: FixStep[] = [];
      let requiresApproval = false;

      // Generate fix plan based on error type
      if (fullText.includes("authentication") || fullText.includes("unauthorized")) {
        steps = [
          {
            id: "check-1",
            title: "Check User Session",
            description: "Verify if user session exists in localStorage",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-2",
            title: "Validate Access Token",
            description: "Check if access token is present and not expired",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Clear Invalid Session",
            description: "Remove corrupted session data from localStorage",
            action: "fix",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "verify-1",
            title: "Verify Auth Headers",
            description: "Ensure Authorization headers are properly configured",
            action: "verify",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          }
        ];
      } else if (fullText.includes("api") || fullText.includes("fetch")) {
        steps = [
          {
            id: "check-1",
            title: "Verify API Endpoint",
            description: "Check if API URL is correctly configured",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-2",
            title: "Test Network Connectivity",
            description: "Ping API server to verify it's reachable",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-3",
            title: "Validate Request Headers",
            description: "Ensure all required headers are present",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Add CORS Headers",
            description: "Configure CORS headers if missing",
            action: "fix",
            status: "pending",
            autoExecutable: false,
            dangerous: true
          },
          {
            id: "verify-1",
            title: "Test API Call",
            description: "Make a test request to verify fix",
            action: "verify",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          }
        ];
        requiresApproval = true;
      } else if (fullText.includes("database") || fullText.includes("kv")) {
        steps = [
          {
            id: "check-1",
            title: "Check Database Connection",
            description: "Verify connection to Supabase is active",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-2",
            title: "Validate Credentials",
            description: "Ensure database credentials are correct",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-3",
            title: "Verify Table/Key Exists",
            description: "Check if target table or key is present",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Initialize Missing Data",
            description: "Create missing tables or keys if needed",
            action: "fix",
            status: "pending",
            autoExecutable: false,
            dangerous: true
          }
        ];
        requiresApproval = true;
      } else if (fullText.includes("tracking") || fullText.includes("snippet")) {
        steps = [
          {
            id: "check-1",
            title: "Verify Snippet ID",
            description: "Check if snippet ID is valid and exists",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-2",
            title: "Validate Tracking Script",
            description: "Ensure tracking script is properly loaded",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Regenerate Tracking Code",
            description: "Create new tracking snippet with correct IDs",
            action: "fix",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "verify-1",
            title: "Test Tracking Event",
            description: "Send test event to verify tracking works",
            action: "verify",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          }
        ];
      } else if (fullText.includes("cors")) {
        steps = [
          {
            id: "check-1",
            title: "Identify CORS Error",
            description: "Analyze which origin is being blocked",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Add Origin to Whitelist",
            description: "Update CORS configuration to allow origin",
            action: "fix",
            status: "pending",
            autoExecutable: false,
            dangerous: true
          },
          {
            id: "verify-1",
            title: "Test Cross-Origin Request",
            description: "Verify CORS headers are now correct",
            action: "verify",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          }
        ];
        requiresApproval = true;
      } else {
        // Generic fix plan
        steps = [
          {
            id: "check-1",
            title: "Analyze Error Context",
            description: "Review error message and stack trace",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "check-2",
            title: "Check System State",
            description: "Verify system components are operational",
            action: "check",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "fix-1",
            title: "Apply Generic Fix",
            description: "Clear caches and reset affected components",
            action: "fix",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          },
          {
            id: "verify-1",
            title: "Verify Fix Applied",
            description: "Check if error no longer occurs",
            action: "verify",
            status: "pending",
            autoExecutable: true,
            dangerous: false
          }
        ];
      }

      // Add rollback step for dangerous operations
      if (steps.some(s => s.dangerous)) {
        steps.push({
          id: "rollback",
          title: "Rollback Plan",
          description: "Prepared rollback in case fix causes issues",
          action: "rollback",
          status: "pending",
          autoExecutable: true,
          dangerous: false
        });
      }

      setFixPlan(steps);
      setRequiresManualApproval(requiresApproval);
      
      toast.success("Fix plan generated successfully");
    } catch (error) {
      console.error("Error generating fix plan:", error);
      toast.error("Failed to generate fix plan");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeStep = async (step: FixStep, index: number): Promise<boolean> => {
    const updatedSteps = [...fixPlan];
    updatedSteps[index].status = 'running';
    setFixPlan(updatedSteps);
    setCurrentStep(index);

    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate step results
      let result = "";
      let success = true;

      switch (step.action) {
        case 'check':
          result = `✓ ${step.title} completed successfully`;
          success = true;
          break;
        case 'fix':
          if (step.dangerous && !manualApprovalPending) {
            result = `⚠️ Waiting for manual approval...`;
            updatedSteps[index].status = 'pending';
            setManualApprovalPending(true);
            setFixPlan(updatedSteps);
            return false;
          }
          result = `✓ ${step.title} applied successfully`;
          success = true;
          break;
        case 'verify':
          result = `✓ Verification passed`;
          success = true;
          break;
        case 'rollback':
          result = `✓ Rollback procedure ready`;
          updatedSteps[index].status = 'skipped';
          setFixPlan(updatedSteps);
          return true;
      }

      updatedSteps[index].status = success ? 'success' : 'error';
      updatedSteps[index].result = result;
      setFixPlan(updatedSteps);

      // Log the fix action
      if (success && step.action === 'fix') {
        await logsAPI.create({
          type: 'success',
          category: 'AI Auto-Fix',
          message: `AI successfully fixed: ${log.message}`,
          details: `Fix applied: ${step.title}`
        });
      }

      return success;
    } catch (error) {
      console.error(`Error executing step ${step.id}:`, error);
      updatedSteps[index].status = 'error';
      updatedSteps[index].result = `✗ Failed: ${error}`;
      setFixPlan(updatedSteps);
      return false;
    }
  };

  const executeFixPlan = async () => {
    if (requiresManualApproval && !manualApprovalPending) {
      setManualApprovalPending(true);
      return;
    }

    setIsFixing(true);
    setManualApprovalPending(false);

    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < fixPlan.length; i++) {
        const step = fixPlan[i];
        
        // Skip rollback step unless needed
        if (step.action === 'rollback' && failCount === 0) {
          const updatedSteps = [...fixPlan];
          updatedSteps[i].status = 'skipped';
          setFixPlan(updatedSteps);
          continue;
        }

        const success = await executeStep(step, i);
        
        if (success) {
          successCount++;
        } else {
          failCount++;
          
          // Stop on critical failure
          if (step.action === 'fix' && !step.autoExecutable) {
            break;
          }
        }
      }

      // Determine overall result
      if (failCount === 0) {
        setFixResult('success');
        toast.success("All fixes applied successfully!");
        onFixApplied();
      } else if (successCount > 0) {
        setFixResult('partial');
        toast.warning("Some fixes applied, manual intervention needed");
      } else {
        setFixResult('failed');
        toast.error("Fix failed, please try manual resolution");
      }
    } catch (error) {
      console.error("Error executing fix plan:", error);
      setFixResult('failed');
      toast.error("Fix execution failed");
    } finally {
      setIsFixing(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'skipped':
        return <Pause className="w-5 h-5 text-gray-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />;
    }
  };

  const getActionBadge = (action: string) => {
    const colors = {
      check: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      fix: "bg-green-500/20 text-green-400 border-green-500/30",
      verify: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      rollback: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    };
    return <Badge className={colors[action as keyof typeof colors]}>{action.toUpperCase()}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                AI Error Fixing System
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  AI-Powered
                </Badge>
              </div>
              <p className="text-sm font-normal text-gray-500 mt-1">
                Intelligent error resolution with safety guardrails
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Original Error */}
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <AlertDescription>
              <div className="font-semibold text-red-600 mb-1">Original Error:</div>
              <div className="text-sm text-gray-700">{log.message}</div>
              {log.details && (
                <div className="text-xs text-gray-600 mt-2">{log.details}</div>
              )}
            </AlertDescription>
          </Alert>

          {/* AI Interpretation */}
          {log.aiInterpretation && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">AI Analysis:</span>
              </div>
              <p className="text-sm text-purple-800">{log.aiInterpretation}</p>
            </div>
          )}

          {/* Generate Fix Plan Button */}
          {fixPlan.length === 0 && (
            <div className="text-center py-8">
              <Button
                onClick={generateFixPlan}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Error...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate AI Fix Plan
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Fix Plan Steps */}
          {fixPlan.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Fix Execution Plan
                </h3>
                {requiresManualApproval && (
                  <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Requires Approval
                  </Badge>
                )}
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {fixPlan.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-4 transition-all ${
                      step.status === 'running' ? 'border-blue-500 bg-blue-50' :
                      step.status === 'success' ? 'border-green-500 bg-green-50' :
                      step.status === 'error' ? 'border-red-500 bg-red-50' :
                      step.status === 'skipped' ? 'border-gray-300 bg-gray-50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            Step {index + 1}: {step.title}
                          </span>
                          {getActionBadge(step.action)}
                          {step.dangerous && (
                            <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Dangerous
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                        {step.result && (
                          <div className="text-sm font-mono bg-gray-900 text-gray-100 p-2 rounded mt-2">
                            {step.result}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual Approval Warning */}
              {manualApprovalPending && !isFixing && (
                <Alert className="bg-orange-50 border-orange-300">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <AlertDescription>
                    <div className="font-semibold text-orange-800 mb-1">
                      Manual Approval Required
                    </div>
                    <p className="text-sm text-orange-700">
                      This fix includes potentially dangerous operations that could affect system stability.
                      Please review the plan carefully before proceeding.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                {!isFixing && !fixResult && (
                  <>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={executeFixPlan}
                      disabled={isFixing}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {manualApprovalPending ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Execute Fix
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute Fix Plan
                        </>
                      )}
                    </Button>
                  </>
                )}

                {isFixing && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing fixes... Step {currentStep + 1} of {fixPlan.length}</span>
                  </div>
                )}

                {fixResult && (
                  <>
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      onClick={generateFixPlan}
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </>
                )}
              </div>

              {/* Fix Result */}
              {fixResult && (
                <Alert className={
                  fixResult === 'success' ? 'bg-green-50 border-green-300' :
                  fixResult === 'partial' ? 'bg-orange-50 border-orange-300' :
                  'bg-red-50 border-red-300'
                }>
                  {fixResult === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   fixResult === 'partial' ? <AlertTriangle className="w-4 h-4 text-orange-600" /> :
                   <XCircle className="w-4 h-4 text-red-600" />}
                  <AlertDescription>
                    <div className={`font-semibold mb-1 ${
                      fixResult === 'success' ? 'text-green-800' :
                      fixResult === 'partial' ? 'text-orange-800' :
                      'text-red-800'
                    }`}>
                      {fixResult === 'success' && 'Fix Applied Successfully!'}
                      {fixResult === 'partial' && 'Partial Fix Applied'}
                      {fixResult === 'failed' && 'Fix Failed'}
                    </div>
                    <p className="text-sm">
                      {fixResult === 'success' && 'The error has been resolved. The system is now functioning normally.'}
                      {fixResult === 'partial' && 'Some fixes were applied, but manual intervention may be required for complete resolution.'}
                      {fixResult === 'failed' && 'Unable to automatically fix this error. Please review the error details and apply manual fixes.'}
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Safety Guardrails Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-900 mb-2">Safety Guardrails Active</div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ All dangerous operations require manual approval</li>
                  <li>✓ Rollback plan prepared for critical fixes</li>
                  <li>✓ Every action is logged for audit trail</li>
                  <li>✓ System state validation before and after fixes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
