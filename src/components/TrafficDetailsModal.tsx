import { X, MapPin, Monitor, Globe, Clock, Wifi, Shield, AlertTriangle, Activity, TrendingUp, Database, Fingerprint } from "lucide-react";

interface TrafficDetailsModalProps {
  traffic: any;
  onClose: () => void;
}

export function TrafficDetailsModal({ traffic, onClose }: TrafficDetailsModalProps) {
  if (!traffic) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-1">Traffic Details</h2>
            <p className="text-slate-400 font-mono text-sm">{traffic.ip}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fraud Score Banner */}
          <div className={`p-6 rounded-xl border ${
            traffic.fraudScore >= 80 ? 'bg-red-500/10 border-red-500/30' :
            traffic.fraudScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-green-500/10 border-green-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Fraud Risk Score</div>
                <div className="text-4xl font-bold">{traffic.fraudScore}/100</div>
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                traffic.blocked ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {traffic.blocked ? 'BLOCKED' : 'ALLOWED'}
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Geographic Information */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Geographic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Country</span>
                  <span className="font-medium">{traffic.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Region/State</span>
                  <span className="font-medium">{traffic.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">City</span>
                  <span className="font-medium">{traffic.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latitude</span>
                  <span className="font-mono text-sm">{traffic.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitude</span>
                  <span className="font-mono text-sm">{traffic.longitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Postal Code</span>
                  <span className="font-mono text-sm">{traffic.postalCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timezone</span>
                  <span className="font-medium">{traffic.timezone}</span>
                </div>
              </div>
            </div>

            {/* Network Information */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-purple-400" />
                Network Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Address</span>
                  <span className="font-mono text-sm">{traffic.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ISP</span>
                  <span className="font-medium">{traffic.isp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Organization</span>
                  <span className="font-medium">{traffic.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ASN</span>
                  <span className="font-mono text-sm">{traffic.asn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Connection Type</span>
                  <span className="font-medium">{traffic.connectionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hosting Provider</span>
                  <span className="font-medium">{traffic.hostingProvider || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Domain</span>
                  <span className="font-mono text-sm">{traffic.domain}</span>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-green-400" />
                Device Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device Type</span>
                  <span className="font-medium">{traffic.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating System</span>
                  <span className="font-medium">{traffic.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Browser</span>
                  <span className="font-medium">{traffic.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Screen Resolution</span>
                  <span className="font-mono text-sm">{traffic.screenResolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Color Depth</span>
                  <span className="font-medium">{traffic.colorDepth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Viewport Size</span>
                  <span className="font-mono text-sm">{traffic.viewportSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Device Memory</span>
                  <span className="font-medium">{traffic.deviceMemory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU Cores</span>
                  <span className="font-medium">{traffic.cpuCores}</span>
                </div>
              </div>
            </div>

            {/* Browser Capabilities */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-400" />
                Browser Capabilities
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">JavaScript</span>
                  <span className={traffic.jsEnabled ? 'text-green-400' : 'text-red-400'}>
                    {traffic.jsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cookies</span>
                  <span className={traffic.cookiesEnabled ? 'text-green-400' : 'text-red-400'}>
                    {traffic.cookiesEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WebGL</span>
                  <span className={traffic.webglSupported ? 'text-green-400' : 'text-red-400'}>
                    {traffic.webglSupported ? 'Supported' : 'Not Supported'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Canvas Support</span>
                  <span className={traffic.canvasSupported ? 'text-green-400' : 'text-red-400'}>
                    {traffic.canvasSupported ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Touch Support</span>
                  <span className={traffic.touchSupport ? 'text-green-400' : 'text-red-400'}>
                    {traffic.touchSupport ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Do Not Track</span>
                  <span className="font-medium">{traffic.doNotTrack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Language</span>
                  <span className="font-medium">{traffic.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plugins Count</span>
                  <span className="font-medium">{traffic.pluginsCount}</span>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Session Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">First Seen</span>
                  <span className="font-mono text-sm">{traffic.firstSeen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Seen</span>
                  <span className="font-mono text-sm">{traffic.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Clicks</span>
                  <span className="font-medium">{traffic.clicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Session Duration</span>
                  <span className="font-medium">{traffic.sessionDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pages Viewed</span>
                  <span className="font-medium">{traffic.pagesViewed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Referrer</span>
                  <span className="font-medium truncate max-w-[200px]">{traffic.referrer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Landing Page</span>
                  <span className="font-medium truncate max-w-[200px]">{traffic.landingPage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">UTM Campaign</span>
                  <span className="font-medium">{traffic.utmCampaign || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Connection Details */}
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                Connection Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Latency</span>
                  <span className="font-medium">{traffic.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bandwidth</span>
                  <span className="font-medium">{traffic.bandwidth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocol</span>
                  <span className="font-mono text-sm">{traffic.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Port</span>
                  <span className="font-mono text-sm">{traffic.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SSL/TLS Version</span>
                  <span className="font-medium">{traffic.tlsVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cipher Suite</span>
                  <span className="font-mono text-xs">{traffic.cipherSuite}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Threat Indicators */}
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Threat Indicators
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${traffic.vpn ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">VPN Detected</div>
                <div className={`text-lg font-medium ${traffic.vpn ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.vpn ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.proxy ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Proxy Server</div>
                <div className={`text-lg font-medium ${traffic.proxy ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.proxy ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.bot ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Bot Detected</div>
                <div className={`text-lg font-medium ${traffic.bot ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.bot ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.datacenter ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Datacenter IP</div>
                <div className={`text-lg font-medium ${traffic.datacenter ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.datacenter ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.tor ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Tor Network</div>
                <div className={`text-lg font-medium ${traffic.tor ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.tor ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.anonymizer ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Anonymizer</div>
                <div className={`text-lg font-medium ${traffic.anonymizer ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.anonymizer ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.headless ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Headless Browser</div>
                <div className={`text-lg font-medium ${traffic.headless ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.headless ? 'Yes' : 'No'}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${traffic.malicious ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-700/50 border-slate-600'}`}>
                <div className="text-sm text-slate-400 mb-1">Malicious Activity</div>
                <div className={`text-lg font-medium ${traffic.malicious ? 'text-red-400' : 'text-green-400'}`}>
                  {traffic.malicious ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* User Agent String */}
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              User Agent String
            </h3>
            <div className="p-4 bg-slate-900 border border-white/10 rounded-lg font-mono text-sm break-all">
              {traffic.userAgent}
            </div>
          </div>

          {/* Fingerprint Hash */}
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-purple-400" />
              Browser Fingerprint
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Fingerprint Hash</span>
                <span className="font-mono text-sm">{traffic.fingerprintHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Canvas Hash</span>
                <span className="font-mono text-sm">{traffic.canvasHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WebGL Hash</span>
                <span className="font-mono text-sm">{traffic.webglHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audio Hash</span>
                <span className="font-mono text-sm">{traffic.audioHash}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
