import { saveToCassette, readFromCassette, generateHash } from '../../apps/web/lib/cassette-store';

export class Anchor8CassetteInterceptor {
  private isOffline: boolean = false;
  private isRecording: boolean = true;

  setMode(offline: boolean) {
    this.isOffline = offline;
  }

  setRecording(recording: boolean) {
    this.isRecording = recording;
  }

  async intercept(operation: string, requestPayload: any, next: () => Promise<any>): Promise<any> {
    const hashPayload = { operation, ...requestPayload };
    const hash = await generateHash(hashPayload);

    if (this.isOffline) {
      console.log(`[Cassette Mode] Intercepting ${operation} (Offline mode active)`);
      const cached = await readFromCassette(hash);
      if (cached) {
        console.log(`[Cassette Mode] Returning cached response for ${operation}`);
        return cached;
      }
      console.warn(`[Cassette Mode] No cassette found for ${operation}, simulating degraded response.`);
      return { status: 'DEGRADED', reason: 'No offline cassette found' };
    }

    // Online Mode
    const response = await next();

    if (this.isRecording) {
      console.log(`[Cassette Mode] Recording response for ${operation}`);
      await saveToCassette(hash, response).catch(e => console.error("Cassette save failed", e));
    }

    return response;
  }
}

export const globalCassette = new Anchor8CassetteInterceptor();
