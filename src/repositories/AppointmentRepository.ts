/**
 * Appointment Repository
 */

import { BaseRepository } from './BaseRepository';
import type { Appointment, AppointmentStatus } from '../domain/types';
import { storage } from '../adapters';

export class AppointmentRepository extends BaseRepository<Appointment> {
  protected storageKey = 'appointments';
  protected entityName = 'Appointment';

  constructor() {
    super(storage);
  }

  async findByProfessional(professionalId: string, date?: string): Promise<Appointment[]> {
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return this.findByDateRange(start.toISOString(), end.toISOString(), professionalId);
    }
    return this.findAll({ where: { professionalId }, orderBy: 'start', orderDir: 'asc' });
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.findAll({ where: { patientId }, orderBy: 'start', orderDir: 'desc' });
  }

  async findByDateRange(start: string, end: string, professionalId?: string): Promise<Appointment[]> {
    const all = await this.findAll({ where: professionalId ? { professionalId } : {} });
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return all.filter(a => {
      const apptTime = new Date(a.start).getTime();
      return apptTime >= startTime && apptTime <= endTime;
    });
  }

  async findByDate(date: string, professionalId?: string): Promise<Appointment[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.findByDateRange(start.toISOString(), end.toISOString(), professionalId);
  }

  async findConflicts(professionalId: string, start: string, durationMin: number, excludeId?: string): Promise<Appointment[]> {
    const startTime = new Date(start).getTime();
    const endTime = startTime + durationMin * 60000;

    const appointments = await this.findByProfessional(professionalId);
    return appointments
      .filter(a => a.id !== excludeId && a.status !== 'cancelled')
      .filter(a => {
        const aStart = new Date(a.start).getTime();
        const aEnd = aStart + a.durationMin * 60000;
        return aStart < endTime && aEnd > startTime;
      });
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return this.findAll({ where: { status }, orderBy: 'start', orderDir: 'asc' });
  }

  async countByStatus(): Promise<Record<string, number>> {
    const all = await this.findAll();
    return all.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async getTodaysAppointments(professionalId?: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.findByDate(today, professionalId);
  }

  async getUpcoming(limit = 5, professionalId?: string): Promise<Appointment[]> {
    const appointments = await this.findAll({
      where: { ...(professionalId ? { professionalId } : {}), status: 'scheduled' },
      orderBy: 'start',
      orderDir: 'asc',
    });
    const now = new Date();
    return appointments.filter(a => new Date(a.start) >= now).slice(0, limit);
  }
}

export const appointmentRepository = new AppointmentRepository();