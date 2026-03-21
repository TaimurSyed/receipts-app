export const focusAreas = [
  "productivity",
  "money",
  "mood",
  "relationships",
  "general patterns",
] as const;

export const recentEntries = [
  {
    id: "entry-101",
    title: "Avoided shipping work after a rough call",
    content: "Spent an hour pacing after a draining client call, then opened YouTube instead of finishing the landing page.",
    mood: 2,
    tags: ["work", "stress", "procrastination"],
    time: "Today · 11:10 AM",
    usedInInsight: true,
  },
  {
    id: "entry-102",
    title: "Late-night spend spiral",
    content: "Bought random desk accessories after telling myself I was just browsing. Felt wired, not excited.",
    mood: 2,
    tags: ["money", "stress"],
    time: "Yesterday · 11:48 PM",
    usedInInsight: true,
  },
  {
    id: "entry-103",
    title: "Gym morning, cleaner head",
    content: "Woke up annoyed, went to the gym anyway, and the whole day felt less hostile after that.",
    mood: 4,
    tags: ["health", "gym", "motivation"],
    time: "Yesterday · 8:05 AM",
    usedInInsight: true,
  },
  {
    id: "entry-104",
    title: "Voice memo about pressure",
    content: "Transcript: I keep saying I want freedom, but my schedule is all reaction and cleanup.",
    mood: 3,
    tags: ["work", "motivation"],
    time: "Thu · 9:14 PM",
    usedInInsight: false,
  },
];

export const insightCards = [
  {
    id: "pattern-1",
    type: "Pattern",
    title: "Avoidance follows emotional drain, not laziness.",
    body: "Your hardest procrastination entries cluster after emotionally expensive conversations. The work problem may actually be a recovery problem.",
    confidence: "High",
    evidence: ["entry-101", "entry-104"],
  },
  {
    id: "contradiction-1",
    type: "Contradiction",
    title: "You call it browsing. Your timeline calls it stress spending.",
    body: "Impulse purchases show up after low-mood or pressure-heavy entries, especially late at night. The purchases look more like regulation than reward.",
    confidence: "Medium",
    evidence: ["entry-102"],
  },
  {
    id: "receipt-1",
    type: "Weekly receipt",
    title: "Structure helps you more than motivation does.",
    body: "Your best entries this week came after movement, early starts, or a defined plan. Unstructured days look looser, more expensive, and more self-critical.",
    confidence: "High",
    evidence: ["entry-103", "entry-104"],
  },
];

export const timelineFilters = ["all", "work", "money", "stress", "relationships", "health"] as const;
