import { motion } from 'motion/react';
import { Logo } from './Logo';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavItem } from './sidebar/SidebarNavItem';
import { SidebarExpandableItem } from './sidebar/SidebarExpandableItem';
import { SidebarSection } from './sidebar/SidebarSection';
import { SidebarUserItem } from './sidebar/SidebarUserItem';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Calendar, 
  Users,
  Plus,
  Menu,
  X,
  FolderKanban,
  CheckSquare,
  MapPin,
  MessageSquare,
  Star,
  Receipt,
  DollarSign,
  CreditCard,
  ShoppingCart,
  TrendingDown,
  Package,
  Grid3x3,
  Box,
  Briefcase,
  Warehouse,
  UserCog,
  FileBarChart,
  Building2,
  FileSpreadsheet,
  Calculator,
  PieChart,
  Landmark
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { HeaderSection } from './Header';

interface SidebarProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function Sidebar({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate,
  onCollapseChange
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  // Notificar el estado inicial al montar
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, []); // Solo al montar

  // Sidebar content based on current section
  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'inicio':
        return (
          <>
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
          </>
        );

      case 'facturacion':
        return (
          <>
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
          </>
        );

      case 'proyectos':
        return (
          <>
            <div className="space-y-0.5">
              <SidebarNavItem
                label="Resumen"
                icon={LayoutDashboard}
                isActive={currentPath === '/proyectos'}
                onClick={() => handleNavClick('/proyectos')}
              />
              
              <SidebarNavItem
                label="Calendario"
                icon={Calendar}
                isActive={currentPath === '/proyectos/calendario'}
                onClick={() => handleNavClick('/proyectos/calendario')}
              />
              
              <SidebarNavItem
                label="Tareas"
                icon={CheckSquare}
                isActive={currentPath === '/proyectos/tareas'}
                onClick={() => handleNavClick('/proyectos/tareas')}
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
                label="Proveedores"
                icon={Briefcase}
                isActive={currentPath === '/proyectos/proveedores'}
                onClick={() => handleNavClick('/proyectos/proveedores')}
              />
              
              <SidebarNavItem
                label="Mapa"
                icon={MapPin}
                isActive={currentPath === '/proyectos/mapa'}
                onClick={() => handleNavClick('/proyectos/mapa')}
              />
            </div>
          </>
        );

      case 'productos':
        return (
          <>
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
          </>
        );

      case 'rrhh':
        return (
          <>
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
          </>
        );

      case 'empresa':
        return (
          <>
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
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? '80px' : 'var(--sidebar-width)'
      }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`flex flex-col ${className}`}
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        height: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--background-sidebar)',
        borderRight: '1px solid var(--border-soft)',
        zIndex: 999,
      }}
    >
      {/* Logo Header with Toggle */}
      <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Logo variant="default" animated={false} style={{ color: 'var(--foreground)' }} />
          </motion.div>
        )}
        
        <motion.button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--foreground-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--foreground-tertiary)';
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Main Navigation */}
      {!isCollapsed && (
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 overflow-y-auto px-2.5 py-3"
        >
          {renderSidebarContent()}
        </motion.div>
      )}

      {/* Collapsed Icons Only */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto px-2 py-3 space-y-2"
        >
          <motion.button
            onClick={() => handleNavClick('/')}
            className="w-full p-2.5 rounded-lg transition-colors flex items-center justify-center"
            style={{
              color: 'var(--foreground-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--foreground-tertiary)';
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <LayoutDashboard className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => handleNavClick('/calendario')}
            className="w-full p-2.5 rounded-lg transition-colors flex items-center justify-center"
            style={{
              color: 'var(--foreground-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--foreground-tertiary)';
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      {/* User Profile at Bottom - ALWAYS VISIBLE */}
      {!isCollapsed && (
        <SidebarHeader
          userName="Andrew Smith"
          userRole="Product Designer"
        />
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div className="p-2" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium mx-auto" style={{ backgroundColor: 'var(--accent-blue-primary)', color: 'var(--foreground)' }}>
            A
          </div>
        </div>
      )}
    </motion.aside>
  );
}