import { motion } from 'motion/react';
import { Logo } from '../Logo';
import { SidebarNavItem } from '../sidebar/SidebarNavItem';
import { 
  LayoutDashboard, 
  Calendar,
  CheckSquare,
  MapPin,
  MessageSquare,
  Star,
  FileText,
  Receipt,
  FileSpreadsheet,
  FileBarChart,
  TrendingDown,
  ShoppingCart,
  FolderKanban,
  Users,
  Briefcase,
  Package,
  Grid3x3,
  Box,
  Warehouse,
  UserCog,
  DollarSign,
  Building2,
  Calculator,
  CreditCard,
  PieChart,
  Landmark,
} from 'lucide-react';
import { HeaderSection } from '../Header';
// CSS importado globalmente en src/main.tsx

interface SidebarTabletPortraitProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
}

/**
 * Versión Tablet Portrait del Sidebar
 * Sidebar fijo, más estrecho, sin toggle
 * Cambia según la sección activa en el HeaderTabletPortrait
 */
export function SidebarTabletPortrait({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate
}: SidebarTabletPortraitProps) {
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // Sidebar content based on current section
  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'inicio':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/'}
              onClick={() => handleNavClick('/')}
            />
            <SidebarNavItem
              label="Calendario"
              icon={Calendar}
              isActive={currentPath === '/calendario'}
              onClick={() => handleNavClick('/calendario')}
            />
            <SidebarNavItem
              label="Tareas"
              icon={CheckSquare}
              isActive={currentPath === '/tareas'}
              onClick={() => handleNavClick('/tareas')}
            />
            <SidebarNavItem
              label="Mapa"
              icon={MapPin}
              isActive={currentPath === '/mapa'}
              onClick={() => handleNavClick('/mapa')}
            />
            <SidebarNavItem
              label="Mensajes"
              icon={MessageSquare}
              isActive={currentPath === '/mensajes'}
              onClick={() => handleNavClick('/mensajes')}
            />
            <SidebarNavItem
              label="Favoritos"
              icon={Star}
              isActive={currentPath === '/favoritos'}
              onClick={() => handleNavClick('/favoritos')}
            />
          </div>
        );

      case 'facturacion':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Facturas"
              icon={Receipt}
              isActive={currentPath === '/facturacion/facturas'}
              onClick={() => handleNavClick('/facturacion/facturas')}
            />
            <SidebarNavItem
              label="Proformas"
              icon={FileText}
              isActive={currentPath === '/facturacion/proformas'}
              onClick={() => handleNavClick('/facturacion/proformas')}
            />
            <SidebarNavItem
              label="Presupuestos"
              icon={FileSpreadsheet}
              isActive={currentPath === '/facturacion/presupuestos'}
              onClick={() => handleNavClick('/facturacion/presupuestos')}
            />
            <SidebarNavItem
              label="Rectificativas"
              icon={FileBarChart}
              isActive={currentPath === '/facturacion/rectificativas'}
              onClick={() => handleNavClick('/facturacion/rectificativas')}
            />
            <SidebarNavItem
              label="Gastos"
              icon={TrendingDown}
              isActive={currentPath === '/facturacion/gastos'}
              onClick={() => handleNavClick('/facturacion/gastos')}
            />
            <SidebarNavItem
              label="Compras"
              icon={ShoppingCart}
              isActive={currentPath === '/facturacion/compras'}
              onClick={() => handleNavClick('/facturacion/compras')}
            />
          </div>
        );

      case 'proyectos':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/proyectos'}
              onClick={() => handleNavClick('/proyectos')}
            />
            <SidebarNavItem
              label="Clientes"
              icon={Users}
              isActive={currentPath === '/proyectos/clientes'}
              onClick={() => handleNavClick('/proyectos/clientes')}
            />
            <SidebarNavItem
              label="Proyectos"
              icon={FolderKanban}
              isActive={currentPath === '/proyectos/listado'}
              onClick={() => handleNavClick('/proyectos/listado')}
            />
            <SidebarNavItem
              label="Tareas"
              icon={CheckSquare}
              isActive={currentPath === '/proyectos/tareas'}
              onClick={() => handleNavClick('/proyectos/tareas')}
            />
            <SidebarNavItem
              label="Calendario"
              icon={Calendar}
              isActive={currentPath === '/proyectos/calendario'}
              onClick={() => handleNavClick('/proyectos/calendario')}
            />
            <SidebarNavItem
              label="Mapa"
              icon={MapPin}
              isActive={currentPath === '/proyectos/mapa'}
              onClick={() => handleNavClick('/proyectos/mapa')}
            />
          </div>
        );

      case 'productos':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/productos'}
              onClick={() => handleNavClick('/productos')}
            />
            <SidebarNavItem
              label="Categorías"
              icon={Grid3x3}
              isActive={currentPath === '/productos/categorias'}
              onClick={() => handleNavClick('/productos/categorias')}
            />
            <SidebarNavItem
              label="Productos"
              icon={Package}
              isActive={currentPath === '/productos/listado'}
              onClick={() => handleNavClick('/productos/listado')}
            />
            <SidebarNavItem
              label="Servicios"
              icon={Briefcase}
              isActive={currentPath === '/productos/servicios'}
              onClick={() => handleNavClick('/productos/servicios')}
            />
            <SidebarNavItem
              label="Inventario"
              icon={Box}
              isActive={currentPath === '/productos/inventario'}
              onClick={() => handleNavClick('/productos/inventario')}
            />
            <SidebarNavItem
              label="Almacén"
              icon={Warehouse}
              isActive={currentPath === '/productos/almacen'}
              onClick={() => handleNavClick('/productos/almacen')}
            />
          </div>
        );

      case 'rrhh':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Plantilla"
              icon={Users}
              isActive={currentPath === '/rrhh/plantilla'}
              onClick={() => handleNavClick('/rrhh/plantilla')}
            />
            <SidebarNavItem
              label="Técnicos"
              icon={UserCog}
              isActive={currentPath === '/rrhh/tecnicos'}
              onClick={() => handleNavClick('/rrhh/tecnicos')}
            />
            <SidebarNavItem
              label="Nóminas"
              icon={DollarSign}
              isActive={currentPath === '/rrhh/nominas'}
              onClick={() => handleNavClick('/rrhh/nominas')}
            />
            <SidebarNavItem
              label="Documentación"
              icon={FileText}
              isActive={currentPath === '/rrhh/documentacion'}
              onClick={() => handleNavClick('/rrhh/documentacion')}
            />
            <SidebarNavItem
              label="Mapa"
              icon={MapPin}
              isActive={currentPath === '/rrhh/mapa'}
              onClick={() => handleNavClick('/rrhh/mapa')}
            />
          </div>
        );

      case 'empresa':
        return (
          <div className="space-y-0.5">
            <SidebarNavItem
              label="Datos"
              icon={Building2}
              isActive={currentPath === '/empresa/datos'}
              onClick={() => handleNavClick('/empresa/datos')}
            />
            <SidebarNavItem
              label="Plantillas"
              icon={FileText}
              isActive={currentPath === '/empresa/plantillas'}
              onClick={() => handleNavClick('/empresa/plantillas')}
            />
            <SidebarNavItem
              label="Impuestos"
              icon={Calculator}
              isActive={currentPath === '/empresa/impuestos'}
              onClick={() => handleNavClick('/empresa/impuestos')}
            />
            <SidebarNavItem
              label="Cuentas"
              icon={CreditCard}
              isActive={currentPath === '/empresa/cuentas'}
              onClick={() => handleNavClick('/empresa/cuentas')}
            />
            <SidebarNavItem
              label="Contabilidad"
              icon={FileSpreadsheet}
              isActive={currentPath === '/empresa/contabilidad'}
              onClick={() => handleNavClick('/empresa/contabilidad')}
            />
            <SidebarNavItem
              label="Analítica"
              icon={PieChart}
              isActive={currentPath === '/empresa/analitica'}
              onClick={() => handleNavClick('/empresa/analitica')}
            />
            <SidebarNavItem
              label="Tesorería"
              icon={Landmark}
              isActive={currentPath === '/empresa/tesoreria'}
              onClick={() => handleNavClick('/empresa/tesoreria')}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.aside
      initial={{ x: -160 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`sidebar-tablet-portrait ${className}`}
    >
      <div className="sidebar-tablet-portrait-content">
        {/* Logo Header */}
        <div className="px-4 py-3 flex items-center justify-center gap-2" style={{ borderBottom: '1px solid var(--border-soft)', marginBottom: 'var(--spacing-sm)', color: 'var(--foreground)' }}>
          <Logo variant="icon" animated={false} className="w-5 h-5" />
          <div className="flex items-baseline gap-[0.15em]">
            <span className="text-xs tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
            <span className="text-xs tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
          </div>
        </div>

        {/* Navigation */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="sidebar-tablet-portrait-nav"
        >
          {renderSidebarContent()}
        </motion.div>

      </div>
    </motion.aside>
  );
}

