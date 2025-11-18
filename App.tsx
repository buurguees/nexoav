import { Sidebar } from './components/Sidebar';
import { Header, HeaderSection } from './components/Header';
import { InicioResumen, InicioCalendario } from './pages/inicio';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useRouter } from './hooks/useRouter';

export default function App() {
  const { section: currentSection, path: currentPath, navigate, changeSection } = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isTabletPortrait = breakpoint === 'tablet-portrait';
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSectionChange = (section: HeaderSection) => {
    // Determinar la ruta por defecto según la sección (primera opción del sidebar)
    let defaultPath = '/';
    switch (section) {
      case 'inicio':
        defaultPath = '/';
        break;
      case 'facturacion':
        defaultPath = '/facturacion/facturas';
        break;
      case 'proyectos':
        defaultPath = '/proyectos';
        break;
      case 'productos':
        defaultPath = '/productos';
        break;
      case 'rrhh':
        defaultPath = '/rrhh/plantilla';
        break;
      case 'empresa':
        defaultPath = '/empresa/datos';
        break;
    }
    
    changeSection(section, defaultPath);
    
    // Cerrar el sidebar en mobile cuando se cambia de sección desde el navbar inferior
    if (breakpoint === 'mobile') {
      setIsSidebarOpen(false);
    }
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
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar - Fixed */}
      <Sidebar 
        currentPath={currentPath} 
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onCollapseChange={setIsSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area - With padding to compensate for fixed header and sidebar */}
      <main 
        style={{ 
          backgroundColor: 'var(--background)', 
          padding: 'var(--content-padding)',
          marginTop: 'var(--header-height)',
          marginBottom: (isTabletPortrait || isMobile) ? 'var(--header-height)' : '0', // Para tablet-portrait y mobile que tienen header inferior
          marginLeft: isTabletPortrait 
            ? '160px' // Ancho fijo del sidebar en tablet-portrait
            : isMobile
            ? '0' // Mobile no tiene sidebar fijo
            : isTablet
            ? 'var(--sidebar-width-tablet-horizontal)' // Tablet horizontal: 200px
            : (isSidebarCollapsed ? '80px' : 'var(--sidebar-width)'), // Desktop
          height: (isTabletPortrait || isMobile)
            ? 'calc(100vh - var(--header-height) * 2)' 
            : 'calc(100vh - var(--header-height))', // Para tablet-portrait y mobile necesita espacio para ambos headers
          transition: isTabletPortrait ? 'none' : 'margin-left 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
          overflow: 'hidden',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}