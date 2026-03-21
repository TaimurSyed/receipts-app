import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { EvidenceSnippet, InsightRecord } from "@/lib/insights";

export type JournalDay = {
  date: string;
  displayDate: string;
  entries: EvidenceSnippet[];
};

export type JournalWeek = {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
  days: JournalDay[];
};

export type JournalMonth = {
  key: string;
  label: string;
  year: number;
  month: number;
  weeks: JournalWeek[];
};

export type JournalYear = {
  year: number;
  months: JournalMonth[];
};

export type MonthGridCell = {
  date: string;
  dayNumber: number;
  inMonth: boolean;
  hasEntries: boolean;
};

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = (day + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfWeek(date: Date) {
  const copy = startOfWeek(date);
  copy.setDate(copy.getDate() + 6);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatRangeLabel(start: Date, end: Date) {
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export async function getJournalWeeks(): Promise<JournalWeek[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("entries")
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(240);

  if (error || !data) return [];

  const weekMap = new Map<string, JournalWeek>();

  for (const entry of data) {
    const created = new Date(entry.created_at);
    const weekStart = startOfWeek(created);
    const weekEnd = endOfWeek(created);
    const weekKey = formatDate(weekStart);
    const dayKey = formatDate(created);

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        key: weekKey,
        label: formatRangeLabel(weekStart, weekEnd),
        startDate: weekKey,
        endDate: formatDate(weekEnd),
        days: [],
      });
    }

    const week = weekMap.get(weekKey)!;
    let day = week.days.find((item) => item.date === dayKey);

    if (!day) {
      day = {
        date: dayKey,
        displayDate: created.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        entries: [],
      };
      week.days.push(day);
    }

    day.entries.push({
      id: entry.id,
      title: entry.title || "Untitled entry",
      content: entry.content,
      createdAt: created.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      dateKey: dayKey,
    });
  }

  return [...weekMap.values()].map((week) => ({
    ...week,
    days: week.days.sort((a, b) => (a.date < b.date ? 1 : -1)),
  }));
}

export async function getJournalArchive(): Promise<JournalYear[]> {
  const weeks = await getJournalWeeks();
  const yearMap = new Map<number, Map<string, JournalMonth>>();

  for (const week of weeks) {
    const start = new Date(`${week.startDate}T12:00:00`);
    const year = start.getFullYear();
    const month = start.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const months = yearMap.get(year)!;

    if (!months.has(monthKey)) {
      months.set(monthKey, {
        key: monthKey,
        label: start.toLocaleDateString("en-US", { month: "long" }),
        year,
        month,
        weeks: [],
      });
    }

    months.get(monthKey)!.weeks.push(week);
  }

  return [...yearMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      months: [...months.values()].sort((a, b) => b.month - a.month),
    }));
}

export function getWeekInsights(insights: InsightRecord[], weekKey?: string) {
  const weeklyInsights = insights.filter((insight) => (insight.scope ?? "week") === "week");
  if (!weekKey) return weeklyInsights;

  return weeklyInsights.filter((insight) => {
    if (insight.periodStart) return insight.periodStart === weekKey;
    if (!insight.createdAt) return true;
    return formatDate(startOfWeek(new Date(insight.createdAt))) === weekKey;
  });
}

export function getMonthInsights(insights: InsightRecord[], monthKey?: string) {
  const monthlyInsights = insights.filter((insight) => (insight.scope ?? "week") === "month");
  if (!monthKey) return monthlyInsights;

  return monthlyInsights.filter((insight) => {
    if (insight.periodStart) return insight.periodStart.startsWith(monthKey);
    if (!insight.createdAt) return false;
    return insight.createdAt.slice(0, 7) === monthKey;
  });
}

export function buildMonthGrid(month: JournalMonth): MonthGridCell[] {
  const firstDay = new Date(Date.UTC(month.year, month.month, 1));
  const lastDay = new Date(Date.UTC(month.year, month.month + 1, 0));
  const gridStart = startOfWeek(firstDay);
  const gridEnd = endOfWeek(lastDay);
  const datesWithEntries = new Set(month.weeks.flatMap((week) => week.days.map((day) => day.date)));

  const cells: MonthGridCell[] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const date = formatDate(cursor);
    cells.push({
      date,
      dayNumber: cursor.getUTCDate(),
      inMonth: cursor.getUTCMonth() === month.month,
      hasEntries: datesWithEntries.has(date),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return cells;
}
