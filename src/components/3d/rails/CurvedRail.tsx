import React from 'react';
import { RailConfig } from '../../../types/rail';
import * as THREE from 'three';

interface CurvedRailProps {
  config: RailConfig;
  materialProps: {
    color: string;
    metalness: number;
    roughness: number;
  };
  position: [number, number, number];
  isSelected: boolean;
}

export const CurvedRail: React.FC<CurvedRailProps> = ({
  config,
  materialProps,
}) => {
  // Create S-curve points
  const points: THREE.Vector3[] = [];
  const segments = 50;
  const amplitude = 1; // How wide the S-curve is
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = -config.length / 2 + t * config.length;
    // Create S-shape using sine wave
    const z = amplitude * Math.sin(t * Math.PI * 2);
    const y = config.height;
    
    points.push(new THREE.Vector3(x, y, z));
  }

  // Create the rail curve
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(
    curve,
    segments,
    0.04,
    8,
    false
  );

  // Calculate support positions along the S-curve
  const supportPositions = Array.from({ length: config.supports }, (_, i) => {
    const t = i / (config.supports - 1);
    const point = curve.getPoint(t);
    return { x: point.x, y: point.y, z: point.z };
  });

  return (
    <group>
      {/* S-curved rail */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Support posts */}
      {supportPositions.map((pos, i) => {
        const supportHeight = config.height;
        
        return (
          <group key={i} position={[pos.x, 0, pos.z]}>
            {/* Vertical post */}
            <mesh position={[0, supportHeight / 2, 0]} castShadow>
              <boxGeometry args={[0.08, supportHeight, 0.08]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            
            {/* Base plate */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.3, 0.04, 0.3]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};