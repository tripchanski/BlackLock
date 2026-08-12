import * as SQLite from 'expo-sqlite';
import { Account, Task, Log, CharacterStats, TaskFrequency } from '../types';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      console.log('Opening database...');
      this.db = await SQLite.openDatabaseAsync('blacklock.db');
      console.log('Database opened, creating tables...');
      await this.createTables();
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Database init error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Account table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        avatar TEXT,
        characterType TEXT,
        name TEXT,
        nickname TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 1,
        experience INTEGER NOT NULL DEFAULT 0,
        strength INTEGER NOT NULL DEFAULT 0,
        knowledge INTEGER NOT NULL DEFAULT 0,
        wisdom INTEGER NOT NULL DEFAULT 0,
        endurance INTEGER NOT NULL DEFAULT 0,
        charisma INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tasks table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        taskName TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        isRepeated INTEGER NOT NULL DEFAULT 0,
        frequencyType TEXT,
        frequencyData TEXT,
        experienceReward INTEGER NOT NULL DEFAULT 10,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Logs table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        timestamp TEXT NOT NULL
      );
    `);
  }

  // Account Methods
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
      `INSERT INTO account (id, avatar, characterType, name, nickname, level, experience,
       strength, knowledge, wisdom, endurance, charisma, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newAccount.id,
        newAccount.avatar || null,
        newAccount.characterType || null,
        newAccount.name || null,
        newAccount.nickname,
        newAccount.level,
        newAccount.experience,
        newAccount.stats.strength,
        newAccount.stats.knowledge,
        newAccount.stats.wisdom,
        newAccount.stats.endurance,
        newAccount.stats.charisma,
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
    if (updates.stats) {
      if (updates.stats.strength !== undefined) {
        fields.push('strength = ?');
        values.push(updates.stats.strength);
      }
      if (updates.stats.knowledge !== undefined) {
        fields.push('knowledge = ?');
        values.push(updates.stats.knowledge);
      }
      if (updates.stats.wisdom !== undefined) {
        fields.push('wisdom = ?');
        values.push(updates.stats.wisdom);
      }
      if (updates.stats.endurance !== undefined) {
        fields.push('endurance = ?');
        values.push(updates.stats.endurance);
      }
      if (updates.stats.charisma !== undefined) {
        fields.push('charisma = ?');
        values.push(updates.stats.charisma);
      }
    }

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(account.id);

    await this.db.runAsync(
      `UPDATE account SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  // Task Methods
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
      `INSERT INTO tasks (id, taskName, description, type, isCompleted, isRepeated,
       frequencyType, frequencyData, experienceReward, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newTask.id,
        newTask.taskName,
        newTask.description,
        newTask.type,
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
    if (updates.type !== undefined) {
      fields.push('type = ?');
      values.push(updates.type);
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

    // Mark task as completed
    await this.updateTask(id, { isCompleted: true });

    // Add experience to account
    const account = await this.getAccount();
    if (account) {
      const newExperience = account.experience + task.experienceReward;
      const newLevel = this.calculateLevel(newExperience);

      // Update character stats based on task type
      const newStats = { ...account.stats };
      newStats[task.type] += 1;

      await this.updateAccount({
        experience: newExperience,
        level: newLevel,
        stats: newStats,
      });
    }
  }

  // Log Methods
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

  // Helper Methods
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
      stats: {
        strength: row.strength,
        knowledge: row.knowledge,
        wisdom: row.wisdom,
        endurance: row.endurance,
        charisma: row.charisma,
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      taskName: row.taskName,
      description: row.description,
      type: row.type,
      isCompleted: row.isCompleted === 1,
      isRepeated: row.isRepeated === 1,
      frequency: row.frequencyData ? JSON.parse(row.frequencyData) : undefined,
      experienceReward: row.experienceReward,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private calculateLevel(experience: number): number {
    // Simple level calculation: level = sqrt(experience / 100)
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  }
}

export const database = new Database();
