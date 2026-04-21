export type Course = {
  id: number;
  name: string;
  progress: number;
  completed: boolean;
};

export type UserInfo = {
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

const defaultCourses: Course[] = [
  { id: 1, name: 'Java - If Statement', progress: 65, completed: false },
  { id: 2, name: 'Java - Variables', progress: 40, completed: false },
  { id: 3, name: 'Java - For Loops', progress: 90, completed: false },
  { id: 4, name: 'Java - Methods', progress: 20, completed: false },
  { id: 5, name: 'Java - Arrays', progress: 100, completed: true },
  { id: 6, name: 'Java - Classes and Objects', progress: 10, completed: false },
];

const defaultUser: UserInfo = { xp: 340, level: 4 };

const defaultAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Premier pas',
    description: 'Ouvrir la simulation pour la premiere fois',
    completed: true,
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
    completed: true,
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

const defaultSettings: AppSettings = {
  darkMode: false,
  language: 'fr',
  notifications: true,
};

function canUseLocalStorage() {
  return typeof localStorage !== 'undefined';
}

function read<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function init() {
  // Put starter data in localStorage the first time the dashboard opens.
  if (!canUseLocalStorage()) {
    return;
  }

  if (!localStorage.getItem('evidex_courses')) {
    write('evidex_courses', defaultCourses);
  }
  if (!localStorage.getItem('evidex_user')) {
    write('evidex_user', defaultUser);
  }
  if (!localStorage.getItem('evidex_achievements')) {
    write('evidex_achievements', defaultAchievements);
  }
  if (!localStorage.getItem('evidex_settings')) {
    write('evidex_settings', defaultSettings);
  }
}

export const db = {
  init,

  getCourses() {
    return read<Course[]>('evidex_courses', defaultCourses);
  },
  saveCourses(courses: Course[]) {
    write('evidex_courses', courses);
  },
  addCourse(name: string) {
    const courses = db.getCourses();
    const course: Course = {
      id: Date.now(),
      name,
      progress: 0,
      completed: false,
    };

    db.saveCourses([...courses, course]);
    return course;
  },
  updateCourse(id: number, patch: Partial<Course>) {
    const courses = db.getCourses().map((course) =>
      course.id === id ? { ...course, ...patch } : course,
    );
    db.saveCourses(courses);
  },
  deleteCourse(id: number) {
    db.saveCourses(db.getCourses().filter((course) => course.id !== id));
  },

  getUser() {
    return read<UserInfo>('evidex_user', defaultUser);
  },
  saveUser(user: UserInfo) {
    write('evidex_user', user);
  },
  addXP(amount: number) {
    const user = db.getUser();
    const xp = user.xp + amount;
    const level = Math.floor(xp / 100) + 1;
    const updatedUser = { xp, level };

    db.saveUser(updatedUser);
    return updatedUser;
  },

  getAchievements() {
    return read<Achievement[]>('evidex_achievements', defaultAchievements);
  },
  completeAchievement(id: number) {
    const achievements = db.getAchievements().map((achievement) =>
      achievement.id === id ? { ...achievement, completed: true } : achievement,
    );
    write('evidex_achievements', achievements);
  },

  getSettings() {
    return read<AppSettings>('evidex_settings', defaultSettings);
  },
  saveSettings(settings: AppSettings) {
    write('evidex_settings', settings);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('evidex_settings_changed'));
    }
  },
};
