import { useUI, useConfig } from '../store';
import { Button } from '../components/ui';
import { Save, RotateCcw, Trash2, Download, Upload, Plus } from 'lucide-react';
import { configRepository } from '../repositories';
import { clinicService } from '../services/ClinicService';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

const SECTION_LABELS: Record<string, string> = {
  identidade: 'Identidade',
  marca: 'Marca',
  textos: 'Textos',
  lgpd: 'Termos LGPD',
};

type ConsentForm = {
  version: string;
  models: { treatment: unknown; data: unknown };
};

function parseJsonField(form: FormData, key: string): unknown {
  const raw = String(form.get(key) ?? '').trim();
  if (!raw) return undefined;
  return JSON.parse(raw);
}

function parseConsentForm(formEl: HTMLFormElement): ConsentForm {
  const form = new FormData(formEl);
  return {
    version: String(form.get('version') ?? ''),
    models: {
      treatment: parseJsonField(form, 'treatment'),
      data: parseJsonField(form, 'data'),
    },
  };
}

export function AdminPage() {
  const { addToast } = useUI();
  const { loadConfig: refreshStoreConfig } = useConfig();
  const [activeTab, setActiveTab] = useState('identidade');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const cfg = await configRepository.get();
      setConfig(cfg);
    } catch (e) {
      console.error('Failed to load config:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async (section: string, data: any) => {
    const label = SECTION_LABELS[section] ?? section;
    try {
      let updated;
      switch (section) {
        case 'identidade':
          updated = await configRepository.updateClinic(data);
          break;
        case 'marca':
          updated = await configRepository.updateBrand(data);
          break;
        case 'textos':
          updated = await configRepository.updateTexts(data);
          break;
        case 'lgpd':
          updated = await configRepository.updateConsent(data);
          break;
        default:
          return;
      }

      const { valid, errors } = clinicService.validateConfig(updated);
      if (!valid) {
        addToast({ type: 'warning', message: `Salvo, mas com avisos: ${errors.join('; ')}` });
      } else {
        addToast({ type: 'success', message: `${label} atualizado com sucesso` });
      }
      setConfig(updated);
      // keep the shared store (sidebar, branding, title) in sync
      await refreshStoreConfig();
    } catch (e) {
      console.error('Failed to save:', e);
      addToast({ type: 'error', message: e instanceof Error ? e.message : `Erro ao salvar ${label}` });
    }
  };

  const onSubmitConsent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      handleSave('lgpd', parseConsentForm(e.currentTarget));
    } catch {
      addToast({ type: 'error', message: 'JSON dos modelos inválido' });
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  const tabs = [
    { id: 'identidade', label: 'Identidade', icon: 'User' },
    { id: 'marca', label: 'Marca', icon: 'Settings' },
    { id: 'textos', label: 'Textos', icon: 'FileText' },
    { id: 'lgpd', label: 'Termos LGPD', icon: 'Shield' },
    { id: 'equipe', label: 'Equipe', icon: 'Users' },
    { id: 'dados', label: 'Dados', icon: 'Database' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Identidade, textos, termos, equipe e dados</p>
      </div>

      <div className="card">
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'identidade' && config && (
            <form onSubmit={e => { e.preventDefault(); handleSave('identidade', Object.fromEntries(new FormData(e.currentTarget))); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="clinic-name">Nome da Clínica *</label>
                  <input id="clinic-name" name="name" type="text" defaultValue={config.clinic?.name} className="form-input" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-unit">Unidade *</label>
                  <input id="clinic-unit" name="unit" type="text" defaultValue={config.clinic?.unit} className="form-input" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-address">Endereço</label>
                  <input id="clinic-address" name="address" type="text" defaultValue={config.clinic?.address} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-phone">Telefone *</label>
                  <input id="clinic-phone" name="phone" type="text" defaultValue={config.clinic?.phone} className="form-input" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-email">E-mail</label>
                  <input id="clinic-email" name="email" type="email" defaultValue={config.clinic?.email} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-website">Site</label>
                  <input id="clinic-website" name="website" type="url" defaultValue={config.clinic?.website} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-document">CNPJ/CPF</label>
                  <input id="clinic-document" name="document" type="text" defaultValue={config.clinic?.document} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="clinic-responsible">Responsável</label>
                  <input id="clinic-responsible" name="responsible" type="text" defaultValue={config.clinic?.responsible} className="form-input" />
                </div>
              </div>
              <div className="mt-6">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> Salvar Identidade</Button>
              </div>
            </form>
          )}

          {activeTab === 'marca' && config && (
            <form onSubmit={e => { e.preventDefault(); handleSave('marca', Object.fromEntries(new FormData(e.currentTarget))); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="brand-acronym">Sigla (até 3 letras)</label>
                  <input id="brand-acronym" name="acronym" type="text" maxLength={3} defaultValue={config.brand?.acronym} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="brand-primary">Cor Principal</label>
                  <input id="brand-primary" name="primaryColor" type="color" defaultValue={config.brand?.primaryColor} className="form-input h-10 w-20" />
                </div>
                <div>
                  <label className="form-label" htmlFor="brand-secondary">Cor Secundária</label>
                  <input id="brand-secondary" name="secondaryColor" type="color" defaultValue={config.brand?.secondaryColor} className="form-input h-10 w-20" />
                </div>
                <div>
                  <label className="form-label" htmlFor="brand-logo">Logo (URL ou data URL)</label>
                  <input id="brand-logo" name="logo" type="text" defaultValue={config.brand?.logo} className="form-input" placeholder="data:image/png;base64,..." />
                </div>
              </div>
              <div className="mt-6">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> Salvar Marca</Button>
              </div>
            </form>
          )}

          {activeTab === 'textos' && config && (
            <form onSubmit={e => { e.preventDefault(); handleSave('textos', Object.fromEntries(new FormData(e.currentTarget))); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="text-system-name">Nome do Sistema *</label>
                  <input id="text-system-name" name="systemName" type="text" defaultValue={config.texts?.systemName} className="form-input" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="text-login-subtitle">Subtítulo do Login</label>
                  <input id="text-login-subtitle" name="loginSubtitle" type="text" defaultValue={config.texts?.loginSubtitle} className="form-input" />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label" htmlFor="text-footer">Rodapé</label>
                  <textarea id="text-footer" name="footer" className="form-textarea" defaultValue={config.texts?.footer} rows={3} />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label" htmlFor="text-lgpd-notice">Aviso LGPD</label>
                  <textarea id="text-lgpd-notice" name="lgpdNotice" className="form-textarea" defaultValue={config.texts?.lgpdNotice} rows={3} />
                </div>
              </div>
              <div className="mt-6">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> Salvar Textos</Button>
              </div>
            </form>
          )}

          {activeTab === 'lgpd' && config && (
            <form onSubmit={onSubmitConsent}>
              <div className="mb-4">
                <label className="form-label" htmlFor="consent-version">Versão dos Modelos *</label>
                <input id="consent-version" name="version" type="text" defaultValue={config.consent?.version} className="form-input" required placeholder="1.0" />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="consent-treatment">Modelo de Tratamento (JSON)</label>
                <textarea id="consent-treatment" name="treatment" className="form-textarea font-mono text-sm" rows={10} defaultValue={JSON.stringify(config.consent?.models?.treatment, null, 2)} />
              </div>
              <div>
                <label className="form-label" htmlFor="consent-data">Modelo de Dados (JSON)</label>
                <textarea id="consent-data" name="data" className="form-textarea font-mono text-sm" rows={10} defaultValue={JSON.stringify(config.consent?.models?.data, null, 2)} />
              </div>
              <div className="mt-6">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> Salvar Modelos LGPD</Button>
              </div>
            </form>
          )}

          {activeTab === 'equipe' && (
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Equipe</h3>
                <Button onClick={() => {}}><Plus className="w-4 h-4 mr-2" /> Novo Profissional</Button>
              </div>
              <p className="text-gray-500">Página em desenvolvimento</p>
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button variant="primary" onClick={() => {}}><Download className="w-4 h-4 mr-2" /> Baixar Backup</Button>
                <Button variant="secondary" onClick={() => {}}><Upload className="w-4 h-4 mr-2" /> Restaurar Backup</Button>
                <Button variant="danger" onClick={() => {}}><Trash2 className="w-4 h-4 mr-2" /> Limpar Dados Clínicos</Button>
                <Button variant="secondary" onClick={() => {}}><RotateCcw className="w-4 h-4 mr-2" /> Restaurar Demonstração</Button>
              </div>
              <p className="text-gray-500">Página em desenvolvimento</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}