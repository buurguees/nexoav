import { Sidebar } from './components/Sidebar';
import { Header, HeaderSection } from './components/Header';
import { InicioResumen } from './components/InicioResumen';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentSection, setCurrentSection] = useState<HeaderSection>('inicio');

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
      return (
        <div style={{ padding: 'var(--content-padding)' }}>
          <InicioResumen />
        </div>
      );
    }

    // Mostrar contenido por defecto para otras rutas
    return (
      <div style={{ padding: 'var(--content-padding)' }}>
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        notificationCount={5}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          currentPath={currentPath} 
          currentSection={currentSection}
          onNavigate={handleNavigate} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--background)', padding: 'var(--content-padding)' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}