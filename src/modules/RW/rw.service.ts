import { Injectable, Logger } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { BddService } from '../BDD/bdd.service';

export type DataRow = {
  key: number;
  value: string;
};

@Injectable()
export class RwService {
  private readonly db: DatabaseSync;
  private readonly logger = new Logger(RwService.name);

  constructor(bddService: BddService) {
    this.db = bddService.getBdd();
  }

  create(value: string): DataRow {
    this.logger.debug(`create(value length=${value.length})`);

    this.db.prepare('INSERT INTO data (value) VALUES (?)').run(value);

    const row = this.db
      .prepare('SELECT last_insert_rowid() AS key')
      .get() as { key: number };

    return { key: row.key, value };
  }

  upsert(key: number, value: string): DataRow {
    this.db.prepare(`
      INSERT INTO data (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, value);

    return { key, value };
  }

  findAll(): DataRow[] {
    return this.db
      .prepare('SELECT key, value FROM data ORDER BY key ASC')
      .all() as DataRow[];
  }

  findOne(key: number): DataRow | null {
    const row = this.db
      .prepare('SELECT key, value FROM data WHERE key = ?')
      .get(key) as DataRow | undefined;

    return row ?? null;
  }

  delete(key: number): { deleted: boolean } {
    const result = this.db
      .prepare('DELETE FROM data WHERE key = ?')
      .run(key) as { changes: number | bigint };

    const changes =
      typeof result.changes === 'bigint'
        ? Number(result.changes)
        : result.changes;

    return { deleted: changes > 0 };
  }
}
