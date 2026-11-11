/**
 * Simulasi delay acak 300-800 ms untuk replikasi latensi jaringan nyata
 */
export async function simulatedDelay(min = 300, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
