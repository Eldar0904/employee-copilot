// ── Winning Week persistence (localStorage) ───────────────────────────────────

function wwGetCurrentWeek() {
  try {
    const raw = localStorage.getItem(WW_STORAGE_KEYS.currentWeek);
    if (!raw) {
      const seeded = wwSeedDemoWeek();
      wwSaveCurrentWeek(seeded);
      return seeded;
    }
    const week = JSON.parse(raw);
    if (!week._demo && week.tasks?.length === 7 && week.calendarEvents?.length === 7) {
      week._demo = true;
    }
    if (week.id !== wwGetWeekId()) {
      wwArchiveWeek(week);
      const fresh = wwCreateEmptyWeek();
      wwSaveCurrentWeek(fresh);
      return fresh;
    }
    return week;
  } catch (e) {
    console.error('Error loading week:', e);
    return wwCreateEmptyWeek();
  }
}

function wwSaveCurrentWeek(week) {
  try {
    localStorage.setItem(WW_STORAGE_KEYS.currentWeek, JSON.stringify(week));
    return true;
  } catch (e) {
    console.error('Error saving week:', e);
    return false;
  }
}

function wwArchiveWeek(week) {
  try {
    const raw = localStorage.getItem(WW_STORAGE_KEYS.weekHistory);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift(week);
    localStorage.setItem(WW_STORAGE_KEYS.weekHistory, JSON.stringify(history.slice(0, 52)));
  } catch (e) {
    console.error('Error archiving week:', e);
  }
}

function wwGetWeekHistory() {
  try {
    const raw = localStorage.getItem(WW_STORAGE_KEYS.weekHistory);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function wwIsOnboardingDone() {
  try {
    return localStorage.getItem(WW_STORAGE_KEYS.onboardingDone) === 'true';
  } catch {
    return false;
  }
}

function wwSetOnboardingDone() {
  localStorage.setItem(WW_STORAGE_KEYS.onboardingDone, 'true');
}
