// ── Shared DOM helpers + app state ────────────────────────────────────────────

const state = {
  activeTab:      'execute',
  activeChat:     null,
  activeTask:     null,
  week:           null,
  weekHistory:    [],
  loading:        true,
  showOnboarding: false,
  onboardingStep: 0,
  // Plan
  activePrompt:   0,
  // Audit
  addingTask:     false,
  addingEvent:    false,
  auditNewTask:   '',
  auditNewEvent:  { title: '', day: 'Mon', type: 'meeting' },
  // Execute
  activeDay:      null,
  // Review
  showHistory:    false,
};

function h(tag, attrs, children) {
  const el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(k => {
      if (k === 'className') el.className = attrs[k];
      else if (k === 'style') {
        if (typeof attrs[k] === 'string') el.style.cssText = attrs[k];
        else Object.assign(el.style, attrs[k]);
      }
      else if (k.startsWith('on')) {
        el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      }
      else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    });
  }
  (Array.isArray(children) ? children : children != null ? [children] : []).forEach(c => {
    if (c == null) return;
    if (Array.isArray(c)) { c.forEach(nested => { if (nested != null) el.appendChild(nested.nodeType ? nested : document.createTextNode(String(nested))); }); return; }
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

function saveWeek(week) {
  state.week = week;
  wwSaveCurrentWeek(week);
}

function hasUnreadMessages() {
  return CHANNELS.some(c => c.unread > 0) || DMS.some(d => d.unread > 0);
}

function wwTopPriority() {
  if (!state.week) return null;
  return state.week.priorities.find(p => p.selected) || state.week.priorities[0];
}

function wwDoTasks() {
  return state.week ? state.week.tasks.filter(t => t.triage === 'do') : [];
}

function wwDoneDoTasks() {
  return wwDoTasks().filter(t => t.done);
}

function cycleTriage(current) {
  const order = ['do', 'defer', 'delegate', 'delete'];
  return order[(order.indexOf(current) + 1) % order.length];
}

function screenHeader(weekLabel, title, extra) {
  const header = h('div', { className: 'screen-header' }, [
    h('div', { className: 'screen-date' }, weekLabel),
    h('div', { className: 'screen-title' }, title),
  ]);
  if (extra) header.appendChild(extra);
  return header;
}

function stepBadge(text) {
  return h('div', { className: 'ww-step-badge' }, text);
}

function wwCard(children) {
  return h('div', { className: 'ww-card' }, children);
}
