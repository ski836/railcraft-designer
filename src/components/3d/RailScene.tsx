import React from 'react';
import { RailModel } from './RailModel';
import { Rail } from '../../types/rail';

interface RailSceneProps {
  rails: Rail[];
  selectedRail?: string;
}

export const RailScene: React.FC<RailSceneProps> = ({
  rails,
  selectedRail,
}) => {
  return (
    <>
      {rails.map((rail) => (
        <RailModel
          key={rail.id}
          rail={rail}
          isSelected={rail.id === selectedRail}
        />
      ))}
    </>
  );
};