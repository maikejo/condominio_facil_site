import React, { useState } from 'react';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Notices } from './pages/Notices';
import { Reservations } from './pages/Reservations';
import { Maintenance } from './pages/Maintenance';
import { PageRoute } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageRoute>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulation of login action from Landing Page
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'notices': return <Notices />;
      case 'reservations': return <Reservations />;
      case 'maintenance': return <Maintenance />;
      case 'settings': return <div className="p-8 text-center text-slate-500">Configurações em desenvolvimento...</div>;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-900">Condomínio Fácil</span>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;