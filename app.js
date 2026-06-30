// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  activeTab:      'today',
  activeChat:     null,   // { id, name, sub, color, icon, iconSize, radius, isChannel }
  activeTask:     null,   // task object
  selectedDay:    0,
  completedTasks: {},
  showAddSheet:   false,
  newTaskInput:   '',
  extraTasks:     [],
  nextId:         13,
};

// ── DOM helpers ───────────────────────────────────────────────────────────────

function h(tag, attrs, children) {
  const el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(k => {
      if (k === 'className') { el.className = attrs[k]; }
      else if (k === 'style') {
        if (typeof attrs[k] === 'string') el.style.cssText = attrs[k];
        else Object.assign(el.style, attrs[k]);
      }
      else if (k.startsWith('on')) {
        el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      }
      else if (attrs[k] != null) {
        el.setAttribute(k, attrs[k]);
      }
    });
  }
  (Array.isArray(children) ? children : children != null ? [children] : []).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' || typeof c === 'number'
      ? document.createTextNode(String(c))
      : c);
  });
  return el;
}

function svgEl(markup) {
  const tmp = document.createElement('div');
  tmp.innerHTML = markup;
  return tmp.firstChild;
}

function stopProp(e) { e.stopPropagation(); }

// ── Computed helpers ──────────────────────────────────────────────────────────

const allTasks         = () => TASKS.concat(state.extraTasks);
const todayTasks       = () => allTasks().filter(t => t.day === 0);
const completedCount   = () => todayTasks().filter(t => state.completedTasks[t.id]).length;
const totalTodayCount  = () => todayTasks().length;
const pendingCount     = () => totalTodayCount() - completedCount();
const weekCompletedCount = () => Object.keys(state.completedTasks).filter(k => state.completedTasks[k]).length;
const hasUnreadMessages  = () =>
  CHANNELS.some(c => c.unread > 0) || DMS.some(d => d.unread > 0);

// ── Render entry point ────────────────────────────────────────────────────────

function render() {
  const content = document.getElementById('appContent');
  content.innerHTML = '';

  const isMeTab = state.activeTab === 'me' && !state.activeChat;
  document.getElementById('statusSpacer').style.background =
    isMeTab ? '#0b5389' : '#ffffff';

  if (state.activeChat) {
    content.appendChild(renderChat());
    return;
  }

  const wrapper = h('div', { className: 'screen' });
  if (state.activeTab === 'today')    wrapper.appendChild(renderToday());
  if (state.activeTab === 'week')     wrapper.appendChild(renderWeek());
  if (state.activeTab === 'messages') wrapper.appendChild(renderMessages());
  if (state.activeTab === 'me')       wrapper.appendChild(renderMe());
  content.appendChild(wrapper);

  if (state.activeTask)   content.appendChild(renderTaskDetailSheet());
  if (state.showAddSheet) content.appendChild(renderAddSheet());
  content.appendChild(renderTabBar());
}

// ── TODAY ─────────────────────────────────────────────────────────────────────

function renderToday() {
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  wrap.appendChild(h('div', { className: 'screen-header' }, [
    h('div', { className: 'screen-date'  }, 'Monday, June 23'),
    h('div', { className: 'screen-title' }, 'Good morning, Sara 👋'),
    renderAINudge(),
    renderSectionRow(),
  ]));

  const scroll = h('div', { className: 'screen-scroll' });
  sortedTodayTasks().forEach(t => scroll.appendChild(renderTaskCard(t)));
  scroll.appendChild(renderAddTaskBtn());
  wrap.appendChild(scroll);
  return wrap;
}

function renderAINudge() {
  const p = pendingCount();
  const text = p === 0
    ? 'All tasks done for today — great work!'
    : `${p} task${p === 1 ? '' : 's'} remaining. Start with the Finance report — highest impact first.`;
  return h('div', { className: 'ai-nudge' }, [
    h('div', { className: 'ai-nudge-icon' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/></svg>'),
    ]),
    h('div', { style: 'flex:1;min-width:0;' }, [
      h('div', { className: 'ai-label' }, 'Copilot'),
      h('div', { className: 'ai-text'  }, text),
    ]),
  ]);
}

function renderSectionRow() {
  return h('div', { className: 'section-row' }, [
    h('div', { className: 'section-title' }, "Today's Tasks"),
    h('div', { className: 'count-badge'   }, `${completedCount()}/${totalTodayCount()}`),
  ]);
}

function sortedTodayTasks() {
  const tasks      = todayTasks();
  const incomplete = tasks
    .filter(t => !state.completedTasks[t.id])
    .sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return  1;
      return a.id - b.id;
    });
  const done = tasks.filter(t => state.completedTasks[t.id]);
  return [...incomplete, ...done];
}

function renderTaskCard(t) {
  const done          = !!state.completedTasks[t.id];
  const priorityColor = done ? '#e0e4e8' : (PRIORITY_COLORS[t.priority] || '#dedede');
  const deptColor     = DEPT_COLORS[t.dept] || '#4f5158';
  const isAIPriority  = t.id === 1 && !done;

  const card = h('div', { className: 'task-card' });
  const bar  = h('div', { className: 'task-priority-bar' });
  bar.style.background = priorityColor;
  card.appendChild(bar);

  const check = h('div', { className: `task-check${done ? ' done' : ''}` });
  check.addEventListener('click', e => {
    e.stopPropagation();
    state.completedTasks = { ...state.completedTasks, [t.id]: !state.completedTasks[t.id] };
    render();
  });
  if (done) {
    check.appendChild(svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10L11 3" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'));
  }

  const meta = h('div', { className: 'task-meta' }, [
    h('div', { className: 'dept-tag', style: `background:${deptColor}` }, t.dept),
    h('div', { className: 'due-time' }, t.dueTime),
  ]);
  if (isAIPriority) meta.appendChild(h('div', { className: 'ai-priority-tag' }, '✦ Priority'));

  const body = h('div', { className: 'task-body' }, [
    check,
    h('div', { className: 'task-info' }, [
      h('div', { className: `task-title${done ? ' done' : ''}` }, t.title),
      meta,
    ]),
    svgEl('<svg class="chevron-right" width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#223035" stroke-width="2" stroke-linecap="round"/></svg>'),
  ]);
  body.addEventListener('click', () => { state.activeTask = t; render(); });
  card.appendChild(body);
  return card;
}

function renderAddTaskBtn() {
  return h('div', { className: 'add-task-btn', onclick: () => { state.showAddSheet = true; render(); } }, [
    h('div', { className: 'add-icon' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="#0b5389" stroke-width="2.5" stroke-linecap="round"/></svg>'),
    ]),
    h('div', { className: 'add-label' }, 'Add a task'),
  ]);
}

// ── WEEK ──────────────────────────────────────────────────────────────────────

function renderWeek() {
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  wrap.appendChild(h('div', { className: 'week-header' }, [
    h('div', { className: 'screen-date'  }, 'Jun 23 – Jun 29'),
    h('div', { className: 'screen-title' }, 'Weekly Planner'),
    renderDayPills(),
    renderWeekProgress(),
  ]));

  const scroll   = h('div', { className: 'week-scroll' });
  const dayTasks = allTasks().filter(t => t.day === state.selectedDay);
  if (dayTasks.length === 0) {
    scroll.appendChild(h('div', { className: 'empty-day' }, [
      h('div', { className: 'empty-check' }, '✓'),
      h('div', { className: 'empty-label' }, 'No tasks for this day'),
    ]));
  } else {
    dayTasks.forEach(t => scroll.appendChild(renderTaskCard(t)));
  }
  wrap.appendChild(scroll);
  return wrap;
}

function renderDayPills() {
  const container = h('div', { className: 'day-pills' });
  WEEK_DAYS.forEach(d => {
    const sel     = state.selectedDay === d.day;
    const isToday = d.day === 0;
    const dt      = allTasks().filter(t => t.day === d.day);
    const hasTasks = dt.length > 0;
    const allDone  = hasTasks && dt.every(t => state.completedTasks[t.id]);

    const pill = h('div', {
      className: 'day-pill',
      style: `background:${sel ? '#0b5389' : isToday ? '#e2f6fd' : '#ffffff'}`,
    }, [
      h('div', { className: 'day-label', style: `color:${sel ? 'rgba(255,255,255,0.65)' : '#a6a6a6'}` }, d.label),
      h('div', { className: 'day-num',   style: `color:${sel ? '#fff' : isToday ? '#0b5389' : '#223035'}` }, d.num),
      h('div', { className: 'day-dot',   style: `background:${!hasTasks ? 'transparent' : allDone ? '#34c759' : '#c97559'}` }),
    ]);
    pill.addEventListener('click', () => { state.selectedDay = d.day; render(); });
    container.appendChild(pill);
  });
  return container;
}

function renderWeekProgress() {
  const dayTasks = allTasks().filter(t => t.day === state.selectedDay);
  const comp  = dayTasks.filter(t => state.completedTasks[t.id]).length;
  const total = dayTasks.length;
  const pct   = total === 0 ? 0 : Math.round(comp / total * 100);
  const dObj  = WEEK_DAYS.find(d => d.day === state.selectedDay);

  return h('div', { className: 'week-progress-card' }, [
    h('div', { className: 'week-progress-row' }, [
      h('div', { className: 'week-progress-label' }, dObj?.fullLabel ?? ''),
      h('div', { className: 'week-progress-count' }, `${comp}/${total} done`),
    ]),
    h('div', { className: 'progress-track' }, [
      h('div', { className: 'progress-fill', style: `width:${pct}%` }),
    ]),
  ]);
}

// ── MESSAGES ──────────────────────────────────────────────────────────────────

function renderMessages() {
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  wrap.appendChild(h('div', { className: 'msgs-header' }, [
    h('div', { className: 'screen-title' }, 'Messages'),
    h('div', { className: 'search-bar' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#a6a6a6" stroke-width="1.6"/><path d="M9.5 9.5L12.5 12.5" stroke="#a6a6a6" stroke-width="1.6" stroke-linecap="round"/></svg>'),
      h('div', { className: 'search-placeholder' }, 'Search messages'),
    ]),
  ]));

  const scroll = h('div', { className: 'msgs-scroll' });

  // Channels
  const chSection = h('div', { className: 'msgs-section' }, [
    h('div', { className: 'msgs-section-label' }, 'Departments'),
  ]);
  CHANNELS.forEach(ch => {
    const row = h('div', { className: 'msg-row' }, [
      h('div', { className: 'channel-icon', style: `background:${ch.bgColor}` }, ch.emoji),
      h('div', { className: 'msg-info' }, [
        h('div', { className: 'msg-top' }, [
          h('div', { className: 'msg-name' }, ch.name),
          h('div', { className: 'msg-time' }, ch.time),
        ]),
        h('div', { className: 'msg-preview' }, ch.lastMsg),
      ]),
    ]);
    if (ch.unread > 0) {
      row.appendChild(h('div', { className: 'unread-badge' }, [
        h('div', { className: 'unread-count' }, String(ch.unread)),
      ]));
    }
    row.addEventListener('click', () => {
      state.activeChat = {
        id: ch.id, name: ch.name,
        sub: `${ch.unread > 0 ? ch.unread + ' unread · ' : ''}Dept. channel`,
        color: ch.bgColor, icon: ch.emoji, iconSize: '18px', radius: '14px', isChannel: true,
      };
      render();
      scrollChatToBottom();
    });
    chSection.appendChild(row);
  });
  scroll.appendChild(chSection);

  // DMs
  const dmSection = h('div', { className: 'msgs-section' }, [
    h('div', { className: 'msgs-section-label' }, 'Direct Messages'),
  ]);
  DMS.forEach(dm => {
    const avatarWrap = h('div', { className: 'dm-avatar', style: `background:${dm.avatarBg}` }, [
      h('div', { className: 'dm-initials' }, dm.initials),
    ]);
    if (dm.online) avatarWrap.appendChild(h('div', { className: 'online-dot' }));

    const row = h('div', { className: 'msg-row' }, [
      avatarWrap,
      h('div', { className: 'msg-info' }, [
        h('div', { className: 'msg-top' }, [
          h('div', { className: 'msg-name' }, dm.name),
          h('div', { className: 'msg-time' }, dm.time),
        ]),
        h('div', { className: 'msg-preview' }, dm.lastMsg),
      ]),
    ]);
    if (dm.unread > 0) {
      row.appendChild(h('div', { className: 'unread-badge' }, [
        h('div', { className: 'unread-count' }, String(dm.unread)),
      ]));
    }
    row.addEventListener('click', () => {
      state.activeChat = {
        id: dm.id, name: dm.name,
        sub: dm.role + (dm.online ? ' · Online' : ''),
        color: dm.avatarBg, icon: dm.initials, iconSize: '14px', radius: '50%', isChannel: false,
      };
      render();
      scrollChatToBottom();
    });
    dmSection.appendChild(row);
  });
  scroll.appendChild(dmSection);
  wrap.appendChild(scroll);
  return wrap;
}

// ── CHAT ──────────────────────────────────────────────────────────────────────

function renderChat() {
  const ac   = state.activeChat;
  const wrap = h('div', { className: 'chat-screen' });

  const avatarEl = h('div', {
    className: 'chat-avatar',
    style: `width:36px;height:36px;border-radius:${ac.radius};background:${ac.color};font-size:${ac.iconSize};font-weight:700;color:#fff;`,
  }, ac.icon);

  wrap.appendChild(h('div', { className: 'chat-nav' }, [
    h('div', { className: 'back-btn', onclick: () => { state.activeChat = null; render(); } }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M8 1L1 7.5L8 14" stroke="#0b5389" stroke-width="2.5" stroke-linecap="round"/></svg>'),
    ]),
    avatarEl,
    h('div', { className: 'chat-nav-info' }, [
      h('div', { className: 'chat-nav-name' }, ac.name),
      h('div', { className: 'chat-nav-sub'  }, ac.sub),
    ]),
    h('div', { className: 'chat-more' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="5" viewBox="0 0 20 5" fill="none"><circle cx="2.5" cy="2.5" r="2" fill="#a6a6a6"/><circle cx="10" cy="2.5" r="2" fill="#a6a6a6"/><circle cx="17.5" cy="2.5" r="2" fill="#a6a6a6"/></svg>'),
    ]),
  ]));

  const msgs = h('div', { className: 'chat-messages', id: 'chatScroll' });
  (CHAT_MESSAGES[ac.id] || []).forEach(msg => {
    const row = h('div', { className: `msg-bubble-row${msg.mine ? ' mine' : ''}` });
    if (!msg.mine) {
      row.appendChild(h('div', { className: 'bubble-avatar', style: `background:${msg.avatarBg}` }, [
        h('div', { className: 'bubble-avatar-text' }, msg.initials),
      ]));
    }
    const bWrap = h('div', { className: 'bubble-wrap' });
    if (!msg.mine && ac.isChannel) {
      bWrap.appendChild(h('div', { className: 'bubble-sender' }, msg.sender));
    }
    bWrap.appendChild(h('div', { className: `bubble ${msg.mine ? 'mine' : 'theirs'}` }, msg.text));
    bWrap.appendChild(h('div', { className: `bubble-time ${msg.mine ? 'mine' : 'theirs'}` }, msg.time));
    row.appendChild(bWrap);
    msgs.appendChild(row);
  });
  wrap.appendChild(msgs);

  wrap.appendChild(h('div', { className: 'chat-input-bar' }, [
    h('div', { className: 'chat-input-field' }, 'Type a message…'),
    h('div', { className: 'chat-send' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'),
    ]),
  ]));

  return wrap;
}

function scrollChatToBottom() {
  setTimeout(() => {
    const el = document.getElementById('chatScroll');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

// ── ME ────────────────────────────────────────────────────────────────────────

function renderMe() {
  const wrap = h('div', { className: 'me-scroll' });

  wrap.appendChild(h('div', { className: 'me-hero' }, [
    h('div', { className: 'me-avatar' }, [h('div', { className: 'me-initials' }, 'SA')]),
    h('div', { className: 'me-name'   }, 'Sara Ahmed'),
    h('div', { className: 'me-role'   }, 'Product Manager · PMO'),
    h('div', { className: 'me-status' }, [
      h('div', { className: 'status-dot'  }),
      h('div', { className: 'status-text' }, 'Available'),
    ]),
  ]));

  wrap.appendChild(h('div', { className: 'me-stats' }, [
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#0b5389' }, String(completedCount())),
      h('div', { className: 'stat-label' }, 'Done today'),
    ]),
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#c97559' }, String(pendingCount())),
      h('div', { className: 'stat-label' }, 'Pending'),
    ]),
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#34c759' }, String(weekCompletedCount())),
      h('div', { className: 'stat-label' }, 'This week'),
    ]),
  ]));

  const list = h('div', { className: 'settings-list' });
  PROFILE_SETTINGS.forEach(s => {
    list.appendChild(h('div', {
      className: 'settings-row',
      style: s.border ? 'border-bottom:1px solid #f2f4f5' : '',
    }, [
      h('div', { className: 'settings-icon', style: `background:${s.iconBg}` }, s.icon),
      h('div', { className: 'settings-label' }, s.label),
      svgEl('<svg width="7" height="12" viewBox="0 0 7 12" fill="none" style="opacity:0.25"><path d="M1 1L6 6L1 11" stroke="#223035" stroke-width="2" stroke-linecap="round"/></svg>'),
    ]));
  });
  wrap.appendChild(list);
  return wrap;
}

// ── TASK DETAIL SHEET ─────────────────────────────────────────────────────────

function renderTaskDetailSheet() {
  const t    = state.activeTask;
  const done = !!state.completedTasks[t.id];
  const priorityColor      = PRIORITY_COLORS[t.priority]  || '#dedede';
  const priorityLightColor = PRIORITY_LIGHTS[t.priority]   || '#f6f7f9';
  const deptColor          = DEPT_COLORS[t.dept]           || '#4f5158';

  const overlay = h('div', { className: 'sheet-overlay' });
  overlay.addEventListener('click', () => { state.activeTask = null; render(); });

  const pBar = h('div', { className: 'sheet-priority-bar' });
  pBar.style.background = priorityColor;

  const btnEl = h('button', { className: 'btn-primary', style: `background:${done ? '#34c759' : '#0b5389'}` });
  btnEl.textContent = done ? 'Mark as Pending' : 'Mark as Done';
  btnEl.addEventListener('click', () => {
    state.completedTasks = { ...state.completedTasks, [t.id]: !state.completedTasks[t.id] };
    state.activeTask = null;
    render();
  });

  const closeBtn = h('button', { className: 'btn-icon' });
  closeBtn.appendChild(svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#4f5158" stroke-width="2" stroke-linecap="round"/></svg>'));
  closeBtn.addEventListener('click', () => { state.activeTask = null; render(); });

  const sheet = h('div', { className: 'sheet' }, [
    h('div', { className: 'sheet-handle' }),
    pBar,
    h('div', { className: 'sheet-task-title' }, t.title),
    h('div', { className: 'sheet-tags' }, [
      h('div', { className: 'sheet-tag', style: `background:${deptColor}` }, t.dept),
      h('div', { className: 'sheet-tag-neutral' }, `Due ${t.dueTime}`),
      h('div', { className: 'sheet-tag-priority', style: `background:${priorityLightColor};color:${priorityColor}` }, `${t.priority} priority`),
    ]),
    h('div', { className: 'sheet-actions' }, [btnEl, closeBtn]),
  ]);
  sheet.addEventListener('click', stopProp);
  overlay.appendChild(sheet);
  return overlay;
}

// ── ADD TASK SHEET ────────────────────────────────────────────────────────────

function renderAddSheet() {
  const overlay = h('div', { className: 'sheet-overlay' });
  overlay.addEventListener('click', () => { state.showAddSheet = false; state.newTaskInput = ''; render(); });

  const input = h('input', { className: 'add-task-input', placeholder: 'What needs to be done?' });
  input.value = state.newTaskInput;
  input.addEventListener('input',   e  => { state.newTaskInput = e.target.value; });
  input.addEventListener('keydown', e  => { if (e.key === 'Enter') addTask(); });

  const addBtn = h('button', { className: 'btn-primary', style: 'background:#0b5389' }, 'Add Task');
  addBtn.addEventListener('click', addTask);

  const closeBtn = h('button', { className: 'btn-icon' });
  closeBtn.appendChild(svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#4f5158" stroke-width="2" stroke-linecap="round"/></svg>'));
  closeBtn.addEventListener('click', () => { state.showAddSheet = false; state.newTaskInput = ''; render(); });

  const sheet = h('div', { className: 'sheet' }, [
    h('div', { className: 'sheet-handle' }),
    h('div', { className: 'sheet-title', style: 'margin-bottom:14px' }, 'New Task'),
    input,
    h('div', { className: 'sheet-actions' }, [addBtn, closeBtn]),
  ]);
  sheet.addEventListener('click', stopProp);
  overlay.appendChild(sheet);

  setTimeout(() => input.focus(), 50);
  return overlay;
}

function addTask() {
  const title = state.newTaskInput.trim();
  if (!title) return;
  state.extraTasks  = [...state.extraTasks, { id: state.nextId++, title, dept: 'PMO', dueTime: 'Today', priority: 'medium', day: 0 }];
  state.showAddSheet  = false;
  state.newTaskInput  = '';
  render();
}

// ── TAB BAR ───────────────────────────────────────────────────────────────────

function renderTabBar() {
  const A = '#0b5389', I = '#a6a6a6';
  const at = state.activeTab;
  const c  = { today: at==='today'?A:I, week: at==='week'?A:I, msgs: at==='messages'?A:I, me: at==='me'?A:I };

  const bar = h('div', { className: 'tab-bar' });

  function tab(key, label, svgMarkup, onClick) {
    const item = h('div', { className: 'tab-item' });
    if (key === 'msgs' && hasUnreadMessages()) item.appendChild(h('div', { className: 'tab-unread' }));
    item.appendChild(svgEl(svgMarkup));
    item.appendChild(h('div', {
      className: 'tab-label',
      style: `color:${c[key]};font-weight:${at === (key==='msgs'?'messages':key) ? '700' : '500'}`,
    }, label));
    item.addEventListener('click', onClick);
    bar.appendChild(item);
  }

  tab('today', 'Today',
    `<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="3" width="18" height="16" rx="3" stroke="${c.today}" stroke-width="1.9"/>
      <path d="M7 1.5V4.5M15 1.5V4.5" stroke="${c.today}" stroke-width="1.9" stroke-linecap="round"/>
      <path d="M6 11H11M6 15H9" stroke="${c.today}" stroke-width="1.9" stroke-linecap="round"/>
      <circle cx="16" cy="15" r="2.5" fill="${at==='today'?c.today:'transparent'}" stroke="${c.today}" stroke-width="1.5"/>
    </svg>`,
    () => { state.activeTab = 'today'; render(); });

  tab('week', 'Week',
    `<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="3" width="18" height="16" rx="3" stroke="${c.week}" stroke-width="1.9"/>
      <path d="M7 1.5V4.5M15 1.5V4.5" stroke="${c.week}" stroke-width="1.9" stroke-linecap="round"/>
      <path d="M6 10H16M6 14H12" stroke="${c.week}" stroke-width="1.9" stroke-linecap="round"/>
    </svg>`,
    () => { state.activeTab = 'week'; render(); });

  tab('msgs', 'Messages',
    `<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M20 13a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h14a2 2 0 012 2v9z" stroke="${c.msgs}" stroke-width="1.9" stroke-linejoin="round"/>
    </svg>`,
    () => { state.activeTab = 'messages'; render(); });

  tab('me', 'Me',
    `<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="3.5" stroke="${c.me}" stroke-width="1.9"/>
      <path d="M3 20c0-4 3.582-7 8-7s8 3 8 7" stroke="${c.me}" stroke-width="1.9" stroke-linecap="round"/>
    </svg>`,
    () => { state.activeTab = 'me'; render(); });

  return bar;
}

// ── Boot ──────────────────────────────────────────────────────────────────────
render();
