import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Wrench, Plus, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { MaintenanceRequest } from '../types';
import { analyzeMaintenanceRequest } from '../services/geminiService';

export const Maintenance: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });

  const [requests, setRequests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      title: 'Lâmpada queimada no corredor',
      description: 'A luz do corredor do 3º andar está piscando e apagou.',
      category: 'Elétrica',
      priority: 'low',
      status: 'completed',
      date: '10 Mai 2024',
      location: 'Bloco A - 3º Andar'
    },
    {
      id: '2',
      title: 'Vazamento na garagem',
      description: 'Poça d\'água perto da vaga 42, parece vir do teto.',
      category: 'Hidráulica',
      priority: 'high',
      status: 'open',
      date: 'Hoje',
      location: 'Garagem Subsolo'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setIsAnalyzing(true);
    // AI determines priority based on description
    const analysis = await analyzeMaintenanceRequest(formData.description);
    
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location || 'Não informado',
      status: 'open',
      date: 'Hoje',
      priority: analysis.priority,
      category: analysis.category
    };

    setRequests([newRequest, ...requests]);
    setIsAnalyzing(false);
    setIsCreating(false);
    setFormData({ title: '', description: '', location: '' });
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (s: string) => {
    switch(s) {
      case 'completed': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'in_progress': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chamados e Manutenção</h1>
          <p className="text-slate-500">Relate problemas nas áreas comuns.</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} icon={<Plus size={18} />}>
            Abrir Chamado
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-indigo-100 ring-1 ring-indigo-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 mb-4">Novo Chamado</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Portão quebrado"
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                <input 
                  type="text" 
                  placeholder="Ex: Hall de entrada"
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Problema</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Descreva o problema com detalhes para a análise automática de urgência..."
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Wrench size={12} /> A IA analisará a urgência automaticamente.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancelar</Button>
              <Button type="submit" isLoading={isAnalyzing}>Registrar Chamado</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id} className="group hover:border-indigo-100 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 shrink-0`}>
                  <Wrench size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{req.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getPriorityColor(req.priority)}`}>
                      {req.priority === 'high' ? 'Urgente' : req.priority === 'medium' ? 'Médio' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {req.location}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{req.category}</span>
                    <span>{req.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pl-14 md:pl-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                  {getStatusIcon(req.status)}
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {req.status === 'open' ? 'Aberto' : req.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};