import { 
  LayoutDashboard, 
  Calendar,
  Map,
  Users,
  FolderKanban,
  Truck,
  ShoppingCart,
  Receipt,
  Package,
  Wallet,
  FileText,
  Calculator,
  BarChart,
  Briefcase,
  Building2,
  LucideIcon,
} from 'lucide-react';

export interface SidebarNavSubItem {
  label: string;
  path: string;
}

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  subItems?: SidebarNavSubItem[];
}

/**
 * Configuración de navegación del Sidebar
 * Todas las opciones principales en un solo lugar
 */
export const sidebarNavigation: SidebarNavItem[] = [
  {
    label: 'Inicio',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Calendario',
    path: '/calendario',
    icon: Calendar,
  },
  {
    label: 'Mapa',
    path: '/mapa',
    icon: Map,
  },
  {
    label: 'Clientes',
    path: '/clientes',
    icon: Users,
  },
  {
    label: 'Proyectos',
    path: '/proyectos',
    icon: FolderKanban,
  },
  {
    label: 'Proveedores',
    path: '/proveedores',
    icon: Truck,
    subItems: [
      { label: 'Técnicos', path: '/proveedores/tecnicos' },
      { label: 'Materiales', path: '/proveedores/materiales' },
      { label: 'Softwares', path: '/proveedores/softwares' },
      { label: 'Externos', path: '/proveedores/externos' },
    ],
  },
  {
    label: 'Gastos',
    path: '/gastos',
    icon: ShoppingCart,
    subItems: [
      { label: 'Tickets', path: '/gastos/tickets' },
      { label: 'Categorías', path: '/gastos/categorias' },
    ],
  },
  {
    label: 'Facturación',
    path: '/facturacion',
    icon: Receipt,
    subItems: [
      { label: 'Presupuestos', path: '/facturacion/presupuestos' },
      { label: 'Proformas', path: '/facturacion/proformas' },
      { label: 'Facturas', path: '/facturacion/facturas' },
      { label: 'Rectificativas', path: '/facturacion/rectificativas' },
    ],
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: Package,
    subItems: [
      { label: 'Productos', path: '/inventario/productos' },
      { label: 'Servicios', path: '/inventario/servicios' },
    ],
  },
  {
    label: 'Tesorería',
    path: '/tesoreria',
    icon: Wallet,
    subItems: [
      { label: 'Cuentas Bancarias', path: '/tesoreria/cuentas-bancarias' },
      { label: 'Cashflow', path: '/tesoreria/cashflow' },
      { label: 'Pagos y Cobros', path: '/tesoreria/pagos-cobros' },
    ],
  },
  {
    label: 'Contabilidad',
    path: '/contabilidad',
    icon: FileText,
    subItems: [
      { label: 'Cuadro de cuentas', path: '/contabilidad/cuadro-cuentas' },
      { label: 'Balance de situación', path: '/contabilidad/balance-situacion' },
      { label: 'Activos', path: '/contabilidad/activos' },
    ],
  },
  {
    label: 'Impuestos',
    path: '/impuestos',
    icon: Calculator,
  },
  {
    label: 'Analítica',
    path: '/analitica',
    icon: BarChart,
    subItems: [
      { label: 'Informes', path: '/analitica/informes' },
      { label: 'Objetivos', path: '/analitica/objetivos' },
    ],
  },
  {
    label: 'RRHH',
    path: '/rrhh',
    icon: Briefcase,
    subItems: [
      { label: 'Nóminas', path: '/rrhh/nominas' },
      { label: 'Empleados', path: '/rrhh/empleados' },
      { label: 'Externos', path: '/rrhh/externos' },
    ],
  },
];

/**
 * Configuración de la sección "Empresa" en la parte inferior del sidebar
 * Esta sección se muestra separada del resto de la navegación
 */
export const empresaNavigation: SidebarNavItem = {
  label: 'Empresa',
  path: '/empresa',
  icon: Building2,
  subItems: [
    { label: 'Datos Fiscales', path: '/empresa/datos-fiscales' },
    { label: 'Preferencias', path: '/empresa/preferencias' },
    { label: 'Plantillas', path: '/empresa/plantillas' },
    { label: 'Conectividad', path: '/empresa/conectividad' },
    { label: 'Documentación', path: '/empresa/documentacion' },
  ],
};

