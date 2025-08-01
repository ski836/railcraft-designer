import React from 'react';
import { Button } from './button';
import { RailType } from '../../types/rail';
import { 
  Minus, 
  TrendingUp, 
  Waves, 
  Rainbow,
  Move3D,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react';

interface ToolbarProps {
  selectedRailType: RailType;
  onRailTypeChange: (type: RailType) => void;
  transformMode: 'select' | 'move' | 'rotate';
  onTransformModeChange: (mode: 'select' | 'move' | 'rotate') => void;
  onAddRail: () => void;
  onDuplicateRail: () => void;
  onDeleteRail: () => void;
  canDelete: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedRailType,
  onRailTypeChange,
  transformMode,
  onTransformModeChange,
  onAddRail,
  onDuplicateRail,
  onDeleteRail,
  canDelete,
}) => {
  const railTools = [
    { type: 'straight' as RailType, icon: Minus, label: 'Straight Rail' },
    { type: 'curved' as RailType, icon: Waves, label: 'S-Curved Rail' },
    { type: 'rainbow' as RailType, icon: Rainbow, label: 'Rainbow Rail' },
  ];

  const transformTools = [
    { mode: 'move' as const, icon: Move3D, label: 'Move Tool', action: () => onTransformModeChange('move') },
    { mode: 'rotate' as const, icon: RotateCcw, label: 'Rotate Tool', action: () => onTransformModeChange('rotate') },
    { mode: null, icon: Copy, label: 'Duplicate Rail', action: onDuplicateRail },
    { mode: null, icon: Trash2, label: 'Delete Rail', action: onDeleteRail, disabled: !canDelete },
  ];

  return (
    <div className="flex flex-col p-2 space-y-1">
      {/* Rail Type Tools */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground px-1 mb-2">Rails</div>
        {railTools.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant={selectedRailType === type ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 p-0"
            onClick={() => onRailTypeChange(type)}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-cad-panel-border my-3" />

      {/* Transform Tools */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground px-1 mb-2">Tools</div>
        {transformTools.map(({ mode, icon: Icon, label, action, disabled }) => (
          <Button
            key={label}
            variant={mode && transformMode === mode ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 p-0"
            onClick={action}
            title={label}
            disabled={disabled}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {/* Add Rail Button */}
      <div className="mt-4 px-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={onAddRail}
          title="Add New Rail"
        >
          + Rail
        </Button>
      </div>
    </div>
  );
};