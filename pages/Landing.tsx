import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Smartphone, ArrowRight, CheckCircle2, 
  Menu, X, Lock, CreditCard, Calendar, MessageSquare, Camera, FileText,
  Package, Dog, Search, Video, Megaphone, Hammer, AlertTriangle, Star, 
  Bell, ChevronRight, UserCircle, LogOut, Settings, Home, QrCode, Key, Mail, Loader2,
  Copy, Check, Banknote, Smartphone as SmartphoneIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { sendEmailViaSendGrid } from '../services/emailService';

// Tipos para pagamento
interface SelectedPlan {
  name: string;
  price: string;
  period: string;
}

type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'stripe' | null;

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    condominio: '',
    telefone: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'process' | 'success'>('select');
  const [pixCopied, setPixCopied] = useState(false);
  
  // Dados do cliente para pagamento
  const [customerData, setCustomerData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: ''
  });

  const handleSelectPlan = (plan: { name: string; price: string; period: string }) => {
    if (plan.price === 'Sob Consulta') {
      // Para plano Enterprise, abre WhatsApp
      window.open('https://wa.me/5561996505995?text=' + encodeURIComponent(`Olá! Tenho interesse no plano Enterprise do Condomínio Fácil. Gostaria de mais informações.`), '_blank');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentStep('select');
    setPaymentMethod(null);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentStep('process');
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = () => {
    // Simulação de processamento
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStep('success');
    }, 2000);
  };

  const copyPixCode = () => {
    const pixCode = '00020126580014br.gov.bcb.pix0136desenvolvimento@msconsultoriati.com5204000053039865802BR5925CONDOMINIO FACIL TECNOL6009SAO PAULO62070503***6304';
    navigator.clipboard.writeText(pixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    setPaymentMethod(null);
    setPaymentStep('select');
    setCustomerData({ nome: '', email: '', cpf: '', telefone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = () => {
    const { nome, email } = formData;
    if (!nome || !email) {
      setErrorMessage('Por favor, preencha seu nome e email.');
      return;
    }
    setShowContactModal(true);
  };

  const sendViaWhatsApp = () => {
    const { nome, email, condominio, telefone } = formData;
    const message = encodeURIComponent(
      `*Nova Solicitação de Demonstração - Condomínio Fácil*\n\n` +
      `👤 *Nome:* ${nome}\n` +
      `📧 *Email:* ${email}\n` +
      `🏢 *Condomínio:* ${condominio || 'Não informado'}\n` +
      `📱 *Telefone:* ${telefone || 'Não informado'}`
    );
    window.open(`https://wa.me/5561996505995?text=${message}`, '_blank');
    setFormSubmitted(true);
    setShowContactModal(false);
    setFormData({ nome: '', email: '', condominio: '', telefone: '' });
  };

  const sendViaEmail = async () => {
    setIsLoading(true);
    setShowContactModal(false);
    setErrorMessage('');
    
    try {
      const result = await sendEmailViaSendGrid(formData);
      
      if (result.success) {
        setFormSubmitted(true);
        setFormData({ nome: '', email: '', condominio: '', telefone: '' });
      } else {
        setErrorMessage(result.message || 'Erro ao enviar email. Tente via WhatsApp.');
      }
    } catch (error) {
      setErrorMessage('Erro ao enviar email. Tente via WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  // Carousel logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { 
      title: "Portaria Inteligente", 
      icon: <QrCode size={28} />, 
      desc: "Libere visitantes via QR Code e abra portões pelo celular.",
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "hover:border-rose-200"
    },
    { 
      title: "Financeiro Fácil", 
      icon: <CreditCard size={28} />, 
      desc: "2ª via de boletos e prestação de contas transparente.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-200"
    },
    { 
      title: "Encomendas", 
      icon: <Package size={28} />, 
      desc: "Você é notificado assim que sua encomenda chega.",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "hover:border-blue-200"
    },
    { 
      title: "Reservas Online", 
      icon: <Calendar size={28} />, 
      desc: "Reserve salão de festas e churrasqueira sem conflitos.",
      color: "text-violet-500",
      bg: "bg-violet-50",
      border: "hover:border-violet-200"
    },
    { 
      title: "Câmeras 24h", 
      icon: <Camera size={28} />, 
      desc: "Monitore áreas comuns em tempo real pelo app.",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-200"
    },
    { 
      title: "Comunicados", 
      icon: <Megaphone size={28} />, 
      desc: "Receba avisos importantes da administração na hora.",
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "hover:border-orange-200"
    },
    { 
      title: "Assembleia Virtual", 
      icon: <Video size={28} />, 
      desc: "Vote e participe de decisões sem sair de casa.",
      color: "text-cyan-500",
      bg: "bg-cyan-50",
      border: "hover:border-cyan-200"
    },
    { 
      title: "Manutenção", 
      icon: <Hammer size={28} />, 
      desc: "Abra chamados para reparos com fotos e detalhes.",
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "hover:border-slate-300"
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 199",
      period: "/mês",
      desc: "Ideal para pequenos condomínios.",
      features: ["Até 30 Unidades", "Mural de Avisos", "Reservas Online", "App para Moradores", "Suporte por Email"],
      highlight: false
    },
    {
      name: "Profissional",
      price: "R$ 399",
      period: "/mês",
      desc: "O favorito dos síndicos.",
      features: ["Até 100 Unidades", "Tudo do Básico", "Controle de Portaria", "Gestão de Encomendas", "Assembleia Virtual", "Integração Bancária", "Suporte WhatsApp"],
      highlight: true,
      tag: "Mais Popular"
    },
    {
      name: "Enterprise",
      price: "Sob Consulta",
      period: "",
      desc: "Para administradoras e grandes complexos.",
      features: ["Unidades Ilimitadas", "Tudo do Profissional", "White Label (Sua Marca)", "API de Integração", "Gerente de Conta", "Treinamento Presencial"],
      highlight: false
    }
  ];

  // Components for the phone screen carousel
  const ScreenHeader = () => (
    <div className="bg-blue-900 p-6 pt-12 text-white pb-8 rounded-b-[2rem] shadow-lg relative z-10 transition-all duration-500">
      <div className="flex justify-between items-center mb-6">
        <Menu className="opacity-80" />
        <span className="font-semibold">Condomínio Fácil</span>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center overflow-hidden border-2 border-blue-700">
             <img src="https://i.pravatar.cc/150?u=maike" alt="User" />
          </div>
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">9</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold">Olá, Maike!</h3>
        <p className="text-blue-200 text-sm">Bem-vindo ao Condomínio Fácil</p>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 py-4 px-6 flex justify-between items-center text-slate-400 z-20">
       <div className="text-blue-900 flex flex-col items-center gap-1">
          <Building2 size={20} />
       </div>
       <MessageSquare size={20} />
       <div className="w-10 h-10 bg-blue-900 rounded-full -mt-8 border-4 border-slate-50 flex items-center justify-center text-white shadow-lg">
          <Smartphone size={20} />
       </div>
       <CreditCard size={20} />
       <Users size={20} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                <Building2 size={24} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                Condomínio<span className="animate-gradient-text">Fácil</span>
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['Funcionalidades', 'Planos', 'Depoimentos'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative group px-1 py-2"
                >
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-900 transition-colors">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                </a>
              ))}
              
              <div className="flex items-center gap-3 ml-4">
                <Button variant="ghost" onClick={onLogin} className="hover:bg-blue-50 hover:text-blue-900 hover:-translate-y-0.5 transition-all">Área do Cliente</Button>
                <Button onClick={onLogin} size="sm" className="shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">Experimente Grátis</Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#funcionalidades" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900 rounded-lg transition-colors">Funcionalidades</a>
              <a href="#planos" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900 rounded-lg transition-colors">Planos</a>
              <a href="#depoimentos" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900 rounded-lg transition-colors">Depoimentos</a>
              <hr className="border-slate-100 my-2"/>
              <Button className="w-full justify-center" onClick={onLogin}>Acessar Sistema</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Shapes Background */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-blue-50 via-indigo-50/50 to-transparent -z-10 rounded-bl-[200px]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8 reveal active">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-800 text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                App atualizado versão 2.0
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                <span className="inline-block animate-gentle-hover text-slate-900">Gestão de</span> <br/> 
                <span className="inline-block animate-gentle-hover text-slate-900" style={{animationDelay: '1s'}}>condomínio</span> 
                <span className="animate-gradient-text block mt-1">Inteligente.</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed reveal" style={{ transitionDelay: '0.1s' }}>
                Centralize a comunicação, aumente a segurança e reduza a inadimplência com o aplicativo que conecta síndicos, portaria e moradores.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal" style={{ transitionDelay: '0.2s' }}>
                <Button size="xl" onClick={onLogin} icon={<ArrowRight size={20}/>} className="hover-lift shadow-blue-900/20">
                  Começar Agora
                </Button>
                <Button size="xl" variant="outline" onClick={() => window.open('https://wa.me/5561996505995', '_blank')} className="hover-lift">
                  Falar com Consultor
                </Button>
              </div>

              {/* Store Buttons & Social Proof */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 reveal" style={{ transitionDelay: '0.3s' }}>
                
                {/* Store Badges */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
                      <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                      </svg>
                      <div className="text-left">
                          <div className="text-[9px] font-medium leading-none opacity-80">Baixe na</div>
                          <div className="text-xs font-bold leading-none mt-0.5">App Store</div>
                      </div>
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
                      <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                      </svg>
                      <div className="text-left">
                          <div className="text-[9px] font-medium leading-none opacity-80">Disponível no</div>
                          <div className="text-xs font-bold leading-none mt-0.5">Google Play</div>
                      </div>
                  </button>
                </div>

                {/* Divider & Social Proof */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="h-8 w-px bg-slate-300"></div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 15})`, backgroundSize: 'cover'}}/>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      <span className="block font-bold text-slate-900 text-sm">+500</span>
                      condomínios
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* App Mockup Visualization - Interactive Carousel */}
            <div className="relative mx-auto lg:ml-auto w-full max-w-[320px] lg:max-w-[360px] animate-float reveal" style={{ transitionDelay: '0.4s' }}>
              
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full z-[-1]" />

              {/* Phone Frame */}
              <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50">
                <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden h-[680px] w-full relative flex flex-col">
                  
                  {/* Screen 0: Home / Dashboard */}
                  <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${currentScreen === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <ScreenHeader />
                    <div className="p-4 space-y-4 overflow-y-auto no-scrollbar pb-20 -mt-4 relative z-0 flex-1">
                      {/* Fake News Banner */}
                      <div className="bg-blue-900 rounded-2xl p-4 text-white text-xs relative overflow-hidden shadow-md">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="bg-yellow-500 text-blue-900 font-bold px-1.5 py-0.5 rounded text-[10px]">Fake News</span>
                           <X size={14} className="opacity-70"/>
                        </div>
                        <p className="opacity-90 leading-relaxed">A definição de uma nova faixa etária para vacinação depende do envio de doses.</p>
                      </div>

                      {/* Warning Banner */}
                      <div className="bg-red-500 rounded-2xl p-4 text-white text-xs relative overflow-hidden shadow-md">
                        <div className="flex items-center gap-2 font-bold text-sm mb-1">
                          <AlertTriangle size={16} />
                          Atenção
                        </div>
                        <p className="opacity-90">Atualmente existem 1 moradores inadimplentes, totalizando R$ 5.000,00.</p>
                        <div className="flex justify-end mt-2">
                           <ChevronRight size={16} />
                        </div>
                      </div>

                      {/* Camera Preview */}
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-2 px-1">
                          <span className="font-bold text-slate-800 text-sm">Controle do Portão</span>
                          <div className="flex gap-2">
                             <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"><Lock size={12}/></div>
                          </div>
                        </div>
                        <div className="bg-slate-800 h-32 rounded-xl flex items-center justify-center text-slate-500 text-xs relative overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1623942004245-566d21cb5270?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Camera" />
                           <span className="absolute bottom-2 right-2 text-white/70 text-[10px]">20/12/2025 19:24:18</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screen 1: Services Grid */}
                  <div className={`absolute inset-0 flex flex-col bg-slate-50 transition-opacity duration-500 ${currentScreen === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="bg-blue-900 p-6 pt-12 text-white pb-6 shadow-md z-10">
                      <div className="flex justify-between items-center">
                        <Menu className="opacity-80" />
                        <span className="font-semibold">Serviços</span>
                        <Bell className="opacity-80" />
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto no-scrollbar pb-20 flex-1">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {icon: <Lock size={20}/>, label: "Abrir Portão", color: "text-rose-500", bg: "bg-rose-100"},
                          {icon: <FileText size={20}/>, label: "Boletos", color: "text-emerald-500", bg: "bg-emerald-100"},
                          {icon: <Package size={20}/>, label: "Gerar Boletos", color: "text-emerald-500", bg: "bg-emerald-100"},
                          {icon: <AlertTriangle size={20}/>, label: "Inadimplentes", color: "text-orange-500", bg: "bg-orange-100"},
                          {icon: <Camera size={20}/>, label: "Câmeras", color: "text-indigo-500", bg: "bg-indigo-100"},
                          {icon: <Hammer size={20}/>, label: "Prestadores", color: "text-violet-500", bg: "bg-violet-100"},
                          {icon: <FileText size={20}/>, label: "Criar Pauta", color: "text-emerald-500", bg: "bg-emerald-100"},
                          {icon: <Calendar size={20}/>, label: "Criar Reunião", color: "text-rose-500", bg: "bg-rose-100"},
                        ].map((item, i) => (
                           <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-3 h-32 justify-between">
                              <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>{item.icon}</div>
                              <div>
                                <span className="text-sm font-bold text-slate-800 block leading-tight">{item.label}</span>
                                <span className="text-[10px] text-slate-400 block mt-1">Acessar serviço</span>
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Screen 2: Menu/Profile */}
                  <div className={`absolute inset-0 flex flex-col bg-slate-50 transition-opacity duration-500 ${currentScreen === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    {/* Blurred backdrop simulation */}
                    <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm z-0"></div>
                    
                    {/* Menu Drawer */}
                    <div className="absolute top-0 bottom-0 left-0 w-[85%] bg-white shadow-2xl z-10 rounded-r-3xl flex flex-col animate-fade-in">
                       <div className="p-6 pt-12 border-b border-slate-100">
                          <div className="flex items-center gap-3 mb-1">
                             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-900">
                                <img src="https://i.pravatar.cc/150?u=maike" alt="User" />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-900">Maike Silva</h4>
                                <span className="text-xs text-slate-500">Síndico</span>
                             </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">maikejo@gmail.com</p>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto p-4 space-y-1">
                          {[
                            {icon: <Home size={18}/>, label: "Início"},
                            {icon: <AlertTriangle size={18}/>, label: "Problemas"},
                            {icon: <MessageSquare size={18}/>, label: "Sugestões"},
                            {icon: <Bell size={18}/>, label: "Notificações"},
                            {icon: <Calendar size={18}/>, label: "Reuniões"},
                            {icon: <FileText size={18}/>, label: "Boletos"},
                            {icon: <Search size={18}/>, label: "Achados e Perdidos"},
                            {icon: <UserCircle size={18}/>, label: "Meu Perfil"},
                            {icon: <Settings size={18}/>, label: "Configurações"},
                          ].map((item, i) => (
                             <button key={i} className="w-full flex items-center gap-4 p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors text-sm font-medium">
                                {item.icon} {item.label}
                             </button>
                          ))}
                       </div>

                       <div className="p-4 border-t border-slate-100">
                          <button className="flex items-center gap-2 text-red-500 font-medium text-sm p-2">
                             <LogOut size={18}/> Sair
                          </button>
                       </div>
                    </div>
                  </div>

                  <BottomNav />

                </div>
              </div>
              
              {/* Decorative Floating Elements around phone */}
              <div className="absolute top-1/4 -right-8 bg-white p-3 rounded-xl shadow-xl z-20 animate-bounce delay-700 hidden md:block border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={16} /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                    <p className="font-bold text-slate-800 text-sm">Portão Fechado</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 -left-8 bg-white p-3 rounded-xl shadow-xl z-20 animate-bounce delay-100 hidden md:block border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Bell size={16} /></div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Nova Notificação</p>
                    <p className="font-bold text-slate-800 text-sm">Encomenda Chegou</p>
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentScreen(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentScreen === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'}`} 
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section id="funcionalidades" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">Funcionalidades</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Tudo que seu condomínio <br/> precisa em <span className="text-blue-600">um só app</span>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Design moderno, fácil de usar e com todas as ferramentas essenciais para síndicos e moradores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, i) => (
              <div 
                key={i} 
                className={`group p-6 rounded-2xl bg-white border border-slate-100 hover:border-transparent transition-all duration-300 hover-card-glow cursor-default reveal`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha o plano ideal</h2>
            <p className="text-blue-200 text-lg">Sem taxas de implantação. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 rounded-3xl border transition-all duration-500 reveal ${plan.highlight ? 'bg-white text-slate-900 border-white transform md:-translate-y-4 shadow-2xl shadow-blue-500/20' : 'bg-slate-800/50 backdrop-blur-md border-slate-700 text-white hover:bg-slate-800'}`}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {plan.tag}
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-8 ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{plan.desc}</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-700 text-blue-400'}`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.highlight ? 'primary' : 'white'} 
                  className={`w-full ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                  onClick={() => handleSelectPlan({ name: plan.name, price: plan.price, period: plan.period })}
                >
                  {plan.price === 'Sob Consulta' ? 'Falar com Consultor' : 'Selecionar Plano'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3">Depoimentos</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">O que dizem nossos clientes</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[
               { name: "Ricardo Mendes", role: "Síndico Profissional", text: "A funcionalidade de 'Inadimplentes' me ajudou a reduzir a dívida do condomínio em 40% nos primeiros 3 meses. O app é muito intuitivo.", rating: 5 },
               { name: "Ana Paula", role: "Moradora", text: "Adoro a função de 'Encomendas'. Recebo a notificação assim que chega algo na portaria. Acabou a confusão de pacotes perdidos.", rating: 5 },
               { name: "Carlos Eduardo", role: "Administrador", text: "A 'Reunião Virtual' salvou nossas assembleias. Conseguimos quórum recorde e as decisões ficaram muito mais ágeis.", rating: 5 }
             ].map((t, i) => (
               <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative hover-card-glow reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                 <div className="flex gap-1 text-yellow-400 mb-4">
                   {[...Array(t.rating)].map((_, r) => <Star key={r} size={16} fill="currentColor" />)}
                 </div>
                 <p className="text-slate-600 italic mb-6">"{t.text}"</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                     {t.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                     <p className="text-xs text-slate-500">{t.role}</p>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 reveal">Pronto para transformar seu condomínio?</h2>
          <p className="text-xl text-slate-600 mb-10 reveal" style={{ transitionDelay: '0.1s' }}>Junte-se a mais de 500 síndicos que modernizaram sua gestão com o Condomínio Fácil.</p>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 inline-block w-full max-w-2xl shadow-xl shadow-blue-900/5 reveal" style={{ transitionDelay: '0.2s' }}>
            
            {formSubmitted ? (
              <div className="py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Solicitação Enviada!</h3>
                <p className="text-slate-600 mb-6">Em breve nossa equipe entrará em contato com você.</p>
                <Button variant="outline" onClick={() => setFormSubmitted(false)}>
                  Enviar nova solicitação
                </Button>
              </div>
            ) : isLoading ? (
              <div className="py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Enviando sua solicitação...</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-6">Solicite uma demonstração gratuita</h3>
                
                {errorMessage && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <AlertTriangle size={18} />
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                   <input 
                     type="text" 
                     name="nome"
                     placeholder="Seu Nome *" 
                     value={formData.nome}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all focus:shadow-md bg-slate-50 focus:bg-white" 
                   />
                   <input 
                     type="email" 
                     name="email"
                     placeholder="Seu Email *" 
                     value={formData.email}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all focus:shadow-md bg-slate-50 focus:bg-white" 
                   />
                   <input 
                     type="text" 
                     name="condominio"
                     placeholder="Nome do Condomínio" 
                     value={formData.condominio}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all focus:shadow-md bg-slate-50 focus:bg-white" 
                   />
                   <input 
                     type="tel" 
                     name="telefone"
                     placeholder="Telefone / WhatsApp" 
                     value={formData.telefone}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 outline-none transition-all focus:shadow-md bg-slate-50 focus:bg-white" 
                   />
                </div>
                <Button size="lg" className="w-full mt-6 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 transform hover:scale-[1.02] transition-all shadow-lg" onClick={handleSubmit}>
                  Agendar Demonstração
                </Button>
                <p className="text-xs text-slate-400 mt-4">* Campos obrigatórios</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal de Opções de Contato */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="font-bold text-xl text-slate-900 mb-2">Como prefere nos contatar?</h3>
              <p className="text-slate-600 text-sm">Escolha a melhor forma de enviar sua solicitação</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={sendViaWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg"
              >
                <MessageSquare size={20} />
                Enviar via WhatsApp
              </button>
              
              <button 
                onClick={sendViaEmail}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg"
              >
                <Mail size={20} />
                Enviar via Email
              </button>
              
              <button 
                onClick={() => setShowContactModal(false)}
                className="w-full text-slate-500 hover:text-slate-700 font-medium py-3 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8">
            
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-xl">Plano {selectedPlan.name}</h3>
                  <p className="text-blue-200 text-sm mt-1">
                    {selectedPlan.price}{selectedPlan.period}
                  </p>
                </div>
                <button 
                  onClick={closePaymentModal}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              
              {/* Step 1: Seleção de método de pagamento */}
              {paymentStep === 'select' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 text-center mb-6">Escolha a forma de pagamento</h4>
                  
                  <button
                    onClick={() => handlePaymentMethodSelect('pix')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <QrCode size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">PIX</p>
                      <p className="text-sm text-slate-500">Aprovação instantânea</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">5% OFF</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('credit_card')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <CreditCard size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Cartão de Crédito</p>
                      <p className="text-sm text-slate-500">Parcele em até 12x</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('boleto')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                      <Banknote size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Boleto Bancário</p>
                      <p className="text-sm text-slate-500">Vencimento em 3 dias úteis</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('stripe')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-violet-500 hover:bg-violet-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-900">Stripe Checkout</p>
                      <p className="text-sm text-slate-500">Pagamento seguro internacional</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Step 2: Processo de pagamento */}
              {paymentStep === 'process' && (
                <div className="space-y-6">
                  
                  {/* PIX */}
                  {paymentMethod === 'pix' && (
                    <div className="text-center">
                      <div className="bg-slate-100 p-6 rounded-2xl mb-4">
                        <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center border-2 border-slate-200">
                          {/* QR Code simulado */}
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-4">
                        Escaneie o QR Code ou copie o código PIX abaixo
                      </p>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value="00020126580014br.gov.bcb.pix..."
                          className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-600 truncate"
                        />
                        <button
                          onClick={copyPixCode}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            pixCopied 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {pixCopied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                      
                      {pixCopied && (
                        <p className="text-green-600 text-sm mt-2 font-medium">✓ Código copiado!</p>
                      )}
                      
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-800 text-sm">
                          <strong>Valor com desconto:</strong> {' '}
                          {selectedPlan.price.replace('R$ ', 'R$ ').replace(/(\d+)/, (m) => String(Math.round(parseInt(m) * 0.95)))}
                          {selectedPlan.period}
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full mt-6" 
                        onClick={processPayment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Verificando pagamento...</>
                        ) : (
                          'Já fiz o pagamento'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Cartão de Crédito */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Nome no cartão</label>
                          <input 
                            type="text"
                            name="nome"
                            value={customerData.nome}
                            onChange={handleCustomerDataChange}
                            placeholder="Como está no cartão"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Número do cartão</label>
                          <input 
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Validade</label>
                          <input 
                            type="text"
                            placeholder="MM/AA"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">CVV</label>
                          <input 
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Parcelas</label>
                          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white">
                            <option>1x de {selectedPlan.price} (sem juros)</option>
                            <option>2x de R$ {Math.ceil(parseInt(selectedPlan.price.replace(/\D/g, '')) / 2)},00 (sem juros)</option>
                            <option>3x de R$ {Math.ceil(parseInt(selectedPlan.price.replace(/\D/g, '')) / 3)},00 (sem juros)</option>
                            <option>6x de R$ {Math.ceil(parseInt(selectedPlan.price.replace(/\D/g, '')) / 6)},00 (sem juros)</option>
                            <option>12x de R$ {Math.ceil(parseInt(selectedPlan.price.replace(/\D/g, '')) / 12)},00 (sem juros)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                        <Lock size={14} />
                        <span>Pagamento 100% seguro com criptografia SSL</span>
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={processPayment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Processando...</>
                        ) : (
                          `Pagar ${selectedPlan.price}`
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Boleto */}
                  {paymentMethod === 'boleto' && (
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Nome completo</label>
                          <input 
                            type="text"
                            name="nome"
                            value={customerData.nome}
                            onChange={handleCustomerDataChange}
                            placeholder="Seu nome completo"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">CPF/CNPJ</label>
                          <input 
                            type="text"
                            name="cpf"
                            value={customerData.cpf}
                            onChange={handleCustomerDataChange}
                            placeholder="000.000.000-00"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                          <input 
                            type="email"
                            name="email"
                            value={customerData.email}
                            onChange={handleCustomerDataChange}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <p className="text-orange-800 text-sm">
                          O boleto será enviado para seu email e tem vencimento em <strong>3 dias úteis</strong>.
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={processPayment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Gerando boleto...</>
                        ) : (
                          'Gerar Boleto'
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Stripe */}
                  {paymentMethod === 'stripe' && (
                    <div className="text-center space-y-6">
                      <div className="p-8 bg-violet-50 rounded-2xl">
                        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock className="text-violet-600" size={28} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Checkout Seguro Stripe</h4>
                        <p className="text-slate-600 text-sm">
                          Você será redirecionado para o ambiente seguro do Stripe para finalizar o pagamento.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 text-slate-400">
                        <span className="text-2xl font-bold">visa</span>
                        <span className="text-2xl font-bold">mastercard</span>
                        <span className="text-lg">amex</span>
                      </div>
                      
                      <Button 
                        className="w-full bg-violet-600 hover:bg-violet-700" 
                        onClick={processPayment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 className="animate-spin mr-2" size={18} /> Redirecionando...</>
                        ) : (
                          'Ir para Checkout Seguro'
                        )}
                      </Button>
                    </div>
                  )}

                  <button
                    onClick={() => setPaymentStep('select')}
                    className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium mt-4"
                  >
                    ← Voltar e escolher outro método
                  </button>
                </div>
              )}

              {/* Step 3: Sucesso */}
              {paymentStep === 'success' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-600" size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Confirmado!</h4>
                  <p className="text-slate-600 mb-6">
                    Obrigado por escolher o Condomínio Fácil! Você receberá um email com os próximos passos.
                  </p>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                    <p className="text-blue-800 text-sm">
                      <strong>Plano:</strong> {selectedPlan.name}<br/>
                      <strong>Valor:</strong> {selectedPlan.price}{selectedPlan.period}
                    </p>
                  </div>
                  
                  <Button onClick={closePaymentModal} className="w-full">
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white">
              <ArrowRight size={18} />
            </div>
            <span className="font-bold text-lg text-slate-900">Condomínio<span className="text-blue-900">Fácil</span></span>
          </div>
          
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Condomínio Fácil Tecnologia Ltda. Todos os direitos reservados.
          </div>

          <div className="flex gap-6">
             <a href="#" className="text-slate-400 hover:text-blue-900 transition-colors hover:scale-110 transform duration-200"><span className="sr-only">Instagram</span>📷</a>
             <a href="#" className="text-slate-400 hover:text-blue-900 transition-colors hover:scale-110 transform duration-200"><span className="sr-only">LinkedIn</span>💼</a>
             <a href="#" className="text-slate-400 hover:text-blue-900 transition-colors hover:scale-110 transform duration-200"><span className="sr-only">Facebook</span>f</a>
          </div>
        </div>
      </footer>
    </div>
  );
};