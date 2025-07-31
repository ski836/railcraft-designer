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
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedRailType,
  onRailTypeChange,
}) => {
  const railTools = [
    { type: 'straight' as RailType, icon: Minus, label: 'Straight Rail' },
    { type: 'kinked' as RailType, icon: TrendingUp, label: 'Kinked Rail' },
    { type: 'curved' as RailType, icon: Waves, label: 'Curved Rail' },
    { type: 'rainbow' as RailType, icon: Rainbow, label: 'Rainbow Rail' },
  ];

  const transformTools = [
    { icon: Move3D, label: 'Move' },
    { icon: RotateCcw, label: 'Rotate' },
    { icon: Copy, label: 'Duplicate' },
    { icon: Trash2, label: 'Delete' },
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
        {transformTools.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0"
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </div>
  );
};