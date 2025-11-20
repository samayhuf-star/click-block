import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DateFilterProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  customStart?: string;
  customEnd?: string;
  onCustomRangeChange?: (start: string, end: string) => void;
}

export function DateFilter({ 
  selectedRange, 
  onRangeChange, 
  customStart, 
  customEnd, 
  onCustomRangeChange 
}: DateFilterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStart, setTempStart] = useState(customStart || "");
  const [tempEnd, setTempEnd] = useState(customEnd || "");

  const dateRanges = [
    { id: "today", label: "Today", description: "Data from today" },
    { id: "yesterday", label: "Yesterday", description: "Data from yesterday" },
    { id: "7d", label: "Last 7 Days", description: "Past week" },
    { id: "14d", label: "Last 14 Days", description: "Past 2 weeks" },
    { id: "30d", label: "Last 30 Days", description: "Past month" },
    { id: "90d", label: "Last 90 Days", description: "Past 3 months" },
    { id: "6m", label: "Last 6 Months", description: "Past 6 months" },
    { id: "1y", label: "Last Year", description: "Past 12 months" },
    { id: "mtd", label: "Month to Date", description: "Current month" },
    { id: "ytd", label: "Year to Date", description: "Current year" },
    { id: "custom", label: "Custom Range", description: "Pick specific dates" },
  ];

  const getSelectedLabel = () => {
    if (selectedRange === "custom" && customStart && customEnd) {
      return `${customStart} to ${customEnd}`;
    }
    return dateRanges.find(r => r.id === selectedRange)?.label || "Last 7 Days";
  };

  const handleRangeSelect = (rangeId: string) => {
    if (rangeId === "custom") {
      setShowCustomPicker(true);
      setShowDropdown(false);
    } else {
      onRangeChange(rangeId);
      setShowDropdown(false);
      setShowCustomPicker(false);
    }
  };

  const applyCustomRange = () => {
    if (tempStart && tempEnd && onCustomRangeChange) {
      onCustomRangeChange(tempStart, tempEnd);
      onRangeChange("custom");
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Filter Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-blue-400" />
        <span className="text-sm">{getSelectedLabel()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-xs text-slate-400 px-3 py-2 mb-1">Quick Select</div>
            {dateRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => handleRangeSelect(range.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedRange === range.id 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="text-sm">{range.label}</div>
                <div className="text-xs text-slate-500">{range.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Date Picker */}
      {showCustomPicker && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 p-4">
          <h4 className="text-sm font-medium mb-4">Custom Date Range</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2">Start Date</label>
              <input
                type="date"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomPicker(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCustomRange}
                disabled={!tempStart || !tempEnd}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showDropdown || showCustomPicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowCustomPicker(false);
          }}
        />
      )}
    </div>
  );
}
