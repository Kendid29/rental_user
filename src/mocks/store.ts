import { Mitra, Pesanan, Unit, User } from '@/types';
import { SEED_KOTA, SEED_MITRA, SEED_PESANAN, SEED_UNITS, SEED_USERS } from './seed';

const PREFIX = 'RentalinAja:mock:v3:';
const KEY_USERS = `${PREFIX}users`;
const KEY_MITRA = `${PREFIX}mitra`;
const KEY_UNITS = `${PREFIX}units`;
const KEY_PESANAN = `${PREFIX}pesanan`;
const KEY_SESSION = `${PREFIX}session_user_id`;

class MockStore {
  private users: User[] = [...SEED_USERS];
  private mitras: Mitra[] = [...SEED_MITRA];
  private units: Unit[] = [...SEED_UNITS];
  private pesanans: Pesanan[] = [...SEED_PESANAN];
  private currentUserId: string | null = 'usr-demo-01'; // Default logged in as demo user
  private initialized = false;

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private initFromStorage(): void {
    if (!this.isBrowser() || this.initialized) return;
    this.initialized = true;

    try {
      const storedUsers = localStorage.getItem(KEY_USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        localStorage.setItem(KEY_USERS, JSON.stringify(this.users));
      }

      const storedMitra = localStorage.getItem(KEY_MITRA);
      if (storedMitra) {
        this.mitras = JSON.parse(storedMitra);
      } else {
        localStorage.setItem(KEY_MITRA, JSON.stringify(this.mitras));
      }

      const storedUnits = localStorage.getItem(KEY_UNITS);
      if (storedUnits) {
        this.units = JSON.parse(storedUnits);
      } else {
        localStorage.setItem(KEY_UNITS, JSON.stringify(this.units));
      }

      const storedPesanan = localStorage.getItem(KEY_PESANAN);
      if (storedPesanan) {
        this.pesanans = JSON.parse(storedPesanan);
      } else {
        localStorage.setItem(KEY_PESANAN, JSON.stringify(this.pesanans));
      }

      const storedSession = localStorage.getItem(KEY_SESSION);
      if (storedSession !== null) {
        this.currentUserId = storedSession ? storedSession : null;
      } else {
        localStorage.setItem(KEY_SESSION, this.currentUserId || '');
      }
    } catch (e) {
      console.warn('[MockStore] Failed to read from localStorage:', e);
    }
  }

  // Users
  getUsers(): User[] {
    this.initFromStorage();
    return this.users;
  }

  getUserById(id: string): User | undefined {
    this.initFromStorage();
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    this.initFromStorage();
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: User): void {
    this.initFromStorage();
    this.users.push(user);
    if (this.isBrowser()) {
      localStorage.setItem(KEY_USERS, JSON.stringify(this.users));
    }
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    this.initFromStorage();
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...updates };
    if (this.isBrowser()) {
      localStorage.setItem(KEY_USERS, JSON.stringify(this.users));
    }
    return this.users[idx];
  }

  // Session
  getCurrentUser(): User | null {
    this.initFromStorage();
    if (!this.currentUserId) return null;
    return this.getUserById(this.currentUserId) || null;
  }

  setCurrentUser(user: User | null): void {
    this.initFromStorage();
    this.currentUserId = user ? user.id : null;
    if (this.isBrowser()) {
      localStorage.setItem(KEY_SESSION, this.currentUserId || '');
    }
  }

  // Mitra
  getMitras(): Mitra[] {
    this.initFromStorage();
    return this.mitras;
  }

  // Kota
  getCities(): string[] {
    return [...SEED_KOTA];
  }

  getMitraById(id: string): Mitra | undefined {
    this.initFromStorage();
    return this.mitras.find((m) => m.id === id);
  }

  // Units
  getUnits(): Unit[] {
    this.initFromStorage();
    return this.units;
  }

  getUnitById(id: string): Unit | undefined {
    this.initFromStorage();
    return this.units.find((u) => u.id === id);
  }

  // Pesanan
  getPesanans(): Pesanan[] {
    this.initFromStorage();
    return this.pesanans;
  }

  getPesananById(id: string): Pesanan | undefined {
    this.initFromStorage();
    return this.pesanans.find((p) => p.id === id);
  }

  addPesanan(pesanan: Pesanan): void {
    this.initFromStorage();
    this.pesanans.unshift(pesanan);
    if (this.isBrowser()) {
      localStorage.setItem(KEY_PESANAN, JSON.stringify(this.pesanans));
    }
  }

  updatePesananStatus(id: string, status: Pesanan['status']): Pesanan | undefined {
    this.initFromStorage();
    const idx = this.pesanans.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.pesanans[idx] = { ...this.pesanans[idx], status };
    if (this.isBrowser()) {
      localStorage.setItem(KEY_PESANAN, JSON.stringify(this.pesanans));
    }
    return this.pesanans[idx];
  }

  // Reset
  resetStore(): void {
    this.users = [...SEED_USERS];
    this.mitras = [...SEED_MITRA];
    this.units = [...SEED_UNITS];
    this.pesanans = [...SEED_PESANAN];
    this.currentUserId = 'usr-demo-01';
    if (this.isBrowser()) {
      localStorage.setItem(KEY_USERS, JSON.stringify(this.users));
      localStorage.setItem(KEY_MITRA, JSON.stringify(this.mitras));
      localStorage.setItem(KEY_UNITS, JSON.stringify(this.units));
      localStorage.setItem(KEY_PESANAN, JSON.stringify(this.pesanans));
      localStorage.setItem(KEY_SESSION, this.currentUserId);
    }
  }
}

export const mockStore = new MockStore();
