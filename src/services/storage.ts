import * as FileSystem from 'expo-file-system';
import lz from 'lz-string';

const STORAGE_DIR = `${FileSystem.documentDirectory}blacklock/`;
const BACKUP_DIR = `${STORAGE_DIR}backups/`;

export interface BackupMetadata {
  filename: string;
  date: string;
  timestamp: number;
  size: number;
}

class StorageService {
  private compressionEnabled = true;

  /**
   * Initialize storage directories
   */
  async init(): Promise<void> {
    try {
      // Create main storage directory
      const dirInfo = await FileSystem.getInfoAsync(STORAGE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
        console.log('📁 Storage directory created:', STORAGE_DIR);
      }

      // Create backup directory
      const backupDirInfo = await FileSystem.getInfoAsync(BACKUP_DIR);
      if (!backupDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BACKUP_DIR, { intermediates: true });
        console.log('📁 Backup directory created:', BACKUP_DIR);
      }
    } catch (error) {
      console.error('❌ Failed to initialize storage:', error);
      throw error;
    }
  }

  /**
   * Save data to file with optional compression
   */
  async save<T>(filename: string, data: T, compress: boolean = true): Promise<void> {
    try {
      const filepath = `${STORAGE_DIR}${filename}`;
      let content: string;

      if (compress && this.compressionEnabled) {
        // Compress data
        const json = JSON.stringify(data);
        content = lz.compressToUTF16(json);
        console.log(`💾 Saving ${filename} (compressed: ${json.length} → ${content.length} chars)`);
      } else {
        // Save as pretty-printed JSON (for debugging)
        content = JSON.stringify(data, null, 2);
        console.log(`💾 Saving ${filename} (${content.length} chars)`);
      }

      await FileSystem.writeAsStringAsync(filepath, content);
    } catch (error) {
      console.error(`❌ Failed to save ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Load data from file with automatic decompression
   */
  async load<T>(filename: string, defaultValue: T): Promise<T> {
    try {
      const filepath = `${STORAGE_DIR}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filepath);

      if (!fileInfo.exists) {
        console.log(`📂 File ${filename} does not exist, using default value`);
        return defaultValue;
      }

      const content = await FileSystem.readAsStringAsync(filepath);

      // Try to decompress first, if fails, assume it's plain JSON
      try {
        const decompressed = lz.decompressFromUTF16(content);
        if (decompressed) {
          console.log(`📖 Loaded ${filename} (decompressed)`);
          return JSON.parse(decompressed);
        }
      } catch {
        // Not compressed, parse as JSON
      }

      console.log(`📖 Loaded ${filename} (plain JSON)`);
      return JSON.parse(content);
    } catch (error) {
      console.error(`❌ Failed to load ${filename}:`, error);
      return defaultValue;
    }
  }

  /**
   * Delete a file
   */
  async delete(filename: string): Promise<void> {
    try {
      const filepath = `${STORAGE_DIR}${filename}`;
      await FileSystem.deleteAsync(filepath, { idempotent: true });
      console.log(`🗑️ Deleted ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${filename}:`, error);
    }
  }

  /**
   * List all files in storage directory
   */
  async list(): Promise<string[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(STORAGE_DIR);
      return files.filter(f => !f.startsWith('backups')); // Exclude backup folder
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      return [];
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(filename: string): Promise<number> {
    try {
      const filepath = `${STORAGE_DIR}${filename}`;
      const info = await FileSystem.getInfoAsync(filepath);
      return info.exists && 'size' in info ? info.size : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Create a backup of all data
   */
  async createBackup(): Promise<string> {
    try {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const filename = `backup-${dateStr}-${timeStr}.json`;
      const filepath = `${BACKUP_DIR}${filename}`;

      // Read all data files
      const [tasks, account, settings, categories, folders] = await Promise.all([
        this.load('tasks.json', []),
        this.load('account.json', null),
        this.load('settings.json', {}),
        this.load('categories.json', []),
        this.load('folders.json', []),
      ]);

      const backup = {
        version: '1.0',
        timestamp: Date.now(),
        date: date.toISOString(),
        data: {
          tasks,
          account,
          settings,
          categories,
          folders,
        },
      };

      // Save backup (compressed)
      const json = JSON.stringify(backup);
      const compressed = lz.compressToUTF16(json);
      await FileSystem.writeAsStringAsync(filepath, compressed);

      console.log(`💾 Backup created: ${filename} (${json.length} → ${compressed.length} chars)`);

      // Clean old backups (keep last 7 days)
      await this.cleanOldBackups(7);

      return filename;
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
      throw error;
    }
  }

  /**
   * Restore data from backup
   */
  async restoreBackup(filename: string): Promise<void> {
    try {
      const filepath = `${BACKUP_DIR}${filename}`;
      const compressed = await FileSystem.readAsStringAsync(filepath);
      const json = lz.decompressFromUTF16(compressed);
      const backup = JSON.parse(json!);

      console.log(`📦 Restoring backup from ${backup.date}`);

      // Restore all data
      const { tasks, account, settings, categories, folders } = backup.data;

      await Promise.all([
        this.save('tasks.json', tasks, true),
        this.save('account.json', account, true),
        this.save('settings.json', settings, true),
        this.save('categories.json', categories, true),
        this.save('folders.json', folders, true),
      ]);

      console.log('✅ Backup restored successfully');
    } catch (error) {
      console.error('❌ Failed to restore backup:', error);
      throw error;
    }
  }

  /**
   * List all backups
   */
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(BACKUP_DIR);
      const backups: BackupMetadata[] = [];

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filepath = `${BACKUP_DIR}${file}`;
        const info = await FileSystem.getInfoAsync(filepath);

        if (info.exists && 'modificationTime' in info) {
          // Extract date from filename: backup-YYYY-MM-DD-HH-MM-SS.json
          const dateMatch = file.match(/backup-(\d{4}-\d{2}-\d{2})-(\d{2}-\d{2}-\d{2})\.json/);
          const dateStr = dateMatch ? `${dateMatch[1]} ${dateMatch[2].replace(/-/g, ':')}` : '';

          backups.push({
            filename: file,
            date: dateStr,
            timestamp: info.modificationTime * 1000,
            size: 'size' in info ? info.size : 0,
          });
        }
      }

      // Sort by timestamp (newest first)
      return backups.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(filename: string): Promise<void> {
    try {
      const filepath = `${BACKUP_DIR}${filename}`;
      await FileSystem.deleteAsync(filepath, { idempotent: true });
      console.log(`🗑️ Deleted backup: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to delete backup ${filename}:`, error);
    }
  }

  /**
   * Clean old backups (keep last N days)
   */
  async cleanOldBackups(keepDays: number = 7): Promise<void> {
    try {
      const backups = await this.listBackups();
      const cutoffTime = Date.now() - keepDays * 24 * 60 * 60 * 1000;

      for (const backup of backups) {
        if (backup.timestamp < cutoffTime) {
          await this.deleteBackup(backup.filename);
        }
      }

      console.log(`🧹 Cleaned backups older than ${keepDays} days`);
    } catch (error) {
      console.error('❌ Failed to clean old backups:', error);
    }
  }

  /**
   * Export backup to Downloads folder (for user to share/save)
   */
  async exportBackup(filename: string): Promise<string> {
    try {
      const sourcePath = `${BACKUP_DIR}${filename}`;
      const destPath = `${FileSystem.documentDirectory}${filename}`;

      // Copy to document directory where user can access
      await FileSystem.copyAsync({
        from: sourcePath,
        to: destPath,
      });

      console.log(`📤 Exported backup to: ${destPath}`);
      return destPath;
    } catch (error) {
      console.error('❌ Failed to export backup:', error);
      throw error;
    }
  }

  /**
   * Import backup from external file
   */
  async importBackup(externalPath: string): Promise<void> {
    try {
      // Read the backup file
      const compressed = await FileSystem.readAsStringAsync(externalPath);
      const json = lz.decompressFromUTF16(compressed);
      const backup = JSON.parse(json!);

      console.log(`📥 Importing backup from ${backup.date}`);

      // Validate backup structure
      if (!backup.data || !backup.version) {
        throw new Error('Invalid backup file format');
      }

      // Create a new backup of current data before importing
      await this.createBackup();

      // Restore the imported data
      const { tasks, account, settings, categories, folders } = backup.data;

      await Promise.all([
        this.save('tasks.json', tasks || [], true),
        this.save('account.json', account, true),
        this.save('settings.json', settings || {}, true),
        this.save('categories.json', categories || [], true),
        this.save('folders.json', folders || [], true),
      ]);

      console.log('✅ Backup imported successfully');
    } catch (error) {
      console.error('❌ Failed to import backup:', error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalSize: number;
    fileCount: number;
    backupCount: number;
    backupSize: number;
  }> {
    try {
      const files = await this.list();
      const backups = await this.listBackups();

      let totalSize = 0;
      for (const file of files) {
        totalSize += await this.getFileSize(file);
      }

      let backupSize = 0;
      for (const backup of backups) {
        backupSize += backup.size;
      }

      return {
        totalSize,
        fileCount: files.length,
        backupCount: backups.length,
        backupSize,
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      return {
        totalSize: 0,
        fileCount: 0,
        backupCount: 0,
        backupSize: 0,
      };
    }
  }
}

// Export singleton instance
export const storage = new StorageService();
