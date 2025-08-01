import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { RailConfig, RailType, Material, MATERIALS, RAIL_TYPES, Rail } from '../../types/rail';
import { Calculator, TrendingUp, Link } from 'lucide-react';

interface PricingPanelProps {
  price: number;
  material: Material;
  railType: RailType;
  config: RailConfig;
  connectedRails?: Rail[];
}

export const PricingPanel: React.FC<PricingPanelProps> = ({
  price,
  material,
  railType,
  config,
  connectedRails = [],
}) => {
  const materialPrice = MATERIALS[material].price;
  const complexityMultiplier = RAIL_TYPES[railType].complexity;
  const basePrice = materialPrice * config.length;
  const complexityPrice = basePrice * (complexityMultiplier - 1);
  const supportsPrice = config.supports * 15; // $15 per support

  return (
    <Card className="border-cad-panel-border bg-cad-panel/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground flex items-center">
          <Calculator className="w-4 h-4 mr-2" />
          Cost Estimate
          {connectedRails.length > 1 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              <Link className="w-3 h-3 mr-1" />
              {connectedRails.length} Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Material ({config.length}m)</span>
            <span className="text-foreground">${basePrice.toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shape complexity</span>
            <span className="text-foreground">+${complexityPrice.toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Supports ({config.supports})</span>
            <span className="text-foreground">${supportsPrice}</span>
          </div>
          
          <Separator className="bg-cad-panel-border" />
          
          <div className="flex justify-between font-medium">
            <span className="text-foreground">Total Price</span>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                ${price}
              </Badge>
            </div>
          </div>
        </div>

        {/* Price Factors */}
        <div className="space-y-2 pt-2 border-t border-cad-panel-border">
          <div className="text-xs font-medium text-foreground">Price Factors</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Material type</span>
              <Badge variant="outline" className="text-xs">
                {MATERIALS[material].name}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rail complexity</span>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{complexityMultiplier}x</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Length factor</span>
              <span>{config.length}m</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2 border-t border-cad-panel-border">
          <div className="text-xs font-medium text-foreground">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-1 rounded">
              Save Quote
            </button>
            <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded">
              Export
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};