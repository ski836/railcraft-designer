import React from 'react';
import { RailModel } from './RailModel';
import { Rail } from '../../types/rail';

interface RailSceneProps {
  rails: Rail[];
  selectedRail?: string;
  onRailSelect: (railId: string) => void;
  transformMode: 'select' | 'move' | 'rotate';
  onRailPositionChange: (railId: string, position: [number, number, number]) => void;
  onRailRotationChange: (railId: string, rotation: [number, number, number]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const RailScene: React.FC<RailSceneProps> = ({
  rails,
  selectedRail,
  onRailSelect,
  transformMode,
  onRailPositionChange,
  onRailRotationChange,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <>
      {rails.map((rail) => (
        <RailModel
          key={rail.id}
          rail={rail}
          isSelected={rail.id === selectedRail}
          onSelect={() => onRailSelect(rail.id)}
          transformMode={transformMode}
          onPositionChange={(position) => onRailPositionChange(rail.id, position)}
          onRotationChange={(rotation) => onRailRotationChange(rail.id, rotation)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </>
  );
};