import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Label } from './label';
import { Input } from './input';
import { Slider } from './slider';
import { RailConfig, RailType } from '../../types/rail';

interface PropertiesPanelProps {
  railConfig: RailConfig;
  onConfigChange: (config: RailConfig) => void;
  railType: RailType;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  railConfig,
  onConfigChange,
  railType,
}) => {
  const updateConfig = (key: keyof RailConfig, value: number) => {
    onConfigChange({ ...railConfig, [key]: value });
  };

  return (
    <Card className="border-cad-panel-border bg-cad-panel/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Length */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Length (meters)</Label>
          <div className="flex items-center space-x-3">
            <Slider
              value={[railConfig.length]}
              onValueChange={([value]) => updateConfig('length', value)}
              min={2}
              max={12}
              step={0.5}
              className="flex-1"
            />
            <Input
              type="number"
              value={railConfig.length}
              onChange={(e) => updateConfig('length', parseFloat(e.target.value) || 0)}
              className="w-16 h-8 text-sm"
              min={2}
              max={12}
              step={0.5}
            />
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Height (meters)</Label>
          <div className="flex items-center space-x-3">
            <Slider
              value={[railConfig.height]}
              onValueChange={([value]) => updateConfig('height', value)}
              min={0.3}
              max={2.0}
              step={0.1}
              className="flex-1"
            />
            <Input
              type="number"
              value={railConfig.height}
              onChange={(e) => updateConfig('height', parseFloat(e.target.value) || 0)}
              className="w-16 h-8 text-sm"
              min={0.3}
              max={2.0}
              step={0.1}
            />
          </div>
        </div>

        {/* Supports */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Support Posts</Label>
          <div className="flex items-center space-x-3">
            <Slider
              value={[railConfig.supports]}
              onValueChange={([value]) => updateConfig('supports', value)}
              min={2}
              max={8}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={railConfig.supports}
              onChange={(e) => updateConfig('supports', parseInt(e.target.value) || 0)}
              className="w-16 h-8 text-sm"
              min={2}
              max={8}
              step={1}
            />
          </div>
        </div>

        {/* Radius for curved/rainbow rails */}
        {(railType === 'curved' || railType === 'rainbow') && (
          <div className="space-y-2">
            <Label className="text-sm text-foreground">
              {railType === 'rainbow' ? 'Arc Radius' : 'Curve Radius'} (meters)
            </Label>
            <div className="flex items-center space-x-3">
              <Slider
                value={[railConfig.radius || 2]}
                onValueChange={([value]) => updateConfig('radius', value)}
                min={1}
                max={8}
                step={0.5}
                className="flex-1"
              />
              <Input
                type="number"
                value={railConfig.radius || 2}
                onChange={(e) => updateConfig('radius', parseFloat(e.target.value) || 0)}
                className="w-16 h-8 text-sm"
                min={1}
                max={8}
                step={0.5}
              />
            </div>
          </div>
        )}

        {/* Segments for kinked rails */}
        {railType === 'kinked' && (
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Segments</Label>
            <div className="flex items-center space-x-3">
              <Slider
                value={[railConfig.segments || 2]}
                onValueChange={([value]) => updateConfig('segments', value)}
                min={2}
                max={5}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={railConfig.segments || 2}
                onChange={(e) => updateConfig('segments', parseInt(e.target.value) || 0)}
                className="w-16 h-8 text-sm"
                min={2}
                max={5}
                step={1}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};