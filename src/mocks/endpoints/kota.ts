import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { mockStore } from '../store';

export async function list(): Promise<string[]> {
  await simulatedDelay();
  checkMockError('kota:list');
  return mockStore.getCities();
}
