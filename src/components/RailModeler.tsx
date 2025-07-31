import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { RailScene } from './3d/RailScene';
import { Toolbar } from './ui/Toolbar';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { MaterialsPanel } from './ui/MaterialsPanel';
import { PricingPanel } from './ui/PricingPanel';
import { RailType, Material, RailConfig } from '../types/rail';

export const RailModeler: React.FC = () => {
  const [selectedRailType, setSelectedRailType] = useState<RailType>('straight');
  const [selectedMaterial, setSelectedMaterial] = useState<Material>('pvc-wood');
  const [railConfig, setRailConfig] = useState<RailConfig>({
    length: 6,
    height: 0.8,
    supports: 3,
    radius: 2, // for curved/rainbow rails
    segments: 2, // for kinked rails
  });

  const rails = [
    {
      id: '1',
      type: selectedRailType,
      material: selectedMaterial,
      config: railConfig,
      position: [0, 0, 0] as [number, number, number],
    }
  ];

  const materialPrices = {
    'pvc-wood': 45,
    'steel': 85,
    'aluminum': 120,
  };

  const complexityMultipliers = {
    'straight': 1.0,
    'kinked': 1.3,
    'curved': 1.5,
    'rainbow': 1.8,
  };

  const calculatePrice = () => {
    const basePrice = materialPrices[selectedMaterial];
    const complexityMultiplier = complexityMultipliers[selectedRailType];
    const lengthFactor = railConfig.length / 6; // base 6m rail
    const supportsFactor = railConfig.supports * 0.1;
    
    return Math.round(basePrice * complexityMultiplier * lengthFactor * (1 + supportsFactor));
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Left Toolbar */}
      <div className="w-16 bg-cad-toolbar border-r border-cad-panel-border">
        <Toolbar 
          selectedRailType={selectedRailType}
          onRailTypeChange={setSelectedRailType}
        />
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [8, 6, 8], fov: 50 }}
          style={{ background: 'hsl(var(--scene-bg))' }}
        >
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
          />
          
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          <Grid 
            position={[0, -0.01, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="hsl(var(--grid-secondary))"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="hsl(var(--grid-primary))"
            fadeDistance={30}
            fadeStrength={1}
          />
          
          <RailScene 
            rails={rails}
            selectedRail="1"
          />
          
          <Environment preset="city" />
        </Canvas>
        
        {/* Scene Controls Overlay */}
        <div className="absolute top-4 left-4 bg-cad-panel/90 backdrop-blur-sm border border-cad-panel-border rounded-lg p-3">
          <div className="text-sm font-medium text-foreground mb-2">View Controls</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Left Click + Drag: Rotate</div>
            <div>• Right Click + Drag: Pan</div>
            <div>• Scroll: Zoom</div>
          </div>
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-80 bg-cad-panel border-l border-cad-panel-border flex flex-col">
        <PropertiesPanel 
          railConfig={railConfig}
          onConfigChange={setRailConfig}
          railType={selectedRailType}
        />
        
        <MaterialsPanel 
          selectedMaterial={selectedMaterial}
          onMaterialChange={setSelectedMaterial}
        />
        
        <PricingPanel 
          price={calculatePrice()}
          material={selectedMaterial}
          railType={selectedRailType}
          config={railConfig}
        />
      </div>
    </div>
  );
};