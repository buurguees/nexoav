"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { HeaderDesktop } from "./desktop";
import { HeaderTabletHorizontal } from "./tablet-horizontal";
import { HeaderTablet } from "./tablet";
import { HeaderMobile } from "./mobile";

interface HeaderProps {
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Header principal que renderiza la versión apropiada según el breakpoint
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Header({ 
  notificationCount = 0,
  onMenuClick
}: HeaderProps) {
  const breakpoint = useBreakpoint();

  return (
    <>
      {breakpoint === "desktop" && (
        <HeaderDesktop
          notificationCount={notificationCount}
        />
      )}
      {breakpoint === "tablet" && (
        <HeaderTabletHorizontal
          notificationCount={notificationCount}
          onMenuClick={onMenuClick}
        />
      )}
      {breakpoint === "tablet-portrait" && (
        <HeaderTablet
          notificationCount={notificationCount}
          onMenuClick={onMenuClick}
        />
      )}
      {breakpoint === "mobile" && (
        <HeaderMobile
          notificationCount={notificationCount}
          onMenuClick={onMenuClick}
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

