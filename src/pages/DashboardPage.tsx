/**
 * Dashboard Page
 */

import { useCallback, useEffect, useState } from 'react';
import { useUI } from '@store';
import { patientRepository, appointmentRepository, evolutionRepository, consentRepository } from '@repositories';
import { Card, CardHeader, CardContent, MetricCard } from '@components/ui';

interface DashboardMetrics {
  totalPatients: number;
  activePatients: number;
  todaysAppointments: number;
  pendingConsents: number;
}

const EMPTY_METRICS: DashboardMetrics = {
  totalPatients: 0,
  activePatients: 0,
  todaysAppointments: 0,
  pendingConsents: 0,
};

export function DashboardPage() {
  const { setGlobalLoading } = useUI();
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recentEvolutions, setRecentEvolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setGlobalLoading(true);
    setLoading(true);
    try {
      const [totalPatients, activePatients, todaysAppointments, pendingConsents, nextAppointments, evolutions] =
        await Promise.all([
          patientRepository.count(),
          patientRepository.count({ status: 'active' }),
          appointmentRepository.getTodaysAppointments(),
          consentRepository.getPendingCount(),
          appointmentRepository.getUpcoming(5),
          evolutionRepository.getRecent(5),
        ]);

      setMetrics({
        totalPatients,
        activePatients,
        todaysAppointments: todaysAppointments.length,
        pendingConsents,
      });
      setUpcoming(nextAppointments);
      setRecentEvolutions(evolutions);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metricCards = [
    { label: 'Total de Pacientes', value: metrics.totalPatients, icon: 'Users', color: 'blue', trend: null },
    { label: 'Em Atendimento', value: metrics.activePatients, icon: 'Users', color: 'green', trend: null },
    { label: 'Agendamentos Hoje', value: metrics.todaysAppointments, icon: 'Calendar', color: 'orange', trend: null },
    { label: 'Consentimentos Pendentes', value: metrics.pendingConsents, icon: 'AlertCircle', color: 'red', trend: 'Revisar' },
  ] as const;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Painel</h1>
        <p>Visão geral da clínica</p>
      </div>

      <div className="metrics-grid" role="list" aria-label="Métricas principais">
        {metricCards.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend ?? undefined}
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader title="Próximos Agendamentos" action={<a href="/agenda">Ver todos</a>} />
          <CardContent>
            {loading ? (
              <p className="empty-state">Carregando...</p>
            ) : upcoming.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum agendamento para hoje</p>
                <a href="/agenda" className="btn btn-secondary btn-sm">Ver agenda</a>
              </div>
            ) : (
              <ul className="activity-list">
                {upcoming.map((appt) => (
                  <li key={appt.id}>
                    <strong>{new Date(appt.start).toLocaleString('pt-BR')}</strong>
                    <span>{appt.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Últimas Evoluções" action={<a href="/patients">Ver prontuários</a>} />
          <CardContent>
            {loading ? (
              <p className="empty-state">Carregando...</p>
            ) : recentEvolutions.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma evolução recente</p>
              </div>
            ) : (
              <ul className="activity-list">
                {recentEvolutions.map((ev) => (
                  <li key={ev.id}>
                    <strong>{ev.title}</strong>
                    <span>{new Date(ev.date).toLocaleDateString('pt-BR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
