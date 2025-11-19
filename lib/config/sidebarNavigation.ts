import { 
  LayoutDashboard, 
  Calendar,
  Users,
  FolderKanban,
  Truck,
  ShoppingCart,
  Receipt,
  Package,
  Wallet,
  FileText,
  Calculator,
  LucideIcon,
} from 'lucide-react';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
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
  },
  {
    label: 'Gastos',
    path: '/gastos',
    icon: ShoppingCart,
  },
  {
    label: 'Facturación',
    path: '/facturacion',
    icon: Receipt,
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: Package,
  },
  {
    label: 'Tesorería',
    path: '/tesoreria',
    icon: Wallet,
  },
  {
    label: 'Contabilidad',
    path: '/contabilidad',
    icon: FileText,
  },
  {
    label: 'Impuestos',
    path: '/impuestos',
    icon: Calculator,
  },
];

