import React from 'react';
import { RailConfig } from '../../../types/rail';
import * as THREE from 'three';

interface RainbowRailProps {
  config: RailConfig;
  materialProps: {
    color: string;
    metalness: number;
    roughness: number;
  };
  position: [number, number, number];
  isSelected: boolean;
}

export const RainbowRail: React.FC<RainbowRailProps> = ({
  config,
  materialProps,
}) => {
  const radius = config.radius || 2;
  const arcHeight = radius * 0.8;
  
  // Create a smooth arc curve
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-config.length / 2, config.height, 0),
    new THREE.Vector3(0, config.height + arcHeight, 0),
    new THREE.Vector3(config.length / 2, config.height, 0)
  );

  const points = curve.getPoints(100);
  const geometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    100,
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
      {/* Rainbow arc rail */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Support posts with varying heights */}
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
            
            {/* Additional arc support struts for rainbow */}
            {i > 0 && i < config.supports - 1 && (
              <mesh 
                position={[0, supportHeight * 0.75, 0]} 
                rotation={[0, 0, Math.PI / 4]}
                castShadow
              >
                <boxGeometry args={[0.06, supportHeight * 0.3, 0.06]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};