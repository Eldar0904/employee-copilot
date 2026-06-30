// ── Winning Week helpers ──────────────────────────────────────────────────────

const WW_STORAGE_KEYS = {
  currentWeek: 'ec_current_week',
  weekHistory: 'ec_week_history',
  onboardingDone: 'ec_onboarding_done',
};

const WW_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const WW_TRIAGE = {
  do:       { label: () => I18N.triage.do,       color: '#0b5389', bg: '#e2f6fd' },
  defer:    { label: () => I18N.triage.defer,    color: '#ff9500', bg: '#fff3e0' },
  delegate: { label: () => I18N.triage.delegate, color: '#34c759', bg: '#e8f8ee' },
  delete:   { label: () => I18N.triage.delete,   color: '#ef4635', bg: '#fdecea' },
};

const WW_EVENT_TYPES = [
  { key: 'leverage', label: () => I18N.eventTypes.leverage, color: '#0b5389', bg: '#e2f6fd' },
  { key: 'deep',     label: () => I18N.eventTypes.deep,     color: '#2E8B57', bg: '#e8f8ee' },
  { key: 'meeting',  label: () => I18N.eventTypes.meeting,  color: '#ff9500', bg: '#fff3e0' },
  { key: 'admin',    label: () => I18N.eventTypes.admin,    color: '#a6a6a6', bg: '#f6f7f9' },
];

const WW_REFLECTION_PROMPTS = () => I18N.reflectionPrompts;
const WW_REVIEW_PROMPTS = () => I18N.reviewPrompts;
const WW_ONBOARDING_STEPS = () => I18N.onboardingSteps;

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
  return `${start.toLocaleDateString(LOCALE, opts)} – ${end.toLocaleDateString(LOCALE, opts)}`;
}

function wwGetWeekId(date = new Date()) {
  return wwGetMonday(date).toISOString().split('T')[0];
}

function wwGetTodayName() {
  return new Date().toLocaleDateString(LOCALE, { weekday: 'long' });
}

function wwGetTodayDayKey() {
  const map = {
    понедельник: 'Mon', вторник: 'Tue', среда: 'Wed', четверг: 'Thu', пятница: 'Fri',
    Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri',
  };
  return map[wwGetTodayName().toLowerCase()] || 'Mon';
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
  const t = WW_EVENT_TYPES.find(e => e.key === key) || WW_EVENT_TYPES[2];
  return { ...t, label: typeof t.label === 'function' ? t.label() : t.label };
}

function wwSeedDemoWeek() {
  const week = wwCreateEmptyWeek();
  week.lesson = 'Утро лучше отдавать глубокой работе, пока не накопились встречи.';
  week.priorities = [
    { id: '1', text: 'Проверить отчёт по бюджету Q3', selected: true },
    { id: '2', text: 'Обновить таймлайн проекта', selected: false },
    { id: '3', text: 'Подготовиться к звонку с клиентом', selected: false },
  ];
  week.calendarEvents = [
    { id: 'e1', title: 'Стендап команды', day: 'Mon', type: 'meeting', flagged: false },
    { id: 'e2', title: 'Глубокая работа: бюджет', day: 'Mon', type: 'deep', flagged: false },
    { id: 'e3', title: 'Планирование спринта', day: 'Tue', type: 'meeting', flagged: false },
    { id: 'e4', title: 'Ревью дизайна', day: 'Tue', type: 'leverage', flagged: false },
    { id: 'e5', title: 'Звонок с клиентом Acme', day: 'Wed', type: 'leverage', flagged: false },
    { id: 'e6', title: 'Блок на почту', day: 'Thu', type: 'admin', flagged: false },
    { id: 'e7', title: 'Подготовка к общему собранию', day: 'Fri', type: 'meeting', flagged: false },
  ];
  week.tasks = [
    { id: 't1', text: 'Проверить отчёт по бюджету Q3', triage: 'do', done: false },
    { id: 't2', text: 'Стендап — разработка', triage: 'do', done: false },
    { id: 't3', text: 'Ответить на памятку HR по онбордингу', triage: 'defer', done: false },
    { id: 't4', text: 'Обновить слайды таймлайна проекта', triage: 'do', done: false },
    { id: 't5', text: 'Звонок с клиентом Acme Corp', triage: 'do', done: false },
    { id: 't6', text: 'Согласование договора с поставщиком', triage: 'delegate', done: false },
    { id: 't7', text: 'Обучение по ИБ', triage: 'delete', done: false },
  ];
  return week;
}
