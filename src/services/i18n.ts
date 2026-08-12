import { I18n } from 'i18n-js';

const translations = {
  en: {
    welcome: {
      title: 'Welcome to BlackLock',
      subtitle: 'Your personal quest companion',
      selectLanguage: 'Select your language',
      continue: 'Continue',
    },
    profile: {
      setupProfile: 'Set up your profile',
      nickname: 'Nickname',
      name: 'Name (optional)',
      avatar: 'Choose avatar',
      createAccount: 'Create Account',
    },
    home: {
      welcome: 'Welcome, {{nickname}}!',
      level: 'Level {{level}}',
      experience: '{{current}} / {{next}} XP',
      tasks: 'Tasks',
      focus: 'Focus',
      settings: 'Settings',
      statistics: 'Statistics',
    },
    tasks: {
      allTasks: 'All Tasks',
      createTask: 'Create Task',
      taskName: 'Task Name',
      description: 'Description',
      type: 'Task Type',
      repeated: 'Repeated Task',
      frequency: 'Frequency',
      delete: 'Delete',
      complete: 'Complete',
      edit: 'Edit',
      noTasks: 'No tasks yet',
      types: {
        strength: 'Strength',
        knowledge: 'Knowledge',
        wisdom: 'Wisdom',
        endurance: 'Endurance',
        charisma: 'Charisma',
      },
      frequencies: {
        once: 'Once',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        custom: 'Custom',
      },
    },
    settings: {
      account: 'Account',
      notifications: 'Notifications',
      customize: 'Customize',
      language: 'Language',
      darkMode: 'Dark Mode',
      textSize: 'Text Size',
      notificationFrequency: 'Notification Frequency',
      taskReminders: 'Task Reminders',
      levelUpNotifications: 'Level Up Notifications',
    },
    statistics: {
      title: 'Statistics',
      totalTasks: 'Total Tasks',
      completedTasks: 'Completed Tasks',
      currentStreak: 'Current Streak',
      characterStats: 'Character Stats',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      back: 'Back',
    },
    warnings: {
      deleteTask: 'Are you sure you want to delete this task?',
      confirmComplete: 'Mark this task as complete?',
    },
  },
  uk: {
    welcome: {
      title: 'Ласкаво просимо до BlackLock',
      subtitle: 'Ваш особистий супутник квестів',
      selectLanguage: 'Оберіть мову',
      continue: 'Продовжити',
    },
    profile: {
      setupProfile: 'Налаштуйте свій профіль',
      nickname: 'Нікнейм',
      name: "Ім'я (необов'язково)",
      avatar: 'Оберіть аватар',
      createAccount: 'Створити акаунт',
    },
    home: {
      welcome: 'Вітаємо, {{nickname}}!',
      level: 'Рівень {{level}}',
      experience: '{{current}} / {{next}} досвіду',
      tasks: 'Завдання',
      focus: 'Фокус',
      settings: 'Налаштування',
      statistics: 'Статистика',
    },
    tasks: {
      allTasks: 'Всі завдання',
      createTask: 'Створити завдання',
      taskName: 'Назва завдання',
      description: 'Опис',
      type: 'Тип завдання',
      repeated: 'Повторюване завдання',
      frequency: 'Частота',
      delete: 'Видалити',
      complete: 'Виконати',
      edit: 'Редагувати',
      noTasks: 'Завдань поки немає',
      types: {
        strength: 'Сила',
        knowledge: 'Знання',
        wisdom: 'Мудрість',
        endurance: 'Витривалість',
        charisma: 'Харизма',
      },
      frequencies: {
        once: 'Одноразово',
        daily: 'Щодня',
        weekly: 'Щотижня',
        monthly: 'Щомісяця',
        custom: 'Власне',
      },
    },
    settings: {
      account: 'Акаунт',
      notifications: 'Сповіщення',
      customize: 'Налаштування',
      language: 'Мова',
      darkMode: 'Темний режим',
      textSize: 'Розмір тексту',
      notificationFrequency: 'Частота сповіщень',
      taskReminders: 'Нагадування про завдання',
      levelUpNotifications: 'Сповіщення про підвищення рівня',
    },
    statistics: {
      title: 'Статистика',
      totalTasks: 'Всього завдань',
      completedTasks: 'Виконано завдань',
      currentStreak: 'Поточна серія',
      characterStats: 'Характеристики персонажа',
    },
    common: {
      save: 'Зберегти',
      cancel: 'Скасувати',
      delete: 'Видалити',
      confirm: 'Підтвердити',
      yes: 'Так',
      no: 'Ні',
      back: 'Назад',
    },
    warnings: {
      deleteTask: 'Ви впевнені, що хочете видалити це завдання?',
      confirmComplete: 'Позначити це завдання як виконане?',
    },
  },
  ru: {
    welcome: {
      title: 'Добро пожаловать в BlackLock',
      subtitle: 'Ваш личный спутник квестов',
      selectLanguage: 'Выберите язык',
      continue: 'Продолжить',
    },
    profile: {
      setupProfile: 'Настройте свой профиль',
      nickname: 'Никнейм',
      name: 'Имя (необязательно)',
      avatar: 'Выберите аватар',
      createAccount: 'Создать аккаунт',
    },
    home: {
      welcome: 'Добро пожаловать, {{nickname}}!',
      level: 'Уровень {{level}}',
      experience: '{{current}} / {{next}} опыта',
      tasks: 'Задания',
      focus: 'Фокус',
      settings: 'Настройки',
      statistics: 'Статистика',
    },
    tasks: {
      allTasks: 'Все задания',
      createTask: 'Создать задание',
      taskName: 'Название задания',
      description: 'Описание',
      type: 'Тип задания',
      repeated: 'Повторяющееся задание',
      frequency: 'Частота',
      delete: 'Удалить',
      complete: 'Завершить',
      edit: 'Редактировать',
      noTasks: 'Заданий пока нет',
      types: {
        strength: 'Сила',
        knowledge: 'Знания',
        wisdom: 'Мудрость',
        endurance: 'Выносливость',
        charisma: 'Харизма',
      },
      frequencies: {
        once: 'Однократно',
        daily: 'Ежедневно',
        weekly: 'Еженедельно',
        monthly: 'Ежемесячно',
        custom: 'Свое',
      },
    },
    settings: {
      account: 'Аккаунт',
      notifications: 'Уведомления',
      customize: 'Настройки',
      language: 'Язык',
      darkMode: 'Темный режим',
      textSize: 'Размер текста',
      notificationFrequency: 'Частота уведомлений',
      taskReminders: 'Напоминания о заданиях',
      levelUpNotifications: 'Уведомления о повышении уровня',
    },
    statistics: {
      title: 'Статистика',
      totalTasks: 'Всего заданий',
      completedTasks: 'Выполнено заданий',
      currentStreak: 'Текущая серия',
      characterStats: 'Характеристики персонажа',
    },
    common: {
      save: 'Сохранить',
      cancel: 'Отменить',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      back: 'Назад',
    },
    warnings: {
      deleteTask: 'Вы уверены, что хотите удалить это задание?',
      confirmComplete: 'Отметить это задание как выполненное?',
    },
  },
};

const i18n = new I18n(translations);
i18n.locale = 'en'; // Default locale
i18n.enableFallback = true;

// Function to get translation with current language
export const t = (key: string, params?: object) => {
  try {
    // Avoid circular dependency by lazy loading store
    const { useStore } = require('./store');
    const settings = useStore.getState().settings;
    i18n.locale = settings?.language || 'en';
  } catch (error) {
    // Fallback to default if store is not available
    i18n.locale = 'en';
  }
  return i18n.t(key, params);
};

// Hook for translations
export const useTranslation = () => {
  const { useStore } = require('./store');
  const { settings } = useStore();
  i18n.locale = settings?.language || 'en';
  return { t: (key: string, params?: object) => i18n.t(key, params) };
};

export default i18n;
