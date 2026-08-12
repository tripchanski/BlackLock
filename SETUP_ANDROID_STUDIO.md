# Установка Android Studio и запуск приложения

## Шаг 1: Скачай Android Studio

**Ссылка:** https://developer.android.com/studio

Скачай последнюю версию (около 1 GB)

---

## Шаг 2: Установка

1. Запусти установщик
2. **ВАЖНО:** Выбери:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device
3. Путь установки: по умолчанию (обычно `C:\Users\...\AppData\Local\Android\Sdk`)
4. Дождись окончания установки (10-15 минут)

---

## Шаг 3: Настройка переменных окружения

### Windows:
1. Нажми Win + Pause → Advanced system settings
2. Environment Variables
3. В **System variables** нажми New:

**ANDROID_HOME**
```
C:\Users\ТвоёИмя\AppData\Local\Android\Sdk
```

4. Найди переменную **Path**, нажми Edit, добавь:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

5. **ПЕРЕЗАПУСТИ ТЕРМИНАЛ** (или перезагрузи компьютер)

---

## Шаг 4: Создай виртуальный телефон (AVD)

1. Открой Android Studio
2. Экран приветствия → **More Actions** → **Virtual Device Manager**
3. **Create Device**
4. Выбери:
   - **Category:** Phone
   - **Device:** Pixel 5 (или любой другой)
   - **Next**
5. **System Image:**
   - Выбери **R** (API 30, Android 11)
   - Нажми Download ⬇ (скачается около 1 GB)
   - **Next**
6. **AVD Name:** оставь по умолчанию
7. **Finish**
8. **▶ Запусти эмулятор** (зелёная кнопка Play)

Подожди пока эмулятор загрузится (2-3 минуты при первом запуске)

---

## Шаг 5: Проверь что эмулятор виден

Открой новый терминал:
```bash
adb devices
```

Должно показать:
```
List of devices attached
emulator-5554   device
```

---

## Шаг 6: Запусти приложение

```bash
cd C:\Users\artur\Documents\Programming\BlackLock
npx expo run:android
```

Приложение соберётся и установится на эмулятор!

---

## Если что-то пошло не так

### ADB не найден
```bash
# Проверь что в PATH добавлен путь к platform-tools
echo %ANDROID_HOME%\platform-tools
```

Если не работает - перезапусти терминал или компьютер.

### Эмулятор не запускается
- Проверь что включена виртуализация в BIOS (Intel VT-x или AMD-V)
- В Windows: включи Hyper-V или удали его если мешает

### Gradle ошибки при сборке
```bash
# Очисти кеш и пересобери
cd android
.\gradlew clean
cd ..
npx expo run:android
```

---

## Быстрая проверка после установки

```bash
# Проверь Java
java -version

# Проверь ADB
adb version

# Проверь ANDROID_HOME
echo %ANDROID_HOME%
```

Всё должно работать без ошибок.

---

## Сколько места нужно:

- Android Studio: ~3 GB
- SDK и tools: ~5 GB
- Эмулятор: ~3 GB
- **Всего: ~10-12 GB**

---

## Сколько времени:

- Скачивание: 10-20 минут (зависит от интернета)
- Установка: 10-15 минут
- Настройка эмулятора: 5 минут
- **Первый запуск приложения:** 5-10 минут (компиляция)

**Общее время: ~30-60 минут**

Потом всё будет запускаться за 1-2 минуты!
