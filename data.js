// ── Color maps ───────────────────────────────────────────────────────────────

const DEPT_COLORS = {
  Finance: '#0b5389', Engineering: '#5856d6', HR: '#c97559',
  PMO: '#2E8B57', Sales: '#ff9500', Design: '#af52de', IT: '#636366',
};

const DEPT_LABELS = {
  Finance: 'Финансы', Engineering: 'Разработка', HR: 'HR',
  PMO: 'PMO', Sales: 'Продажи', Design: 'Дизайн', IT: 'ИТ',
};

const PRIORITY_COLORS = { high: '#ef4635', medium: '#ff9500', low: '#34c759' };
const PRIORITY_LIGHTS  = { high: '#fdecea', medium: '#fff3e0', low: '#e8f8ee' };

const TASKS = [
  { id:1,  title:'Проверить отчёт по бюджету Q3',     dept:'Finance',     dueTime:'10:00', priority:'high',   day:0 },
  { id:2,  title:'Стендап — разработка',              dept:'Engineering', dueTime:'11:30', priority:'medium', day:0 },
  { id:3,  title:'Ответить на памятку HR',            dept:'HR',          dueTime:'14:00', priority:'medium', day:0 },
  { id:4,  title:'Обновить слайды таймлайна',         dept:'PMO',         dueTime:'16:00', priority:'low',    day:0 },
  { id:5,  title:'Звонок с клиентом Acme',            dept:'Sales',       dueTime:'17:00', priority:'high',   day:0 },
];

const CHANNELS = [
  { id:'ch1', name:'#общий',        emoji:'📢', bgColor:'#e2f6fd', lastMsg:'Общее собрание в пятницу в 15:00 — отметьте в календаре!', time:'9:14', unread:3 },
  { id:'ch2', name:'#разработка',   emoji:'⚙',  bgColor:'#ede9ff', lastMsg:'Нужен ревью PR по модулю авторизации сегодня',            time:'9:45', unread:5 },
  { id:'ch3', name:'#финансы',      emoji:'📊', bgColor:'#e6f0ff', lastMsg:'Отчёты по бюджету Q3 — до конца дня',                   time:'8:30', unread:1 },
  { id:'ch4', name:'#hr',           emoji:'👥', bgColor:'#fef0ec', lastMsg:'Материалы по онбордингу готовы к проверке',              time:'Вт',  unread:0 },
  { id:'ch5', name:'#pmo',          emoji:'📋', bgColor:'#e8f8ee', lastMsg:'Статус проекта опубликован на общем диске',              time:'Вт',  unread:0 },
];

const DMS = [
  { id:'dm1', name:'Алексей Волков',   initials:'АВ', avatarBg:'#0b5389', lastMsg:'Посмотрела презентацию Q3?',              time:'10:02', unread:2, online:true,  role:'Руководитель разработки' },
  { id:'dm2', name:'Мария Козлова',    initials:'МК', avatarBg:'#af52de', lastMsg:'Можешь на дизайн-колл в 14:00?',          time:'9:55',  unread:1, online:true,  role:'UX-дизайнер' },
  { id:'dm3', name:'Дмитрий Соколов',  initials:'ДС', avatarBg:'#c97559', lastMsg:'Спасибо за быстрый ответ!',               time:'9:20',  unread:0, online:false, role:'Руководитель финансов' },
  { id:'dm4', name:'Елена Новикова',   initials:'ЕН', avatarBg:'#5856d6', lastMsg:'Предложение от поставщика выглядит хорошо.', time:'Вт',  unread:0, online:false, role:'HR-бизнес-партнёр' },
];

const CHAT_MESSAGES = {
  ch1: [
    { sender:'Тимур Муса',  initials:'ТМ', avatarBg:'#34c759', text:'Доброе утро! Общее собрание в пятницу в 15:00.', mine:false, time:'9:14',  isChannel:true },
    { sender:'Сара Ахмед',  initials:'СА', avatarBg:'#c97559', text:'Добавила! Будет запись?',                       mine:true,  time:'9:18',  isChannel:true },
    { sender:'Тимур Муса',  initials:'ТМ', avatarBg:'#34c759', text:'Да, выложим на диск после.',                    mine:false, time:'9:22',  isChannel:true },
  ],
  ch2: [
    { sender:'Жад Малик',   initials:'ЖМ', avatarBg:'#5856d6', text:'Нужен ревью PR — модуль авторизации.',           mine:false, time:'9:14',  isChannel:true },
    { sender:'Сара Ахмед',  initials:'СА', avatarBg:'#c97559', text:'Возьму после стендапа!',                         mine:true,  time:'9:32',  isChannel:true },
    { sender:'Нур Кассаб',  initials:'НК', avatarBg:'#ff9500', text:'Уже оставила комментарии, Жад.',                 mine:false, time:'9:45',  isChannel:true },
    { sender:'Жад Малик',   initials:'ЖМ', avatarBg:'#5856d6', text:'Спасибо обоим! Исправлю до полудня.',            mine:false, time:'10:01', isChannel:true },
    { sender:'Сара Ахмед',  initials:'СА', avatarBg:'#c97559', text:'Изменения отличные — одобрено!',                 mine:true,  time:'11:48', isChannel:true },
  ],
  ch3: [
    { sender:'Дмитрий Соколов', initials:'ДС', avatarBg:'#c97559', text:'Отчёты по бюджету Q3 — до конца дня.',         mine:false, time:'8:30', isChannel:true },
    { sender:'Сара Ахмед',      initials:'СА', avatarBg:'#c97559', text:'Отчёт PMO отправлен.',                          mine:true,  time:'8:45', isChannel:true },
  ],
  ch4: [
    { sender:'Елена Новикова', initials:'ЕН', avatarBg:'#5856d6', text:'Материалы по онбордингу готовы. Обратная связь до четверга.', mine:false, time:'Вт', isChannel:true },
  ],
  ch5: [
    { sender:'Сара Ахмед',     initials:'СА', avatarBg:'#c97559', text:'Статус обновлён. Все вехи в графике.',          mine:true,  time:'Вт', isChannel:true },
    { sender:'Алексей Волков', initials:'АВ', avatarBg:'#0b5389', text:'Отличная работа! Спринт опережает график.',     mine:false, time:'Вт', isChannel:true },
  ],
  dm1: [
    { sender:'Алексей Волков', initials:'АВ', avatarBg:'#0b5389', text:'Утро! Быстрый апдейт по таймлайну спринта?',   mine:false, time:'8:45',  isChannel:false },
    { sender:'Сара Ахмед',     initials:'СА', avatarBg:'#c97559', text:'В графике. Презентация готова к вечеру.',       mine:true,  time:'9:01',  isChannel:false },
    { sender:'Алексей Волков', initials:'АВ', avatarBg:'#0b5389', text:'Посмотрела презентацию Q3?',                    mine:false, time:'10:02', isChannel:false },
  ],
  dm2: [
    { sender:'Мария Козлова', initials:'МК', avatarBg:'#af52de', text:'Делюсь новым флоу онбординга на ревью.',        mine:false, time:'9:30', isChannel:false },
    { sender:'Сара Ахмед',    initials:'СА', avatarBg:'#c97559', text:'Нравится новая навигация! Намного чище.',       mine:true,  time:'9:38', isChannel:false },
    { sender:'Мария Козлова', initials:'МК', avatarBg:'#af52de', text:'Можешь на дизайн-колл в 14:00?',                mine:false, time:'9:55', isChannel:false },
  ],
  dm3: [
    { sender:'Сара Ахмед',      initials:'СА', avatarBg:'#c97559', text:'Бюджет отправлен. Напиши, если нужно что-то ещё.', mine:true,  time:'9:15', isChannel:false },
    { sender:'Дмитрий Соколов', initials:'ДС', avatarBg:'#c97559', text:'Спасибо за быстрый ответ!',                        mine:false, time:'9:20', isChannel:false },
  ],
  dm4: [
    { sender:'Сара Ахмед',     initials:'СА', avatarBg:'#c97559', text:'Посмотрела предложение поставщика — всё ок.',     mine:true,  time:'Вт', isChannel:false },
    { sender:'Елена Новикова', initials:'ЕН', avatarBg:'#5856d6', text:'Предложение от поставщика выглядит хорошо.',      mine:false, time:'Вт', isChannel:false },
  ],
};

const WEEK_DAYS = [
  { label:'П', num:'23', day:0, fullLabel:'Понедельник, 23 июня' },
  { label:'В', num:'24', day:1, fullLabel:'Вторник, 24 июня' },
  { label:'С', num:'25', day:2, fullLabel:'Среда, 25 июня' },
  { label:'Ч', num:'26', day:3, fullLabel:'Четверг, 26 июня' },
  { label:'П', num:'27', day:4, fullLabel:'Пятница, 27 июня' },
  { label:'С', num:'28', day:5, fullLabel:'Суббота, 28 июня' },
  { label:'В', num:'29', day:6, fullLabel:'Воскресенье, 29 июня' },
];

const PROFILE_SETTINGS = [
  { icon:'🔔', label:'Уведомления',           iconBg:'#e2f6fd', border:true  },
  { icon:'🔐', label:'Конфиденциальность',    iconBg:'#fef0ec', border:true  },
  { icon:'🎨', label:'Оформление',            iconBg:'#ede9ff', border:true  },
  { icon:'❓', label:'Помощь и поддержка',    iconBg:'#e8f8ee', border:false },
];
