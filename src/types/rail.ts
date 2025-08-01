export type RailType = 'straight' | 'curved' | 'rainbow';

export type Material = 'pvc-wood' | 'steel' | 'aluminum';

export interface RailConfig {
  length: number; // in meters
  height: number; // in meters
  supports: number; // number of support posts
  radius?: number; // for curved/rainbow rails
  segments?: number; // for kinked rails
  width?: number; // rail width
}

export interface RailConnection {
  railId: string;
  endpoint: 'start' | 'end';
}

export interface Rail {
  id: string;
  type: RailType;
  material: Material;
  config: RailConfig;
  position: [number, number, number];
  rotation?: [number, number, number];
  connections?: {
    start?: RailConnection;
    end?: RailConnection;
  };
}

export interface MaterialProperties {
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  price: number; // per meter
}

export const MATERIALS: Record<Material, MaterialProperties> = {
  'pvc-wood': {
    name: 'PVC with Wood',
    color: '#D2B48C',
    metalness: 0.1,
    roughness: 0.8,
    price: 45,
  },
  'steel': {
    name: 'Steel',
    color: '#8C8C8C',
    metalness: 0.9,
    roughness: 0.1,
    price: 85,
  },
  'aluminum': {
    name: 'Aluminum',
    color: '#C0C0C0',
    metalness: 0.8,
    roughness: 0.2,
    price: 120,
  },
};

export const RAIL_TYPES: Record<RailType, { name: string; description: string; complexity: number }> = {
  'straight': {
    name: 'Straight Rail',
    description: 'Simple horizontal rail with even supports',
    complexity: 1.0,
  },
  'curved': {
    name: 'S-Curved Rail',
    description: 'Smooth S-shaped rail lying on the ground',
    complexity: 1.5,
  },
  'rainbow': {
    name: 'Rainbow Rail',
    description: 'Arched rail forming a rainbow shape',
    complexity: 1.8,
  },
};