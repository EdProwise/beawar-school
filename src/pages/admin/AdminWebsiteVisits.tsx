import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Calendar,
  TrendingUp,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuthSafe } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  daily: { date: string; count: number }[];
  summary: {
    totalVisits: number;
    todayVisits: number;
    yesterdayVisits: number;
    weekVisits: number;
    monthVisits: number;
  };
  topPages: { page: string; count: number }[];
}

const fetchAnalytics = async (from?: string, to?: string): Promise<AnalyticsData> => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const res = await fetch(`/api/visits/analytics?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

const AdminWebsiteVisits = () => {
  const navigate = useNavigate();
  const auth = useAuthSafe();
  const user = auth?.user;
  const authLoading = auth?.isLoading ?? false;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["visit-analytics", appliedFrom, appliedTo],
    queryFn: () => fetchAnalytics(appliedFrom || undefined, appliedTo || undefined),
  });

  const handleFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setAppliedFrom("");
    setAppliedTo("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const summary = data?.summary;
  const todayChange =
    summary && summary.yesterdayVisits > 0
      ? Math.round(
          ((summary.todayVisits - summary.yesterdayVisits) / summary.yesterdayVisits) * 100
        )
      : summary?.todayVisits
        ? 100
        : 0;

  const cards = [
    {
      title: "Total Visits",
      value: summary?.totalVisits ?? 0,
      icon: Globe,
      color: "bg-primary",
      subtitle: appliedFrom ? "Filtered period" : "All time",
    },
    {
      title: "Today's Visits",
      value: summary?.todayVisits ?? 0,
      icon: Eye,
      color: "bg-green-500",
      subtitle:
        todayChange !== 0
          ? `${todayChange > 0 ? "+" : ""}${todayChange}% vs yesterday`
          : "Same as yesterday",
      trend: todayChange,
    },
    {
      title: "This Week",
      value: summary?.weekVisits ?? 0,
      icon: TrendingUp,
      color: "bg-blue-500",
      subtitle: "Current week",
    },
    {
      title: "This Month",
      value: summary?.monthVisits ?? 0,
      icon: Calendar,
      color: "bg-purple-500",
      subtitle: "Current month",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-heading text-2xl font-bold mb-2 flex items-center gap-2">
            <Eye className="w-7 h-7" />
            Website Visits
          </h1>
          <p className="text-primary-foreground/80">
            Monitor your website traffic and page visits.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{card.title}</p>
                  <p className="font-heading text-3xl font-bold text-foreground">
                    {isLoading ? "..." : card.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {card.trend !== undefined && card.trend !== 0 && (
                      card.trend > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )
                    )}
                    {card.subtitle}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Pages */}
        {data?.topPages && data.topPages.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Pages
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {data.topPages.map((p) => (
                <div
                  key={p.page}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30"
                >
                  <span className="text-sm font-medium text-foreground truncate mr-2">
                    {p.page === "/" ? "Home" : p.page}
                  </span>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Filter + Table */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Visit Log
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-44"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-44"
              />
            </div>
            <Button onClick={handleFilter} size="sm">
              <Search className="w-4 h-4 mr-1" />
              Filter
            </Button>
            {(appliedFrom || appliedTo) && (
              <Button onClick={handleClear} variant="outline" size="sm">
                Clear
              </Button>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : data?.daily && data.daily.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.daily.map((row, idx) => (
                    <TableRow key={row.date}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">
                        {new Date(row.date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {row.count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Eye className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No visit data available yet.</p>
              <p className="text-xs mt-1">
                Visits will be recorded as users browse your website.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWebsiteVisits;
