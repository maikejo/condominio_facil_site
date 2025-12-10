import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Clock } from 'lucide-react';
import { Amenity } from '../types';

export const Reservations: React.FC = () => {
  const amenities: Amenity[] = [
    {
      id: '1',
      name: 'Salão de Festas',
      description: 'Espaço climatizado com cozinha completa, mesas e cadeiras para 50 pessoas.',
      capacity: 50,
      imageUrl: 'https://picsum.photos/800/400?random=1',
      price: 150.00
    },
    {
      id: '2',
      name: 'Churrasqueira Gourmet',
      description: 'Área externa coberta com churrasqueira, forno de pizza e freezer.',
      capacity: 20,
      imageUrl: 'https://picsum.photos/800/400?random=2',
      price: 80.00
    },
    {
      id: '3',
      name: 'Academia',
      description: 'Equipamentos modernos para musculação e aeróbico.',
      capacity: 10,
      imageUrl: 'https://picsum.photos/800/400?random=3',
      price: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservas</h1>
          <p className="text-slate-500">Agende o uso das áreas comuns.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <Card key={amenity.id} noPadding className="overflow-hidden flex flex-col group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={amenity.imageUrl} 
                alt={amenity.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {amenity.price && amenity.price > 0 ? (
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                   R$ {amenity.price.toFixed(2)}
                 </div>
              ) : (
                <div className="absolute top-3 right-3 bg-emerald-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                   Gratuito
                 </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{amenity.name}</h3>
              <p className="text-slate-500 text-sm mb-4 flex-1">{amenity.description}</p>
              
              <div className="flex items-center gap-4 mb-5 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  <span>Até {amenity.capacity} pessoas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>08:00 - 22:00</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">Ver Disponibilidade</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};