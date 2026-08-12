# BlackLock Development Guide

## Quick Start

### Run the app
```bash
npm start
```

### Run on specific platform
```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Type checking
```bash
npx tsc --noEmit
```

## Architecture Overview

### Tech Stack
- **React Native** with **Expo** for cross-platform mobile development
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Zustand** for state management
- **expo-sqlite** for local database
- **AsyncStorage** for settings persistence
- **i18n-js** for internationalization

### Project Structure

```
src/
├── components/       # Reusable UI components (Button, Input, Card)
├── screens/          # All application screens
├── navigation/       # Navigation configuration
├── services/         # Business logic (database, store, i18n)
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
├── constants/        # Constants
├── styles/           # Shared styles
└── utils/            # Utility functions
```

### Key Files

#### Services
- **database.ts**: SQLite database layer with CRUD operations
- **store.ts**: Zustand store for global state management
- **i18n.ts**: Internationalization configuration

#### Navigation
- **AppNavigator.tsx**: Main navigation structure
- **types.ts**: Navigation type definitions

#### Types
- **index.ts**: All TypeScript interfaces and types

## Database

### Tables

1. **account**: User profile and character data
2. **tasks**: Task management
3. **logs**: Application logs and analytics

### Database Operations

```typescript
// Example: Create account
await database.createAccount({
  nickname: 'Player',
  level: 1,
  experience: 0,
  stats: { strength: 0, knowledge: 0, wisdom: 0, endurance: 0, charisma: 0 }
});

// Example: Create task
await database.createTask({
  taskName: 'Learn TypeScript',
  description: 'Complete TypeScript tutorial',
  type: 'knowledge',
  isCompleted: false,
  isRepeated: false,
  experienceReward: 10
});
```

## State Management

### Using the Store

```typescript
import { useStore } from '../services/store';

function MyComponent() {
  const { account, tasks, addTask, completeTask } = useStore();

  // Use state and actions
}
```

### Available Actions
- `initialize()`: Initialize app and load data
- `loadAccount()`: Load account from database
- `updateAccount()`: Update account
- `loadTasks()`: Load all tasks
- `addTask()`: Create new task
- `updateTask()`: Update existing task
- `deleteTask()`: Delete task
- `completeTask()`: Mark task as complete and award XP
- `setSettings()`: Update app settings

## Localization

### Adding Translations

Edit `src/services/i18n.ts`:

```typescript
const translations = {
  en: {
    welcome: {
      title: 'Welcome to BlackLock',
      // ...
    }
  },
  uk: {
    welcome: {
      title: 'Ласкаво просимо до BlackLock',
      // ...
    }
  }
};
```

### Using Translations

```typescript
import { t } from '../services/i18n';

// In component
<Text>{t('welcome.title')}</Text>

// With parameters
<Text>{t('home.welcome', { nickname: 'Player' })}</Text>
```

## Adding New Features

### Adding a New Screen

1. Create screen file in `src/screens/`:
```typescript
// NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#fff',
    fontSize: 24,
  },
});
```

2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Add route to `src/navigation/types.ts`

### Adding New Database Table

1. Add interface to `src/types/index.ts`
2. Add table creation in `database.ts` `createTables()`
3. Add CRUD methods in `database.ts`
4. Add store actions in `store.ts`

## Styling Guidelines

### Colors
- Background: `#1a1a1a`
- Card background: `#2a2a2a`
- Border: `#3a3a3a`
- Primary: `#4a9eff`
- Text: `#fff`
- Secondary text: `#888`
- Danger: `#ff4a4a`

### Component Styling
- Use consistent padding: 16px or 24px
- Border radius: 12px or 16px
- Card margin: 12px bottom
- Font sizes: 14-32px

## Testing

### Manual Testing Checklist

- [ ] Welcome screen language selection
- [ ] Profile creation
- [ ] Task creation (all types)
- [ ] Task completion (XP awarded)
- [ ] Repeating tasks
- [ ] Character leveling
- [ ] Settings changes
- [ ] Language switching
- [ ] Dark mode (default)

## Common Issues

### Navigation Type Errors
If you encounter navigation type errors, use `// @ts-ignore` before `navigation.navigate()` calls.

### Database Not Initializing
Make sure `initialize()` is called in `App.tsx` on mount.

### State Not Updating
Check if you're using Zustand actions correctly and that the store is properly initialized.

## Future Improvements

### High Priority
- Focus mode with Pomodoro timer
- Task categories and filtering
- Push notifications for task reminders
- Data export/import functionality

### Medium Priority
- Light mode support
- Custom themes
- Achievement system
- Daily/weekly challenges

### Low Priority
- Cloud sync
- Social features
- AI suggestions
- Advanced analytics

## Contributing

When contributing:
1. Follow the existing code style
2. Add TypeScript types for all new code
3. Test on both iOS and Android
4. Update documentation
5. Keep commits atomic and meaningful

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

---

Happy coding! 🚀
