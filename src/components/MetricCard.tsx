
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon?: string;
  color?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  color = "bg-primary",
  description 
}) => {
  const getTrendColor = (trend?: number) => {
    if (!trend) return "text-gray-500";
    return trend > 0 ? "text-green-600" : "text-red-600";
  };

  const getTrendSymbol = (trend?: number) => {
    if (!trend) return "";
    return trend > 0 ? "↗" : "↘";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && (
          <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white text-lg`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={`text-sm font-medium ${getTrendColor(trend)}`}>
              {getTrendSymbol(trend)} {Math.abs(trend)}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
