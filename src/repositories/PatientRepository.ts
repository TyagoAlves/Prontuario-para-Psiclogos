/**
 * Patient Repository
 */

import { BaseRepository } from './BaseRepository';
import type { Patient, PatientStatus } from '../domain/types';
import { storage } from '../adapters';

export class PatientRepository extends BaseRepository<Patient> {
  protected storageKey = 'patients';
  protected entityName = 'Patient';

  constructor() {
    super(storage);
  }

  async findByStatus(status: PatientStatus): Promise<Patient[]> {
    return this.findAll({ where: { status }, orderBy: 'name', orderDir: 'asc' });
  }

  async search(query: string): Promise<Patient[]> {
    const collection = await this.readCollection();
    const lower = query.toLowerCase().trim();
    if (!lower) return [];

    return collection.filter((p) =>
      p.name.toLowerCase().includes(lower) ||
      p.phone?.includes(lower) ||
      p.email?.toLowerCase().includes(lower) ||
      p.document?.includes(lower)
    );
  }

  async findByService(serviceId: string): Promise<Patient[]> {
    return this.findAll({ where: { serviceId } });
  }

  async countByStatus(): Promise<Record<string, number>> {
    const all = await this.findAll();
    return all.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const patientRepository = new PatientRepository();