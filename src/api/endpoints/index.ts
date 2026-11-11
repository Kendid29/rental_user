import * as auth from './auth';
import * as kota from './kota';
import * as mitra from './mitra';
import * as unit from './unit';
import * as pesanan from './pesanan';
import * as profil from './profil';

export const realApi = {
  auth,
  kota,
  mitra,
  unit,
  pesanan,
  profil,
};

export type ApiInterface = typeof realApi;
