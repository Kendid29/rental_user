export interface User {
  id: string;
  nama: string;
  email: string;
  nomorWA: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  kataSandi: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  nama: string;
  email: string;
  nomorWA: string;
  kataSandi: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface UpdateProfilRequest {
  nama: string;
  nomorWA: string;
}

export interface UbahSandiRequest {
  kataSandiLama: string;
  kataSandiBaru: string;
  konfirmasiKataSandi: string;
}
