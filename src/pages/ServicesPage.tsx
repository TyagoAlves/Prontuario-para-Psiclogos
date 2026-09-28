import { useUI } from '../store';
import { Button } from '../components/ui';
import { Plus } from 'lucide-react';
import { serviceRepository } from '../repositories';
import { useCallback, useState, useEffect } from 'react';

export function ServicesPage() {
  const { addToast } = useUI();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceRepository.findAll({ limit: 100 });
      setServices(data);
    } catch (e) {
      console.error('Failed to load services:', e);
      addToast({ type: 'error', message: 'Erro ao carregar serviços' });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { loadServices(); }, [loadServices]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Serviços</h1>
        <p>Crie, altere e desative os tipos de atendimento</p>
      </div>

      <div className="flex justify-between mb-6">
        <Button onClick={() => {}}><Plus className="w-4 h-4 mr-2" /> Novo Serviço</Button>
      </div>

      <div className="card">
        <div className="card-content">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum serviço cadastrado</p>
              <Button onClick={() => {}} className="mt-4"><Plus className="w-4 h-4 mr-2" /> Criar primeiro serviço</Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.durationMin} min</td>
                    <td className="px-4 py-3">
                      <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: s.color === 'primary' ? '#4f46e5' : s.color === 'success' ? '#059669' : s.color === 'warning' ? '#d97706' : '#dc2626' }} />
                    </td>
                    <td className="px-4 py-3"><span className={`badge ${s.active ? 'success' : 'default'}`}>{s.active ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-primary-600 hover:underline">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}