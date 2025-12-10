import React from 'react';
import { Card } from '../components/ui/Card';
import { Bell, Calendar, Users, Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageRoute } from '../types';

interface DashboardProps {
  onNavigate: (page: PageRoute) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Avisos Ativos', value: '3', icon: <Bell size={20} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Reservas Hoje', value: '2', icon: <Calendar size={20} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Visitantes', value: '12', icon: <Users size={20} className="text-violet-600" />, bg: 'bg-violet-50' },
    { label: 'Manutenções', value: '1', icon: <Wrench size={20} className="text-orange-600" />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bom dia, Morador</h1>
          <p className="text-slate-500">Aqui está o resumo do seu condomínio hoje.</p>
        </div>
        <Button onClick={() => onNavigate('reservations')}>Nova Reserva</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center gap-4 transition-all hover:shadow-md cursor-default">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Notices */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Últimos Avisos</h2>
          <Card noPadding className="overflow-hidden">
            <div className="divide-y divide-slate-100">
              {[
                { title: 'Manutenção no Elevador Social', date: 'Hoje, 09:00', type: 'Urgente' },
                { title: 'Festa Junina do Condomínio', date: 'Ontem', type: 'Social' },
                { title: 'Mudança nas regras da piscina', date: '2 dias atrás', type: 'Info' }
              ].map((notice, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className={`w-2 h-2 rounded-full ${notice.type === 'Urgente' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <h4 className="font-medium text-slate-900">{notice.title}</h4>
                      <p className="text-sm text-slate-500">{notice.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ler</Button>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Button variant="ghost" size="sm" className="w-full text-indigo-600" onClick={() => onNavigate('notices')}>Ver todos os avisos</Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions / Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Status</h2>
          <Card>
            <h3 className="font-medium text-slate-900 mb-2">Sua Unidade: 402-B</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Condomínio</span>
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">Em dia</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Próxima Assembleia</span>
                <span className="text-slate-900">15/06</span>
              </div>
              <div className="h-px bg-slate-100 my-2"></div>
              <Button variant="outline" className="w-full" size="sm">Emitir 2ª Via Boleto</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};