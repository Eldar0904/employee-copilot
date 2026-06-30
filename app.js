// ── Render entry point ────────────────────────────────────────────────────────

function render() {
  const content = document.getElementById('appContent');
  if (!content) return;
  content.innerHTML = '';

  try {
    renderApp(content);
  } catch (err) {
    console.error(err);
    content.appendChild(h('div', { className: 'loading-screen', style: 'padding:24px;text-align:center;line-height:1.5' }, [
      I18N.errorTitle,
      h('br'),
      h('span', { style: 'font-size:12px;color:#a6a6a6' }, err.message),
    ]));
  }
}

function renderApp(content) {
  if (state.loading) {
    content.appendChild(h('div', { className: 'loading-screen' }, I18N.loading));
    return;
  }

  const isMeTab = state.activeTab === 'me' && !state.activeChat;
  document.getElementById('statusSpacer').style.background =
    isMeTab ? '#0b5389' : '#ffffff';

  if (state.activeChat) {
    content.appendChild(renderChat());
    return;
  }

  const wrapper = h('div', { className: 'screen' });
  if (state.activeTab === 'plan')    wrapper.appendChild(renderPlan());
  if (state.activeTab === 'audit')   wrapper.appendChild(renderAudit());
  if (state.activeTab === 'execute') wrapper.appendChild(renderExecute());
  if (state.activeTab === 'review')  wrapper.appendChild(renderReview());
  if (state.activeTab === 'messages') wrapper.appendChild(renderMessages());
  if (state.activeTab === 'me')      wrapper.appendChild(renderMe());
  content.appendChild(wrapper);

  if (state.activeTask) content.appendChild(renderWwTaskSheet());
  if (!state.activeChat) content.appendChild(renderTabBar());
  if (state.showOnboarding) content.appendChild(renderOnboarding());
}

// ── MESSAGES ──────────────────────────────────────────────────────────────────

function renderMessages() {
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  wrap.appendChild(h('div', { className: 'msgs-header' }, [
    h('div', { className: 'screen-title' }, I18N.messages),
    h('div', { className: 'search-bar' }, [
      svgEl('<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#a6a6a6" stroke-width="1.6"/><path d="M9.5 9.5L12.5 12.5" stroke="#a6a6a6" stroke-width="1.6" stroke-linecap="round"/></svg>'),
      h('div', { className: 'search-placeholder' }, I18N.searchMessages),
    ]),
  ]));

  const scroll = h('div', { className: 'msgs-scroll' });

  const chSection = h('div', { className: 'msgs-section' }, [
    h('div', { className: 'msgs-section-label' }, I18N.departments),
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
        sub: `${ch.unread > 0 ? ch.unread + ' ' + I18N.unread + ' · ' : ''}${I18N.deptChannel}`,
        color: ch.bgColor, icon: ch.emoji, iconSize: '18px', radius: '14px', isChannel: true,
      };
      render();
      scrollChatToBottom();
    });
    chSection.appendChild(row);
  });
  scroll.appendChild(chSection);

  const dmSection = h('div', { className: 'msgs-section' }, [
    h('div', { className: 'msgs-section-label' }, I18N.directMessages),
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
        sub: dm.role + (dm.online ? ' · ' + I18N.online : ''),
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
  const ac = state.activeChat;
  const wrap = h('div', { className: 'chat-screen' });

  const avatarEl = h('div', {
    className: 'chat-avatar',
    style: `width:36px;height:36px;border-radius:${ac.radius};background:${ac.color};font-size:${ac.iconSize};font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;`,
  }, ac.icon);

  wrap.appendChild(h('div', { className: 'chat-nav' }, [
    h('div', { className: 'back-btn', onclick: () => { state.activeChat = null; render(); } }, [
      svgEl('<svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M8 1L1 7.5L8 14" stroke="#0b5389" stroke-width="2.5" stroke-linecap="round"/></svg>'),
    ]),
    avatarEl,
    h('div', { className: 'chat-nav-info' }, [
      h('div', { className: 'chat-nav-name' }, ac.name),
      h('div', { className: 'chat-nav-sub' }, ac.sub),
    ]),
    h('div', { className: 'chat-more' }, [
      svgEl('<svg width="20" height="5" viewBox="0 0 20 5" fill="none"><circle cx="2.5" cy="2.5" r="2" fill="#a6a6a6"/><circle cx="10" cy="2.5" r="2" fill="#a6a6a6"/><circle cx="17.5" cy="2.5" r="2" fill="#a6a6a6"/></svg>'),
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
    h('div', { className: 'chat-input-field' }, I18N.typeMessage),
    h('div', { className: 'chat-send' }, [
      svgEl('<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'),
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
  const doTasks = wwDoTasks();
  const doneTasks = wwDoneDoTasks();

  wrap.appendChild(h('div', { className: 'me-hero' }, [
    h('div', { className: 'me-avatar' }, [h('div', { className: 'me-initials' }, 'SA')]),
    h('div', { className: 'me-name' }, I18N.meName),
    h('div', { className: 'me-role' }, I18N.meRole),
    h('div', { className: 'me-status' }, [
      h('div', { className: 'status-dot' }),
      h('div', { className: 'status-text' }, I18N.available),
    ]),
  ]));

  wrap.appendChild(h('div', { className: 'me-stats' }, [
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#0b5389' }, String(doneTasks.length)),
      h('div', { className: 'stat-label' }, I18N.doneThisWeek),
    ]),
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#c97559' }, String(doTasks.length - doneTasks.length)),
      h('div', { className: 'stat-label' }, I18N.pendingLabel),
    ]),
    h('div', { className: 'stat-card' }, [
      h('div', { className: 'stat-num', style: 'color:#34c759' }, String(state.weekHistory.length + 1)),
      h('div', { className: 'stat-label' }, I18N.weeksTracked),
    ]),
  ]));

  const list = h('div', { className: 'settings-list' });
  getProfileSettings().forEach(s => {
    if (s.isLanguage) {
      const lang = getLang();
      const row = h('div', { className: 'settings-row settings-row-lang', style: s.border ? 'border-bottom:1px solid #f2f4f5' : '' }, [
        h('div', { className: 'settings-icon', style: `background:${s.iconBg}` }, s.icon),
        h('div', { className: 'settings-label' }, s.label),
        h('div', { className: 'lang-picker' }, [
          h('button', {
            className: `lang-pill${lang === 'ru' ? ' active' : ''}`,
            onclick: e => { e.stopPropagation(); if (lang !== 'ru') setLanguage('ru'); },
          }, I18N.langRu),
          h('button', {
            className: `lang-pill${lang === 'en' ? ' active' : ''}`,
            onclick: e => { e.stopPropagation(); if (lang !== 'en') setLanguage('en'); },
          }, I18N.langEn),
        ]),
      ]);
      list.appendChild(row);
      return;
    }
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

// ── TAB BAR ───────────────────────────────────────────────────────────────────

function renderTabBar() {
  const A = '#0b5389', I = '#a6a6a6';
  const at = state.activeTab;
  const tabs = [
    { key: 'plan',    label: I18N.tabPlan,    active: at === 'plan' },
    { key: 'audit',   label: I18N.tabAudit,   active: at === 'audit' },
    { key: 'execute', label: I18N.tabDo,      active: at === 'execute' },
    { key: 'review',  label: I18N.tabReview,  active: at === 'review' },
    { key: 'messages', label: I18N.tabInbox,  active: at === 'messages', unread: hasUnreadMessages() },
    { key: 'me',      label: I18N.tabMe,      active: at === 'me' },
  ];

  const bar = h('div', { className: 'tab-bar tab-bar-6' });

  tabs.forEach(t => {
    const color = t.active ? A : I;
    const item = h('div', { className: 'tab-item' });
    if (t.unread) item.appendChild(h('div', { className: 'tab-unread' }));

    const icons = {
      plan: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M12 2l2 4 4.5.7-3.2 3.2.8 4.5-3.9-2.3-3.9 2.3.8-4.5-3.2-3.2L12 2z" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
      audit: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="15" rx="2" stroke="${color}" stroke-width="1.9"/><path d="M7 8h8M7 12h6M7 16h4" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/></svg>`,
      execute: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="${color}" stroke-width="1.9"/><path d="M9 7l6 4-6 4V7z" fill="${t.active ? color : 'none'}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
      review: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M4 16l3-9h8l3 9H4z" stroke="${color}" stroke-width="1.9" stroke-linejoin="round"/><path d="M6 19h10" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/></svg>`,
      messages: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M20 13a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h14a2 2 0 012 2v9z" stroke="${color}" stroke-width="1.9" stroke-linejoin="round"/></svg>`,
      me: `<svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7" r="3.5" stroke="${color}" stroke-width="1.9"/><path d="M3 20c0-4 3.582-7 8-7s8 3 8 7" stroke="${color}" stroke-width="1.9" stroke-linecap="round"/></svg>`,
    };

    item.appendChild(svgEl(icons[t.key]));
    item.appendChild(h('div', {
      className: 'tab-label',
      style: `color:${color};font-weight:${t.active ? '700' : '500'};font-size:9px`,
    }, t.label));
    item.addEventListener('click', () => { state.activeTab = t.key; render(); });
    bar.appendChild(item);
  });

  return bar;
}

// ── Boot ──────────────────────────────────────────────────────────────────────

function boot() {
  try {
    initLang();
    state.week = wwGetCurrentWeek();
    state.weekHistory = wwGetWeekHistory();
    state.activeDay = wwGetTodayDayKey();
    state.showOnboarding = !wwIsOnboardingDone();
    state.loading = false;
    render();
  } catch (err) {
    console.error(err);
    state.loading = false;
    render();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
