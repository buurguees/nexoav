import { Logo } from '../Logo';
import { SidebarNavItemMobile } from '../sidebar/SidebarNavItemMobile';
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
import { Sheet, SheetContent } from '../ui/sheet';
import { useMemo } from 'react';

interface SidebarMobileProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Versión Mobile del Sidebar
 * Sidebar más estrecho, con toggle, texto más pequeño
 * Cambia según la sección activa
 */
export function SidebarMobile({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate,
  isOpen = false,
  onClose
}: SidebarMobileProps) {
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (onClose) {
      onClose();
    }
  };

  // Calcular el ancho del sidebar basado en el texto más largo + padding + icono + 3px
  // Cálculo más preciso y ajustado
  const sidebarWidth = useMemo(() => {
    // Textos de todas las secciones
    const allLabels = [
      'Resumen', 'Calendario', 'Tareas', 'Mapa', 'Mensajes', 'Favoritos',
      'Facturas', 'Proformas', 'Presupuestos', 'Rectificativas', 'Gastos', 'Compras',
      'Clientes', 'Proveedores',
      'Categorías', 'Productos', 'Servicios', 'Inventario', 'Almacén',
      'Plantilla', 'Técnicos', 'Nóminas', 'Documentación',
      'Datos', 'Plantillas', 'Impuestos', 'Cuentas', 'Contabilidad', 'Analítica', 'Tesorería'
    ];
    
    // Encontrar el texto más largo
    const longestLabel = allLabels.reduce((a, b) => a.length > b.length ? a : b);
    
    // Calcular ancho de forma más precisa y ajustada:
    // Font: 12px medium, en fuente SUSE cada carácter es aproximadamente 6.2px (más ajustado)
    const textWidth = longestLabel.length * 6.2;
    const iconWidth = 16; // Icono
    const gap = 8; // Gap entre icono y texto
    const itemPaddingLeft = 8; // padding izquierdo del item (reducido de 10px)
    const itemPaddingRight = 8; // padding derecho del item (reducido de 10px)
    const sidebarPaddingLeft = 8; // padding izquierdo del sidebar
    const sidebarPaddingRight = 8; // padding derecho del sidebar
    const extra = 3; // 3px extra como solicitó el usuario
    
    // Total: texto + icono + gap + padding del item + padding del sidebar + extra
    // Cálculo más ajustado: solo el ancho del contenido + 3px
    return Math.ceil(textWidth + iconWidth + gap + itemPaddingLeft + itemPaddingRight + sidebarPaddingLeft + sidebarPaddingRight + extra);
  }, []);

  // Sidebar content based on current section
  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'inicio':
        return (
          <div className="space-y-0.5">
            <SidebarNavItemMobile
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/'}
              onClick={() => handleNavClick('/')}
            />
            <SidebarNavItemMobile
              label="Calendario"
              icon={Calendar}
              isActive={currentPath === '/calendario'}
              onClick={() => handleNavClick('/calendario')}
            />
            <SidebarNavItemMobile
              label="Tareas"
              icon={CheckSquare}
              isActive={currentPath === '/tareas'}
              onClick={() => handleNavClick('/tareas')}
            />
            <SidebarNavItemMobile
              label="Mapa"
              icon={MapPin}
              isActive={currentPath === '/mapa'}
              onClick={() => handleNavClick('/mapa')}
            />
            <SidebarNavItemMobile
              label="Mensajes"
              icon={MessageSquare}
              isActive={currentPath === '/mensajes'}
              onClick={() => handleNavClick('/mensajes')}
            />
            <SidebarNavItemMobile
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
            <SidebarNavItemMobile
              label="Facturas"
              icon={Receipt}
              isActive={currentPath === '/facturacion/facturas'}
              onClick={() => handleNavClick('/facturacion/facturas')}
            />
            <SidebarNavItemMobile
              label="Proformas"
              icon={FileText}
              isActive={currentPath === '/facturacion/proformas'}
              onClick={() => handleNavClick('/facturacion/proformas')}
            />
            <SidebarNavItemMobile
              label="Presupuestos"
              icon={FileSpreadsheet}
              isActive={currentPath === '/facturacion/presupuestos'}
              onClick={() => handleNavClick('/facturacion/presupuestos')}
            />
            <SidebarNavItemMobile
              label="Rectificativas"
              icon={FileBarChart}
              isActive={currentPath === '/facturacion/rectificativas'}
              onClick={() => handleNavClick('/facturacion/rectificativas')}
            />
            <SidebarNavItemMobile
              label="Gastos"
              icon={TrendingDown}
              isActive={currentPath === '/facturacion/gastos'}
              onClick={() => handleNavClick('/facturacion/gastos')}
            />
            <SidebarNavItemMobile
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
            <SidebarNavItemMobile
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/proyectos'}
              onClick={() => handleNavClick('/proyectos')}
            />
            <SidebarNavItemMobile
              label="Calendario"
              icon={Calendar}
              isActive={currentPath === '/proyectos/calendario'}
              onClick={() => handleNavClick('/proyectos/calendario')}
            />
            <SidebarNavItemMobile
              label="Tareas"
              icon={CheckSquare}
              isActive={currentPath === '/proyectos/tareas'}
              onClick={() => handleNavClick('/proyectos/tareas')}
            />
            <SidebarNavItemMobile
              label="Clientes"
              icon={Users}
              isActive={currentPath === '/proyectos/clientes'}
              onClick={() => handleNavClick('/proyectos/clientes')}
            />
            <SidebarNavItemMobile
              label="Proyectos"
              icon={FolderKanban}
              isActive={currentPath === '/proyectos/listado'}
              onClick={() => handleNavClick('/proyectos/listado')}
            />
            <SidebarNavItemMobile
              label="Proveedores"
              icon={Briefcase}
              isActive={currentPath === '/proyectos/proveedores'}
              onClick={() => handleNavClick('/proyectos/proveedores')}
            />
            <SidebarNavItemMobile
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
            <SidebarNavItemMobile
              label="Resumen"
              icon={LayoutDashboard}
              isActive={currentPath === '/productos'}
              onClick={() => handleNavClick('/productos')}
            />
            <SidebarNavItemMobile
              label="Categorías"
              icon={Grid3x3}
              isActive={currentPath === '/productos/categorias'}
              onClick={() => handleNavClick('/productos/categorias')}
            />
            <SidebarNavItemMobile
              label="Productos"
              icon={Package}
              isActive={currentPath === '/productos/listado'}
              onClick={() => handleNavClick('/productos/listado')}
            />
            <SidebarNavItemMobile
              label="Servicios"
              icon={Briefcase}
              isActive={currentPath === '/productos/servicios'}
              onClick={() => handleNavClick('/productos/servicios')}
            />
            <SidebarNavItemMobile
              label="Inventario"
              icon={Box}
              isActive={currentPath === '/productos/inventario'}
              onClick={() => handleNavClick('/productos/inventario')}
            />
            <SidebarNavItemMobile
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
            <SidebarNavItemMobile
              label="Plantilla"
              icon={Users}
              isActive={currentPath === '/rrhh/plantilla'}
              onClick={() => handleNavClick('/rrhh/plantilla')}
            />
            <SidebarNavItemMobile
              label="Técnicos"
              icon={UserCog}
              isActive={currentPath === '/rrhh/tecnicos'}
              onClick={() => handleNavClick('/rrhh/tecnicos')}
            />
            <SidebarNavItemMobile
              label="Nóminas"
              icon={DollarSign}
              isActive={currentPath === '/rrhh/nominas'}
              onClick={() => handleNavClick('/rrhh/nominas')}
            />
            <SidebarNavItemMobile
              label="Documentación"
              icon={FileText}
              isActive={currentPath === '/rrhh/documentacion'}
              onClick={() => handleNavClick('/rrhh/documentacion')}
            />
            <SidebarNavItemMobile
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
            <SidebarNavItemMobile
              label="Datos"
              icon={Building2}
              isActive={currentPath === '/empresa/datos'}
              onClick={() => handleNavClick('/empresa/datos')}
            />
            <SidebarNavItemMobile
              label="Plantillas"
              icon={FileText}
              isActive={currentPath === '/empresa/plantillas'}
              onClick={() => handleNavClick('/empresa/plantillas')}
            />
            <SidebarNavItemMobile
              label="Impuestos"
              icon={Calculator}
              isActive={currentPath === '/empresa/impuestos'}
              onClick={() => handleNavClick('/empresa/impuestos')}
            />
            <SidebarNavItemMobile
              label="Cuentas"
              icon={CreditCard}
              isActive={currentPath === '/empresa/cuentas'}
              onClick={() => handleNavClick('/empresa/cuentas')}
            />
            <SidebarNavItemMobile
              label="Contabilidad"
              icon={FileSpreadsheet}
              isActive={currentPath === '/empresa/contabilidad'}
              onClick={() => handleNavClick('/empresa/contabilidad')}
            />
            <SidebarNavItemMobile
              label="Analítica"
              icon={PieChart}
              isActive={currentPath === '/empresa/analitica'}
              onClick={() => handleNavClick('/empresa/analitica')}
            />
            <SidebarNavItemMobile
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="p-0"
        style={{
          width: `${sidebarWidth}px`,
          backgroundColor: 'var(--background-sidebar)',
          borderRight: '1px solid var(--border-soft)',
          zIndex: 1001, // Menor que el navbar inferior (1002) pero mayor que el overlay (50)
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="py-3 flex items-center justify-center gap-1.5" style={{ 
            borderBottom: '1px solid var(--border-soft)',
            paddingLeft: '8px',
            paddingRight: '8px',
            color: 'var(--foreground)',
          }}>
            <Logo variant="icon" animated={false} className="w-5 h-5" />
            <div className="flex items-baseline gap-[0.1em]">
              <span className="text-xs tracking-[0.1em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
              <span className="text-xs tracking-[0.1em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-3" style={{
            paddingLeft: '8px',
            paddingRight: '8px',
          }}>
            {renderSidebarContent()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
