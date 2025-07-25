import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({ title, value, icon, color, change, trend = "up" }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend === "up" 
              ? "text-green-300 bg-green-500/20" 
              : trend === "down" 
              ? "text-red-300 bg-red-500/20"
              : "text-gray-300 bg-gray-500/20"
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/80">{title}</div>
    </div>
  );
}
