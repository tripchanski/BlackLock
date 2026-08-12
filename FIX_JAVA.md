# Исправление ошибки Java

## Проблема
Gradle не может найти правильную Java. У тебя стоит JRE 8, а нужен JDK 17+.

## Решение

### Шаг 1: Настроить переменные окружения

1. **Нажми Win + Pause** (или ПКМ на "Этот компьютер" → Свойства)
2. **Advanced system settings** (Дополнительные параметры системы)
3. **Environment Variables** (Переменные среды)

### Шаг 2: Добавить JAVA_HOME

В разделе **System variables** (Системные переменные):

1. Нажми **New** (Создать)
2. **Variable name:** `JAVA_HOME`
3. **Variable value:** `C:\Program Files\Android\Android Studio\jbr`
4. **OK**

### Шаг 3: Обновить PATH

1. Найди переменную **Path** в **System variables**
2. Нажми **Edit**
3. **Удали** старые записи с Java 8 (если есть):
   - `C:\Program Files\Java\jre1.8.0_461\bin`
   - `C:\Program Files\Java\jdk1.8.0_461\bin`
4. Нажми **New** и добавь:
   - `%JAVA_HOME%\bin`
5. **OK** → **OK** → **OK**

### Шаг 4: ПЕРЕЗАПУСТИ ТЕРМИНАЛ

**ВАЖНО!** Закрой все терминалы и открой новый!

### Шаг 5: Проверь

```bash
java -version
```

Должно показать Java 17 или 21 (из Android Studio)

---

## Если не хочешь менять системную Java

Можно указать Java только для Gradle:

### Windows:
Открой файл: `android/gradle.properties`

Добавь строку:
```
org.gradle.java.home=C:\\Program Files\\Android\\Android Studio\\jbr
```

Сохрани и запусти заново:
```bash
npx expo run:android
```

---

## Проверка после настройки

```bash
# Проверь Java
java -version
# Должно показать 17+

# Проверь JAVA_HOME
echo %JAVA_HOME%
# Должно показать: C:\Program Files\Android\Android Studio\jbr

# Попробуй собрать
npx expo run:android
```

---

## Альтернатива: Скачать JDK 17 отдельно

Если не хочешь использовать JDK из Android Studio:

**Скачай:** https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

Или используй OpenJDK:
**Adoptium:** https://adoptium.net/temurin/releases/?version=17

Установи и укажи JAVA_HOME на папку установки.
