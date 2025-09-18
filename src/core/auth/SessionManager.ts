import { User } from '../../types';

interface Session {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: Session | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public startSession(session: Session): void {
    this.currentSession = session;
    this.scheduleTokenRefresh();
    this.persistSession(session);
  }

  public clearSession(): void {
    this.currentSession = null;
    this.clearRefreshTimeout();
    this.clearPersistedSession();
  }

  public endSession(): void {
    this.clearSession();
  }

  public getCurrentSession(): Session | null {
    if (!this.currentSession) {
      this.currentSession = this.getPersistedSession();
    }
    return this.currentSession;
  }

  public isSessionValid(): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    return Date.now() < session.expiresAt;
  }

  private scheduleTokenRefresh(): void {
    this.clearRefreshTimeout();
    
    if (!this.currentSession) return;

    const timeUntilExpiry = this.currentSession.expiresAt - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // Refresh 5 minutes before expiry

    this.refreshTimeout = setTimeout(() => {
      // Implement token refresh logic here
      this.onTokenRefreshNeeded();
    }, refreshTime);
  }

  private clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private persistSession(session: Session): void {
    localStorage.setItem('farmconnect_session', JSON.stringify(session));
  }

  private getPersistedSession(): Session | null {
    const savedSession = localStorage.getItem('farmconnect_session');
    if (!savedSession) return null;

    try {
      return JSON.parse(savedSession);
    } catch {
      return null;
    }
  }

  private clearPersistedSession(): void {
    localStorage.removeItem('farmconnect_session');
  }

  private onTokenRefreshNeeded(): void {
    // This should be implemented by the auth service to refresh the token
    const event = new CustomEvent('tokenRefreshNeeded');
    window.dispatchEvent(event);
  }
}