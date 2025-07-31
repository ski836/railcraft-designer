import React from 'react';
import { RailConfig } from '../../../types/rail';

interface StraightRailProps {
  config: RailConfig;
  materialProps: {
    color: string;
    metalness: number;
    roughness: number;
  };
  position: [number, number, number];
  isSelected: boolean;
}

export const StraightRail: React.FC<StraightRailProps> = ({
  config,
  materialProps,
}) => {
  const supportPositions = Array.from({ length: config.supports }, (_, i) => {
    const spacing = config.length / (config.supports - 1);
    return -config.length / 2 + i * spacing;
  });

  return (
    <group>
      {/* Main rail bar */}
      <mesh position={[0, config.height, 0]} castShadow>
        <boxGeometry args={[config.length, 0.08, 0.15]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Support posts */}
      {supportPositions.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Vertical post */}
          <mesh position={[0, config.height / 2, 0]} castShadow>
            <boxGeometry args={[0.08, config.height, 0.08]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          
          {/* Base plate */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>
      ))}
    </group>
  );
};