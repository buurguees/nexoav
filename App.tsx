import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InicioResumen } from './pages/inicio';
import { Clientes } from './pages/clientes';
import { Proyectos } from './pages/proyectos';
import { Calendario } from './pages/calendario';
import { Mapa } from './pages/mapa';
import { Proveedores } from './pages/proveedores';
import { Tecnicos } from './pages/proveedores/tecnicos';
import { Materiales } from './pages/proveedores/materiales';
import { Softwares } from './pages/proveedores/softwares';
import { Externos } from './pages/proveedores/externos';
import { Gastos } from './pages/gastos';
import { Tickets } from './pages/gastos/tickets';
import { Categorias } from './pages/gastos/categorias';
import { Facturacion } from './pages/facturacion';
import { Presupuestos } from './pages/facturacion/presupuestos';
import { Proformas } from './pages/facturacion/proformas';
import { Facturas } from './pages/facturacion/facturas';
import { Rectificativas } from './pages/facturacion/rectificativas';
import { Inventario } from './pages/inventario';
import { Productos } from './pages/inventario/productos';
import { Servicios } from './pages/inventario/servicios';
import { Tesoreria } from './pages/tesoreria';
import { CuentasBancarias } from './pages/tesoreria/cuentas-bancarias';
import { Cashflow } from './pages/tesoreria/cashflow';
import { PagosCobros } from './pages/tesoreria/pagos-cobros';
import { Contabilidad } from './pages/contabilidad';
import { CuadroCuentas } from './pages/contabilidad/cuadro-cuentas';
import { BalanceSituacion } from './pages/contabilidad/balance-situacion';
import { Activos } from './pages/contabilidad/activos';
import { Impuestos } from './pages/impuestos';
import { Analitica } from './pages/analitica';
import { Informes } from './pages/analitica/informes';
import { Objetivos } from './pages/analitica/objetivos';
import { RRHH } from './pages/rrhh';
import { Empleados } from './pages/rrhh/empleados';
import { Nominas } from './pages/rrhh/nominas';
import { Externos as ExternosRRHH } from './pages/rrhh/externos';
import { Empresa } from './pages/empresa';
import { DatosFiscales } from './pages/empresa/datos-fiscales';
import { Preferencias } from './pages/empresa/preferencias';
import { Plantillas } from './pages/empresa/plantillas';
import { Conectividad } from './pages/empresa/conectividad';
import { Documentacion } from './pages/empresa/documentacion';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useRouter } from './hooks/useRouter';
import { ThemeProvider } from './src/contexts/ThemeContext';

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

    // Mapa
    if (currentPath === '/mapa') {
      return <Mapa />;
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

    // Proveedores - Submenús
    if (currentPath === '/proveedores/tecnicos') {
      return <Tecnicos />;
    }
    if (currentPath === '/proveedores/materiales') {
      return <Materiales />;
    }
    if (currentPath === '/proveedores/softwares') {
      return <Softwares />;
    }
    if (currentPath === '/proveedores/externos') {
      return <Externos />;
    }

    // Gastos
    if (currentPath === '/gastos') {
      return <Gastos />;
    }

    // Gastos - Submenús
    if (currentPath === '/gastos/tickets') {
      return <Tickets />;
    }
    if (currentPath === '/gastos/categorias') {
      return <Categorias />;
    }

    // Facturación
    if (currentPath === '/facturacion') {
      return <Facturacion />;
    }

    // Facturación - Submenús
    if (currentPath === '/facturacion/presupuestos') {
      return <Presupuestos />;
    }
    if (currentPath === '/facturacion/proformas') {
      return <Proformas />;
    }
    if (currentPath === '/facturacion/facturas') {
      return <Facturas />;
    }
    if (currentPath === '/facturacion/rectificativas') {
      return <Rectificativas />;
    }

    // Inventario
    if (currentPath === '/inventario') {
      return <Inventario />;
    }

    // Inventario - Submenús
    if (currentPath === '/inventario/productos') {
      return <Productos />;
    }
    if (currentPath === '/inventario/servicios') {
      return <Servicios />;
    }

    // Tesorería
    if (currentPath === '/tesoreria') {
      return <Tesoreria />;
    }

    // Tesorería - Submenús
    if (currentPath === '/tesoreria/cuentas-bancarias') {
      return <CuentasBancarias />;
    }
    if (currentPath === '/tesoreria/cashflow') {
      return <Cashflow />;
    }
    if (currentPath === '/tesoreria/pagos-cobros') {
      return <PagosCobros />;
    }

    // Contabilidad
    if (currentPath === '/contabilidad') {
      return <Contabilidad />;
    }

    // Contabilidad - Submenús
    if (currentPath === '/contabilidad/cuadro-cuentas') {
      return <CuadroCuentas />;
    }
    if (currentPath === '/contabilidad/balance-situacion') {
      return <BalanceSituacion />;
    }
    if (currentPath === '/contabilidad/activos') {
      return <Activos />;
    }

    // Impuestos
    if (currentPath === '/impuestos') {
      return <Impuestos />;
    }

    // Analítica
    if (currentPath === '/analitica') {
      return <Analitica />;
    }

    // Analítica - Submenús
    if (currentPath === '/analitica/informes') {
      return <Informes />;
    }
    if (currentPath === '/analitica/objetivos') {
      return <Objetivos />;
    }

    // RRHH
    if (currentPath === '/rrhh') {
      return <RRHH />;
    }

    // RRHH - Submenús
    if (currentPath === '/rrhh/empleados') {
      return <Empleados />;
    }
    if (currentPath === '/rrhh/nominas') {
      return <Nominas />;
    }
    if (currentPath === '/rrhh/externos') {
      return <ExternosRRHH />;
    }

    // Empresa
    if (currentPath === '/empresa') {
      return <Empresa />;
    }

    // Empresa - Submenús
    if (currentPath === '/empresa/datos-fiscales') {
      return <DatosFiscales />;
    }
    if (currentPath === '/empresa/preferencias') {
      return <Preferencias />;
    }
    if (currentPath === '/empresa/plantillas') {
      return <Plantillas />;
    }
    if (currentPath === '/empresa/conectividad') {
      return <Conectividad />;
    }
    if (currentPath === '/empresa/documentacion') {
      return <Documentacion />;
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}