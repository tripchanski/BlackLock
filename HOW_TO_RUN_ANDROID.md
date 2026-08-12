# Как запустить BlackLock на Android

## Способ 1: Expo Go (РЕКОМЕНДУЕТСЯ - Проще всего!)

### Шаг 1: Установи Expo Go на телефон
1. Открой Google Play Store на Android телефоне
2. Найди **Expo Go**
3. Установи приложение

### Шаг 2: Запусти сервер
Я уже запустил Expo на порту 8082. Ты увидишь в терминале QR-код.

Или запусти сам:
```bash
npx expo start --port 8082
```

### Шаг 3: Подключись к серверу

**ВАЖНО**: Телефон и компьютер должны быть в одной Wi-Fi сети!

#### Вариант A: Сканировать QR-код
1. Открой Expo Go на телефоне
2. Нажми "Scan QR code"
3. Отсканируй QR-код из терминала

#### Вариант B: Ввести вручную
1. Открой Expo Go на телефоне
2. Нажми "Enter URL manually"
3. Введи: `exp://ТВО_IP:8082`
   - Например: `exp://192.168.1.100:8082`
   - Твой IP можно узнать командой: `ipconfig` (смотри IPv4 Address)

---

## Способ 2: Android Эмулятор (Если есть Android Studio)

### Шаг 1: Установи Android Studio
1. Скачай [Android Studio](https://developer.android.com/studio)
2. Установи и запусти

### Шаг 2: Создай виртуальное устройство
1. Открой Android Studio
2. Tools → Device Manager
3. Create Device
4. Выбери любой телефон (например, Pixel 5)
5. Скачай System Image (Android 13 или новее)
6. Finish → Launch эмулятор

### Шаг 3: Запусти приложение на эмуляторе
```bash
# Убедись что эмулятор запущен
adb devices

# Запусти Expo
npx expo start --port 8082

# В терминале Expo нажми 'a' для запуска на Android
```

---

## Способ 3: Прямая сборка APK (Для установки на телефон)

### Требования:
- Java JDK 17
- Android SDK

```bash
# Установи EAS CLI
npm install -g eas-cli

# Залогинься в Expo
eas login

# Собери APK
eas build --platform android --profile preview
```

После сборки получишь ссылку на скачивание APK файла.

---

## Проверка что всё работает

После запуска приложения смотри логи в Metro Bundler:

**Ожидаемые логи (успешный запуск):**
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

**Если видишь:**
- "Loading BlackLock..." - это нормально, идёт инициализация
- Красный экран с ошибкой - смотри текст ошибки и проверь логи в Metro

---

## Текущий статус сервера

Сейчас Expo запущен на:
```
http://localhost:8082
```

Для подключения с телефона нужно знать IP твоего компьютера:

### Узнать IP (Windows):
```bash
ipconfig
```
Ищи строку "IPv4 Address" в разделе Wi-Fi или Ethernet.

### Узнать IP (Mac/Linux):
```bash
ifconfig
```

---

## Быстрый старт (TL;DR)

1. **Установи Expo Go** на Android телефон
2. **Убедись** что телефон и компьютер в одной Wi-Fi сети
3. **Запусти** в терминале: `npx expo start`
4. **Отсканируй** QR-код в Expo Go

---

## Решение проблем

### Проблема: "Unable to connect to Metro"
**Решение:**
- Проверь что телефон и ПК в одной Wi-Fi
- Попробуй ввести URL вручную с IP адресом
- Отключи VPN если есть

### Проблема: "Network response timed out"
**Решение:**
```bash
# Запусти с туннелем
npx expo start --tunnel
```

### Проблема: "App keeps loading forever"
**Решение:**
- Смотри логи в Metro Bundler
- Проверь есть ли ошибки в консоли
- Убедись что используешь Android, а не Web (в Web SQLite не работает!)

---

## Полезные команды

```bash
# Очистить кеш и перезапустить
npx expo start --clear

# Запустить на конкретном порту
npx expo start --port 8082

# Запустить с туннелем (работает через интернет)
npx expo start --tunnel

# Показать все подключенные Android устройства
adb devices
```

---

**Если всё ещё не работает - пришли мне скриншот ошибки и логи из Metro Bundler!**
