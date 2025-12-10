import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, Send, Trash2, Plus } from 'lucide-react';
import { generateNoticeDraft } from '../services/geminiService';
import { Notice } from '../types';

export const Notices: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'urgent'>('formal');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Manutenção Preventiva - Elevadores',
      content: 'Informamos que na próxima terça-feira realizaremos a manutenção preventiva nos elevadores do bloco B. O serviço ocorrerá das 09h às 14h. Pedimos desculpas pelo transtorno e agradecemos a compreensão.',
      date: '10 Mai 2024',
      author: 'Administração',
      important: true
    },
    {
      id: '2',
      title: 'Assembleia Geral Ordinária',
      content: 'Convocamos todos os condôminos para a assembleia geral que ocorrerá no dia 20/05 no salão de festas.',
      date: '08 Mai 2024',
      author: 'Síndico',
      important: false
    }
  ]);

  const handleGenerateAI = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const text = await generateNoticeDraft(topic, tone);
    setGeneratedContent(text);
    setIsGenerating(false);
  };

  const handlePublish = () => {
    if (!topic || !generatedContent) return;
    const newNotice: Notice = {
      id: Date.now().toString(),
      title: topic,
      content: generatedContent,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Síndico (via IA)',
      important: tone === 'urgent'
    };
    setNotices([newNotice, ...notices]);
    setIsCreating(false);
    setTopic('');
    setGeneratedContent('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mural de Avisos</h1>
          <p className="text-slate-500">Comunicações oficiais e atualizações.</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} icon={<Plus size={18} />}>
            Novo Aviso
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-indigo-100 shadow-lg ring-1 ring-indigo-50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles size={20} />
              <h2 className="font-semibold text-lg">Criar com IA</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancelar</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sobre o que é o aviso?</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Reforma da piscina, Barulho após as 22h..."
                className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tom da mensagem</label>
              <div className="flex gap-2">
                {['formal', 'friendly', 'urgent'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      tone === t 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t === 'formal' ? 'Formal' : t === 'friendly' ? 'Amigável' : 'Urgente'}
                  </button>
                ))}
              </div>
            </div>

            {generatedContent && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <textarea 
                  className="w-full bg-transparent border-none p-0 text-slate-700 focus:ring-0 text-sm h-24 resize-none"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={handleGenerateAI} isLoading={isGenerating} disabled={!topic}>
                {generatedContent ? 'Gerar Novamente' : 'Gerar Rascunho'}
              </Button>
              {generatedContent && (
                <Button onClick={handlePublish} icon={<Send size={16} />}>
                  Publicar
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="group transition-all hover:border-indigo-100">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {notice.important && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Importante
                  </span>
                )}
                <span className="text-sm text-slate-400">{notice.date}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Simulated delete for UI demo */}
                <button className="text-slate-400 hover:text-red-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{notice.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{notice.content}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {notice.author.charAt(0)}
              </div>
              <span className="text-xs text-slate-500 font-medium">{notice.author}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};