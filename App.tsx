import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { BottomNavbar } from './components/navigation/mobile/BottomNavbar';
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
// TODO: Migrar estas importaciones cuando se renombren las carpetas
import { Gastos } from './pages/gastos';
import { Tickets } from './pages/gastos/tickets';
import { FacturasGastos } from './pages/gastos/facturas';
import { Categorias } from './pages/gastos/categorias';
import { Pedidos } from './pages/gastos/pedidos';
import { Facturacion } from './pages/facturacion';
import { Presupuestos } from './pages/facturacion/presupuestos';
import { Proformas } from './pages/facturacion/proformas';
import { Facturas } from './pages/facturacion/facturas';
import { Rectificativas } from './pages/facturacion/rectificativas';
import { Albaranes } from './pages/facturacion/albaranes';
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
import { Calculadora } from './pages/calculadora';
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
import { SidebarProvider, useSidebar } from './src/contexts/SidebarContext';

// Componente interno que usa el contexto del sidebar
function AppContent({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}: { 
  isSidebarCollapsed: boolean; 
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}) {
  const { path: currentPath, navigate } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isTabletPortrait = breakpoint === 'tablet-portrait';
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const { sidebarWidth } = useSidebar(); // Obtener el ancho dinámico del sidebar

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

    // Compras (antes Gastos)
    if (currentPath === '/compras') {
      return <Gastos />;
    }

    // Compras - Submenús
    if (currentPath === '/compras/gastos') {
      return <Tickets />;
    }
    if (currentPath === '/compras/facturas') {
      return <FacturasGastos />;
    }
    if (currentPath === '/compras/categorias') {
      return <Categorias />;
    }
    if (currentPath === '/compras/pedidos') {
      return <Pedidos />;
    }

    // Ventas (antes Facturación)
    if (currentPath === '/ventas') {
      return <Facturacion />;
    }

    // Ventas - Submenús
    if (currentPath === '/ventas/presupuestos') {
      return <Presupuestos />;
    }
    if (currentPath === '/ventas/proformas') {
      return <Proformas />;
    }
    if (currentPath === '/ventas/facturas') {
      return <Facturas />;
    }
    if (currentPath === '/ventas/rectificativas') {
      return <Rectificativas />;
    }
    if (currentPath === '/ventas/albaranes') {
      return <Albaranes />;
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

    // Calculadora
    if (currentPath === '/calculadora') {
      return <Calculadora />;
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
    <div style={{ backgroundColor: 'var(--background)', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, position: 'relative' }}>
      {/* Header - Fixed (simplificado: solo búsqueda, notificaciones y perfil) */}
      <Header 
        notificationCount={5}
        onMenuClick={() => setIsSidebarOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Sidebar - Fixed */}
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={handleNavigate}
        onCollapseChange={setIsSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area - With padding to compensate for fixed header and sidebar */}
      <main 
        style={{ 
          backgroundColor: 'var(--background)', 
          padding: (isTabletPortrait || isTablet || isMobile) ? '0' : 'var(--content-padding)', // Sin padding en tablet/mobile, las páginas lo manejan
          position: isMobile ? 'absolute' : 'relative', // Absolute para mobile para que el contenido empiece desde el top
          top: isMobile ? 'var(--header-height)' : undefined, // Posicionar desde el header en mobile
          left: isMobile ? '0' : undefined,
          right: isMobile ? '0' : undefined,
          bottom: isMobile ? 'var(--header-height)' : undefined, // Espacio para el bottom navbar
          marginTop: isMobile ? '0' : 'var(--header-height)', // Solo marginTop para desktop/tablet
          marginBottom: (isTabletPortrait || isMobile) ? '0' : '0', // Sin marginBottom cuando usamos position absolute
          marginLeft: isTabletPortrait 
            ? `${sidebarWidth}px` // Ancho dinámico del sidebar en tablet-portrait (64px colapsado, 160px expandido) - el borde está incluido con box-sizing: border-box
            : isMobile
            ? '0' // Mobile no tiene sidebar fijo
            : isTablet
            ? `${sidebarWidth}px` // Tablet horizontal: ancho dinámico (64px colapsado, 200px expandido) - el borde está incluido con box-sizing: border-box
            : (isSidebarCollapsed ? '80px' : 'var(--sidebar-width)'), // Desktop - el borde está incluido con box-sizing: border-box
          width: (isTabletPortrait || isTablet)
            ? `calc(100vw - ${sidebarWidth}px)` // Ancho dinámico que se ajusta al sidebar
            : isMobile
            ? '100vw' // Ancho completo para mobile
            : undefined, // Desktop usa el comportamiento por defecto
          height: isMobile 
            ? undefined // En mobile, height se calcula con top y bottom
            : (isTabletPortrait || isMobile)
            ? 'calc(100vh - var(--header-height) * 2)' 
            : 'calc(100vh - var(--header-height))', // Para tablet-portrait y mobile necesita espacio para ambos headers
          transition: isTabletPortrait ? 'none' : 'margin-left 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {renderContent()}
      </main>

      {/* Bottom Navbar - Solo en Mobile */}
      {isMobile && (
        <BottomNavbar 
          currentPath={currentPath} 
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const breakpoint = useBreakpoint();

  return (
    <ThemeProvider>
      <SidebarProvider isCollapsed={isSidebarCollapsed} breakpoint={breakpoint}>
        <AppContent 
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
}