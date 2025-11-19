import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InicioResumen } from './pages/inicio';
import { Clientes } from './pages/clientes';
import { Proyectos } from './pages/proyectos';
import { Calendario } from './pages/calendario';
import { Proveedores } from './pages/proveedores';
import { Gastos } from './pages/gastos';
import { Facturacion } from './pages/facturacion';
import { Inventario } from './pages/inventario';
import { Tesoreria } from './pages/tesoreria';
import { Contabilidad } from './pages/contabilidad';
import { Impuestos } from './pages/impuestos';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useRouter } from './hooks/useRouter';

export default function App() {
  const { path: currentPath, navigate } = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isTabletPortrait = breakpoint === 'tablet-portrait';
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  const handleNavigate = (path: string) => {
    navigate(path);
    // Cerrar el sidebar en mobile/tablet cuando se navega
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    // Inicio
    if (currentPath === '/') {
      return <InicioResumen />;
    }

    // Calendario
    if (currentPath === '/calendario') {
      return <Calendario />;
    }

    // Clientes
    if (currentPath === '/clientes') {
      return <Clientes />;
    }

    // Proyectos
    if (currentPath === '/proyectos') {
      return <Proyectos />;
    }

    // Proveedores
    if (currentPath === '/proveedores') {
      return <Proveedores />;
    }

    // Gastos
    if (currentPath === '/gastos') {
      return <Gastos />;
    }

    // Facturación
    if (currentPath === '/facturacion') {
      return <Facturacion />;
    }

    // Inventario
    if (currentPath === '/inventario') {
      return <Inventario />;
    }

    // Tesorería
    if (currentPath === '/tesoreria') {
      return <Tesoreria />;
    }

    // Contabilidad
    if (currentPath === '/contabilidad') {
      return <Contabilidad />;
    }

    // Impuestos
    if (currentPath === '/impuestos') {
      return <Impuestos />;
    }

    // Fallback para rutas no reconocidas
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
          Página no encontrada
        </h1>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Ruta actual: {currentPath || '/'}
        </p>
        <p style={{ color: 'var(--foreground-tertiary)', fontSize: '12px', marginTop: 'var(--spacing-sm)' }}>
          Esta ruta no está implementada aún.
        </p>
      </motion.div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', height: '100vh', overflow: 'hidden' }}>
      {/* Header - Fixed (simplificado: solo búsqueda, notificaciones y perfil) */}
      <Header 
        notificationCount={5}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar - Fixed */}
      <Sidebar 
        currentPath={currentPath} 
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