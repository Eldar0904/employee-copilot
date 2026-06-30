// ── Color maps ───────────────────────────────────────────────────────────────

const DEPT_COLORS = {
  Finance: '#0b5389', Engineering: '#5856d6', HR: '#c97559',
  PMO: '#2E8B57', Sales: '#ff9500', Design: '#af52de', IT: '#636366',
};

const PRIORITY_COLORS = { high: '#ef4635', medium: '#ff9500', low: '#34c759' };
const PRIORITY_LIGHTS  = { high: '#fdecea', medium: '#fff3e0', low: '#e8f8ee' };

const CHANNELS = [];
const DMS = [];
const CHAT_MESSAGES = {};

const LOCALE_DATA = {
  ru: {
    channels: [
      { id:'ch1', name:'#общий',        emoji:'📢', bgColor:'#e2f6fd', lastMsg:'Общее собрание в пятницу в 15:00 — отметьте в календаре!', time:'9:14', unread:3 },
      { id:'ch2', name:'#разработка',   emoji:'⚙',  bgColor:'#ede9ff', lastMsg:'Нужен ревью PR по модулю авторизации сегодня',            time:'9:45', unread:5 },
      { id:'ch3', name:'#финансы',      emoji:'📊', bgColor:'#e6f0ff', lastMsg:'Отчёты по бюджету Q3 — до конца дня',                   time:'8:30', unread:1 },
      { id:'ch4', name:'#hr',           emoji:'👥', bgColor:'#fef0ec', lastMsg:'Материалы по онбордингу готовы к проверке',              time:'Вт',  unread:0 },
      { id:'ch5', name:'#pmo',          emoji:'📋', bgColor:'#e8f8ee', lastMsg:'Статус проекта опубликован на общем диске',              time:'Вт',  unread:0 },
    ],
    dms: [
      { id:'dm1', name:'Алексей Волков',   initials:'АВ', avatarBg:'#0b5389', lastMsg:'Посмотрела презентацию Q3?',              time:'10:02', unread:2, online:true,  role:'Руководитель разработки' },
      { id:'dm2', name:'Мария Козлова',    initials:'МК', avatarBg:'#af52de', lastMsg:'Можешь на дизайн-колл в 14:00?',          time:'9:55',  unread:1, online:true,  role:'UX-дизайнер' },
      { id:'dm3', name:'Дмитрий Соколов',  initials:'ДС', avatarBg:'#c97559', lastMsg:'Спасибо за быстрый ответ!',               time:'9:20',  unread:0, online:false, role:'Руководитель финансов' },
      { id:'dm4', name:'Елена Новикова',   initials:'ЕН', avatarBg:'#5856d6', lastMsg:'Предложение от поставщика выглядит хорошо.', time:'Вт',  unread:0, online:false, role:'HR-бизнес-партнёр' },
    ],
    chatMessages: {
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
    },
  },

  en: {
    channels: [
      { id:'ch1', name:'#general',      emoji:'📢', bgColor:'#e2f6fd', lastMsg:'All-hands Friday at 3pm — mark your calendars!',     time:'9:14', unread:3 },
      { id:'ch2', name:'#engineering',  emoji:'⚙',  bgColor:'#ede9ff', lastMsg:'Need a PR review on auth module today',                time:'9:45', unread:5 },
      { id:'ch3', name:'#finance',      emoji:'📊', bgColor:'#e6f0ff', lastMsg:'Q3 budget reports due EOD',                            time:'8:30', unread:1 },
      { id:'ch4', name:'#hr',           emoji:'👥', bgColor:'#fef0ec', lastMsg:'Onboarding materials ready for review',                time:'Tue',  unread:0 },
      { id:'ch5', name:'#pmo',          emoji:'📋', bgColor:'#e8f8ee', lastMsg:'Project status posted to shared drive',                time:'Tue',  unread:0 },
    ],
    dms: [
      { id:'dm1', name:'Alex Volkov',    initials:'AV', avatarBg:'#0b5389', lastMsg:'Did you review the Q3 deck?',              time:'10:02', unread:2, online:true,  role:'Engineering Lead' },
      { id:'dm2', name:'Maria Kozlova',  initials:'MK', avatarBg:'#af52de', lastMsg:'Can you join design call at 2pm?',         time:'9:55',  unread:1, online:true,  role:'UX Designer' },
      { id:'dm3', name:'Dmitry Sokolov', initials:'DS', avatarBg:'#c97559', lastMsg:'Thanks for the quick turnaround!',         time:'9:20',  unread:0, online:false, role:'Finance Lead' },
      { id:'dm4', name:'Elena Novikova', initials:'EN', avatarBg:'#5856d6', lastMsg:'Vendor proposal looks good.',              time:'Tue',  unread:0, online:false, role:'HR Business Partner' },
    ],
    chatMessages: {
      ch1: [
        { sender:'Timur Musa',  initials:'TM', avatarBg:'#34c759', text:'Morning! All-hands Friday at 3pm.', mine:false, time:'9:14',  isChannel:true },
        { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'Added! Will it be recorded?',       mine:true,  time:'9:18',  isChannel:true },
        { sender:'Timur Musa',  initials:'TM', avatarBg:'#34c759', text:'Yes, we\'ll post to the drive after.', mine:false, time:'9:22', isChannel:true },
      ],
      ch2: [
        { sender:'Jad Malik',   initials:'JM', avatarBg:'#5856d6', text:'Need a PR review — auth module.',    mine:false, time:'9:14',  isChannel:true },
        { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'On it after standup!',               mine:true,  time:'9:32',  isChannel:true },
        { sender:'Nour Kassab', initials:'NK', avatarBg:'#ff9500', text:'Left comments already, Jad.',         mine:false, time:'9:45',  isChannel:true },
        { sender:'Jad Malik',   initials:'JM', avatarBg:'#5856d6', text:'Thanks both! Will fix by noon.',      mine:false, time:'10:01', isChannel:true },
        { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'Changes look great — approved!',     mine:true,  time:'11:48', isChannel:true },
      ],
      ch3: [
        { sender:'Dmitry Sokolov', initials:'DS', avatarBg:'#c97559', text:'Q3 budget reports due EOD.',       mine:false, time:'8:30', isChannel:true },
        { sender:'Sara Ahmed',     initials:'SA', avatarBg:'#c97559', text:'PMO report sent.',                 mine:true,  time:'8:45', isChannel:true },
      ],
      ch4: [
        { sender:'Elena Novikova', initials:'EN', avatarBg:'#5856d6', text:'Onboarding materials ready. Feedback by Thursday.', mine:false, time:'Tue', isChannel:true },
      ],
      ch5: [
        { sender:'Sara Ahmed',     initials:'SA', avatarBg:'#c97559', text:'Status updated. All milestones on track.', mine:true,  time:'Tue', isChannel:true },
        { sender:'Alex Volkov',    initials:'AV', avatarBg:'#0b5389', text:'Great work! Sprint is ahead of schedule.', mine:false, time:'Tue', isChannel:true },
      ],
      dm1: [
        { sender:'Alex Volkov', initials:'AV', avatarBg:'#0b5389', text:'Morning! Quick sprint timeline update?', mine:false, time:'8:45',  isChannel:false },
        { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'On track. Deck ready by EOD.',           mine:true,  time:'9:01',  isChannel:false },
        { sender:'Alex Volkov', initials:'AV', avatarBg:'#0b5389', text:'Did you review the Q3 deck?',            mine:false, time:'10:02', isChannel:false },
      ],
      dm2: [
        { sender:'Maria Kozlova', initials:'MK', avatarBg:'#af52de', text:'Sharing new onboarding flow for review.', mine:false, time:'9:30', isChannel:false },
        { sender:'Sara Ahmed',    initials:'SA', avatarBg:'#c97559', text:'Love the new nav! Much cleaner.',         mine:true,  time:'9:38', isChannel:false },
        { sender:'Maria Kozlova', initials:'MK', avatarBg:'#af52de', text:'Can you join design call at 2pm?',        mine:false, time:'9:55', isChannel:false },
      ],
      dm3: [
        { sender:'Sara Ahmed',      initials:'SA', avatarBg:'#c97559', text:'Budget sent. Let me know if you need anything else.', mine:true,  time:'9:15', isChannel:false },
        { sender:'Dmitry Sokolov', initials:'DS', avatarBg:'#c97559', text:'Thanks for the quick turnaround!',                     mine:false, time:'9:20', isChannel:false },
      ],
      dm4: [
        { sender:'Sara Ahmed',     initials:'SA', avatarBg:'#c97559', text:'Reviewed vendor proposal — looks good.', mine:true,  time:'Tue', isChannel:false },
        { sender:'Elena Novikova', initials:'EN', avatarBg:'#5856d6', text:'Vendor proposal looks good.',            mine:false, time:'Tue', isChannel:false },
      ],
    },
  },
};

function syncLocaleData() {
  const lang = typeof getLang === 'function' ? getLang() : 'ru';
  const data = LOCALE_DATA[lang] || LOCALE_DATA.ru;
  CHANNELS.length = 0;
  CHANNELS.push(...data.channels);
  DMS.length = 0;
  DMS.push(...data.dms);
  Object.keys(CHAT_MESSAGES).forEach(k => delete CHAT_MESSAGES[k]);
  Object.assign(CHAT_MESSAGES, data.chatMessages);
}

syncLocaleData();
