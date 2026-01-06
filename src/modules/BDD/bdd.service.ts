import { Injectable, Logger } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import type { User } from '../auth/user.model';

@Injectable()
export class BddService {
  private readonly dataBase: DatabaseSync;
  private readonly logger = new Logger(BddService.name);

  constructor() {
    this.dataBase = new DatabaseSync('./dataBase.sqlite');

    this.dataBase.exec(`
      CREATE TABLE IF NOT EXISTS data (
        key INTEGER PRIMARY KEY,
        value TEXT NOT NULL
      ) STRICT;

      CREATE TABLE IF NOT EXISTS ref_gendarme (
        nigend INTEGER PRIMARY KEY,
        nom TEXT NOT NULL
      ) STRICT;
    `);
  }

  getBdd(): DatabaseSync {
    return this.dataBase;
  }

  // Conversion DB → objet métier
  private toUser(row: any): User | undefined {
    if (!row) return undefined;

    const nigend = Number(row.nigend);
    const nom = String(row.nom ?? '');

    if (!Number.isInteger(nigend) || !nom) {
      return undefined;
    }

    return { nigend, nom };
  }

  getGendarmeByNigend(nigend: number): User | undefined {
    const row = this.dataBase
      .prepare('SELECT nigend, nom FROM ref_gendarme WHERE nigend = ?')
      .get(nigend);

    return this.toUser(row);
  }

  listGendarmes(): User[] {
    const rows = this.dataBase
      .prepare('SELECT nigend, nom FROM ref_gendarme ORDER BY nigend ASC')
      .all();

    return (rows as any[])
      .map((row) => this.toUser(row))
      .filter((u): u is User => !!u);
  }

  insertGendarme(nigend: number, nom: string): User {
    this.dataBase
      .prepare('INSERT INTO ref_gendarme (nigend, nom) VALUES (?, ?)')
      .run(nigend, nom);

    this.logger.log(`Création ref_gendarme → nigend=${nigend}, nom="${nom}"`);

    const user = this.getGendarmeByNigend(nigend);
    if (!user) {
      throw new Error('Insert failed');
    }

    return user;
  }

  updateGendarme(nigend: number, nom: string): User | null {
    const res = this.dataBase
      .prepare('UPDATE ref_gendarme SET nom = ? WHERE nigend = ?')
      .run(nom, nigend);

    if ((res as any).changes > 0) {
      this.logger.log(`Modification ref_gendarme → nigend=${nigend}, nom="${nom}"`);
      return this.getGendarmeByNigend(nigend) ?? null;
    }

    return null;
  }

  deleteGendarme(nigend: number): { deleted: boolean } {
    const res = this.dataBase
      .prepare('DELETE FROM ref_gendarme WHERE nigend = ?')
      .run(nigend);

    return { deleted: (res as any).changes > 0 };
  }
}
