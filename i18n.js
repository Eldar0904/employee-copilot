// ── Russian localization ──────────────────────────────────────────────────────

const LOCALE = 'ru-RU';

const I18N = {
  appTitle: 'Копилот сотрудника',
  loading: 'Загрузка…',
  errorTitle: 'Не удалось загрузить приложение.',
  copilot: 'Копилот',

  // Tabs
  tabPlan: 'План',
  tabAudit: 'Аудит',
  tabDo: 'Дела',
  tabReview: 'Обзор',
  tabInbox: 'Входящие',
  tabMe: 'Я',

  // Onboarding
  onboardingContinue: 'Далее',
  onboardingStart: 'Начать планирование',
  onboardingSkip: 'Пропустить',

  // Plan
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

  // Audit
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

  // Execute
  greeting: 'Доброе утро, Сара 👋',
  allTasksDone: n => `Все ${n} ${ruTasks(n)} выполнены — отличная неделя!`,
  tasksLeftFocus: (n, text) => `Осталось ${ruTasks(n)}. Фокус: «${text}»`,
  tasksRemaining: n => `На этой неделе осталось ${ruTasks(n)}.`,
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

  // Review
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

  // Task sheet
  markPending: 'Вернуть в работу',
  markDone: 'Отметить выполненным',
  completed: 'Выполнено',
  pending: 'В ожидании',

  // Messages
  messages: 'Сообщения',
  searchMessages: 'Поиск сообщений',
  departments: 'Отделы',
  directMessages: 'Личные сообщения',
  deptChannel: 'Канал отдела',
  unread: 'непрочит.',
  online: 'В сети',
  typeMessage: 'Напишите сообщение…',

  // Me
  meName: 'Сара Ахмед',
  meRole: 'Менеджер продукта · PMO',
  available: 'Доступна',
  doneThisWeek: 'Сделано за неделю',
  pendingLabel: 'В ожидании',

  // Triage labels
  triage: {
    do: 'Сделать',
    defer: 'Отложить',
    delegate: 'Делегировать',
    delete: 'Удалить',
  },

  // Event types
  eventTypes: {
    leverage: 'Рычаг',
    deep: 'Глубокая работа',
    meeting: 'Встреча',
    admin: 'Админ',
  },

  // Days (display)
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
};

function ruTasks(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} задач`;
  if (mod10 === 1) return `${n} задача`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} задачи`;
  return `${n} задач`;
}

function ruEvents(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} событий`;
  if (mod10 === 1) return `${n} событие`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} события`;
  return `${n} событий`;
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
