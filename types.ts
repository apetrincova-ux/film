
export interface ProcessingStats {
  noiseLevel: number;
  estimatedResolution: string;
  dynamicRange: string;
  frameHealth: number;
}

export interface RestorationConfig {
  denoise: number;
  upscale: boolean;
  colorGrade: boolean;
  fpsBoost: boolean;
  sharpness: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
