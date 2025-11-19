"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SidebarDesktop } from "./desktop";
import { SidebarTabletHorizontal } from "./tablet-horizontal";
import { SidebarTablet } from "./tablet";
import { SidebarMobile } from "./mobile";

interface SidebarProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar principal que renderiza la versión apropiada según el breakpoint
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Sidebar({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange,
  isOpen,
  onClose
}: SidebarProps) {
  const breakpoint = useBreakpoint();

  return (
    <>
      {breakpoint === "desktop" && (
        <SidebarDesktop
          className={className}
          currentPath={currentPath}
          onNavigate={onNavigate}
          onCollapseChange={onCollapseChange}
        />
      )}
      {breakpoint === "tablet" && (
        <SidebarTabletHorizontal
          className={className}
          currentPath={currentPath}
          onNavigate={onNavigate}
          onCollapseChange={onCollapseChange}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {breakpoint === "tablet-portrait" && (
        <SidebarTablet
          className={className}
          currentPath={currentPath}
          onNavigate={onNavigate}
          onCollapseChange={onCollapseChange}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {breakpoint === "mobile" && (
        <SidebarMobile
          className={className}
          currentPath={currentPath}
          onNavigate={onNavigate}
          onCollapseChange={onCollapseChange}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </>
  );
}

