// ── Color maps ───────────────────────────────────────────────────────────────

const DEPT_COLORS = {
  Finance: '#0b5389', Engineering: '#5856d6', HR: '#c97559',
  PMO: '#2E8B57', Sales: '#ff9500', Design: '#af52de', IT: '#636366',
};

const PRIORITY_COLORS = { high: '#ef4635', medium: '#ff9500', low: '#34c759' };
const PRIORITY_LIGHTS  = { high: '#fdecea', medium: '#fff3e0', low: '#e8f8ee' };

// ── Tasks ────────────────────────────────────────────────────────────────────

const TASKS = [
  { id:1,  title:'Review Q3 budget report',        dept:'Finance',     dueTime:'10:00 AM', priority:'high',   day:0 },
  { id:2,  title:'Team standup - Engineering',     dept:'Engineering', dueTime:'11:30 AM', priority:'medium', day:0 },
  { id:3,  title:'Reply to HR onboarding memo',    dept:'HR',          dueTime:'2:00 PM',  priority:'medium', day:0 },
  { id:4,  title:'Update project timeline slides', dept:'PMO',         dueTime:'4:00 PM',  priority:'low',    day:0 },
  { id:5,  title:'Client call - Acme Corp',        dept:'Sales',       dueTime:'5:00 PM',  priority:'high',   day:0 },
  { id:6,  title:'Sprint planning session',        dept:'Engineering', dueTime:'9:00 AM',  priority:'high',   day:1 },
  { id:7,  title:'Design review with UX team',     dept:'Design',      dueTime:'2:00 PM',  priority:'medium', day:1 },
  { id:8,  title:'Vendor contract approval',       dept:'Finance',     dueTime:'11:00 AM', priority:'high',   day:2 },
  { id:9,  title:'Monthly all-hands prep',         dept:'PMO',         dueTime:'3:00 PM',  priority:'medium', day:2 },
  { id:10, title:'Performance review kick-off',    dept:'HR',          dueTime:'10:00 AM', priority:'high',   day:3 },
  { id:11, title:'Product roadmap presentation',   dept:'PMO',         dueTime:'1:00 PM',  priority:'high',   day:4 },
  { id:12, title:'IT security training',           dept:'IT',          dueTime:'9:00 AM',  priority:'low',    day:5 },
];

// ── Channels ─────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id:'ch1', name:'#general',     emoji:'📢', bgColor:'#e2f6fd', lastMsg:'All-hands this Friday at 3pm - mark your calendars!', time:'9:14', unread:3 },
  { id:'ch2', name:'#engineering', emoji:'⚙',  bgColor:'#ede9ff', lastMsg:'PR review needed on the auth module today',            time:'9:45', unread:5 },
  { id:'ch3', name:'#finance',     emoji:'📊', bgColor:'#e6f0ff', lastMsg:'Q3 budget reports due by EOD today',                   time:'8:30', unread:1 },
  { id:'ch4', name:'#hr',          emoji:'👥', bgColor:'#fef0ec', lastMsg:'New onboarding materials are ready for review',        time:'Tue',  unread:0 },
  { id:'ch5', name:'#pmo',         emoji:'📋', bgColor:'#e8f8ee', lastMsg:'Project status update posted to the shared drive',     time:'Tue',  unread:0 },
];

// ── Direct Messages ───────────────────────────────────────────────────────────

const DMS = [
  { id:'dm1', name:'Khalid Al-Rashid', initials:'KA', avatarBg:'#0b5389', lastMsg:'Did you review the Q3 deck?',         time:'10:02', unread:2, online:true,  role:'Engineering Manager' },
  { id:'dm2', name:'Layla Hassan',     initials:'LH', avatarBg:'#af52de', lastMsg:'Can you join the design call at 2pm?', time:'9:55',  unread:1, online:true,  role:'UX Designer' },
  { id:'dm3', name:'Omar Yousef',      initials:'OY', avatarBg:'#c97559', lastMsg:'Thanks for the quick reply!',          time:'9:20',  unread:0, online:false, role:'Finance Lead' },
  { id:'dm4', name:'Rania Saleh',      initials:'RS', avatarBg:'#5856d6', lastMsg:'The vendor proposal looks good.',      time:'Tue',   unread:0, online:false, role:'HR Business Partner' },
];

// ── Chat message history ──────────────────────────────────────────────────────

const CHAT_MESSAGES = {
  ch1: [
    { sender:'Tariq Musa', initials:'TM', avatarBg:'#34c759', text:'Good morning! All-hands Friday 3pm.',   mine:false, time:'9:14 AM',  isChannel:true },
    { sender:'Sara Ahmed', initials:'SA', avatarBg:'#c97559', text:"Added! Will there be a recording?",     mine:true,  time:'9:18 AM',  isChannel:true },
    { sender:'Tariq Musa', initials:'TM', avatarBg:'#34c759', text:'Yes, posted to the drive after.',       mine:false, time:'9:22 AM',  isChannel:true },
  ],
  ch2: [
    { sender:'Jad Malik',   initials:'JM', avatarBg:'#5856d6', text:'PR review needed - auth module.',      mine:false, time:'9:14 AM',  isChannel:true },
    { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'On it after standup!',                 mine:true,  time:'9:32 AM',  isChannel:true },
    { sender:'Nour Kassab', initials:'NK', avatarBg:'#ff9500', text:'Left comments already, Jad.',          mine:false, time:'9:45 AM',  isChannel:true },
    { sender:'Jad Malik',   initials:'JM', avatarBg:'#5856d6', text:'Thanks both! Addressing by noon.',     mine:false, time:'10:01 AM', isChannel:true },
    { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'Changes look great - approved!',       mine:true,  time:'11:48 AM', isChannel:true },
  ],
  ch3: [
    { sender:'Omar Yousef', initials:'OY', avatarBg:'#c97559', text:'Q3 budget reports due EOD today.',     mine:false, time:'8:30 AM', isChannel:true },
    { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'PMO report submitted.',                mine:true,  time:'8:45 AM', isChannel:true },
  ],
  ch4: [
    { sender:'Rania Saleh', initials:'RS', avatarBg:'#5856d6', text:'New onboarding materials ready. Feedback due Thursday.', mine:false, time:'Tue', isChannel:true },
  ],
  ch5: [
    { sender:'Sara Ahmed',       initials:'SA', avatarBg:'#c97559', text:'Status update posted. All milestones on track.', mine:true,  time:'Tue', isChannel:true },
    { sender:'Khalid Al-Rashid', initials:'KA', avatarBg:'#0b5389', text:'Great work! Sprint ahead of schedule.',          mine:false, time:'Tue', isChannel:true },
  ],
  dm1: [
    { sender:'Khalid Al-Rashid', initials:'KA', avatarBg:'#0b5389', text:'Morning! Quick sprint timeline update?', mine:false, time:'8:45 AM',  isChannel:false },
    { sender:'Sara Ahmed',       initials:'SA', avatarBg:'#c97559', text:'On track. Deck ready by EOD.',           mine:true,  time:'9:01 AM',  isChannel:false },
    { sender:'Khalid Al-Rashid', initials:'KA', avatarBg:'#0b5389', text:'Did you review the Q3 deck?',           mine:false, time:'10:02 AM', isChannel:false },
  ],
  dm2: [
    { sender:'Layla Hassan', initials:'LH', avatarBg:'#af52de', text:'Sharing new onboarding flow for review.',   mine:false, time:'9:30 AM', isChannel:false },
    { sender:'Sara Ahmed',   initials:'SA', avatarBg:'#c97559', text:'Love the new navigation! Much cleaner.',    mine:true,  time:'9:38 AM', isChannel:false },
    { sender:'Layla Hassan', initials:'LH', avatarBg:'#af52de', text:'Can you join the design call at 2pm?',      mine:false, time:'9:55 AM', isChannel:false },
  ],
  dm3: [
    { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'Budget submitted. Let me know if needed.',   mine:true,  time:'9:15 AM', isChannel:false },
    { sender:'Omar Yousef', initials:'OY', avatarBg:'#c97559', text:'Thanks for the quick reply!',                mine:false, time:'9:20 AM', isChannel:false },
  ],
  dm4: [
    { sender:'Sara Ahmed',  initials:'SA', avatarBg:'#c97559', text:'Reviewed the vendor proposal - looks solid.', mine:true,  time:'Tue', isChannel:false },
    { sender:'Rania Saleh', initials:'RS', avatarBg:'#5856d6', text:'The vendor proposal looks good.',              mine:false, time:'Tue', isChannel:false },
  ],
};

// ── Week days ─────────────────────────────────────────────────────────────────

const WEEK_DAYS = [
  { label:'M', num:'23', day:0, fullLabel:'Monday, June 23' },
  { label:'T', num:'24', day:1, fullLabel:'Tuesday, June 24' },
  { label:'W', num:'25', day:2, fullLabel:'Wednesday, June 25' },
  { label:'T', num:'26', day:3, fullLabel:'Thursday, June 26' },
  { label:'F', num:'27', day:4, fullLabel:'Friday, June 27' },
  { label:'S', num:'28', day:5, fullLabel:'Saturday, June 28' },
  { label:'S', num:'29', day:6, fullLabel:'Sunday, June 29' },
];

// ── Profile settings ──────────────────────────────────────────────────────────

const PROFILE_SETTINGS = [
  { icon:'🔔', label:'Notifications',      iconBg:'#e2f6fd', border:true  },
  { icon:'🔐', label:'Privacy & Security', iconBg:'#fef0ec', border:true  },
  { icon:'🎨', label:'Appearance',          iconBg:'#ede9ff', border:true  },
  { icon:'❓', label:'Help & Support',      iconBg:'#e8f8ee', border:false },
];
