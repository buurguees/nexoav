import { LucideIcon } from 'lucide-react';
import { CSSProperties } from 'react';

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  size?: number | string;
  style?: CSSProperties;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

/**
 * Wrapper unificado para iconos con estilo Duotone
 * Aplica el estilo duotone usando dos capas superpuestas con diferentes colores
 */
export function IconWrapper({ 
  icon: Icon, 
  className = '', 
  size = 16,
  style = {},
  primaryColor,
  secondaryColor,
  isActive = false
}: IconWrapperProps) {
  // Colores por defecto basados en el estado
  const defaultPrimary = isActive 
    ? 'var(--foreground)' 
    : primaryColor || 'var(--foreground)';
  const defaultSecondary = isActive
    ? 'var(--accent-blue-primary)'
    : secondaryColor || 'var(--accent-blue-primary)';

  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      className={`icon-duotone ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: sizeValue,
        height: sizeValue,
        ...style
      }}
    >
      {/* Capa secundaria - color de fondo con opacidad */}
      <Icon
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          color: defaultSecondary,
          strokeWidth: 2.5,
          opacity: 0.3,
        }}
      />
      {/* Capa principal - color sólido encima */}
      <Icon
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          color: defaultPrimary,
          strokeWidth: 1.5,
        }}
      />
    </span>
  );
}

