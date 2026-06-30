// ── Winning Week helpers (ported from winning-week-app) ───────────────────────

const WW_STORAGE_KEYS = {
  currentWeek: 'ec_current_week',
  weekHistory: 'ec_week_history',
  onboardingDone: 'ec_onboarding_done',
};

const WW_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const WW_TRIAGE = {
  do:       { label: 'Do',       color: '#0b5389', bg: '#e2f6fd' },
  defer:    { label: 'Defer',    color: '#ff9500', bg: '#fff3e0' },
  delegate: { label: 'Delegate', color: '#34c759', bg: '#e8f8ee' },
  delete:   { label: 'Delete',   color: '#ef4635', bg: '#fdecea' },
};

const WW_EVENT_TYPES = [
  { key: 'leverage', label: 'Leverage', color: '#0b5389', bg: '#e2f6fd' },
  { key: 'deep',     label: 'Deep work', color: '#2E8B57', bg: '#e8f8ee' },
  { key: 'meeting',  label: 'Meeting',  color: '#ff9500', bg: '#fff3e0' },
  { key: 'admin',    label: 'Admin',    color: '#a6a6a6', bg: '#f6f7f9' },
];

const WW_REFLECTION_PROMPTS = [
  'What drained energy this week?',
  'What created the most leverage?',
  'What would you do differently?',
];

const WW_REVIEW_PROMPTS = [
  'Did your priority get done?',
  'What gave you energy this week?',
  'What will you protect next week?',
  'What almost derailed you?',
];

const WW_ONBOARDING_STEPS = [
  { emoji: '⚡', title: 'Win every week', body: 'A simple ritual that takes 30 minutes on Sunday and pays back hours all week.' },
  { emoji: '🎯', title: 'One priority wins the week', body: 'Identify the single outcome that makes everything else easier or unnecessary.' },
  { emoji: '📋', title: 'Interrogate your calendar', body: "Remove what doesn't serve your priority. Protect deep work. Eliminate landmines." },
  { emoji: '▶︎', title: 'Execute with clarity', body: 'Each day you know exactly what to do first. No guessing, no drift.' },
];

function wwGetMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function wwGetWeekLabel(date = new Date()) {
  const start = wwGetMonday(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

function wwGetWeekId(date = new Date()) {
  return wwGetMonday(date).toISOString().split('T')[0];
}

function wwGetTodayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function wwGetTodayDayKey() {
  const map = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri' };
  return map[wwGetTodayName()] || 'Mon';
}

function wwCreateEmptyWeek() {
  return {
    id: wwGetWeekId(),
    label: wwGetWeekLabel(),
    createdAt: new Date().toISOString(),
    lesson: '',
    priorities: [
      { id: '1', text: '', selected: false },
      { id: '2', text: '', selected: false },
      { id: '3', text: '', selected: false },
    ],
    calendarEvents: [],
    tasks: [],
    timeBlocks: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] },
    review: { rating: 0, priorityDone: 0, energyLevel: 5, focusQuality: 5, reflection: '' },
  };
}

function wwTriageColor(triage) {
  return (WW_TRIAGE[triage] || WW_TRIAGE.do).color;
}

function wwTriageBg(triage) {
  return (WW_TRIAGE[triage] || WW_TRIAGE.do).bg;
}

function wwEventType(key) {
  return WW_EVENT_TYPES.find(t => t.key === key) || WW_EVENT_TYPES[2];
}

function wwSeedDemoWeek() {
  const week = wwCreateEmptyWeek();
  week.lesson = 'Block morning time for deep work before meetings stack up.';
  week.priorities = [
    { id: '1', text: 'Review Q3 budget report', selected: true },
    { id: '2', text: 'Ship project timeline update', selected: false },
    { id: '3', text: 'Prep for client call', selected: false },
  ];
  week.calendarEvents = [
    { id: 'e1', title: 'Team standup', day: 'Mon', type: 'meeting', flagged: false },
    { id: 'e2', title: 'Budget deep work', day: 'Mon', type: 'deep', flagged: false },
    { id: 'e3', title: 'Sprint planning', day: 'Tue', type: 'meeting', flagged: false },
    { id: 'e4', title: 'Design review', day: 'Tue', type: 'leverage', flagged: false },
    { id: 'e5', title: 'Client call - Acme', day: 'Wed', type: 'leverage', flagged: false },
    { id: 'e6', title: 'Email admin block', day: 'Thu', type: 'admin', flagged: false },
    { id: 'e7', title: 'All-hands prep', day: 'Fri', type: 'meeting', flagged: false },
  ];
  week.tasks = [
    { id: 't1', text: 'Review Q3 budget report', triage: 'do', done: false },
    { id: 't2', text: 'Team standup - Engineering', triage: 'do', done: false },
    { id: 't3', text: 'Reply to HR onboarding memo', triage: 'defer', done: false },
    { id: 't4', text: 'Update project timeline slides', triage: 'do', done: false },
    { id: 't5', text: 'Client call - Acme Corp', triage: 'do', done: false },
    { id: 't6', text: 'Vendor contract approval', triage: 'delegate', done: false },
    { id: 't7', text: 'IT security training', triage: 'delete', done: false },
  ];
  return week;
}
