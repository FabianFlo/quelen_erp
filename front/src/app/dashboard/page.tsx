"use client";

import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { CalendarDays, Download } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4 mr-2" />
            Pick a date
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Overview Tabs */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="font-medium text-black">Overview</div>
        <div>Analytics</div>
        <div>Reports</div>
        <div>Notifications</div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="New Subscriptions" value="4,682" sub="Since Last week" delta="+15.54%" positive />
        <Card title="New Orders" value="1,226" sub="Since Last week" delta="-40.2%" />
        <Card title="Avg Order Revenue" value="1,080" sub="Since Last week" delta="+10.8%" positive />
        <Card title="Total Revenue" value="$15,231.89" sub="+23.01% from last month" chart />
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Graph title="Sale Activity - Monthly" subtitle="Showing total sales for the last 6 months" />
        <Graph title="Subscriptions" subtitle="+2350" bar />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-sm font-semibold mb-2">Payments</h2>
          <input
            placeholder="Filter emails..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="text-sm font-semibold mb-2">Team Members</h2>
          <p className="text-xs text-muted-foreground mb-2">
            Invite your team members to collaborate.
          </p>
          {/* Puedes agregar una lista de miembros aquí */}
        </div>
      </div>
    </div>
  );
}

// COMPONENTE CARD
function Card({
  title,
  value,
  sub,
  delta,
  positive = false,
  chart = false,
}: {
  title: string;
  value: string;
  sub: string;
  delta?: string;
  positive?: boolean;
  chart?: boolean;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-1">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
      {delta && (
        <div className={cn("text-xs font-medium", positive ? "text-green-600" : "text-red-600")}>
          {delta}
        </div>
      )}
      {chart && <div className="mt-2 text-sm text-muted-foreground italic">[Chart here]</div>}
    </div>
  );
}

// COMPONENTE GRAPH
function Graph({
  title,
  subtitle,
  bar = false,
}: {
  title: string;
  subtitle: string;
  bar?: boolean;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{subtitle}</div>
      <div className="h-32 rounded bg-gradient-to-t from-orange-100 to-green-100 flex items-center justify-center text-xs text-muted-foreground">
        {bar ? "[Bar Chart]" : "[Area Chart]"}
      </div>
    </div>
  );
}
