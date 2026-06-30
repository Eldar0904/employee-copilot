// ── Bilingual localization ────────────────────────────────────────────────────

const LANG_STORAGE_KEY = 'ec_lang';

const STRINGS = {
  ru: {
    appTitle: 'Копилот сотрудника',
    loading: 'Загрузка…',
    errorTitle: 'Не удалось загрузить приложение.',
    copilot: 'Копилот',

    tabPlan: 'План',
    tabAudit: 'Аудит',
    tabDo: 'Дела',
    tabReview: 'Обзор',
    tabInbox: 'Входящие',
    tabMe: 'Я',

    onboardingContinue: 'Далее',
    onboardingStart: 'Начать планирование',
    onboardingSkip: 'Пропустить',

    planTitle: 'План на неделю',
    step1: 'Шаг 1 · Урок недели',
    step2: 'Шаг 2 · Главный приоритет',
    step3: 'Шаг 3 · Разбор календаря',
    step4: 'Шаг 4 · Сортировка задач',
    lessonQuestion: 'Чему научила прошлая неделя?',
    lessonPlaceholder: 'Запишите урок здесь…',
    priorityQuestion: 'Один результат, который упростит всё остальное',
    priorityPlaceholder: n => `Приоритет ${n}…`,
    priorityHint: 'Нажмите на номер, чтобы отметить главный приоритет',

    auditTitle: 'Аудит и сортировка',
    weekEvents: 'События на этой неделе',
    noEvents: 'Событий пока нет. Добавьте неделю ниже.',
    addEvent: '+ Добавить событие',
    eventFlagHint: 'Нажмите на событие, чтобы отметить к удалению',
    triageQuestion: 'Решите судьбу каждой задачи',
    noTasks: 'Задач пока нет. Добавьте то, что на вас висит.',
    addTask: '+ Добавить задачу',
    triageHint: 'Нажмите: Сделать → Отложить → Делегировать → Удалить',
    eventNamePlaceholder: 'Название события…',
    taskDescPlaceholder: 'Описание задачи…',
    cancel: 'Отмена',
    confirmAddEvent: 'Добавить',
    confirmAddTask: 'Добавить',

    greeting: 'Доброе утро, Сара 👋',
    allTasksDone: n => `Все ${formatTasks(n)} выполнены — отличная неделя!`,
    tasksLeftFocus: (n, text) => `Осталось ${formatTasks(n)}. Фокус: «${text}»`,
    tasksRemaining: n => `На этой неделе осталось ${formatTasks(n)}.`,
    statTasksDone: 'Задачи',
    statDeepWork: 'Глубокая работа',
    statMeetings: 'Встречи',
    statRemoved: 'Удалено',
    blocks: 'блоков',
    events: 'событий',
    leveragedPriority: 'Главный приоритет',
    doListProgress: 'Прогресс списка «Сделать»',
    todaysPlan: 'План на сегодня',
    noEventsForDay: day => `Нет событий на ${day}. Добавьте в разделе «Аудит».`,
    doList: 'Список «Сделать»',
    noDoTasks: 'Нет задач со статусом «Сделать». Добавьте в разделе «Аудит».',
    doneCheck: 'Готово ✓',
    deepWork: 'глубокая работа',

    reviewTitle: 'Обзор недели',
    weekAtGlance: 'Неделя в целом',
    weeksTracked: 'Недель отслеживается',
    thisWeekPriority: 'Приоритет этой недели',
    howWasWeek: 'Как прошла неделя?',
    overallRating: 'Общая оценка',
    selfAssessment: 'Самооценка',
    priorityComplete: 'Приоритет выполнен',
    energyLevel: 'Уровень энергии',
    focusQuality: 'Качество фокуса',
    reflection: 'Рефлексия',
    reflectionPlaceholder: 'Что возьмёте с собой на следующую неделю?',
    pastWeeks: n => `Прошлые недели (${n})`,

    markPending: 'Вернуть в работу',
    markDone: 'Отметить выполненным',
    completed: 'Выполнено',
    pending: 'В ожидании',

    messages: 'Сообщения',
    searchMessages: 'Поиск сообщений',
    departments: 'Отделы',
    directMessages: 'Личные сообщения',
    deptChannel: 'Канал отдела',
    unread: 'непрочит.',
    online: 'В сети',
    typeMessage: 'Напишите сообщение…',

    meName: 'Сара Ахмед',
    meRole: 'Менеджер продукта · PMO',
    available: 'Доступна',
    doneThisWeek: 'Сделано за неделю',
    pendingLabel: 'В ожидании',

    settingsLanguage: 'Язык',
    settingsNotifications: 'Уведомления',
    settingsPrivacy: 'Конфиденциальность',
    settingsAppearance: 'Оформление',
    settingsHelp: 'Помощь и поддержка',
    langRu: 'Русский',
    langEn: 'English',

    triage: {
      do: 'Сделать',
      defer: 'Отложить',
      delegate: 'Делегировать',
      delete: 'Удалить',
    },

    eventTypes: {
      leverage: 'Рычаг',
      deep: 'Глубокая работа',
      meeting: 'Встреча',
      admin: 'Админ',
    },

    days: { Mon: 'Пн', Tue: 'Вт', Wed: 'Ср', Thu: 'Чт', Fri: 'Пт' },

    reflectionPrompts: [
      'Что забирало энергию на этой неделе?',
      'Что дало наибольший рычаг?',
      'Что сделали бы иначе?',
    ],

    reviewPrompts: [
      'Приоритет выполнен?',
      'Что давало энергию на этой неделе?',
      'Что защитите на следующей неделе?',
      'Что чуть не сбило с курса?',
    ],

    onboardingSteps: [
      { emoji: '⚡', title: 'Побеждайте каждую неделю', body: 'Простой ритуал на 30 минут в воскресенье, который окупается часами в течение всей недели.' },
      { emoji: '🎯', title: 'Один приоритет решает неделю', body: 'Определите единственный результат, который упростит или сделает ненужным всё остальное.' },
      { emoji: '📋', title: 'Разберите календарь', body: 'Уберите то, что не служит приоритету. Защитите глубокую работу. Устраните минные поля.' },
      { emoji: '▶︎', title: 'Действуйте ясно', body: 'Каждый день вы точно знаете, с чего начать. Без догадок и суеты.' },
    ],
  },

  en: {
    appTitle: 'Employee Copilot',
    loading: 'Loading…',
    errorTitle: 'Something went wrong loading the app.',
    copilot: 'Copilot',

    tabPlan: 'Plan',
    tabAudit: 'Audit',
    tabDo: 'Do',
    tabReview: 'Review',
    tabInbox: 'Inbox',
    tabMe: 'Me',

    onboardingContinue: 'Continue',
    onboardingStart: 'Start planning',
    onboardingSkip: 'Skip',

    planTitle: 'Plan your week',
    step1: 'Step 1 · Lesson from last week',
    step2: 'Step 2 · Leveraged priority',
    step3: 'Step 3 · Calendar audit',
    step4: 'Step 4 · Task triage',
    lessonQuestion: 'What did last week teach you?',
    lessonPlaceholder: 'Write your lesson here…',
    priorityPlaceholder: n => `Priority ${n}…`,
    priorityQuestion: 'One outcome that makes everything else easier',
    priorityHint: 'Tap a number to mark your leveraged priority',

    auditTitle: 'Audit & triage',
    weekEvents: 'Events this week',
    noEvents: 'No events yet. Add your week below.',
    addEvent: '+ Add event',
    eventFlagHint: 'Tap an event to flag for removal',
    triageQuestion: 'Decide the fate of each task',
    noTasks: 'No tasks yet. Add what\'s on your plate.',
    addTask: '+ Add task',
    triageHint: 'Tap to cycle: Do → Defer → Delegate → Delete',
    eventNamePlaceholder: 'Event name…',
    taskDescPlaceholder: 'Task description…',
    cancel: 'Cancel',
    confirmAddEvent: 'Add',
    confirmAddTask: 'Add',

    greeting: 'Good morning, Sara 👋',
    allTasksDone: n => `All ${formatTasks(n)} done — great week!`,
    tasksLeftFocus: (n, text) => `${formatTasks(n)} left. Focus: "${text}"`,
    tasksRemaining: n => `${formatTasks(n)} remaining this week.`,
    statTasksDone: 'Tasks done',
    statDeepWork: 'Deep work',
    statMeetings: 'Meetings',
    statRemoved: 'Removed',
    blocks: 'blocks',
    events: 'events',
    leveragedPriority: 'Leveraged priority',
    doListProgress: 'Do list progress',
    todaysPlan: "Today's plan",
    noEventsForDay: day => `No events on ${day}. Add some in Audit.`,
    doList: 'Do list',
    noDoTasks: 'No Do tasks yet. Add some in Audit.',
    doneCheck: 'Done ✓',
    deepWork: 'deep work',

    reviewTitle: 'Weekly review',
    weekAtGlance: 'Week at a glance',
    weeksTracked: 'Weeks tracked',
    thisWeekPriority: "This week's priority",
    howWasWeek: 'How was your week?',
    overallRating: 'Overall rating',
    selfAssessment: 'Self-assessment',
    priorityComplete: 'Priority complete',
    energyLevel: 'Energy level',
    focusQuality: 'Focus quality',
    reflection: 'Reflection',
    reflectionPlaceholder: 'What will you carry into next week?',
    pastWeeks: n => `Past weeks (${n})`,

    markPending: 'Mark as pending',
    markDone: 'Mark as done',
    completed: 'Completed',
    pending: 'Pending',

    messages: 'Messages',
    searchMessages: 'Search messages',
    departments: 'Departments',
    directMessages: 'Direct Messages',
    deptChannel: 'Dept. channel',
    unread: 'unread',
    online: 'Online',
    typeMessage: 'Type a message…',

    meName: 'Sara Ahmed',
    meRole: 'Product Manager · PMO',
    available: 'Available',
    doneThisWeek: 'Done this week',
    pendingLabel: 'Pending',

    settingsLanguage: 'Language',
    settingsNotifications: 'Notifications',
    settingsPrivacy: 'Privacy',
    settingsAppearance: 'Appearance',
    settingsHelp: 'Help & support',
    langRu: 'Русский',
    langEn: 'English',

    triage: {
      do: 'Do',
      defer: 'Defer',
      delegate: 'Delegate',
      delete: 'Delete',
    },

    eventTypes: {
      leverage: 'Leverage',
      deep: 'Deep work',
      meeting: 'Meeting',
      admin: 'Admin',
    },

    days: { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri' },

    reflectionPrompts: [
      'What drained energy this week?',
      'What gave the most leverage?',
      'What would you do differently?',
    ],

    reviewPrompts: [
      'Was the priority completed?',
      'What gave you energy this week?',
      'What will you protect next week?',
      'What almost knocked you off course?',
    ],

    onboardingSteps: [
      { emoji: '⚡', title: 'Win your week', body: 'A simple 30-minute Sunday ritual that pays back hours all week long.' },
      { emoji: '🎯', title: 'One priority rules the week', body: 'Identify the single outcome that makes everything else easier or unnecessary.' },
      { emoji: '📋', title: 'Audit your calendar', body: 'Remove what doesn\'t serve your priority. Protect deep work. Clear the landmines.' },
      { emoji: '▶︎', title: 'Execute with clarity', body: 'Every day you know exactly what to work on first. No guessing, no scrambling.' },
    ],
  },
};

let currentLang = 'ru';
let LOCALE = 'ru-RU';
let I18N = STRINGS.ru;

function getLang() {
  return currentLang;
}

function getLocale() {
  return LOCALE;
}

function formatTasks(n) {
  if (currentLang === 'en') return n === 1 ? '1 task' : `${n} tasks`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} задач`;
  if (mod10 === 1) return `${n} задача`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} задачи`;
  return `${n} задач`;
}

function formatEvents(n) {
  if (currentLang === 'en') return n === 1 ? '1 event' : `${n} events`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} событий`;
  if (mod10 === 1) return `${n} событие`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} события`;
  return `${n} событий`;
}

function initLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'ru') applyLanguage(saved);
    else applyLanguage('ru');
  } catch {
    applyLanguage('ru');
  }
  if (typeof syncLocaleData === 'function') syncLocaleData();
}

function setLanguage(lang, persist = true) {
  if (lang !== 'en' && lang !== 'ru') return;
  applyLanguage(lang);
  if (persist) {
    try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch { /* ignore */ }
  }
  if (typeof syncLocaleData === 'function') syncLocaleData();
  if (typeof state !== 'undefined' && state.week) {
    if (state.week._demo) state.week = wwSeedDemoWeek();
    else state.week.label = wwGetWeekLabel();
    if (typeof wwSaveCurrentWeek === 'function') wwSaveCurrentWeek(state.week);
  }
  if (typeof render === 'function') render();
}

function applyLanguage(lang) {
  currentLang = lang;
  LOCALE = lang === 'en' ? 'en-US' : 'ru-RU';
  I18N = STRINGS[lang];
  document.documentElement.lang = lang;
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = I18N.appTitle;
}

function wwDayLabel(key) {
  return I18N.days[key] || key;
}

function wwEventLabel(key) {
  return I18N.eventTypes[key] || key;
}

function wwTriageLabel(key) {
  return I18N.triage[key] || key;
}

function getProfileSettings() {
  return [
    { id: 'language',    icon: '🌐', label: I18N.settingsLanguage,    iconBg: '#e2f6fd', border: true,  isLanguage: true },
    { id: 'notifications', icon: '🔔', label: I18N.settingsNotifications, iconBg: '#e2f6fd', border: true },
    { id: 'privacy',     icon: '🔐', label: I18N.settingsPrivacy,     iconBg: '#fef0ec', border: true },
    { id: 'appearance',  icon: '🎨', label: I18N.settingsAppearance,  iconBg: '#ede9ff', border: true },
    { id: 'help',        icon: '❓', label: I18N.settingsHelp,        iconBg: '#e8f8ee', border: false },
  ];
}
