import { CardHeader } from '../components/ui';

export function PatientDetailPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Prontuário do Paciente</h1>
        <p>Dados cadastrais, evoluções e termos LGPD</p>
      </div>

      <div className="card">
        <CardHeader title="Dados do Paciente" />
        <div className="card-content">
          <p>Página em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
}