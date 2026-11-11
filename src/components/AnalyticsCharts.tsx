"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon, Layers } from "lucide-react";
import { Lead } from "@/types";

interface AnalyticsChartsProps {
  leads: Lead[];
}

// Brand Colors
const COLOR_PRIMARY_BLUE = "#2EA3E6";
const COLOR_HOT_PINK = "#FF2E63";
const COLOR_EMERALD = "#10B981";
const COLOR_AMBER = "#F59E0B";

export function AnalyticsCharts({ leads }: AnalyticsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Group leads by Campaign
  const campaignMap: Record<string, number> = {};
  leads.forEach((l) => {
    const shortName =
      l.campaign.length > 25 ? l.campaign.substring(0, 24) + "…" : l.campaign;
    campaignMap[shortName] = (campaignMap[shortName] || 0) + 1;
  });

  const campaignChartData = Object.entries(campaignMap)
    .map(([name, count]) => ({
      name,
      leads: count,
    }))
    .sort((a, b) => b.leads - a.leads);

  // 2. Group leads by Source (Facebook vs Instagram vs WhatsApp Direct)
  const sourceMap: Record<string, number> = {
    Facebook: 0,
    Instagram: 0,
    "WhatsApp Direct": 0,
  };

  leads.forEach((l) => {
    if (sourceMap[l.source] !== undefined) {
      sourceMap[l.source]++;
    } else {
      sourceMap[l.source] = 1;
    }
  });

  const sourceChartData = [
    { name: "Facebook", value: sourceMap["Facebook"] || 0, color: COLOR_PRIMARY_BLUE },
    { name: "Instagram", value: sourceMap["Instagram"] || 0, color: COLOR_HOT_PINK },
    {
      name: "WhatsApp Direct",
      value: sourceMap["WhatsApp Direct"] || 0,
      color: COLOR_EMERALD,
    },
  ].filter((item) => item.value > 0);

  const totalSourceLeads = sourceChartData.reduce((acc, curr) => acc + curr.value, 0);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-7 h-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
        <div className="lg:col-span-5 h-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* Chart 1: Bar Chart - Lead Volume by Campaign */}
      <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#2EA3E6]/10 flex items-center justify-center text-[#2EA3E6]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Lead Volume by Meta Campaign
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inbound Click-to-WhatsApp chats per creative campaign
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2EA3E6]/10 text-[#2EA3E6] border border-[#2EA3E6]/20">
            {campaignChartData.length} Campaigns Active
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          {campaignChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No campaign data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 45 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.2)"
                />
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-slate-600 dark:text-slate-400 font-medium"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-slate-600 dark:text-slate-400"
                />
                <Tooltip
                  cursor={{ fill: "rgba(46, 163, 230, 0.08)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-slate-900 dark:text-white mb-1">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-[#2EA3E6] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#2EA3E6]" />
                            {payload[0].value} Inbound WhatsApp Leads
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="leads"
                  fill={COLOR_PRIMARY_BLUE}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Donut / Pie Chart - Split by Source */}
      <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF2E63]/10 flex items-center justify-center text-[#FF2E63]">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Lead Distribution by Source
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Facebook vs. Instagram Ads split
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {totalSourceLeads} Total
          </span>
        </div>

        <div className="h-72 w-full relative flex items-center justify-center">
          {sourceChartData.length === 0 ? (
            <div className="text-slate-400 text-sm">No source data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const pct = totalSourceLeads > 0
                        ? Math.round(((data.value as number) / totalSourceLeads) * 100)
                        : 0;
                      return (
                        <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-xs">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {data.name}
                          </p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                            {data.value} leads ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  content={({ payload }) => (
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {payload?.map((item: any, i: number) => {
                        const original = sourceChartData.find(
                          (s) => s.name === item.value
                        );
                        const pct =
                          totalSourceLeads > 0 && original
                            ? Math.round((original.value / totalSourceLeads) * 100)
                            : 0;
                        return (
                          <div
                            key={i}
                            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.value}</span>
                            <span className="text-[11px] font-bold text-slate-400">
                              ({pct}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Central Donut Stat */}
          {totalSourceLeads > 0 && (
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-2xl font-black text-slate-900 dark:text-white">
                {totalSourceLeads}
              </span>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Leads
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
