import { Calendar } from "lucide-react";

interface DateRangeIndicatorProps {
  selectedRange: string;
  customStart?: string;
  customEnd?: string;
}

export function DateRangeIndicator({ selectedRange, customStart, customEnd }: DateRangeIndicatorProps) {
  const getDateRangeText = () => {
    const now = new Date();
    
    switch (selectedRange) {
      case "today":
        return `Today - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return `Yesterday - ${yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "7d":
        const week = new Date(now);
        week.setDate(week.getDate() - 7);
        return `${week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "14d":
        const twoWeeks = new Date(now);
        twoWeeks.setDate(twoWeeks.getDate() - 14);
        return `${twoWeeks.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "30d":
        const month = new Date(now);
        month.setDate(month.getDate() - 30);
        return `${month.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "90d":
        const quarter = new Date(now);
        quarter.setDate(quarter.getDate() - 90);
        return `${quarter.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "6m":
        const sixMonths = new Date(now);
        sixMonths.setMonth(sixMonths.getMonth() - 6);
        return `${sixMonths.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "1y":
        const year = new Date(now);
        year.setFullYear(year.getFullYear() - 1);
        return `${year.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "mtd":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return `${monthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (MTD)`;
      case "ytd":
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return `${yearStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (YTD)`;
      case "custom":
        if (customStart && customEnd) {
          const start = new Date(customStart);
          const end = new Date(customEnd);
          return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return "Custom Range";
      default:
        return "Last 7 Days";
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
      <Calendar className="w-4 h-4 text-blue-400" />
      <span className="text-sm text-blue-300">{getDateRangeText()}</span>
    </div>
  );
}
