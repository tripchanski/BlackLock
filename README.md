# BlackLock

**Your personal quest companion for tracking tasks and leveling up your character!**

BlackLock is an open-source mobile application that gamifies your daily tasks by turning them into quests. Complete tasks to earn experience, level up your character, and improve your character stats.

## Features

### Core Features
- **Task Management**: Create, edit, and complete tasks with different types (Strength, Knowledge, Wisdom, Endurance, Charisma)
- **Character System**: Level up your character by completing tasks and earn experience points
- **Character Stats**: Build your character's stats based on the types of tasks you complete
- **Rank System**: Progress through ranks from Novice to Legend
- **Repeating Tasks**: Set tasks to repeat daily, weekly, or monthly
- **Multi-language Support**: Available in English, Ukrainian, and Russian

### Screens
- **Welcome Screen**: Choose your language on first launch
- **Profile Setup**: Create your character profile
- **Home Screen**: View your character stats, level progress, and active tasks
- **Tasks Screen**: Manage all your tasks
- **Focus Mode**: Coming soon - distraction-free focus timer
- **Statistics**: View detailed statistics and character progression
- **Settings**: Customize notifications, appearance, and account settings

### Technical Features
- **SQLite Database**: Local data storage for offline functionality
- **Dark Mode**: Built-in dark theme (light mode coming soon)
- **Localization**: Full i18n support for multiple languages
- **TypeScript**: Fully typed codebase for better development experience
- **State Management**: Zustand for efficient state management
- **React Navigation**: Smooth navigation between screens

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tripchanski/BlackLock.git
cd BlackLock
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- **Android**: `npm run android` or scan the QR code with Expo Go
- **iOS**: `npm run ios` or scan the QR code with Expo Go
- **Web**: `npm run web`

## Project Structure

```
BlackLock/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── screens/          # Application screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── ProfileSetupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AllTasksScreen.tsx
│   │   ├── CreateTaskScreen.tsx
│   │   ├── TaskDetailScreen.tsx
│   │   ├── FocusScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── AccountSettingsScreen.tsx
│   │   ├── NotificationSettingsScreen.tsx
│   │   ├── CustomizeSettingsScreen.tsx
│   │   └── StatisticsScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── services/         # Business logic and services
│   │   ├── database.ts   # SQLite database layer
│   │   ├── store.ts      # Zustand state management
│   │   └── i18n.ts       # Internationalization
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── hooks/            # Custom React hooks
│   │   └── useAppNavigation.ts
│   ├── constants/        # Constants and configuration
│   ├── styles/           # Shared styles
│   └── utils/            # Utility functions
├── App.tsx               # Application entry point
├── package.json
└── README.md
```

## Database Schema

### Account Table
- `id`: Unique identifier
- `avatar`: Avatar image path (optional)
- `characterType`: Character type (optional)
- `name`: User's name (optional)
- `nickname`: User's nickname (required)
- `level`: Character level
- `experience`: Total experience points
- `stats`: Character stats (strength, knowledge, wisdom, endurance, charisma)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Tasks Table
- `id`: Unique identifier
- `taskName`: Task name
- `description`: Task description
- `type`: Task type (strength, knowledge, wisdom, endurance, charisma)
- `isCompleted`: Completion status
- `isRepeated`: Repeating task flag
- `frequency`: Task frequency (once, daily, weekly, monthly, custom)
- `experienceReward`: Experience points rewarded
- `createdAt`: Task creation timestamp
- `updatedAt`: Last update timestamp

### Logs Table
- `id`: Unique identifier
- `type`: Log type (error, warning, analytics)
- `message`: Log message
- `data`: Additional data (JSON)
- `timestamp`: Log timestamp

## Character System

### Experience & Leveling
- Complete tasks to earn experience points (XP)
- Level calculation: `Level = sqrt(Experience / 100) + 1`
- Each task type rewards XP that increases your character stats

### Character Stats
- **Strength**: Increased by completing strength-based tasks
- **Knowledge**: Increased by completing knowledge-based tasks
- **Wisdom**: Increased by completing wisdom-based tasks
- **Endurance**: Increased by completing endurance-based tasks
- **Charisma**: Increased by completing charisma-based tasks

### Rank System
1. **Novice** (Level 1-10)
2. **Apprentice** (Level 11-25)
3. **Adept** (Level 26-50)
4. **Expert** (Level 51-75)
5. **Master** (Level 76-100)
6. **Legend** (Level 101+)

## Contributing

BlackLock is an open-source project, and contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## Roadmap

### Version 1.1
- [ ] Focus mode with Pomodoro timer
- [ ] Task categories and tags
- [ ] Daily/Weekly challenges
- [ ] Achievement system
- [ ] Data export functionality

### Version 1.2
- [ ] Cloud sync
- [ ] Social features (friends, leaderboards)
- [ ] Custom themes
- [ ] Widget support
- [ ] Notification improvements

### Version 2.0
- [ ] AI-powered task suggestions
- [ ] Habit tracking
- [ ] Goal setting and tracking
- [ ] Advanced analytics and insights

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Database**: expo-sqlite
- **Storage**: AsyncStorage
- **Internationalization**: i18n-js

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspired by RPG game mechanics and productivity apps
- Built with love for the open-source community
- Special thanks to all contributors

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Join our community discussions

## Screenshots

*Coming soon*

---

**Made with ❤️ by the BlackLock Team**

**Open Source • Free Forever • Community Driven**
