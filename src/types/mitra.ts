import { ListParams } from './common';
import { Unit } from './unit';

export interface Mitra {
  id: string;
  nama: string;
  kota: string;
  rating: number;
  jumlahUlasan: number;
  unitTersedia: number;
  isSuperPartner: boolean;
  layanan: string[];
}

export interface MitraWithUnits extends Mitra {
  units: Unit[];
}

export interface GetMitraParams extends ListParams {
  kota?: string;
}
