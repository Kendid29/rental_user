import { ApiInterface } from '@/api/endpoints';
import * as auth from './auth';
import * as kota from './kota';
import * as mitra from './mitra';
import * as unit from './unit';
import * as pesanan from './pesanan';
import * as profil from './profil';

export const mockApi: ApiInterface = {
  auth,
  kota,
  mitra,
  unit,
  pesanan,
  profil,
};

export { _updatePesananStatus } from './pesanan';
