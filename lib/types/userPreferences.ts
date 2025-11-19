/**
 * Tipos para las preferencias del usuario
 * Preparado para integración con backend
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  // Más preferencias que se pueden añadir en el futuro:
  // accentColor?: string;
  // fontSize?: 'small' | 'medium' | 'large';
  // language?: string;
  // notifications?: NotificationPreferences;
  // sidebarCollapsed?: boolean;
}

/**
 * Función para obtener las preferencias del usuario desde el backend
 * TODO: Implementar cuando tengamos el backend
 */
export async function fetchUserPreferences(): Promise<UserPreferences | null> {
  // Por ahora retorna null, se implementará cuando tengamos backend
  // try {
  //   const response = await fetch('/api/user/preferences');
  //   if (!response.ok) throw new Error('Failed to fetch preferences');
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error fetching user preferences:', error);
  //   return null;
  // }
  return null;
}

/**
 * Función para guardar las preferencias del usuario en el backend
 * TODO: Implementar cuando tengamos el backend
 */
export async function saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
  // Por ahora retorna false, se implementará cuando tengamos backend
  // try {
  //   const response = await fetch('/api/user/preferences', {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(preferences),
  //   });
  //   return response.ok;
  // } catch (error) {
  //   console.error('Error saving user preferences:', error);
  //   return false;
  // }
  return false;
}

