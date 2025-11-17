import { motion, AnimatePresence } from 'motion/react';
import { HeaderNavItem } from '../header/HeaderNavItem';
import { HeaderSearch } from '../header/HeaderSearch';
import { HeaderActions } from '../header/HeaderActions';
import { HeaderSection } from '../Header';
import { Search, X } from 'lucide-react';
import { IconWrapper } from '../icons/IconWrapper';
import { useState, useEffect, useRef } from 'react';

interface HeaderDesktopProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
}

/**
 * Versión Desktop del Header (versión original)
 * Esta es la versión por defecto y original del diseño
 */
export function HeaderDesktop({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0
}: HeaderDesktopProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shouldShiftNav, setShouldShiftNav] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const sections: Array<{ id: HeaderSection; label: string }> = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'facturacion', label: 'Facturación' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'productos', label: 'Productos' },
    { id: 'rrhh', label: 'RRHH' },
    { id: 'empresa', label: 'Empresa' },
  ];

  const handleSectionClick = (section: HeaderSection) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  // Calcular si el buscador expandido se solapa con la navegación
  useEffect(() => {
    if (!isSearchOpen || !navRef.current || !searchContainerRef.current) {
      setShouldShiftNav(false);
      return;
    }

    const checkOverlap = () => {
      const navRect = navRef.current?.getBoundingClientRect();
      const searchContainerRect = searchContainerRef.current?.getBoundingClientRect();
      
      if (!navRect || !searchContainerRect) {
        setShouldShiftNav(false);
        return;
      }

      // Buscar el input del buscador dentro del contenedor
      if (!searchContainerRef.current) {
        setShouldShiftNav(false);
        return;
      }
      
      const searchInput = searchContainerRef.current.querySelector('input');
      if (!searchInput) {
        setShouldShiftNav(false);
        return;
      }

      const searchInputRect = searchInput.getBoundingClientRect();
      
      // Calcular la posición real del buscador expandido
      // El buscador está dentro del contenedor, necesitamos su posición real
      const searchLeft = searchInputRect.left;
      const navRight = navRect.right;
      
      // Calcular la distancia entre el final de la navegación y el inicio del buscador
      const distance = searchLeft - navRight;
      
      // Solo desplazar si hay solapamiento real (distancia < 0) o está muy cerca (< 10px)
      // Esto significa que el buscador realmente se solapa o está a punto de solaparse con la navegación
      const hasOverlap = distance < 10;
      
      setShouldShiftNav(hasOverlap);
    };

    // Verificar después de que la animación del buscador termine
    // Usar un timeout más largo para asegurar que la animación completa
    const timeout = setTimeout(checkOverlap, 300);
    
    // También verificar en resize y cuando cambie el contenido
    window.addEventListener('resize', checkOverlap);
    
    // Verificar también cuando el DOM se actualice
    const observer = new MutationObserver(checkOverlap);
    if (searchContainerRef.current) {
      observer.observe(searchContainerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverlap);
      observer.disconnect();
    };
  }, [isSearchOpen]);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="flex items-center relative"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'var(--background-header)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 var(--spacing-2xl)',
        zIndex: 1000,
      }}
    >
      {/* Navigation Sections - Siempre centrado horizontalmente */}
      <motion.nav 
        ref={navRef}
        className="flex items-center gap-1"
        animate={{
          paddingRight: shouldShiftNav && isSearchOpen ? '200px' : '0',
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          justifyContent: 'center',
        }}
      >
        {sections.map((section) => (
          <HeaderNavItem
            key={section.id}
            label={section.label}
            isActive={currentSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </motion.nav>

      {/* Right Side Actions - Absolute positioned */}
      <div 
        ref={searchContainerRef}
        className="absolute right-6 flex items-center gap-2"
      >
        {/* Search Toggle or Search Input */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-input"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <HeaderSearch placeholder="Buscar en NEXO AV..." size="mobile" />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
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
              >
                <IconWrapper icon={X} size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg transition-colors"
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
              whileTap={{ scale: 0.95 }}
            >
              <IconWrapper icon={Search} size={20} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <HeaderActions 
          notificationCount={notificationCount}
          onNotificationClick={() => console.log('Notifications')}
          onSettingsClick={() => handleSectionClick('empresa')}
        />
      </div>
    </motion.header>
  );
}

