// Configuração do FaceIO para verificação facial
declare global {
  interface Window {
    faceIO: any;
  }
}

export interface FaceIOOptions {
  locale?: string;
  userConsent?: boolean;
  facioIdExternalDatabaseID?: string;
  permissionTimeout?: number;
}

export class FaceIOManager {
  private faceio: any;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeFaceIO();
    }
  }

  private async initializeFaceIO() {
    try {
      // Carregar script do FaceIO se não estiver carregado
      if (!window.faceIO) {
        await this.loadFaceIOScript();
      }

      const publicKey = process.env.NEXT_PUBLIC_FACEIO_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('FACEIO_PUBLIC_KEY não configurada');
      }

      this.faceio = new window.faceIO(publicKey);
      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar FaceIO:', error);
    }
  }

  private loadFaceIOScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.faceio.net/fio.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar FaceIO SDK'));
      document.head.appendChild(script);
    });
  }

  async enroll(options?: FaceIOOptions): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('FaceIO não inicializado');
    }

    try {
      const response = await this.faceio.enroll({
        locale: 'pt',
        userConsent: true,
        ...options
      });
      return response.facialId;
    } catch (error) {
      console.error('Erro no enrollment facial:', error);
      throw error;
    }
  }

  async authenticate(facialId?: string): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('FaceIO não inicializado');
    }

    try {
      const response = await this.faceio.authenticate({
        locale: 'pt',
        ...(facialId && { facioIdExternalDatabaseID: facialId })
      });
      return response.facialId;
    } catch (error) {
      console.error('Erro na autenticação facial:', error);
      throw error;
    }
  }
}

export const faceIOManager = new FaceIOManager();
