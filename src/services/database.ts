import * as SQLite from 'expo-sqlite';
import { Account, Task, Log, TaskFrequency, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly DB_VERSION = 4;

  async init() {
    try {
      console.log('Opening database...');
      this.db = await SQLite.openDatabaseAsync('blacklock.db');
      console.log('Database opened, checking version...');

      await this.migrate();

      await this.ensureCategoriesTable();

      await this.ensureTaskColumns();

      console.log('Database ready');
    } catch (error) {
      console.error('Database init error:', error);
      throw error;
    }
  }

  private async ensureCategoriesTable() {
    if (!this.db) throw new Error('Database not initialized');

    const tableCheck = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='categories'"
    );

    if (!tableCheck || tableCheck.count === 0) {
      console.log('⚠️  Categories table missing, creating it now...');

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          isDefault INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);

      await this.insertDefaultCategories();

      console.log('✅ Categories table created and populated');
    }
  }

  private async ensureTaskColumns() {
    if (!this.db) throw new Error('Database not initialized');

    const columnCheck = await this.db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(tasks)"
    );

    const hasCategoryId = columnCheck.some(col => col.name === 'categoryId');
    const hasColor = columnCheck.some(col => col.name === 'color');

    if (!hasCategoryId) {
      console.log('⚠️  categoryId column missing in tasks table, adding it now...');
      try {
        await this.db.execAsync('ALTER TABLE tasks ADD COLUMN categoryId TEXT');
        console.log('✅ categoryId column added to tasks table');
      } catch (error) {
        console.log('categoryId column might already exist, continuing...');
      }
    }

    if (!hasColor) {
      console.log('⚠️  color column missing in tasks table, adding it now...');
      try {
        await this.db.execAsync('ALTER TABLE tasks ADD COLUMN color TEXT');
        console.log('✅ color column added to tasks table');
      } catch (error) {
        console.log('color column might already exist, continuing...');
      }
    }
  }

  private async migrate() {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    );
    const currentVersion = result?.user_version || 0;

    console.log(`Current DB version: ${currentVersion}, Target version: ${this.DB_VERSION}`);

    if (currentVersion < this.DB_VERSION) {
      console.log('Migration needed...');

      if (currentVersion === 0) {
        const tableCheck = await this.db.getFirstAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='tasks'"
        );

        if (tableCheck && tableCheck.count > 0) {
          console.log('Old database detected, migrating...');
          await this.migrateV1ToV2();

          console.log('Migrating from v2 to v3...');
          await this.migrateV2ToV3();

          console.log('Migrating from v3 to v4...');
          await this.migrateV3ToV4();
        } else {
          console.log('Fresh install, creating tables...');
          await this.createTables();
        }
      } else if (currentVersion === 1) {
        console.log('Migrating from v1 to v2...');
        await this.migrateV1ToV2();

        console.log('Migrating from v2 to v3...');
        await this.migrateV2ToV3();

        console.log('Migrating from v3 to v4...');
        await this.migrateV3ToV4();
      } else if (currentVersion === 2) {

        console.log('Migrating from v2 to v3...');
        await this.migrateV2ToV3();

        console.log('Migrating from v3 to v4...');
        await this.migrateV3ToV4();
      } else if (currentVersion === 3) {

        console.log('Migrating from v3 to v4...');
        await this.migrateV3ToV4();
      }


      await this.db.execAsync(`PRAGMA user_version = ${this.DB_VERSION}`);
      console.log(`Database migrated to version ${this.DB_VERSION}`);
    } else {
      console.log('Database is up to date');
    }
  }

  private async migrateV1ToV2() {
    if (!this.db) throw new Error('Database not initialized');

    console.log('⚠️  Migration v1→v2: Dropping old tables (data will be lost)...');
    console.log('This is necessary to remove task types and character stats.');

    await this.db.execAsync('DROP TABLE IF EXISTS account');
    await this.db.execAsync('DROP TABLE IF EXISTS tasks');
    await this.db.execAsync('DROP TABLE IF EXISTS logs');

    console.log('Creating new tables with updated schema...');
    await this.createTables();
    console.log('✅ Migration complete. Database schema updated.');
  }

  private async migrateV2ToV3() {
    if (!this.db) throw new Error('Database not initialized');

    console.log('⚙️  Migration v2→v3: Adding categories support...');


    try {
      await this.db.execAsync('ALTER TABLE tasks ADD COLUMN categoryId TEXT');
      console.log('Added categoryId column to tasks table');
    } catch (error) {
      console.log('categoryId column might already exist, continuing...');
    }


    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        isDefault INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    console.log('Created categories table');


    await this.insertDefaultCategories();
    console.log('✅ Migration v2→v3 complete');
  }

  private async migrateV3ToV4() {
    if (!this.db) throw new Error('Database not initialized');

    console.log('⚙️  Migration v3→v4: Adding task color support...');


    try {
      await this.db.execAsync('ALTER TABLE tasks ADD COLUMN color TEXT');
      console.log('Added color column to tasks table');
    } catch (error) {
      console.log('color column might already exist, continuing...');
    }

    console.log('✅ Migration v3→v4 complete');
  }

  private async insertDefaultCategories() {
    if (!this.db) throw new Error('Database not initialized');


    const existing = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories WHERE isDefault = 1'
    );

    if (existing && existing.count > 0) {
      console.log('Default categories already exist, skipping...');
      return;
    }

    console.log('Inserting default categories...');
    const now = new Date().toISOString();

    for (const category of DEFAULT_CATEGORIES) {
      const id = Math.random().toString(36).substring(2, 15);
      await this.db.runAsync(
        `INSERT INTO categories (id, name, icon, color, isDefault, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, category.name, category.icon, category.color, category.isDefault ? 1 : 0, now, now]
      );
    }
    console.log(`Inserted ${DEFAULT_CATEGORIES.length} default categories`);
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');


    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        avatar TEXT,
        characterType TEXT,
        name TEXT,
        nickname TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 1,
        experience INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);


    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        taskName TEXT NOT NULL,
        description TEXT NOT NULL,
        categoryId TEXT,
        color TEXT,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        isRepeated INTEGER NOT NULL DEFAULT 0,
        frequencyType TEXT,
        frequencyData TEXT,
        experienceReward INTEGER NOT NULL DEFAULT 10,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );
    `);


    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        isDefault INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);


    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        timestamp TEXT NOT NULL
      );
    `);


    await this.insertDefaultCategories();
  }


  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    const newAccount: Account = {
      id,
      ...account,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.runAsync(
      `INSERT INTO account (id, avatar, characterType, name, nickname, level, experience, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newAccount.id,
        newAccount.avatar || null,
        newAccount.characterType || null,
        newAccount.name || null,
        newAccount.nickname,
        newAccount.level,
        newAccount.experience,
        newAccount.createdAt,
        newAccount.updatedAt,
      ]
    );

    return newAccount;
  }

  async getAccount(): Promise<Account | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM account LIMIT 1'
    );

    if (!result) return null;

    return this.mapRowToAccount(result);
  }

  async updateAccount(updates: Partial<Account>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const account = await this.getAccount();
    if (!account) throw new Error('Account not found');

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(updates.avatar);
    }
    if (updates.characterType !== undefined) {
      fields.push('characterType = ?');
      values.push(updates.characterType);
    }
    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(updates.nickname);
    }
    if (updates.level !== undefined) {
      fields.push('level = ?');
      values.push(updates.level);
    }
    if (updates.experience !== undefined) {
      fields.push('experience = ?');
      values.push(updates.experience);
    }

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(account.id);

    await this.db.runAsync(
      `UPDATE account SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }


  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    const newTask: Task = {
      id,
      ...task,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.runAsync(
      `INSERT INTO tasks (id, taskName, description, categoryId, color, isCompleted, isRepeated,
       frequencyType, frequencyData, experienceReward, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newTask.id,
        newTask.taskName,
        newTask.description,
        newTask.categoryId || null,
        newTask.color || null,
        newTask.isCompleted ? 1 : 0,
        newTask.isRepeated ? 1 : 0,
        newTask.frequency?.type || null,
        newTask.frequency ? JSON.stringify(newTask.frequency) : null,
        newTask.experienceReward,
        newTask.createdAt,
        newTask.updatedAt,
      ]
    );

    return newTask;
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<any>(
      'SELECT * FROM tasks ORDER BY createdAt DESC'
    );

    return results.map(this.mapRowToTask);
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<any>(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return this.mapRowToTask(result);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.taskName !== undefined) {
      fields.push('taskName = ?');
      values.push(updates.taskName);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(updates.categoryId || null);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color || null);
    }
    if (updates.isCompleted !== undefined) {
      fields.push('isCompleted = ?');
      values.push(updates.isCompleted ? 1 : 0);
    }
    if (updates.isRepeated !== undefined) {
      fields.push('isRepeated = ?');
      values.push(updates.isRepeated ? 1 : 0);
    }
    if (updates.frequency !== undefined) {
      fields.push('frequencyType = ?');
      fields.push('frequencyData = ?');
      values.push(updates.frequency?.type || null);
      values.push(updates.frequency ? JSON.stringify(updates.frequency) : null);
    }
    if (updates.experienceReward !== undefined) {
      fields.push('experienceReward = ?');
      values.push(updates.experienceReward);
    }

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await this.db.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async completeTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const task = await this.getTaskById(id);
    if (!task) throw new Error('Task not found');


    await this.updateTask(id, { isCompleted: true });


    const account = await this.getAccount();
    if (account) {
      const newExperience = account.experience + task.experienceReward;
      const newLevel = this.calculateLevel(newExperience);

      await this.updateAccount({
        experience: newExperience,
        level: newLevel,
      });
    }
  }


  async getAllCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllAsync<any>('SELECT * FROM categories ORDER BY isDefault DESC, name ASC');

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      isDefault: row.isDefault === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync<any>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      isDefault: row.isDefault === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO categories (id, name, icon, color, isDefault, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, category.name, category.icon, category.color, category.isDefault ? 1 : 0, now, now]
    );

    return {
      id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.isDefault,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'>>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      setClauses.push('name = ?');
      values.push(updates.name);
    }
    if (updates.icon !== undefined) {
      setClauses.push('icon = ?');
      values.push(updates.icon);
    }
    if (updates.color !== undefined) {
      setClauses.push('color = ?');
      values.push(updates.color);
    }

    if (setClauses.length === 0) return;

    setClauses.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    await this.db.runAsync(
      `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if it's a default category
    const category = await this.getCategoryById(id);
    if (category?.isDefault) {
      throw new Error('Cannot delete default category');
    }


    await this.db.runAsync(
      'UPDATE tasks SET categoryId = NULL WHERE categoryId = ?',
      [id]
    );


    await this.db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  }


  async addLog(log: Omit<Log, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const timestamp = new Date().toISOString();

    await this.db.runAsync(
      'INSERT INTO logs (id, type, message, data, timestamp) VALUES (?, ?, ?, ?, ?)',
      [id, log.type, log.message, log.data ? JSON.stringify(log.data) : null, timestamp]
    );
  }

  async getLogs(limit: number = 100): Promise<Log[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<any>(
      'SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );

    return results.map((row) => ({
      id: row.id,
      type: row.type,
      message: row.message,
      data: row.data ? JSON.parse(row.data) : undefined,
      timestamp: row.timestamp,
    }));
  }


  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private mapRowToAccount(row: any): Account {
    return {
      id: row.id,
      avatar: row.avatar,
      characterType: row.characterType,
      name: row.name,
      nickname: row.nickname,
      level: row.level,
      experience: row.experience,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      taskName: row.taskName,
      description: row.description,
      categoryId: row.categoryId || undefined,
      color: row.color || undefined,
      isCompleted: row.isCompleted === 1,
      isRepeated: row.isRepeated === 1,
      frequency: row.frequencyData ? JSON.parse(row.frequencyData) : undefined,
      experienceReward: row.experienceReward,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private calculateLevel(experience: number): number {
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  }


  async exportData(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const account = await this.getAccount();
      const tasks = await this.getAllTasks();
      const categories = await this.getAllCategories();

      const backup = {
        version: this.DB_VERSION,
        exportDate: new Date().toISOString(),
        data: {
          account,
          tasks,
          categories: categories.filter(c => !c.isDefault),
        },
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const backup = JSON.parse(jsonData);

      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup format');
      }

      console.log('Importing data from backup...');

      if (backup.data.account) {
        const account = backup.data.account;
        await this.db.runAsync(
          `INSERT OR REPLACE INTO account (id, nickname, level, experience, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [account.id, account.nickname, account.level, account.experience, account.createdAt, new Date().toISOString()]
        );
        console.log('Account imported');
      }

      if (backup.data.categories && Array.isArray(backup.data.categories)) {
        for (const category of backup.data.categories) {
          await this.db.runAsync(
            `INSERT OR REPLACE INTO categories (id, name, icon, color, isDefault, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [category.id, category.name, category.icon, category.color, 0, category.createdAt, new Date().toISOString()]
          );
        }
        console.log(`Imported ${backup.data.categories.length} custom categories`);
      }

      if (backup.data.tasks && Array.isArray(backup.data.tasks)) {
        for (const task of backup.data.tasks) {
          const frequencyData = task.frequency ? JSON.stringify(task.frequency) : null;
          await this.db.runAsync(
            `INSERT OR REPLACE INTO tasks (id, taskName, description, categoryId, color, isCompleted, isRepeated, frequencyData, experienceReward, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              task.id,
              task.taskName,
              task.description,
              task.categoryId || null,
              task.color || null,
              task.isCompleted ? 1 : 0,
              task.isRepeated ? 1 : 0,
              frequencyData,
              task.experienceReward,
              task.createdAt,
              new Date().toISOString()
            ]
          );
        }
        console.log(`Imported ${backup.data.tasks.length} tasks`);
      }

      console.log('✅ Data import completed successfully');
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }
}

export const database = new Database();
