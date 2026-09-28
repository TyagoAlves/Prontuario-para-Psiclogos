/**
 * Consent Repository
 */

import { BaseRepository } from './BaseRepository';
import type { Consent } from '../domain/types';
import { storage } from '../adapters';

export class ConsentRepository extends BaseRepository<Consent> {
  protected storageKey = 'consents';
  protected entityName = 'Consent';

  constructor() {
    super(storage);
  }

  async findByPatient(patientId: string): Promise<any[]> {
    return this.findAll({
      where: { patientId },
      orderBy: 'signedAt',
      orderDir: 'desc',
    });
  }

  async findByType(type: 'treatment' | 'data'): Promise<any[]> {
    return this.findAll({ where: { type }, orderBy: 'signedAt', orderDir: 'desc' });
  }

  async findActive(patientId: string): Promise<any[]> {
    return this.findAll({
      where: { patientId, status: 'active' },
      orderBy: 'signedAt',
      orderDir: 'desc',
    });
  }

  async findVigent(patientId: string, type: 'treatment' | 'data'): Promise<any | null> {
    const all = await this.findAll({
      where: { patientId, type, status: 'active' },
      orderBy: 'signedAt',
      orderDir: 'desc',
    });
    return all[0] || null;
  }

  async revoke(id: string, reason: string): Promise<any | null> {
    return this.update(id, {
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revocationReason: reason,
    });
  }

  async replace(id: string, newConsent: any): Promise<any> {
    const old = await this.findById(id);
    if (!old) throw new Error('Consent not found');

    // Mark old as replaced
    await this.update(id, {
      status: 'replaced',
      revokedAt: new Date().toISOString(),
      revocationReason: 'Substituído por nova versão',
    });

    // Create new
    return this.create(newConsent);
  }

  async countByStatus(): Promise<Record<string, number>> {
    const all = await this.findAll();
    return all.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async getPendingCount(): Promise<number> {
    // Patients without active consent
    const { patientRepository } = await import('./PatientRepository');
    const { consentRepository } = await import('./ConsentRepository');

    const patients = await patientRepository.findAll({ where: { status: 'active' } });
    let pending = 0;

    for (const patient of patients) {
      const active = await consentRepository.findActive(patient.id);
      if (active.length === 0) pending++;
    }

    return pending;
  }
}

export const consentRepository = new ConsentRepository();