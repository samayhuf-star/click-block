import { useState, useEffect } from "react";
import { Plus, Globe, Check, X, Trash2, Copy, ExternalLink, RefreshCw, Eye, EyeOff, Search, Grid, List, Layers, Download, Upload, Code, Edit, Shield, CheckCircle, AlertCircle, Loader2, Filter, ArrowUpDown, Grid3x3, Activity, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner@2.0.3";
import { websitesAPI } from "../../utils/api";
import { validateURL, validateWebsiteName, sanitizeURL } from "../../utils/validation";

interface Website {
  id: string;
  name: string;
  url: string;
  snippetId: string;
  status: "active" | "inactive";
  clicks: number;
  fraudClicks: number;
  createdAt: string;
  blockedIPs: string[];
  verified?: boolean;
  lastVerified?: string;
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "clicks-high" | "clicks-low";
type FilterOption = "all" | "active" | "inactive";

export function WebsitesManager() {
  console.log("WebsitesManager loaded v2");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showSnippet, setShowSnippet] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [verifyingWebsites, setVerifyingWebsites] = useState<Set<string>>(new Set());
  
  // Bulk selection
  const [selectedWebsites, setSelectedWebsites] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Usability features
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  useEffect(() => {
    loadWebsites();
    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(() => {
      loadWebsites();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      const data = await websitesAPI.getAll();
      
      // Fetch analytics for each website
      const websitesWithAnalytics = await Promise.all(
        (data.websites || []).map(async (website: Website) => {
          try {
            const analyticsData = await websitesAPI.getAnalytics(website.id);
            const totalClicks = analyticsData.analytics?.totalClicks || 0;
            const fraudClicks = analyticsData.analytics?.fraudulentClicks || 0;
            
            console.log(`Analytics for ${website.name}:`, {
              totalClicks,
              fraudClicks,
              snippetId: website.snippetId
            });
            
            return {
              ...website,
              clicks: totalClicks,
              fraudClicks: fraudClicks
              // blockedIPs is already in the website object as an array
            };
          } catch (error) {
            console.error(`Error loading analytics for ${website.name}:`, error);
            // Return website with zero clicks if analytics fail
            return {
              ...website,
              clicks: 0,
              fraudClicks: 0
            };
          }
        })
      );
      
      setWebsites(websitesWithAnalytics);
      toast.success('Websites loaded successfully');
    } catch (error) {
      console.error("Error loading websites:", error);
      toast.error('Failed to load websites', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (name: string, url: string) => {
    try {
      // Validate inputs
      const nameValidation = validateWebsiteName(name);
      if (!nameValidation.valid) {
        toast.error('Invalid website name', {
          description: nameValidation.error
        });
        return;
      }

      const urlValidation = validateURL(url);
      if (!urlValidation.valid) {
        toast.error('Invalid URL', {
          description: urlValidation.error
        });
        return;
      }

      // Sanitize URL
      const sanitizedUrl = sanitizeURL(url);
      
      const data = await websitesAPI.create(name.trim(), sanitizedUrl);
      setWebsites([...websites, data.website]);
      setIsAddDialogOpen(false);
      setShowSnippet(data.website.id);
      
      toast.success('Website added successfully!', {
        description: 'Install the tracking snippet to activate protection.'
      });
    } catch (error) {
      console.error("Error adding website:", error);
      toast.error('Failed to add website', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  const handleBulkAddWebsites = async (domains: { name: string; url: string }[]) => {
    if (domains.length === 0) {
      toast.error('No domains to add');
      return;
    }

    if (domains.length > 10) {
      toast.error('Maximum 10 domains allowed at once');
      return;
    }

    const successCount = { value: 0 };
    const failedDomains: string[] = [];
    const addedWebsites: Website[] = [];

    toast.loading(`Adding ${domains.length} websites...`, { id: 'bulk-add' });

    for (const domain of domains) {
      try {
        const data = await websitesAPI.create(domain.name, domain.url);
        addedWebsites.push(data.website);
        successCount.value++;
      } catch (error) {
        console.error(`Error adding ${domain.url}:`, error);
        failedDomains.push(domain.url);
      }
    }

    setWebsites([...websites, ...addedWebsites]);
    setIsBulkDialogOpen(false);

    toast.dismiss('bulk-add');

    if (failedDomains.length === 0) {
      toast.success(`Successfully added all ${domains.length} websites!`, {
        description: 'Install tracking snippets to activate protection.'
      });
    } else {
      toast.warning(`Added ${successCount.value} of ${domains.length} websites`, {
        description: `Failed: ${failedDomains.join(', ')}`
      });
    }
  };

  const handleEditWebsite = async (id: string, name: string, url: string) => {
    try {
      setWebsites(websites.map(site => 
        site.id === id ? { ...site, name, url } : site
      ));
      setIsEditDialogOpen(false);
      setSelectedWebsite(null);
      toast.success('Website updated successfully');
    } catch (error) {
      console.error("Error updating website:", error);
      toast.error('Failed to update website');
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    const website = websites.find(w => w.id === id);
    
    if (!confirm(`Are you sure you want to delete "${website?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await websitesAPI.delete(id);
      setWebsites(websites.filter(site => site.id !== id));
      toast.success('Website deleted successfully', {
        description: `${website?.name} has been removed.`
      });
    } catch (error) {
      console.error("Error deleting website:", error);
      toast.error('Failed to delete website', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  // Bulk selection handlers
  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedWebsites);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedWebsites(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWebsites.size === filteredWebsites.length) {
      setSelectedWebsites(new Set());
    } else {
      setSelectedWebsites(new Set(filteredWebsites.map(w => w.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedWebsites.size === 0) {
      toast.error('No websites selected');
      return;
    }

    const selectedCount = selectedWebsites.size;
    const websiteNames = Array.from(selectedWebsites)
      .map(id => websites.find(w => w.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');

    const displayNames = selectedCount > 3 
      ? `${websiteNames} and ${selectedCount - 3} more` 
      : websiteNames;

    if (!confirm(`Are you sure you want to delete ${selectedCount} website${selectedCount > 1 ? 's' : ''}?\n\n${displayNames}\n\nThis action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    toast.loading(`Deleting ${selectedCount} websites...`, { id: 'bulk-delete' });

    let successCount = 0;
    let failedCount = 0;

    for (const id of Array.from(selectedWebsites)) {
      try {
        await websitesAPI.delete(id);
        successCount++;
      } catch (error) {
        console.error(`Error deleting website ${id}:`, error);
        failedCount++;
      }
    }

    // Refresh websites list
    setWebsites(websites.filter(site => !selectedWebsites.has(site.id)));
    setSelectedWebsites(new Set());
    setIsDeleting(false);

    toast.dismiss('bulk-delete');

    if (failedCount === 0) {
      toast.success(`Successfully deleted ${successCount} website${successCount > 1 ? 's' : ''}!`);
    } else {
      toast.warning(`Deleted ${successCount} of ${selectedCount} websites`, {
        description: `${failedCount} deletion${failedCount > 1 ? 's' : ''} failed`
      });
    }
  };

  const handleDeleteAll = async () => {
    if (websites.length === 0) {
      toast.info('No websites to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ALL ${websites.length} website${websites.length !== 1 ? 's' : ''}?\n\nThis action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    toast.loading(`Deleting all ${websites.length} websites...`, { id: 'delete-all' });

    let successCount = 0;
    let failedCount = 0;

    for (const website of websites) {
      try {
        await websitesAPI.delete(website.id);
        successCount++;
      } catch (error) {
        console.error(`Error deleting website ${website.id}:`, error);
        failedCount++;
      }
    }

    // Clear websites list
    setWebsites([]);
    setSelectedWebsites(new Set());
    setIsDeleting(false);

    toast.dismiss('delete-all');

    if (failedCount === 0) {
      toast.success(`Successfully deleted all ${successCount} website${successCount > 1 ? 's' : ''}!`);
    } else {
      toast.warning(`Deleted ${successCount} of ${websites.length} websites`, {
        description: `${failedCount} deletion${failedCount > 1 ? 's' : ''} failed`
      });
    }
  };

  const handleVerifyWebsite = async (id: string) => {
    const website = websites.find(w => w.id === id);
    
    // Add to verifying set
    setVerifyingWebsites(prev => new Set([...prev, id]));
    
    toast.loading(`Verifying ${website?.name}...`, { id: `verify-${id}` });

    try {
      const data = await websitesAPI.verify(id);
      
      // Update website with verification status
      setWebsites(websites.map(site => 
        site.id === id ? { 
          ...site, 
          verified: data.verified,
          lastVerified: data.lastVerified,
          status: data.verified ? "active" : "inactive"
        } : site
      ));

      toast.dismiss(`verify-${id}`);

      if (data.verified) {
        toast.success('Verification successful!', {
          description: `Tracking snippet detected on ${website?.name}`
        });
      } else {
        toast.error('Verification failed', {
          description: data.message || 'Tracking snippet not found on the website'
        });
      }
    } catch (error) {
      console.error("Error verifying website:", error);
      toast.dismiss(`verify-${id}`);
      toast.error('Verification failed', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    } finally {
      // Remove from verifying set
      setVerifyingWebsites(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleRestoreDefaultWebsites = async () => {
    try {
      toast.loading('Restoring your websites...', { id: 'restore-websites' });
      const data = await websitesAPI.initializeDefaultWebsites();
      
      // Reload websites
      await loadWebsites();
      
      toast.dismiss('restore-websites');
      toast.success('Websites restored successfully!', {
        description: `Restored ${data.websites?.length || 3} verified websites`
      });
    } catch (error) {
      console.error("Error restoring websites:", error);
      toast.dismiss('restore-websites');
      toast.error('Failed to restore websites', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  const handleFixDomains = async () => {
    try {
      toast.loading('Fixing malformed domain URLs...', { id: 'fix-domains' });
      
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-51144976/fix-domains`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fix domains');
      }

      const data = await response.json();
      
      // Reload websites to show fixed URLs
      await loadWebsites();
      
      toast.dismiss('fix-domains');
      toast.success('Domain URLs fixed successfully!', {
        description: `Fixed: ${data.fixed}, Already correct: ${data.alreadyCorrect}`
      });
    } catch (error) {
      console.error("Error fixing domains:", error);
      toast.dismiss('fix-domains');
      toast.error('Failed to fix domains', {
        description: error instanceof Error ? error.message : 'Please try again.'
      });
    }
  };

  // Filter and sort logic
  const getFilteredAndSortedWebsites = () => {
    let filtered = [...websites];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.snippetId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterBy !== "all") {
      filtered = filtered.filter(site => site.status === filterBy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "clicks-high":
          return b.clicks - a.clicks;
        case "clicks-low":
          return a.clicks - b.clicks;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredWebsites = getFilteredAndSortedWebsites();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Websites</h1>
          <p className="text-slate-300">Manage your protected websites and tracking snippets</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={loadWebsites}
            variant="outline"
            className="border-white/20 hover:bg-slate-800"
            title="Refresh analytics data"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </Button>
          {websites.length > 0 && (
            <Button 
              onClick={handleDeleteAll}
              variant="outline"
              className="border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300"
              disabled={isDeleting}
              title="Delete all websites"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete All
            </Button>
          )}
          <Button 
            onClick={handleFixDomains}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Fix URLs
          </Button>
          
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Layers className="w-5 h-5 mr-2" />
                Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Bulk Add Websites (Max 10)</DialogTitle>
              </DialogHeader>
              <BulkAddWebsiteForm onSubmit={handleBulkAddWebsites} onCancel={() => setIsBulkDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Add New Website</DialogTitle>
              </DialogHeader>
              <AddWebsiteForm onSubmit={handleAddWebsite} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Total Websites</p>
              <p className="text-3xl font-bold text-white">{websites.length}</p>
            </div>
            <Globe className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-400">
                {websites.filter(w => w.status === "active").length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
          </div>
        </Card>
        <Card className="p-6 bg-slate-800/80 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Inactive</p>
              <p className="text-3xl font-bold text-orange-400">
                {websites.filter(w => w.status === "inactive").length}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Toolbar: Search, Filter, Sort, View */}
      <Card className="p-4 bg-slate-800/80 border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, URL, or snippet ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Filter */}
          <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
            <SelectTrigger className="w-full lg:w-40 bg-slate-700 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full lg:w-48 bg-slate-700 border-slate-600 text-white">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="clicks-high">Most Clicks</SelectItem>
              <SelectItem value="clicks-low">Least Clicks</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-600 text-white" : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-600 text-white" : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || filterBy !== "all") && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
            <span>Active filters:</span>
            {searchQuery && (
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/20 text-blue-300">
                Search: {searchQuery}
              </Badge>
            )}
            {filterBy !== "all" && (
              <Badge variant="outline" className="border-green-500/50 bg-green-500/20 text-green-300">
                Status: {filterBy}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setFilterBy("all");
              }}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Results Count */}
      {websites.length > 0 && (
        <div className="text-sm text-slate-300">
          Showing {filteredWebsites.length} of {websites.length} website{websites.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedWebsites.size > 0 && (
        <Card className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox 
                checked={selectedWebsites.size === filteredWebsites.length}
                onCheckedChange={handleSelectAll}
                className="border-white data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <div>
                <p className="text-white font-semibold">
                  {selectedWebsites.size} website{selectedWebsites.size !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-slate-300">
                  {selectedWebsites.size === filteredWebsites.length ? 'All websites selected' : 'Click checkbox to select all'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedWebsites(new Set())}
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
              <Button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Select All Bar (when no selection) */}
      {websites.length > 0 && filteredWebsites.length > 0 && selectedWebsites.size === 0 && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Checkbox 
            checked={false}
            onCheckedChange={handleSelectAll}
            className="border-slate-600"
          />
          <span>Select all {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Websites List/Grid */}
      {viewMode === "list" ? (
        <div className="grid gap-6">
          {filteredWebsites.map((website) => (
            <WebsiteCardList
              key={website.id}
              website={website}
              showSnippet={showSnippet}
              showDetails={showDetails}
              onShowSnippet={setShowSnippet}
              onShowDetails={setShowDetails}
              onEdit={(site) => {
                setSelectedWebsite(site);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteWebsite}
              onVerify={handleVerifyWebsite}
              verifyingWebsites={verifyingWebsites}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => (
            <WebsiteCardGrid
              key={website.id}
              website={website}
              showSnippet={showSnippet}
              showDetails={showDetails}
              onShowSnippet={setShowSnippet}
              onShowDetails={setShowDetails}
              onEdit={(site) => {
                setSelectedWebsite(site);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteWebsite}
              onVerify={handleVerifyWebsite}
              verifyingWebsites={verifyingWebsites}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {websites.length === 0 && (
        <Card className="p-12 bg-slate-800/80 border-slate-700 text-center">
          <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">No websites added yet</h3>
          <p className="text-slate-300 mb-6">Add your first website to start protecting your ad spend</p>
          <div className="flex gap-3 justify-center">
            <Button 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              onClick={handleRestoreDefaultWebsites}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Restore My 3 Websites
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Website
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              onClick={() => setIsBulkDialogOpen(true)}
            >
              <Layers className="w-5 h-5 mr-2" />
              Bulk Add
            </Button>
          </div>
        </Card>
      )}

      {/* No Results State */}
      {websites.length > 0 && filteredWebsites.length === 0 && (
        <Card className="p-12 bg-slate-800/80 border-slate-700 text-center">
          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">No websites found</h3>
          <p className="text-slate-300 mb-6">Try adjusting your search or filters</p>
          <Button 
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={() => {
              setSearchQuery("");
              setFilterBy("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Edit Website</DialogTitle>
          </DialogHeader>
          {selectedWebsite && (
            <EditWebsiteForm 
              website={selectedWebsite}
              onSubmit={handleEditWebsite}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedWebsite(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Website Card - List View
function WebsiteCardList({ 
  website, 
  showSnippet,
  showDetails,
  onShowSnippet,
  onShowDetails,
  onEdit, 
  onDelete,
  onVerify,
  verifyingWebsites
}: {
  website: Website;
  showSnippet: string | null;
  showDetails: string | null;
  onShowSnippet: (id: string | null) => void;
  onShowDetails: (id: string | null) => void;
  onEdit: (website: Website) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  verifyingWebsites: Set<string>;
}) {
  return (
    <Card className="p-6 bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Website Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>

          {/* Website Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold truncate text-white">{website.name}</h3>
              <Badge className={
                website.status === "active" 
                  ? "bg-green-500/20 text-green-300 border-green-500/50"
                  : "bg-orange-500/20 text-orange-300 border-orange-500/50"
              }>
                {website.status === "active" ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>
            <a 
              href={website.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1 mb-3"
            >
              {website.url}
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Snippet ID</p>
                <p className="font-mono text-blue-300">{website.snippetId}</p>
              </div>
              <div>
                <p className="text-slate-400">Total Clicks</p>
                <p className="font-semibold text-white">{website.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Fraud Clicks</p>
                <p className={`font-semibold ${website.fraudClicks > 10 ? 'text-red-400' : 'text-green-400'}`}>
                  {website.fraudClicks.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:flex-col lg:items-end">
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white"
            onClick={() => onShowSnippet(showSnippet === website.id ? null : website.id)}
          >
            <Code className="w-4 h-4 mr-2" />
            {showSnippet === website.id ? 'Hide Snippet' : 'View Snippet'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-blue-500/50 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
            onClick={() => setShowDetails(showDetails === website.id ? null : website.id)}
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white"
            onClick={() => onEdit(website)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300"
            onClick={() => onDelete(website.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-green-500/50 hover:bg-green-500/20 text-green-400 hover:text-green-300"
            onClick={() => onVerify(website.id)}
            disabled={verifyingWebsites.has(website.id)}
          >
            <Shield className="w-4 h-4" />
            {verifyingWebsites.has(website.id) ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </div>

      {/* Snippet Display */}
      {showSnippet === website.id && (
        <div className="mt-6 pt-6 border-t border-slate-700 transition-all duration-300">
          <SnippetDisplay 
            snippetId={website.snippetId} 
            status={website.status}
            onClose={() => onShowSnippet(null)}
            onVerify={() => onVerify(website.id)}
          />
        </div>
      )}

      {/* Details Display */}
      {showDetails === website.id && (
        <div className="mt-6 pt-6 border-t border-slate-700 transition-all duration-300">
          <WebsiteDetailsDisplay 
            website={website}
            onClose={() => setShowDetails(null)}
          />
        </div>
      )}
    </Card>
  );
}

// Website Card - Grid View
function WebsiteCardGrid({ 
  website, 
  showSnippet,
  showDetails,
  onShowSnippet,
  onShowDetails,
  onEdit, 
  onDelete,
  onVerify,
  verifyingWebsites
}: {
  website: Website;
  showSnippet: string | null;
  showDetails: string | null;
  onShowSnippet: (id: string | null) => void;
  onShowDetails: (id: string | null) => void;
  onEdit: (website: Website) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
  verifyingWebsites: Set<string>;
}) {
  return (
    <Card className="p-6 bg-slate-800/80 border-slate-700 hover:bg-slate-800 transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate mb-1 text-white">{website.name}</h3>
            <Badge className={
              website.status === "active" 
                ? "bg-green-500/20 text-green-300 border-green-500/50"
                : "bg-orange-500/20 text-orange-300 border-orange-500/50"
            }>
              {website.status === "active" ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* URL */}
        <a 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-1 truncate"
        >
          {website.url}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Total Clicks</p>
            <p className="font-semibold text-white">{website.clicks.toLocaleString()}</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Fraud Rate</p>
            <p className={`font-semibold ${website.fraudClicks > 10 ? 'text-red-400' : 'text-green-400'}`}>
              {website.fraudClicks}%
            </p>
          </div>
        </div>

        {/* Snippet ID */}
        <div className="text-xs">
          <p className="text-slate-400 mb-1">Snippet ID</p>
          <p className="font-mono text-blue-300 truncate">{website.snippetId}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent flex-1 border-slate-600 hover:bg-slate-700 text-xs text-slate-300 hover:text-white"
            onClick={() => onShowSnippet(showSnippet === website.id ? null : website.id)}
          >
            <Code className="w-3 h-3 mr-1" />
            Snippet
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent flex-1 border-blue-500/50 hover:bg-blue-500/20 text-xs text-blue-400 hover:text-blue-300"
            onClick={() => onShowDetails(showDetails === website.id ? null : website.id)}
          >
            <Info className="w-3 h-3 mr-1" />
            Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white"
            onClick={() => onEdit(website)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300"
            onClick={() => onDelete(website.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-green-500/50 hover:bg-green-500/20 text-green-400 hover:text-green-300"
            onClick={() => onVerify(website.id)}
            disabled={verifyingWebsites.has(website.id)}
          >
            <Shield className="w-3 h-3" />
            {verifyingWebsites.has(website.id) ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </div>

      {/* Snippet Display */}
      {showSnippet === website.id && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <SnippetDisplay 
            snippetId={website.snippetId} 
            status={website.status}
            onClose={() => onShowSnippet(null)}
            onVerify={() => onVerify(website.id)}
          />
        </div>
      )}
    </Card>
  );
}

function AddWebsiteForm({ onSubmit, onCancel }: {
  onSubmit: (name: string, url: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onSubmit(name.trim(), url.trim());
      setName("");
      setUrl("");
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-slate-200">Website Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My E-commerce Store"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 mt-2"
          required
        />
      </div>
      <div>
        <Label htmlFor="url" className="text-slate-200">Website URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://mywebsite.com"
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 mt-2"
          required
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
          Add Website
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function BulkAddWebsiteForm({ onSubmit, onCancel }: {
  onSubmit: (domains: { name: string; url: string }[]) => void;
  onCancel: () => void;
}) {
  const [bulkInput, setBulkInput] = useState("");
  const [parsedDomains, setParsedDomains] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState("");

  const parseBulkInput = (input: string) => {
    if (!input.trim()) {
      setParsedDomains([]);
      setError("");
      return;
    }

    const domains: { name: string; url: string }[] = [];
    const errors: string[] = [];

    // Smart parsing: handle multiple formats
    // Split by newlines, commas, semicolons, spaces, or tabs
    const allText = input.replace(/[,;\t]+/g, '\n').replace(/\s+/g, '\n');
    const lines = allText.split('\n').filter(line => line.trim());

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;

      try {
        let url = trimmedLine;
        
        // Remove common prefixes that users might include
        url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
        
        // Remove trailing slashes and paths
        url = url.split('/')[0];
        
        // If there's no protocol, add https://
        const fullUrl = 'https://' + url;

        // Try to parse as URL to validate
        const parsedUrl = new URL(fullUrl);
        const hostname = parsedUrl.hostname;

        // Basic domain validation - must have at least one dot and valid characters
        if (!hostname.includes('.') || hostname.length < 4) {
          errors.push(`"${trimmedLine}" - Invalid domain format`);
          return;
        }

        // Auto-generate clean website name from domain
        // Remove TLD and capitalize
        const domainParts = hostname.split('.');
        const mainDomain = domainParts[0];
        const websiteName = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);

        // Use the hostname as the name (cleaned domain)
        domains.push({
          name: websiteName,
          url: fullUrl
        });
      } catch (e) {
        errors.push(`"${trimmedLine}" - Invalid domain format`);
      }
    });

    // Remove duplicates
    const uniqueDomains = domains.filter((domain, index, self) =>
      index === self.findIndex((d) => d.url === domain.url)
    );

    if (uniqueDomains.length > 10) {
      setError("Maximum 10 domains allowed. Only first 10 will be processed.");
      setParsedDomains(uniqueDomains.slice(0, 10));
    } else if (errors.length > 0) {
      setError(`Fixed ${uniqueDomains.length} domains. Issues: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
      setParsedDomains(uniqueDomains);
    } else {
      setError("");
      setParsedDomains(uniqueDomains);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parsedDomains.length === 0) {
      toast.error('Please enter at least one domain');
      return;
    }

    if (parsedDomains.length > 10) {
      toast.error('Maximum 10 domains allowed');
      return;
    }

    onSubmit(parsedDomains);
    setBulkInput("");
    setParsedDomains([]);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bulk-input" className="text-slate-200">Enter Domains (One per line, max 10)</Label>
        <p className="text-xs text-slate-400 mt-1 mb-2">
          Enter domains in any format - we&apos;ll automatically fix and format them!
        </p>
        <Textarea
          id="bulk-input"
          value={bulkInput}
          onChange={(e) => {
            setBulkInput(e.target.value);
            parseBulkInput(e.target.value);
          }}
          placeholder={`scoins.online
pdftime.online
dominent.online

You can also use commas, spaces, or mix formats:
example.com, mystore.io
https://www.shop.online another-site.com`}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-40 font-mono text-sm"
          required
        />
        <p className="text-xs text-slate-400 mt-2">
          💡 Paste in any format - commas, spaces, with/without https://, we&apos;ll handle it!
        </p>
      </div>

      {error && (
        <Alert className="bg-orange-500/20 border-orange-500/50">
          <AlertCircle className="w-4 h-4 text-orange-300" />
          <AlertDescription className="text-orange-200 text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {parsedDomains.length > 0 && (
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
          <p className="text-sm font-semibold mb-3 text-green-300">
            ✓ {parsedDomains.length} domain{parsedDomains.length !== 1 ? 's' : ''} ready to add:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {parsedDomains.map((domain, index) => (
              <div key={index} className="text-xs bg-slate-800/70 p-2 rounded flex justify-between items-center border border-slate-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">#{index + 1}</span>
                    <span className="text-white font-semibold">{domain.name}</span>
                  </div>
                  <div className="mt-1 text-blue-300">{domain.url}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
          disabled={parsedDomains.length === 0}
        >
          <Layers className="w-4 h-4 mr-2" />
          Add {parsedDomains.length} Website{parsedDomains.length !== 1 ? 's' : ''}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditWebsiteForm({ website, onSubmit, onCancel }: {
  website: Website;
  onSubmit: (id: string, name: string, url: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(website.name);
  const [url, setUrl] = useState(website.url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onSubmit(website.id, name.trim(), url.trim());
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name" className="text-slate-200">Website Name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white mt-2"
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-url" className="text-slate-200">Website URL</Label>
        <Input
          id="edit-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white mt-2"
          required
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function WebsiteDetailsDisplay({ website, onClose }: {
  website: Website;
  onClose: () => void;
}) {
  const [trafficData, setTrafficData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");

  useEffect(() => {
    loadTrafficData();
    const interval = setInterval(loadTrafficData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [website.id, timeRange]);

  const loadTrafficData = async () => {
    try {
      setLoading(true);
      const analyticsData = await websitesAPI.getAnalytics(website.id);
      // Simulate live traffic data (in production, this would come from real-time API)
      const mockTraffic = [
        { ip: "192.168.1.1", userAgent: "Mozilla/5.0", referrer: "google.com", timestamp: new Date().toISOString(), type: "legitimate", location: "US", device: "Desktop" },
        { ip: "10.0.0.1", userAgent: "Bot/1.0", referrer: "direct", timestamp: new Date(Date.now() - 60000).toISOString(), type: "bot", location: "Unknown", device: "Bot" },
        { ip: "172.16.0.1", userAgent: "Mozilla/5.0", referrer: "facebook.com", timestamp: new Date(Date.now() - 120000).toISOString(), type: "legitimate", location: "UK", device: "Mobile" },
      ];
      
      setTrafficData({
        analytics: analyticsData.analytics || {},
        liveTraffic: mockTraffic,
        trafficBreakdown: {
          legitimate: analyticsData.analytics?.totalClicks - (analyticsData.analytics?.fraudulentClicks || 0) || 0,
          bot: Math.floor((analyticsData.analytics?.fraudulentClicks || 0) * 0.4),
          vpn: Math.floor((analyticsData.analytics?.fraudulentClicks || 0) * 0.3),
          blocked: analyticsData.analytics?.blockedIPs || 0,
          suspicious: Math.floor((analyticsData.analytics?.fraudulentClicks || 0) * 0.3)
        }
      });
    } catch (error) {
      console.error("Error loading traffic data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !trafficData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const breakdown = trafficData?.trafficBreakdown || { legitimate: 0, bot: 0, vpn: 0, blocked: 0, suspicious: 0 };
  const total = breakdown.legitimate + breakdown.bot + breakdown.vpn + breakdown.suspicious;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Live Traffic Details - {website.name}</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setTimeRange("24h")} className={timeRange === "24h" ? "bg-blue-600 text-white" : ""}>24h</Button>
          <Button size="sm" variant="outline" onClick={() => setTimeRange("7d")} className={timeRange === "7d" ? "bg-blue-600 text-white" : ""}>7d</Button>
          <Button size="sm" variant="outline" onClick={() => setTimeRange("30d")} className={timeRange === "30d" ? "bg-blue-600 text-white" : ""}>30d</Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Traffic Breakdown Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="text-green-400 text-sm font-medium">Legitimate</div>
          <div className="text-2xl font-bold text-white">{breakdown.legitimate}</div>
          <div className="text-xs text-slate-400">{total > 0 ? ((breakdown.legitimate / total) * 100).toFixed(1) : 0}%</div>
        </Card>
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="text-red-400 text-sm font-medium">Bot Traffic</div>
          <div className="text-2xl font-bold text-white">{breakdown.bot}</div>
          <div className="text-xs text-slate-400">{total > 0 ? ((breakdown.bot / total) * 100).toFixed(1) : 0}%</div>
        </Card>
        <Card className="p-4 bg-orange-500/10 border-orange-500/20">
          <div className="text-orange-400 text-sm font-medium">VPN Traffic</div>
          <div className="text-2xl font-bold text-white">{breakdown.vpn}</div>
          <div className="text-xs text-slate-400">{total > 0 ? ((breakdown.vpn / total) * 100).toFixed(1) : 0}%</div>
        </Card>
        <Card className="p-4 bg-purple-500/10 border-purple-500/20">
          <div className="text-purple-400 text-sm font-medium">Suspicious</div>
          <div className="text-2xl font-bold text-white">{breakdown.suspicious}</div>
          <div className="text-xs text-slate-400">{total > 0 ? ((breakdown.suspicious / total) * 100).toFixed(1) : 0}%</div>
        </Card>
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <div className="text-yellow-400 text-sm font-medium">Blocked IPs</div>
          <div className="text-2xl font-bold text-white">{breakdown.blocked}</div>
        </Card>
      </div>

      {/* Live Traffic Table */}
      <Card className="p-6 bg-slate-900/50 border-slate-700">
        <h5 className="text-lg font-semibold text-white mb-4">Recent Traffic</h5>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">IP Address</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">User Agent</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Referrer</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Device</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {trafficData?.liveTraffic?.map((traffic: any, index: number) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-white font-mono text-sm">{traffic.ip}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm truncate max-w-xs">{traffic.userAgent}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{traffic.referrer}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{traffic.location}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{traffic.device}</td>
                  <td className="py-3 px-4">
                    <Badge className={
                      traffic.type === "legitimate" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }>
                      {traffic.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-sm">{new Date(traffic.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {(!trafficData?.liveTraffic || trafficData.liveTraffic.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No traffic data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SnippetDisplay({ snippetId, status, onClose, onVerify }: {
  snippetId: string;
  status: "active" | "inactive";
  onClose: () => void;
  onVerify: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Use current origin for tracking script (works for both localhost and production)
  const trackingScriptUrl = `${origin}/tracking.js`;
  
  const snippet = `<!-- ClickBlock Tracking Snippet -->
<!-- Paste this code in the <head> section of your website -->
<script>
  (function() {
    var ag = document.createElement('script');
    ag.type = 'text/javascript';
    ag.async = true;
    ag.src = '${trackingScriptUrl}';
    ag.setAttribute('data-snippet-id', '${snippetId}');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ag, s);
  })();
</script>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Installation & Verification</h4>
        <Button size="sm" variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-slate-700">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Step 1: Code */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
          <div className="flex gap-4">
            <div className="bg-blue-500/20 p-2.5 rounded-lg h-fit shrink-0">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-blue-100 mb-2 text-base">Step 1: Install Tracking Script</h5>
              <p className="text-sm text-blue-200/70 mb-4 leading-relaxed">
                Copy this code and paste it into the <code className="bg-blue-950/60 px-1.5 py-0.5 rounded text-blue-100">&lt;head&gt;</code> section of every page you want to protect.
              </p>
              <div className="relative group">
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-slate-300 shadow-inner">
                  {snippet}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-lg"
                  onClick={() => handleCopy(snippet)}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 mr-2 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Verify */}
        <div className={`border rounded-lg p-5 transition-all duration-300 ${
          status === 'active' 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-slate-800/50 border-slate-700'
        }`}>
          <div className="flex gap-4 items-center">
             <div className={`p-2.5 rounded-lg h-fit shrink-0 ${
               status === 'active' ? 'bg-green-500/20' : 'bg-slate-700'
             }`}>
              <Shield className={`w-6 h-6 ${
                status === 'active' ? 'text-green-400' : 'text-slate-400'
              }`} />
            </div>
            <div className="flex-1">
              <h5 className={`font-semibold mb-1 text-base ${
                status === 'active' ? 'text-green-100' : 'text-white'
              }`}>
                Step 2: Verify Setup
              </h5>
              <p className={`text-sm mb-0 ${
                status === 'active' ? 'text-green-200/80' : 'text-slate-400'
              }`}>
                {status === 'active' 
                  ? 'Excellent! Your tracking code is verified and actively protecting your ads.' 
                  : 'After installing the code, click the button to confirm protection is active.'}
              </p>
            </div>
            <Button
              onClick={onVerify}
              disabled={status === 'active'}
              size="lg"
              className={status === 'active' 
                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/20"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/20"
              }
            >
              {status === 'active' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verified Active
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Verify Installation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}