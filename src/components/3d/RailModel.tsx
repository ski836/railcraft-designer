import React, { useMemo, useRef, useEffect } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Rail, MATERIALS } from '../../types/rail';
import { StraightRail } from './rails/StraightRail';
import { CurvedRail } from './rails/CurvedRail';
import { RainbowRail } from './rails/RainbowRail';

interface RailModelProps {
  rail: Rail;
  isSelected: boolean;
  onSelect: () => void;
  transformMode: 'select' | 'move' | 'rotate';
  onPositionChange: (position: [number, number, number]) => void;
  onRotationChange: (rotation: [number, number, number]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const RailModel: React.FC<RailModelProps> = ({
  rail,
  isSelected,
  onSelect,
  transformMode,
  onPositionChange,
  onRotationChange,
  onDragStart,
  onDragEnd,
}) => {
  const groupRef = useRef<any>();
  const { camera, raycaster, pointer } = useThree();
  const isDragging = useRef(false);
  const dragPlane = useRef(new Vector3());
  const materialProps = useMemo(() => {
    const mat = MATERIALS[rail.material];
    return {
      color: mat.color,
      metalness: mat.metalness,
      roughness: mat.roughness,
    };
  }, [rail.material]);

  // Handle keyboard input for rotation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isSelected) return;
      
      if (e.key === 'r' || e.key === 'R') {
        const newRotation: [number, number, number] = [
          rail.rotation?.[0] || 0,
          (rail.rotation?.[1] || 0) + Math.PI / 4,
          rail.rotation?.[2] || 0
        ];
        onRotationChange(newRotation);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSelected, rail.rotation, onRotationChange]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect();
    
    if (transformMode === 'move' && isSelected) {
      isDragging.current = true;
      dragPlane.current.copy(rail.position as any);
      onDragStart();
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current || transformMode !== 'move' || !isSelected) return;
    
    const intersectPoint = e.intersections[0]?.point;
    if (intersectPoint) {
      onPositionChange([intersectPoint.x, rail.position[1], intersectPoint.z]);
    }
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      onDragEnd();
    }
    isDragging.current = false;
  };

  const renderRail = () => {
    const commonProps = {
      config: rail.config,
      materialProps,
      position: [0, 0, 0] as [number, number, number], // Position handled by group
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
    <group 
      ref={groupRef}
      position={rail.position}
      rotation={rail.rotation || [0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Invisible interaction plane for easier selection */}
      <mesh position={[0, 0.1, 0]} visible={false}>
        <planeGeometry args={[rail.config.length + 2, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {renderRail()}
      
      {/* Selection indicator */}
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
      
      {/* Transform mode indicators */}
      {isSelected && transformMode === 'move' && (
        <mesh position={[0, rail.config.height + 0.5, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
      
      {isSelected && transformMode === 'rotate' && (
        <mesh position={[0, rail.config.height + 0.5, 0]}>
          <torusGeometry args={[0.2, 0.05]} />
          <meshBasicMaterial color="#ff8800" />
        </mesh>
      )}
    </group>
  );
};