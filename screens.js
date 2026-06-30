// ── Winning Week screens ──────────────────────────────────────────────────────

function renderOnboarding() {
  const step = WW_ONBOARDING_STEPS[state.onboardingStep];
  const overlay = h('div', { className: 'onboarding-overlay' });

  overlay.appendChild(h('div', { className: 'onboarding-card' }, [
    h('div', { className: 'onboarding-emoji' }, step.emoji),
    h('div', { className: 'onboarding-title' }, step.title),
    h('div', { className: 'onboarding-body' }, step.body),
    h('div', { className: 'onboarding-dots' },
      WW_ONBOARDING_STEPS.map((_, i) =>
        h('div', { className: `onboarding-dot${i === state.onboardingStep ? ' active' : ''}` })
      )
    ),
    h('button', {
      className: 'btn-primary',
      style: 'background:#0b5389;width:100%;',
      onclick: () => {
        if (state.onboardingStep < WW_ONBOARDING_STEPS.length - 1) {
          state.onboardingStep++;
          render();
        } else {
          wwSetOnboardingDone();
          state.showOnboarding = false;
          render();
        }
      },
    }, state.onboardingStep < WW_ONBOARDING_STEPS.length - 1 ? 'Continue' : 'Start planning'),
    state.onboardingStep < WW_ONBOARDING_STEPS.length - 1
      ? h('button', {
          className: 'onboarding-skip',
          onclick: () => { wwSetOnboardingDone(); state.showOnboarding = false; render(); },
        }, 'Skip')
      : null,
  ]));
  return overlay;
}

// ── PLAN (Steps 1–2) ─────────────────────────────────────────────────────────

function renderPlan() {
  const week = state.week;
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  const scroll = h('div', { className: 'screen-scroll' });

  scroll.appendChild(screenHeader(week.label, 'Plan your week'));

  // Step 1
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    stepBadge('Step 1 · Lesson learned'),
    wwCard([
      h('div', { className: 'ww-card-title' }, 'What did last week teach you?'),
      h('div', { className: 'ww-chips' },
        WW_REFLECTION_PROMPTS.map((p, i) =>
          h('button', {
            className: `ww-chip${state.activePrompt === i ? ' active' : ''}`,
            onclick: () => {
              state.activePrompt = i;
              if (!week.lesson) { week.lesson = p + ' '; saveWeek(week); }
              render();
            },
          }, p)
        )
      ),
      h('textarea', {
        className: 'ww-textarea',
        placeholder: 'Write your lesson here…',
        value: week.lesson,
        oninput: e => { week.lesson = e.target.value; saveWeek(week); },
      }),
    ]),
  ]));

  // Step 2
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    stepBadge('Step 2 · Leveraged priority'),
    wwCard([
      h('div', { className: 'ww-card-title' }, 'The one outcome that makes everything else easier'),
      ...week.priorities.map((p, i) => {
        const row = h('div', { className: 'ww-priority-row' });
        const sel = h('button', {
          className: `ww-priority-sel${p.selected ? ' active' : ''}`,
          onclick: () => {
            week.priorities.forEach((pr, j) => { pr.selected = j === i; });
            saveWeek(week);
            render();
          },
        }, p.selected ? '★' : String(i + 1));
        const input = h('input', {
          className: `ww-priority-input${p.selected ? ' active' : ''}`,
          placeholder: `Priority ${i + 1}…`,
          value: p.text,
          oninput: e => { p.text = e.target.value; saveWeek(week); },
          onfocus: () => {
            if (!p.selected) { week.priorities.forEach((pr, j) => { pr.selected = j === i; }); saveWeek(week); render(); }
          },
        });
        row.appendChild(sel);
        row.appendChild(input);
        return row;
      }),
      h('div', { className: 'ww-hint' }, 'Tap the number to mark as your top priority'),
    ]),
  ]));

  wrap.appendChild(scroll);
  return wrap;
}

// ── AUDIT (Steps 3–4) ───────────────────────────────────────────────────────

function renderAudit() {
  const week = state.week;
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  const scroll = h('div', { className: 'screen-scroll' });

  scroll.appendChild(screenHeader(week.label, 'Audit and triage'));

  // Step 3: Calendar
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    stepBadge('Step 3 · Interrogate calendar'),
    wwCard([
      h('div', { className: 'ww-card-title' }, "This week's events"),
      h('div', { className: 'ww-legend' },
        WW_EVENT_TYPES.map(t =>
          h('div', { className: 'ww-legend-item' }, [
            h('div', { className: 'ww-legend-dot', style: `background:${t.color}` }),
            h('span', null, t.label),
          ])
        )
      ),
      ...WW_DAYS.map(day => {
        const dayEvents = week.calendarEvents.filter(e => e.day === day);
        if (!dayEvents.length) return null;
        return h('div', { className: 'ww-day-row' }, [
          h('div', { className: 'ww-day-label' }, day),
          h('div', { className: 'ww-day-events' },
            dayEvents.map(event => {
              const type = wwEventType(event.type);
              return h('button', {
                className: `ww-event-chip${event.flagged ? ' flagged' : ''}`,
                style: `background:${type.bg};border-color:${type.color};color:${type.color}`,
                onclick: () => { event.flagged = !event.flagged; saveWeek(week); render(); },
              }, event.title);
            })
          ),
        ]);
      }),
      week.calendarEvents.length === 0
        ? h('div', { className: 'ww-empty' }, 'No events added yet. Add your week below.')
        : null,
      state.addingEvent ? renderAddEventForm(week) : h('button', {
        className: 'ww-add-btn',
        onclick: () => { state.addingEvent = true; render(); },
      }, '+ Add event'),
      h('div', { className: 'ww-hint' }, 'Tap an event to flag it for removal'),
    ]),
  ]));

  // Step 4: Triage
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    stepBadge('Step 4 · Task triage'),
    wwCard([
      h('div', { className: 'ww-card-title' }, 'Decide the fate of every task'),
      ...week.tasks.map(task => renderTriageRow(task, week)),
      week.tasks.length === 0
        ? h('div', { className: 'ww-empty' }, "No tasks yet. Add what's on your plate.")
        : null,
      state.addingTask ? renderAddTaskForm(week) : h('button', {
        className: 'ww-add-btn',
        onclick: () => { state.addingTask = true; render(); },
      }, '+ Add task'),
      h('div', { className: 'ww-hint' }, 'Tap to cycle: Do → Defer → Delegate → Delete'),
    ]),
  ]));

  wrap.appendChild(scroll);
  return wrap;
}

function renderTriageRow(task, week) {
  const color = wwTriageColor(task.triage);
  const bg = wwTriageBg(task.triage);
  const label = WW_TRIAGE[task.triage].label;
  const row = h('div', { className: 'ww-triage-row' });
  row.appendChild(h('div', { className: 'ww-triage-bar', style: `background:${color}` }));
  row.appendChild(h('div', { className: 'ww-triage-text' }, task.text));
  row.appendChild(h('div', { className: 'ww-triage-tag', style: `background:${bg};color:${color}` }, label));
  row.addEventListener('click', () => {
    task.triage = cycleTriage(task.triage);
    saveWeek(week);
    render();
  });
  return row;
}

function renderAddEventForm(week) {
  const ev = state.auditNewEvent;
  return h('div', { className: 'ww-add-form' }, [
    h('input', {
      className: 'ww-input',
      placeholder: 'Event name…',
      value: ev.title,
      oninput: e => { ev.title = e.target.value; },
    }),
    h('div', { className: 'ww-chips' },
      WW_DAYS.map(d =>
        h('button', {
          className: `ww-chip${ev.day === d ? ' active' : ''}`,
          onclick: () => { ev.day = d; render(); },
        }, d)
      )
    ),
    h('div', { className: 'ww-chips' },
      WW_EVENT_TYPES.map(t =>
        h('button', {
          className: `ww-chip${ev.type === t.key ? ' active' : ''}`,
          style: ev.type === t.key ? `background:${t.bg};border-color:${t.color};color:${t.color}` : '',
          onclick: () => { ev.type = t.key; render(); },
        }, t.label)
      )
    ),
    h('div', { className: 'ww-form-actions' }, [
      h('button', { className: 'ww-cancel-btn', onclick: () => { state.addingEvent = false; render(); } }, 'Cancel'),
      h('button', {
        className: 'ww-confirm-btn',
        onclick: () => {
          if (!ev.title.trim()) return;
          week.calendarEvents.push({
            id: Date.now().toString(),
            title: ev.title.trim(),
            day: ev.day,
            type: ev.type,
            flagged: false,
          });
          state.auditNewEvent = { title: '', day: 'Mon', type: 'meeting' };
          state.addingEvent = false;
          saveWeek(week);
          render();
        },
      }, 'Add event'),
    ]),
  ]);
}

function renderAddTaskForm(week) {
  return h('div', { className: 'ww-add-form' }, [
    h('input', {
      className: 'ww-input',
      placeholder: 'Task description…',
      value: state.auditNewTask,
      oninput: e => { state.auditNewTask = e.target.value; },
      onkeydown: e => { if (e.key === 'Enter') submitAuditTask(week); },
    }),
    h('div', { className: 'ww-form-actions' }, [
      h('button', { className: 'ww-cancel-btn', onclick: () => { state.addingTask = false; render(); } }, 'Cancel'),
      h('button', { className: 'ww-confirm-btn', onclick: () => submitAuditTask(week) }, 'Add task'),
    ]),
  ]);
}

function submitAuditTask(week) {
  if (!state.auditNewTask.trim()) return;
  week.tasks.push({ id: Date.now().toString(), text: state.auditNewTask.trim(), triage: 'do', done: false });
  state.auditNewTask = '';
  state.addingTask = false;
  saveWeek(week);
  render();
}

// ── EXECUTE (Steps 5–6) ───────────────────────────────────────────────────────

function renderExecute() {
  const week = state.week;
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  const scroll = h('div', { className: 'screen-scroll' });

  const doTasks = wwDoTasks();
  const doneTasks = wwDoneDoTasks();
  const pending = doTasks.length - doneTasks.length;
  const pct = doTasks.length ? Math.round(doneTasks.length / doTasks.length * 100) : 0;
  const topPriority = wwTopPriority();
  const allEvents = week.calendarEvents || [];
  const todayEvents = allEvents.filter(e => e.day === state.activeDay && !e.flagged);
  const deepWorkCount = allEvents.filter(e => e.type === 'deep' && !e.flagged).length;
  const meetingCount = allEvents.filter(e => e.type === 'meeting' && !e.flagged).length;
  const flaggedCount = allEvents.filter(e => e.flagged).length;

  const nudgeText = pending === 0 && doTasks.length > 0
    ? `All ${doTasks.length} tasks done — great week!`
    : topPriority?.text
    ? `${pending} task${pending === 1 ? '' : 's'} left. Stay focused on: "${topPriority.text}"`
    : `${pending} task${pending === 1 ? '' : 's'} remaining this week.`;

  scroll.appendChild(screenHeader(week.label, 'Good morning, Sara 👋', renderAINudge(nudgeText)));

  // Stats
  scroll.appendChild(h('div', { className: 'ww-stats-grid' }, [
    renderStatCard('Tasks done', `${doneTasks.length}/${doTasks.length}`, '#0b5389'),
    renderStatCard('Deep work', String(deepWorkCount), '#2E8B57', 'blocks'),
    renderStatCard('Meetings', String(meetingCount), '#ff9500'),
    renderStatCard('Removed', String(flaggedCount), '#ef4635', 'events'),
  ]));

  // Priority + progress
  if (topPriority?.text) {
    scroll.appendChild(h('div', { className: 'ww-section' }, [
      h('div', { className: 'section-row', style: 'padding-top:0' }, [
        h('div', { className: 'section-title' }, 'Leveraged priority'),
      ]),
      wwCard([
        h('div', { className: 'ww-priority-banner-text' }, topPriority.text),
        h('div', { className: 'week-progress-row' }, [
          h('div', { className: 'week-progress-label' }, 'Do list progress'),
          h('div', { className: 'week-progress-count' }, `${pct}%`),
        ]),
        h('div', { className: 'progress-track' }, [
          h('div', { className: 'progress-fill', style: `width:${pct}%` }),
        ]),
      ]),
    ]));
  }

  // Day pills + events
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-title', style: 'margin-bottom:10px' }, "Today's plan"),
    renderExecDayPills(allEvents),
    renderDayProgress(allEvents, state.activeDay),
    wwCard(
      todayEvents.length
        ? todayEvents.map((event, i) => {
            const type = wwEventType(event.type);
            return h('div', { className: `ww-time-slot${i < todayEvents.length - 1 ? ' bordered' : ''}` }, [
              h('div', { className: 'ww-slot-bar', style: `background:${type.color}` }),
              h('div', null, [
                h('div', { className: 'ww-slot-name' }, event.title),
                h('div', { className: 'ww-slot-type', style: `color:${type.color}` }, event.type),
              ]),
            ]);
          })
        : [h('div', { className: 'ww-empty' }, `No events for ${state.activeDay}. Add them in Audit.`)]
    ),
  ]));

  // Do list
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-row', style: 'padding-top:0' }, [
      h('div', { className: 'section-title' }, 'Do list'),
      h('div', { className: 'count-badge' }, `${doneTasks.length}/${doTasks.length}`),
    ]),
    doTasks.length === 0
      ? wwCard([h('div', { className: 'ww-empty' }, 'No tasks marked as Do. Add them in Audit.')])
      : [...doTasks.filter(t => !t.done), ...doTasks.filter(t => t.done)].map(t => renderDoTaskCard(t, week)),
  ]));

  wrap.appendChild(scroll);
  return wrap;
}

function renderAINudge(text) {
  return h('div', { className: 'ai-nudge' }, [
    h('div', { className: 'ai-nudge-icon' }, [
      svgEl('<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/></svg>'),
    ]),
    h('div', { style: 'flex:1;min-width:0;' }, [
      h('div', { className: 'ai-label' }, 'Copilot'),
      h('div', { className: 'ai-text' }, text),
    ]),
  ]);
}

function renderStatCard(label, value, color, unit) {
  return h('div', { className: 'ww-stat-card' }, [
    h('div', { className: 'ww-stat-label' }, label),
    h('div', { className: 'ww-stat-value', style: `color:${color}` },
      unit ? [value, h('span', { className: 'ww-stat-unit' }, ` ${unit}`)] : value
    ),
  ]);
}

function renderExecDayPills(allEvents) {
  const container = h('div', { className: 'day-pills' });
  const todayKey = wwGetTodayDayKey();
  WW_DAYS.forEach(d => {
    const dayEvents = allEvents.filter(e => e.day === d && !e.flagged);
    const hasDeep = dayEvents.some(e => e.type === 'deep');
    const hasMeeting = dayEvents.some(e => e.type === 'meeting');
    const dotColor = !dayEvents.length ? 'transparent' : hasDeep ? '#2E8B57' : hasMeeting ? '#ff9500' : '#0b5389';
    const isActive = state.activeDay === d;
    const isToday = d === todayKey;
    const pill = h('div', {
      className: 'day-pill',
      style: `background:${isActive ? '#0b5389' : isToday ? '#e2f6fd' : '#ffffff'}`,
    }, [
      h('div', { className: 'day-label', style: `color:${isActive ? 'rgba(255,255,255,0.65)' : '#a6a6a6'}` }, d),
      h('div', { className: 'day-dot', style: `background:${dotColor}` }),
    ]);
    pill.addEventListener('click', () => { state.activeDay = d; render(); });
    container.appendChild(pill);
  });
  return container;
}

function renderDayProgress(allEvents, activeDay) {
  const dayAll = allEvents.filter(e => e.day === activeDay && !e.flagged);
  const dayDeep = dayAll.filter(e => e.type === 'deep').length;
  const pct = dayAll.length === 0 ? 0 : Math.round(dayDeep / dayAll.length * 100);
  return h('div', { className: 'week-progress-card', style: 'margin-top:12px' }, [
    h('div', { className: 'week-progress-row' }, [
      h('div', { className: 'week-progress-label' }, `${activeDay} — ${dayAll.length} event${dayAll.length !== 1 ? 's' : ''}`),
      h('div', { className: 'week-progress-count' }, `${dayDeep} deep work`),
    ]),
    h('div', { className: 'progress-track' }, [
      h('div', { className: 'progress-fill', style: `width:${pct}%;background:linear-gradient(90deg,#2E8B57,#86d7f7)` }),
    ]),
  ]);
}

function renderDoTaskCard(task, week) {
  const done = !!task.done;
  const color = done ? '#e0e4e8' : wwTriageColor(task.triage);
  const card = h('div', { className: 'task-card' });
  card.appendChild(h('div', { className: 'task-priority-bar', style: `background:${color}` }));

  const check = h('div', { className: `task-check${done ? ' done' : ''}` });
  check.addEventListener('click', e => {
    e.stopPropagation();
    task.done = !task.done;
    saveWeek(week);
    render();
  });
  if (done) {
    check.appendChild(svgEl('<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10L11 3" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'));
  }

  const triageBg = wwTriageBg(task.triage);
  const triageColor = wwTriageColor(task.triage);
  const body = h('div', { className: 'task-body' }, [
    check,
    h('div', { className: 'task-info' }, [
      h('div', { className: `task-title${done ? ' done' : ''}` }, task.text),
      h('div', { className: 'task-meta' }, [
        h('div', { className: 'ai-priority-tag', style: `background:${triageBg};color:${triageColor}` },
          WW_TRIAGE[task.triage].label),
        done ? h('div', { className: 'due-time', style: 'color:#34c759' }, 'Done ✓') : null,
      ]),
    ]),
    svgEl('<svg class="chevron-right" width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="#223035" stroke-width="2" stroke-linecap="round"/></svg>'),
  ]);
  body.addEventListener('click', () => { state.activeTask = task; render(); });
  card.appendChild(body);
  return card;
}

// ── REVIEW ────────────────────────────────────────────────────────────────────

function renderReview() {
  const week = state.week;
  const wrap = h('div', { style: 'flex:1;display:flex;flex-direction:column;overflow:hidden;' });
  const scroll = h('div', { className: 'screen-scroll' });
  const doTasks = wwDoTasks();
  const doneTasks = wwDoneDoTasks();
  const topPriority = wwTopPriority();

  scroll.appendChild(screenHeader(week.label, 'Weekly review'));

  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-title', style: 'margin-bottom:10px' }, 'Week at a glance'),
    h('div', { className: 'ww-summary-grid' }, [
      renderStatCard('Tasks done', `${doneTasks.length}/${doTasks.length}`, '#0b5389'),
      renderStatCard('Weeks tracked', String(state.weekHistory.length + 1), '#34c759'),
    ]),
    topPriority?.text ? h('div', { className: 'ww-priority-banner' }, [
      h('div', { className: 'ww-priority-banner-label' }, "This week's priority"),
      h('div', { className: 'ww-priority-banner-text' }, topPriority.text),
    ]) : null,
  ]));

  // Rating
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-title', style: 'margin-bottom:10px' }, 'How was your week?'),
    wwCard([
      h('div', { className: 'ww-card-title' }, 'Overall rating'),
      h('div', { className: 'ww-stars' },
        [1, 2, 3, 4, 5].map(n =>
          h('button', {
            className: `ww-star${week.review.rating >= n ? ' lit' : ''}`,
            onclick: () => { week.review.rating = n; saveWeek(week); render(); },
          }, '★')
        )
      ),
    ]),
  ]));

  // Sliders
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-title', style: 'margin-bottom:10px' }, 'Self-assessment'),
    wwCard([
      renderSliderRow('Priority complete', week.review.priorityDone, 0, 100, '%', v => { week.review.priorityDone = v; saveWeek(week); render(); }),
      renderSliderRow('Energy level', week.review.energyLevel, 1, 10, '', v => { week.review.energyLevel = v; saveWeek(week); render(); }),
      renderSliderRow('Focus quality', week.review.focusQuality, 1, 10, '', v => { week.review.focusQuality = v; saveWeek(week); render(); }),
    ]),
  ]));

  // Reflection
  scroll.appendChild(h('div', { className: 'ww-section' }, [
    h('div', { className: 'section-title', style: 'margin-bottom:10px' }, 'Reflection'),
    h('div', { className: 'ww-chips', style: 'margin-bottom:10px' },
      WW_REVIEW_PROMPTS.map(p =>
        h('button', {
          className: 'ww-chip',
          onclick: () => {
            if (!week.review.reflection) { week.review.reflection = p + '\n\n'; saveWeek(week); render(); }
          },
        }, p)
      )
    ),
    h('textarea', {
      className: 'ww-textarea',
      placeholder: 'What will you carry into next week?',
      value: week.review.reflection,
      oninput: e => { week.review.reflection = e.target.value; saveWeek(week); },
    }),
  ]));

  // History
  if (state.weekHistory.length > 0) {
    scroll.appendChild(h('div', { className: 'ww-section' }, [
      h('button', {
        className: 'ww-history-toggle',
        onclick: () => { state.showHistory = !state.showHistory; render(); },
      }, [
        h('div', { className: 'section-title', style: 'margin:0' }, `Past weeks (${state.weekHistory.length})`),
        h('span', { className: 'ww-history-arrow' }, state.showHistory ? '▲' : '▼'),
      ]),
      state.showHistory ? wwCard(
        state.weekHistory.slice(0, 8).map((w, i) => {
          const pri = w.priorities.find(p => p.selected);
          return h('div', { className: `ww-history-row${i < 7 ? ' bordered' : ''}` }, [
            h('div', { style: 'flex:1' }, [
              h('div', { className: 'ww-history-week' }, w.label),
              pri?.text ? h('div', { className: 'ww-history-priority' }, pri.text) : null,
            ]),
            w.review.rating > 0 ? h('div', { className: 'ww-history-rating' }, '★'.repeat(w.review.rating)) : null,
          ]);
        })
      ) : null,
    ]));
  }

  wrap.appendChild(scroll);
  return wrap;
}

function renderSliderRow(label, value, min, max, unit, onChange) {
  const options = [];
  for (let i = min; i <= max; i++) options.push(i);
  return h('div', { className: 'ww-slider-row' }, [
    h('div', { className: 'ww-slider-header' }, [
      h('span', { className: 'ww-slider-label' }, label),
      h('span', { className: 'ww-slider-value' }, `${value}${unit || ''}`),
    ]),
    h('div', { className: 'ww-slider-dots' },
      options.map(n =>
        h('button', {
          className: `ww-slider-dot${value >= n ? ' active' : ''}`,
          onclick: () => onChange(n),
        })
      )
    ),
  ]);
}

// ── WW Task detail sheet ──────────────────────────────────────────────────────

function renderWwTaskSheet() {
  const task = state.activeTask;
  const week = state.week;
  const live = week.tasks.find(t => t.id === task.id) || task;
  const done = !!live.done;
  const color = done ? '#34c759' : wwTriageColor(live.triage);
  const triageBg = wwTriageBg(live.triage);
  const triageColor = wwTriageColor(live.triage);

  const overlay = h('div', { className: 'sheet-overlay' });
  overlay.addEventListener('click', () => { state.activeTask = null; render(); });

  const btnEl = h('button', { className: 'btn-primary', style: `background:${done ? '#34c759' : '#0b5389'}` });
  btnEl.textContent = done ? 'Mark as Pending' : 'Mark as Done';
  btnEl.addEventListener('click', () => {
    live.done = !live.done;
    saveWeek(week);
    state.activeTask = null;
    render();
  });

  const closeBtn = h('button', { className: 'btn-icon' });
  closeBtn.appendChild(svgEl('<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#4f5158" stroke-width="2" stroke-linecap="round"/></svg>'));
  closeBtn.addEventListener('click', () => { state.activeTask = null; render(); });

  const sheet = h('div', { className: 'sheet' }, [
    h('div', { className: 'sheet-handle' }),
    h('div', { className: 'sheet-priority-bar', style: `background:${color}` }),
    h('div', { className: 'sheet-task-title' }, live.text),
    h('div', { className: 'sheet-tags' }, [
      h('div', { className: 'sheet-tag-priority', style: `background:${triageBg};color:${triageColor}` },
        WW_TRIAGE[live.triage].label),
      h('div', { className: 'sheet-tag-neutral' }, done ? 'Completed' : 'Pending'),
    ]),
    h('div', { className: 'sheet-actions' }, [btnEl, closeBtn]),
  ]);
  sheet.addEventListener('click', stopProp);
  overlay.appendChild(sheet);
  return overlay;
}
