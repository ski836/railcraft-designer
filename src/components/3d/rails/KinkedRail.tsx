import React from 'react';
import { RailConfig } from '../../../types/rail';

interface KinkedRailProps {
  config: RailConfig;
  materialProps: {
    color: string;
    metalness: number;
    roughness: number;
  };
  position: [number, number, number];
  isSelected: boolean;
}

export const KinkedRail: React.FC<KinkedRailProps> = ({
  config,
  materialProps,
}) => {
  const segments = config.segments || 2;
  const segmentLength = config.length / segments;
  
  // Create kink angles
  const angles = Array.from({ length: segments }, (_, i) => {
    return (i % 2 === 0 ? 1 : -1) * 0.2; // Alternate angles
  });

  const supportPositions = Array.from({ length: config.supports }, (_, i) => {
    const spacing = config.length / (config.supports - 1);
    return -config.length / 2 + i * spacing;
  });

  // Calculate height variation for supports
  const getHeightAtPosition = (x: number) => {
    const normalizedX = (x + config.length / 2) / config.length;
    const segmentIndex = Math.floor(normalizedX * segments);
    const segmentProgress = (normalizedX * segments) % 1;
    
    if (segmentIndex < segments - 1) {
      const angle1 = angles[segmentIndex];
      const angle2 = angles[segmentIndex + 1];
      const interpolatedAngle = angle1 + (angle2 - angle1) * segmentProgress;
      return config.height + Math.sin(interpolatedAngle) * 0.2;
    }
    
    return config.height;
  };

  return (
    <group>
      {/* Rail segments */}
      {Array.from({ length: segments }, (_, i) => {
        const x = -config.length / 2 + (i + 0.5) * segmentLength;
        const angle = angles[i];
        const heightOffset = Math.sin(angle) * 0.2;
        
        return (
          <mesh 
            key={i}
            position={[x, config.height + heightOffset, 0]} 
            rotation={[0, 0, angle]}
            castShadow
          >
            <boxGeometry args={[segmentLength * 0.9, 0.08, 0.15]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      })}
      
      {/* Support posts with varying heights */}
      {supportPositions.map((x, i) => {
        const supportHeight = getHeightAtPosition(x);
        
        return (
          <group key={i} position={[x, 0, 0]}>
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