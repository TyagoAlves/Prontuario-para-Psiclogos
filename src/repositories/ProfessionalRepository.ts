/**
 * Professional Repository
 */

import { BaseRepository } from './BaseRepository';
import type { Professional } from '../domain/types';
import { storage } from '../adapters';

export class ProfessionalRepository extends BaseRepository<Professional> {
  protected storageKey = 'professionals';
  protected entityName = 'Professional';

  constructor() {
    super(storage);
  }

  async findByEmail(email: string): Promise<Professional | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findActive(): Promise<Professional[]> {
    return this.findAll({ where: { active: true }, orderBy: 'name', orderDir: 'asc' });
  }

  async findAdmins(): Promise<Professional[]> {
    return this.findAll({ where: { admin: true, active: true } });
  }

  async authenticate(email: string, password: string): Promise<Professional | null> {
    // In production, use proper password hashing (bcrypt, argon2)
    const professional = await this.findByEmail(email);
    if (professional && professional.password === password && professional.active) {
      return professional;
    }
    return null;
  }

  async countActive(): Promise<number> {
    return this.count({ active: true });
  }

  async countActiveAdmins(): Promise<number> {
    return this.count({ active: true, admin: true });
  }

  async deactivate(id: string): Promise<Professional | null> {
    return this.update(id, { active: false });
  }

  async activate(id: string): Promise<Professional | null> {
    return this.update(id, { active: true });
  }

  async toggleAdmin(id: string): Promise<Professional | null> {
    const prof = await this.findById(id);
    if (!prof) return null;
    return this.update(id, { admin: !prof.admin });
  }
}

export const professionalRepository = new ProfessionalRepository();