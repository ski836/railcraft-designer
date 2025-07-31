import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Material, MATERIALS } from '../../types/rail';

interface MaterialsPanelProps {
  selectedMaterial: Material;
  onMaterialChange: (material: Material) => void;
}

export const MaterialsPanel: React.FC<MaterialsPanelProps> = ({
  selectedMaterial,
  onMaterialChange,
}) => {
  return (
    <Card className="border-cad-panel-border bg-cad-panel/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground">Materials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(MATERIALS).map(([key, material]) => (
          <Button
            key={key}
            variant={selectedMaterial === key ? "default" : "ghost"}
            className="w-full justify-start h-auto p-3"
            onClick={() => onMaterialChange(key as Material)}
          >
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{material.name}</span>
                <Badge variant="secondary" className="text-xs">
                  ${material.price}/m
                </Badge>
              </div>
              <div className="flex items-center mt-1 space-x-2">
                <div 
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: material.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {material.metalness > 0.5 ? 'Metal' : 'Composite'}
                </span>
              </div>
            </div>
          </Button>
        ))}
        
        <div className="pt-3 border-t border-cad-panel-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• PVC/Wood: Lightweight, affordable</div>
            <div>• Steel: Durable, professional grade</div>
            <div>• Aluminum: Corrosion resistant</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};