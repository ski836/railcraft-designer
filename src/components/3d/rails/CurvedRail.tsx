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
  const radius = config.radius || 2;
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-config.length / 2, config.height, 0),
    new THREE.Vector3(0, config.height + radius, 0),
    new THREE.Vector3(config.length / 2, config.height, 0)
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    50,
    0.04,
    8,
    false
  );

  const supportPositions = Array.from({ length: config.supports }, (_, i) => {
    const t = i / (config.supports - 1);
    const point = curve.getPoint(t);
    return { x: point.x, y: point.y, z: point.z };
  });

  return (
    <group>
      {/* Curved rail */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Support posts */}
      {supportPositions.map((pos, i) => {
        const supportHeight = pos.y;
        
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