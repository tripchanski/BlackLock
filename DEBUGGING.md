# Debugging Guide

## Issue: App Stuck on Loading Screen

### What Was Fixed

1. **Circular Dependency in i18n.ts**
   - Problem: `i18n.ts` was importing `useStore` at the top level, causing circular dependency with `store.ts`
   - Solution: Changed to lazy loading with `require()` inside functions

2. **Added Detailed Logging**
   - Added console.log statements in initialization process
   - Added error handling in App.tsx to show errors on screen

3. **Improved Error Handling**
   - App.tsx now catches initialization errors and displays them
   - Database initialization has better error logging

### How to Debug

1. **Check Console Logs**
   - Open Metro bundler console
   - Look for these logs:
     ```
     App: Starting initialization...
     Starting app initialization...
     Initializing database...
     Database opened, creating tables...
     Tables created successfully
     Database initialized
     Checking first launch...
     First launch: true/false
     Loading settings...
     Loading account...
     Loading tasks...
     App initialization complete
     App: Initialization complete
     ```

2. **If App Stays on Loading Screen**
   - Check console for where initialization stops
   - Common issues:
     - Database initialization fails
     - SQLite not available in environment
     - AsyncStorage permission issues

3. **Test with Minimal App**
   - Rename `App.tsx` to `App.backup.tsx`
   - Rename `App.test.tsx` to `App.tsx`
   - If this works, the issue is in the initialization logic

### Running the App

```bash
# Clear cache and restart
npm start -- --clear

# Or
npx expo start -c

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Common Issues

#### 1. Port Already in Use
```
Error: Port 8081 is being used
```
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :8081

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use different port
npx expo start --port 8082
```

#### 2. Database Not Working
```
Error: Database not initialized
```
**Solution:**
- expo-sqlite may not work in web environment
- Try on actual device or emulator
- Check Expo Go app is up to date

#### 3. AsyncStorage Issues
```
Error: Cannot read property 'getItem'
```
**Solution:**
```bash
# Reinstall AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage
```

### Development Mode

For faster debugging, you can temporarily simplify `App.tsx`:

```typescript
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Test Mode</Text>
    </View>
  );
}
```

If this works, gradually add back:
1. StatusBar
2. Store initialization
3. Navigation

### Logs to Check

**Successful Initialization:**
```
App: Starting initialization...
Starting app initialization...
Opening database...
Database opened, creating tables...
Tables created successfully
Database initialized
Checking first launch...
First launch: true
Loading settings...
Loading account...
Loading tasks...
App initialization complete
App: Initialization complete
```

**Failed Initialization (example):**
```
App: Starting initialization...
Starting app initialization...
Opening database...
Database init error: [Error details]
Error initializing app: [Error details]
```

### Testing Database

To test if SQLite works in your environment:

```typescript
// Add to App.tsx temporarily
import * as SQLite from 'expo-sqlite';

useEffect(() => {
  const testDB = async () => {
    try {
      console.log('Testing SQLite...');
      const db = await SQLite.openDatabaseAsync('test.db');
      console.log('SQLite works!', db);
    } catch (err) {
      console.error('SQLite error:', err);
    }
  };
  testDB();
}, []);
```

### Environment Requirements

- **Expo SDK**: ~52.0.43
- **React Native**: 0.76.9
- **Node.js**: v14 or higher

### Platform-Specific Notes

**iOS:**
- SQLite works out of the box
- No special permissions needed

**Android:**
- SQLite works out of the box
- No special permissions needed

**Web:**
- SQLite NOT supported in web browsers
- App will fail to initialize on web
- Use iOS/Android only for now

### Next Steps if Still Stuck

1. Check Expo Go app is latest version
2. Try on different device/emulator
3. Check Metro bundler logs for errors
4. Verify all dependencies installed: `npm install`
5. Clear npm cache: `npm cache clean --force`
6. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Getting Help

If issue persists:
1. Copy console logs
2. Note which platform (iOS/Android/Web)
3. Note where initialization stops
4. Check GitHub issues for similar problems

---

**Remember**: The app requires a native environment (iOS/Android) to work properly due to SQLite dependency.
