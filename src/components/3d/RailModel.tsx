import React, { useMemo } from 'react';
import { Mesh } from 'three';
import { Rail, MATERIALS } from '../../types/rail';
import { StraightRail } from './rails/StraightRail';

import { CurvedRail } from './rails/CurvedRail';
import { RainbowRail } from './rails/RainbowRail';

interface RailModelProps {
  rail: Rail;
  isSelected: boolean;
}

export const RailModel: React.FC<RailModelProps> = ({
  rail,
  isSelected,
}) => {
  const materialProps = useMemo(() => {
    const mat = MATERIALS[rail.material];
    return {
      color: mat.color,
      metalness: mat.metalness,
      roughness: mat.roughness,
    };
  }, [rail.material]);

  const renderRail = () => {
    const commonProps = {
      config: rail.config,
      materialProps,
      position: rail.position,
      isSelected,
    };

    switch (rail.type) {
      case 'straight':
        return <StraightRail {...commonProps} />;
      case 'curved':
        return <CurvedRail {...commonProps} />;
      case 'rainbow':
        return <RainbowRail {...commonProps} />;
      default:
        return <StraightRail {...commonProps} />;
    }
  };

  return (
    <group position={rail.position}>
      {renderRail()}
      {isSelected && (
        <mesh position={[0, -0.05, 0]}>
          <planeGeometry args={[rail.config.length + 1, rail.config.length + 1]} />
          <meshBasicMaterial 
            color="hsl(var(--cad-highlight))" 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      )}
    </group>
  );
};