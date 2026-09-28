/**
 * Demo data bootstrap
 * Seeds the demo professionals (and a small clinical sample) on first run,
 * so the credentials shown on the login page actually work.
 */

import type { Appointment, Evolution, Patient, Professional, Service, UUID } from '../domain/types';
import {
  appointmentRepository,
  evolutionRepository,
  patientRepository,
  professionalRepository,
  serviceRepository,
} from '../repositories';

const id = (value: string) => value as UUID;

const PROFESSIONALS: Professional[] = [
  {
    id: id('11111111-1111-4111-8111-111111111111'),
    name: 'Ana Ribeiro',
    email: 'ana@clinica.com.br',
    password: '123456',
    crp: 'CRP 06/12345',
    role: 'Psicóloga',
    active: true,
    admin: true,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: id('22222222-2222-4222-8222-222222222222'),
    name: 'Marcos Lima',
    email: 'marcos@clinica.com.br',
    password: '123456',
    crp: 'CRP 06/54321',
    role: 'Psicólogo',
    active: true,
    admin: false,
    createdAt: '2026-01-05T09:05:00.000Z',
    updatedAt: '2026-01-05T09:05:00.000Z',
  },
];

const SERVICES: Service[] = [
  {
    id: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    name: 'Terapia Individual',
    description: 'Atendimento individual com acompanhamento contínuo.',
    durationMin: 50,
    color: 'primary',
    active: true,
    createdAt: '2026-01-05T09:10:00.000Z',
    updatedAt: '2026-01-05T09:10:00.000Z',
  },
  {
    id: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
    name: 'Avaliação Psicológica',
    description: 'Avaliação inicial com instrumentos padronizados.',
    durationMin: 90,
    color: 'success',
    active: true,
    createdAt: '2026-01-05T09:11:00.000Z',
    updatedAt: '2026-01-05T09:11:00.000Z',
  },
  {
    id: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'),
    name: 'Terapia de Casal',
    description: 'Atendimento conjunto para casais e famílias.',
    durationMin: 80,
    color: 'warning',
    active: true,
    createdAt: '2026-01-05T09:12:00.000Z',
    updatedAt: '2026-01-05T09:12:00.000Z',
  },
];

const PATIENTS: Patient[] = [
  {
    id: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    name: 'Juliana Martins',
    phone: '(11) 98888-0001',
    email: 'juliana.martins@example.com',
    birthDate: '1992-04-18',
    document: '123.456.789-00',
    responsible: '',
    address: 'Rua das Acácias, 120',
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    status: 'active',
    startDate: '2026-02-02',
    description: 'Acompanhamento de ansiedade.',
    createdAt: '2026-02-02T12:00:00.000Z',
    updatedAt: '2026-02-02T12:00:00.000Z',
  },
  {
    id: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'),
    name: 'Rafael Duarte',
    phone: '(11) 97777-0002',
    email: 'rafael.duarte@example.com',
    birthDate: '1985-11-30',
    document: '987.654.321-00',
    responsible: '',
    address: 'Av. Paulista, 900',
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
    status: 'active',
    startDate: '2026-02-16',
    description: 'Primeira avaliação.',
    createdAt: '2026-02-16T12:00:00.000Z',
    updatedAt: '2026-02-16T12:00:00.000Z',
  },
  {
    id: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3'),
    name: 'Beatriz Rocha',
    phone: '(11) 96666-0003',
    email: 'beatriz.rocha@example.com',
    birthDate: '1998-07-09',
    document: '456.789.123-00',
    responsible: '',
    address: 'Rua Augusta, 45',
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    status: 'paused',
    startDate: '2025-11-10',
    description: 'Sessões pausadas a pedido.',
    createdAt: '2025-11-10T12:00:00.000Z',
    updatedAt: '2026-01-20T12:00:00.000Z',
  },
];

function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const APPOINTMENTS: Appointment[] = [
  {
    id: id('cccccccc-cccc-4ccc-8ccc-ccccccccccc1'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    professionalId: id('11111111-1111-4111-8111-111111111111'),
    start: at(0, 9),
    durationMin: 50,
    status: 'confirmed',
    notes: '',
    createdAt: '2026-02-02T12:00:00.000Z',
    updatedAt: '2026-02-02T12:00:00.000Z',
  },
  {
    id: id('cccccccc-cccc-4ccc-8ccc-ccccccccccc2'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'),
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
    professionalId: id('11111111-1111-4111-8111-111111111111'),
    start: at(0, 14),
    durationMin: 90,
    status: 'scheduled',
    notes: 'Trazer documentos escolares.',
    createdAt: '2026-02-16T12:00:00.000Z',
    updatedAt: '2026-02-16T12:00:00.000Z',
  },
  {
    id: id('cccccccc-cccc-4ccc-8ccc-ccccccccccc3'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    serviceId: id('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    professionalId: id('22222222-2222-4222-8222-222222222222'),
    start: at(2, 10, 30),
    durationMin: 50,
    status: 'scheduled',
    notes: '',
    createdAt: '2026-02-02T12:00:00.000Z',
    updatedAt: '2026-02-02T12:00:00.000Z',
  },
];

const EVOLUTIONS: Evolution[] = [
  {
    id: id('dddddddd-dddd-4ddd-8ddd-ddddddddddd1'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    professionalId: id('11111111-1111-4111-8111-111111111111'),
    title: 'Sessão 1 - linha de base',
    date: '2026-02-02T13:00:00.000Z',
    content: '<p>Relato inicial de ansiedade com predomínio de Forestas. Optou-se por TCC.</p>',
    createdAt: '2026-02-02T14:00:00.000Z',
    updatedAt: '2026-02-02T14:00:00.000Z',
  },
  {
    id: id('dddddddd-dddd-4ddd-8ddd-ddddddddddd2'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    professionalId: id('11111111-1111-4111-8111-111111111111'),
    title: 'Sessão 2 - psicoeducação',
    date: '2026-02-16T13:00:00.000Z',
    content: '<p>Trabalhada a psicoeducação sobre ansiedade e o registro de pensamentos.</p>',
    createdAt: '2026-02-16T14:00:00.000Z',
    updatedAt: '2026-02-16T14:00:00.000Z',
  },
  {
    id: id('dddddddd-dddd-4ddd-8ddd-ddddddddddd3'),
    patientId: id('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'),
    professionalId: id('11111111-1111-4111-8111-111111111111'),
    title: 'Entrevista inicial',
    date: '2026-02-16T15:00:00.000Z',
    content: '<p>Entrevista inicial para avaliação. Aplicar inventários na próxima sessão.</p>',
    createdAt: '2026-02-16T16:00:00.000Z',
    updatedAt: '2026-02-16T16:00:00.000Z',
  },
];

let bootstrapPromise: Promise<void> | null = null;

async function seedIfEmpty(): Promise<void> {
  if ((await professionalRepository.count()) > 0) return;

  await serviceRepository.createMany(SERVICES);
  await professionalRepository.createMany(PROFESSIONALS);
  await patientRepository.createMany(PATIENTS);
  await appointmentRepository.createMany(APPOINTMENTS);
  await evolutionRepository.createMany(EVOLUTIONS);
}

/**
 * Idempotent bootstrap. Safe to await multiple times.
 */
export function bootstrap(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = seedIfEmpty().catch((e) => {
      console.error('Bootstrap failed:', e);
      bootstrapPromise = null;
    });
  }
  return bootstrapPromise;
}
