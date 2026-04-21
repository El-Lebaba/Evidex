export type Course = {
  id: number | string;
  name: string;
  progress: number;
  completed: boolean;
  subject?: string;
  courseId?: string;
  totalSlides?: number;
  highestSlideIndex?: number;
  lastOpenedAt?: string;
};

export type UserInfo = {
  id?: string;
  name?: string;
  xp: number;
  level: number;
};

export type Achievement = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export type AppSettings = {
  darkMode: boolean;
  language: string;
  notifications: boolean;
};

type StoredUser = {
  id: string;
  key: string;
  name: string;
  xp: number;
  level: number;
  createdAt: string;
  lastSeenAt: string;
};

type StoredCourseProgress = {
  id: string;
  subject: string;
  courseId: string;
  name: string;
  progress: number;
  completed: boolean;
  totalSlides?: number;
  highestSlideIndex?: number;
  lastOpenedAt: string;
};

type UserData = {
  courses: Record<string, StoredCourseProgress>;
  achievements: Record<string, Achievement>;
  settings: AppSettings;
};

type AppData = {
  activeUserId: string;
  users: Record<string, StoredUser>;
  userData: Record<string, UserData>;
};

const storageKey = 'evidex_app_data';
const defaultUserName = 'User';

const defaultSettings: AppSettings = {
  darkMode: false,
  language: 'fr',
  notifications: true,
};

const defaultAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Premier pas',
    description: 'Ouvrir la simulation pour la premiere fois',
    completed: false,
  },
  {
    id: 2,
    title: 'Simulateur assidu',
    description: 'Ouvrir la simulation 5 fois',
    completed: false,
  },
  {
    id: 3,
    title: 'Premier cours termine',
    description: 'Completer 1 cours',
    completed: false,
  },
  {
    id: 4,
    title: 'Studieux',
    description: 'Completer 5 cours',
    completed: false,
  },
  {
    id: 5,
    title: 'Flashcards',
    description: 'Creer 10 flashcards',
    completed: false,
  },
  {
    id: 6,
    title: 'Niveau 5',
    description: 'Atteindre le niveau 5',
    completed: false,
  },
];

let memoryData: AppData | null = null;

function canUseLocalStorage() {
  return typeof localStorage !== 'undefined';
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeUserName(name?: string | null) {
  const trimmedName = name?.trim();
  return trimmedName && trimmedName.length > 0 ? trimmedName : defaultUserName;
}

function userKey(name: string) {
  return normalizeUserName(name).toLocaleLowerCase();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function clampProgress(progress: number) {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(progress)));
}

function progressFromSlide(slideIndex: number, totalSlides?: number) {
  if (!totalSlides || totalSlides <= 0) {
    return slideIndex >= 0 ? 1 : 0;
  }

  const safeSlide = Math.max(0, Math.min(Math.floor(slideIndex), totalSlides - 1));
  return clampProgress(((safeSlide + 1) / totalSlides) * 100);
}

function defaultAchievementMap() {
  return Object.fromEntries(defaultAchievements.map((achievement) => [String(achievement.id), achievement]));
}

function createUser(name: string): StoredUser {
  const displayName = normalizeUserName(name);
  return {
    id: createId('user'),
    key: userKey(displayName),
    name: displayName,
    xp: 0,
    level: 1,
    createdAt: nowIso(),
    lastSeenAt: nowIso(),
  };
}

function createUserData(): UserData {
  return {
    courses: {},
    achievements: defaultAchievementMap(),
    settings: { ...defaultSettings },
  };
}

function createDefaultAppData() {
  const user = createUser(defaultUserName);
  return {
    activeUserId: user.id,
    users: { [user.id]: user },
    userData: { [user.id]: createUserData() },
  };
}

function readAppData(): AppData {
  if (memoryData) {
    return memoryData;
  }

  if (!canUseLocalStorage()) {
    memoryData = createDefaultAppData();
    return memoryData;
  }

  try {
    const savedValue = localStorage.getItem(storageKey);
    memoryData = savedValue ? JSON.parse(savedValue) : createDefaultAppData();
  } catch {
    memoryData = createDefaultAppData();
  }

  if (!memoryData) {
    memoryData = createDefaultAppData();
  }

  return memoryData;
}

function writeAppData(nextData: AppData) {
  memoryData = nextData;

  if (canUseLocalStorage()) {
    localStorage.setItem(storageKey, JSON.stringify(nextData));
  }
}

function ensureActiveUser(data = readAppData()) {
  let activeUser = data.users[data.activeUserId];

  if (!activeUser) {
    activeUser = createUser(defaultUserName);
    data.activeUserId = activeUser.id;
    data.users[activeUser.id] = activeUser;
  }

  if (!data.userData[activeUser.id]) {
    data.userData[activeUser.id] = createUserData();
  }

  return activeUser;
}

function getActiveUserData(data = readAppData()) {
  const user = ensureActiveUser(data);
  return data.userData[user.id];
}

function findUserByName(data: AppData, name: string) {
  const key = userKey(name);
  return Object.values(data.users).find((user) => user.key === key);
}

function courseIdentity(course: Partial<Course>) {
  const idText = String(course.id ?? '');

  if (course.subject && course.courseId) {
    return {
      subject: course.subject,
      courseId: course.courseId,
      id: `${course.subject}:${course.courseId}`,
    };
  }

  if (idText.includes(':')) {
    const [subject, courseId] = idText.split(':');
    return { subject, courseId, id: idText };
  }

  return { subject: 'general', courseId: idText, id: idText };
}

function mapCourse(course: StoredCourseProgress): Course {
  return {
    id: course.id,
    name: course.name,
    progress: course.progress,
    completed: course.completed,
    subject: course.subject,
    courseId: course.courseId,
    totalSlides: course.totalSlides,
    highestSlideIndex: course.highestSlideIndex,
    lastOpenedAt: course.lastOpenedAt,
  };
}

function emitSettingsChanged() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event('evidex_settings_changed'));
  }
}

export const db = {
  init(userName?: string) {
    const data = readAppData();
    ensureActiveUser(data);

    if (userName) {
      db.setActiveUser(userName);
      return;
    }

    writeAppData(data);
  },

  setActiveUser(userName: string) {
    const data = readAppData();
    const displayName = normalizeUserName(userName);
    let user = findUserByName(data, displayName);

    if (!user) {
      user = createUser(displayName);
      data.users[user.id] = user;
      data.userData[user.id] = createUserData();
    }

    user.name = displayName;
    user.key = userKey(displayName);
    user.lastSeenAt = nowIso();
    data.activeUserId = user.id;
    ensureActiveUser(data);
    writeAppData(data);

    return db.getUser();
  },

  syncUser(userName: string) {
    return db.setActiveUser(userName);
  },

  renameActiveUser(nextName: string) {
    const data = readAppData();
    const currentUser = ensureActiveUser(data);
    const displayName = normalizeUserName(nextName);
    const existingUser = findUserByName(data, displayName);

    if (existingUser && existingUser.id !== currentUser.id) {
      data.activeUserId = existingUser.id;
      existingUser.lastSeenAt = nowIso();
      ensureActiveUser(data);
      writeAppData(data);
      return db.getUser();
    }

    currentUser.name = displayName;
    currentUser.key = userKey(displayName);
    currentUser.lastSeenAt = nowIso();
    writeAppData(data);
    return db.getUser();
  },

  getUsers() {
    const data = readAppData();
    return Object.values(data.users)
      .sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt))
      .map((user) => ({
        id: user.id,
        name: user.name,
        xp: user.xp,
        level: user.level,
      }));
  },

  getUser(): UserInfo {
    const data = readAppData();
    const user = ensureActiveUser(data);
    return {
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
    };
  },

  saveUser(userInfo: UserInfo) {
    const data = readAppData();
    const user = ensureActiveUser(data);

    if (userInfo.name) {
      user.name = normalizeUserName(userInfo.name);
      user.key = userKey(user.name);
    }

    user.xp = Math.max(0, Math.round(userInfo.xp));
    user.level = Math.max(1, Math.round(userInfo.level));
    user.lastSeenAt = nowIso();
    writeAppData(data);
  },

  addXP(amount: number) {
    const user = db.getUser();
    const xp = Math.max(0, user.xp + amount);
    const level = Math.floor(xp / 100) + 1;
    const nextUser = { ...user, xp, level };

    db.saveUser(nextUser);
    return nextUser;
  },

  getRecentCourses(limit = 6) {
    const userData = getActiveUserData();
    return Object.values(userData.courses)
      .filter((course) => course.progress > 0)
      .sort((left, right) => right.lastOpenedAt.localeCompare(left.lastOpenedAt))
      .slice(0, limit)
      .map(mapCourse);
  },

  getCourseProgressMap() {
    const userData = getActiveUserData();
    return Object.values(userData.courses).reduce<Record<string, number>>((progressMap, course) => {
      if (course.progress > 0) {
        progressMap[course.id] = course.highestSlideIndex ?? 0;
      }

      return progressMap;
    }, {});
  },

  getCourseProgress(subject: string, courseId: string) {
    const userData = getActiveUserData();
    const course = userData.courses[`${subject}:${courseId}`];
    return course?.highestSlideIndex ?? 0;
  },

  saveCourseProgress(subject: string, courseId: string, slideIndex: number, totalSlides?: number, courseName?: string) {
    const progress = progressFromSlide(slideIndex, totalSlides);

    if (progress <= 0) {
      return;
    }

    const data = readAppData();
    const userData = getActiveUserData(data);
    const id = `${subject}:${courseId}`;
    const existing = userData.courses[id];
    const highestSlideIndex = Math.max(existing?.highestSlideIndex ?? -1, Math.max(0, Math.floor(slideIndex)));
    const nextProgress = Math.max(existing?.progress ?? 0, progress);

    userData.courses[id] = {
      id,
      subject,
      courseId,
      name: courseName ?? existing?.name ?? `${subject} - ${courseId}`,
      progress: nextProgress,
      completed: nextProgress >= 100,
      totalSlides: totalSlides ?? existing?.totalSlides,
      highestSlideIndex,
      lastOpenedAt: nowIso(),
    };

    writeAppData(data);
  },

  saveCourses(courses: Course[]) {
    courses.forEach((course) => {
      const identity = courseIdentity(course);

      if (course.highestSlideIndex !== undefined) {
        db.saveCourseProgress(
          identity.subject,
          identity.courseId,
          course.highestSlideIndex,
          course.totalSlides,
          course.name,
        );
        return;
      }

      if (course.progress > 0) {
        const slideIndex = course.totalSlides
          ? Math.max(0, Math.ceil((course.progress / 100) * course.totalSlides) - 1)
          : 0;
        db.saveCourseProgress(identity.subject, identity.courseId, slideIndex, course.totalSlides, course.name);
      }
    });
  },

  updateCourse(id: number | string, patch: Partial<Course>) {
    const identity = courseIdentity({ ...patch, id });
    const existingProgress = db.getCourseProgress(identity.subject, identity.courseId);

    db.saveCourseProgress(
      identity.subject,
      identity.courseId,
      patch.highestSlideIndex ?? existingProgress,
      patch.totalSlides,
      patch.name,
    );
  },

  deleteCourse(id: number | string) {
    const data = readAppData();
    const userData = getActiveUserData(data);
    const identity = courseIdentity({ id });
    delete userData.courses[identity.id];
    writeAppData(data);
  },

  getAchievements() {
    const userData = getActiveUserData();
    return defaultAchievements.map((achievement) => ({
      ...achievement,
      ...userData.achievements[String(achievement.id)],
    }));
  },

  completeAchievement(id: number) {
    const data = readAppData();
    const userData = getActiveUserData(data);
    const existing = userData.achievements[String(id)] ?? defaultAchievements.find((achievement) => achievement.id === id);

    if (existing) {
      userData.achievements[String(id)] = { ...existing, completed: true };
      writeAppData(data);
    }
  },

  saveAchievement(achievement: Achievement) {
    const data = readAppData();
    const userData = getActiveUserData(data);
    const existing = userData.achievements[String(achievement.id)];
    userData.achievements[String(achievement.id)] = {
      ...achievement,
      completed: existing?.completed || achievement.completed,
    };
    writeAppData(data);
  },

  getSettings() {
    return { ...getActiveUserData().settings };
  },

  saveSettings(settings: AppSettings) {
    const data = readAppData();
    const userData = getActiveUserData(data);
    userData.settings = { ...settings };
    writeAppData(data);
    emitSettingsChanged();
  },

  resetActiveUserData() {
    const data = readAppData();
    const user = ensureActiveUser(data);
    data.userData[user.id] = createUserData();
    user.xp = 0;
    user.level = 1;
    user.lastSeenAt = nowIso();
    writeAppData(data);
    emitSettingsChanged();
  },
};
