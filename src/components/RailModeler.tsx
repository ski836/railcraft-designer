import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { RailScene } from './3d/RailScene';
import { Toolbar } from './ui/Toolbar';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { MaterialsPanel } from './ui/MaterialsPanel';
import { PricingPanel } from './ui/PricingPanel';
import { RailType, Material, RailConfig, Rail } from '../types/rail';

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
  const [rails, setRails] = useState<Rail[]>([
    {
      id: '1',
      type: 'straight',
      material: 'pvc-wood',
      config: { length: 6, height: 0.8, supports: 3, radius: 2, segments: 2 },
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    }
  ]);
  const [selectedRailId, setSelectedRailId] = useState<string>('1');
  const [transformMode, setTransformMode] = useState<'select' | 'move' | 'rotate'>('select');

  const materialPrices = {
    'pvc-wood': 45,
    'steel': 85,
    'aluminum': 120,
  };

  const complexityMultipliers = {
    'straight': 1.0,
    'curved': 1.5,
    'rainbow': 1.8,
  };

  const selectedRail = rails.find(rail => rail.id === selectedRailId);

  const addRail = () => {
    const newId = Date.now().toString();
    const newRail: Rail = {
      id: newId,
      type: selectedRailType,
      material: selectedMaterial,
      config: railConfig,
      position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
    };
    setRails([...rails, newRail]);
    setSelectedRailId(newId);
  };

  const duplicateRail = () => {
    if (!selectedRail) return;
    const newId = Date.now().toString();
    const newRail: Rail = {
      ...selectedRail,
      id: newId,
      position: [selectedRail.position[0] + 2, selectedRail.position[1], selectedRail.position[2]],
    };
    setRails([...rails, newRail]);
    setSelectedRailId(newId);
  };

  const deleteRail = () => {
    if (!selectedRail || rails.length <= 1) return;
    const newRails = rails.filter(rail => rail.id !== selectedRailId);
    setRails(newRails);
    setSelectedRailId(newRails[0]?.id || '');
  };

  const updateRailPosition = (railId: string, position: [number, number, number]) => {
    setRails(rails.map(rail => 
      rail.id === railId ? { ...rail, position } : rail
    ));
  };

  const updateRailRotation = (railId: string, rotation: [number, number, number]) => {
    setRails(rails.map(rail => 
      rail.id === railId ? { ...rail, rotation } : rail
    ));
  };

  const calculatePrice = () => {
    const rail = selectedRail || rails[0];
    if (!rail) return 0;
    
    const basePrice = materialPrices[rail.material];
    const complexityMultiplier = complexityMultipliers[rail.type];
    const lengthFactor = rail.config.length / 6; // base 6m rail
    const supportsFactor = rail.config.supports * 0.1;
    
    return Math.round(basePrice * complexityMultiplier * lengthFactor * (1 + supportsFactor));
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Left Toolbar */}
      <div className="w-16 bg-cad-toolbar border-r border-cad-panel-border">
        <Toolbar 
          selectedRailType={selectedRailType}
          onRailTypeChange={setSelectedRailType}
          transformMode={transformMode}
          onTransformModeChange={setTransformMode}
          onAddRail={addRail}
          onDuplicateRail={duplicateRail}
          onDeleteRail={deleteRail}
          canDelete={rails.length > 1}
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
            selectedRail={selectedRailId}
            onRailSelect={setSelectedRailId}
            transformMode={transformMode}
            onRailPositionChange={updateRailPosition}
            onRailRotationChange={updateRailRotation}
          />
          
          <Environment preset="city" />
        </Canvas>
        
        {/* Scene Controls Overlay */}
        <div className="absolute top-4 left-4 bg-cad-panel/90 backdrop-blur-sm border border-cad-panel-border rounded-lg p-3">
          <div className="text-sm font-medium text-foreground mb-2">Controls</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Click rail to select</div>
            <div>• Move mode: Drag to reposition</div>
            <div>• Rotate mode: R key or use buttons</div>
            <div>• Camera: Right-click drag to rotate</div>
          </div>
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-80 bg-cad-panel border-l border-cad-panel-border flex flex-col">
        <PropertiesPanel 
          railConfig={selectedRail?.config || railConfig}
          onConfigChange={(config) => {
            if (selectedRail) {
              setRails(rails.map(rail => 
                rail.id === selectedRailId ? { ...rail, config } : rail
              ));
            } else {
              setRailConfig(config);
            }
          }}
          railType={selectedRail?.type || selectedRailType}
        />
        
        <MaterialsPanel 
          selectedMaterial={selectedRail?.material || selectedMaterial}
          onMaterialChange={(material) => {
            if (selectedRail) {
              setRails(rails.map(rail => 
                rail.id === selectedRailId ? { ...rail, material } : rail
              ));
            } else {
              setSelectedMaterial(material);
            }
          }}
        />
        
        <PricingPanel 
          price={calculatePrice()}
          material={selectedRail?.material || selectedMaterial}
          railType={selectedRail?.type || selectedRailType}
          config={selectedRail?.config || railConfig}
        />
      </div>
    </div>
  );
};