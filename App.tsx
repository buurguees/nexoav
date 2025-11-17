import { Sidebar } from './components/Sidebar';
import { Header, HeaderSection } from './components/Header';
import { InicioResumen } from './components/InicioResumen';
import { InicioCalendario } from './components/InicioCalendario';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentSection, setCurrentSection] = useState<HeaderSection>('inicio');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleSectionChange = (section: HeaderSection) => {
    setCurrentSection(section);
    // Reset path when changing sections
    setCurrentPath(`/${section === 'inicio' ? '' : section}`);
  };

  const renderContent = () => {
    // Mostrar InicioResumen cuando estamos en la sección "inicio" y en la ruta "/" (Resumen)
    if (currentSection === 'inicio' && currentPath === '/') {
      return <InicioResumen />;
    }

    // Mostrar InicioCalendario cuando estamos en la sección "inicio" y en la ruta "/calendario"
    if (currentSection === 'inicio' && currentPath === '/calendario') {
      return <InicioCalendario />;
    }

    // Mostrar contenido por defecto para otras rutas
    return (
      <motion.div
        key={currentPath}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-content-scroll"
        style={{ height: '100%' }}
      >
        <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
          {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
        </h1>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Ruta actual: {currentPath || '/'}
        </p>
        <p style={{ color: 'var(--foreground-tertiary)', fontSize: '12px', marginTop: 'var(--spacing-sm)' }}>
          Esta vista se desarrollará más adelante con contenido específico.
        </p>
      </motion.div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', height: '100vh', overflow: 'hidden' }}>
      {/* Header - Fixed */}
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        notificationCount={5}
      />

      {/* Sidebar - Fixed */}
      <Sidebar 
        currentPath={currentPath} 
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onCollapseChange={setIsSidebarCollapsed}
      />

      {/* Main Content Area - With padding to compensate for fixed header and sidebar */}
      <main 
        style={{ 
          backgroundColor: 'var(--background)', 
          padding: 'var(--content-padding)',
          marginTop: 'var(--header-height)',
          marginLeft: isSidebarCollapsed ? '80px' : 'var(--sidebar-width)',
          height: 'calc(100vh - var(--header-height))',
          transition: 'margin-left 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
          overflow: 'hidden',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}