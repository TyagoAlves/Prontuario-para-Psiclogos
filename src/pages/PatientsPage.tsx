import { useUI } from '../store';
import { Button, Input, Badge } from '../components/ui';
import { Edit, Trash2 } from 'lucide-react';
import { patientRepository } from '../repositories';
import { useCallback, useState, useEffect } from 'react';

export function PatientsPage() {
  const { addToast } = useUI();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await patientRepository.findAll({ limit: 50 });
      setPatients(data);
    } catch (e) {
      console.error('Failed to load patients:', e);
      addToast({ type: 'error', message: 'Erro ao carregar pacientes' });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return;
    try {
      await patientRepository.delete(id);
      addToast({ type: 'success', message: 'Paciente excluído' });
      loadPatients();
    } catch {
      addToast({ type: 'error', message: 'Erro ao excluir paciente' });
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Pacientes</h1>
        <p>Cadastro e acompanhamento</p>
      </div>

      <div className="flex justify-between mb-6">
        <Input
          placeholder="Buscar por nome, telefone ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80"
        />
        <Button onClick={() => {}}>+ Novo Paciente</Button>
      </div>

      <div className="card">
        <div className="card-content">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        Nenhum registro encontrado
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filtered.map((row) => {
                        return (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{row.name}</td>
                            <td className="px-4 py-3">{row.phone}</td>
                            <td className="px-4 py-3">{row.email}</td>
                            <td className="px-4 py-3"><Badge variant={row.status === 'active' ? 'success' : 'default'}>{row.status}</Badge></td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => {}}><Edit className="w-4 h-4" /></Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}