import { Rail, RailConnection } from '../types/rail';

export const CONNECTION_THRESHOLD = 0.5; // meters

export interface RailEndpoint {
  railId: string;
  endpoint: 'start' | 'end';
  position: [number, number, number];
}

export function getRailEndpoints(rail: Rail): { start: [number, number, number]; end: [number, number, number] } {
  const [x, y, z] = rail.position;
  const [rotX, rotY, rotZ] = rail.rotation || [0, 0, 0];
  
  // Calculate endpoint positions based on rail type and rotation
  const halfLength = rail.config.length / 2;
  
  // For straight rails, endpoints are along the X-axis
  // Apply Y rotation to get proper direction
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  
  const start: [number, number, number] = [
    x - halfLength * cos,
    y,
    z + halfLength * sin
  ];
  
  const end: [number, number, number] = [
    x + halfLength * cos,
    y,
    z - halfLength * sin
  ];
  
  return { start, end };
}

export function calculateDistance(pos1: [number, number, number], pos2: [number, number, number]): number {
  const [x1, y1, z1] = pos1;
  const [x2, y2, z2] = pos2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

export function findNearbyEndpoints(movedRail: Rail, allRails: Rail[]): RailEndpoint[] {
  const movedEndpoints = getRailEndpoints(movedRail);
  const nearbyEndpoints: RailEndpoint[] = [];
  
  for (const rail of allRails) {
    if (rail.id === movedRail.id) continue;
    
    const railEndpoints = getRailEndpoints(rail);
    
    // Check if any endpoint of moved rail is close to any endpoint of this rail
    for (const [movedEndpoint, movedPos] of Object.entries(movedEndpoints) as [keyof typeof movedEndpoints, [number, number, number]][]) {
      for (const [railEndpoint, railPos] of Object.entries(railEndpoints) as [keyof typeof railEndpoints, [number, number, number]][]) {
        const distance = calculateDistance(movedPos, railPos);
        
        if (distance <= CONNECTION_THRESHOLD) {
          nearbyEndpoints.push({
            railId: rail.id,
            endpoint: railEndpoint,
            position: railPos
          });
        }
      }
    }
  }
  
  return nearbyEndpoints;
}

export function updateConnections(rails: Rail[], movedRailId: string): Rail[] {
  const movedRail = rails.find(r => r.id === movedRailId);
  if (!movedRail) return rails;
  
  // Clear all existing connections for the moved rail
  const updatedRails = rails.map(rail => {
    if (rail.id === movedRailId) {
      return { ...rail, connections: undefined };
    }
    
    // Remove connections to the moved rail from other rails
    if (rail.connections) {
      const newConnections = { ...rail.connections };
      if (newConnections.start?.railId === movedRailId) {
        delete newConnections.start;
      }
      if (newConnections.end?.railId === movedRailId) {
        delete newConnections.end;
      }
      
      const hasConnections = newConnections.start || newConnections.end;
      return { ...rail, connections: hasConnections ? newConnections : undefined };
    }
    
    return rail;
  });
  
  // Find new connections
  const nearbyEndpoints = findNearbyEndpoints(movedRail, updatedRails);
  const movedEndpoints = getRailEndpoints(movedRail);
  
  let finalRails = [...updatedRails];
  
  for (const nearby of nearbyEndpoints) {
    // Find which endpoint of moved rail is closest
    let closestMovedEndpoint: 'start' | 'end' = 'start';
    let minDistance = Infinity;
    
    for (const [endpoint, pos] of Object.entries(movedEndpoints) as [keyof typeof movedEndpoints, [number, number, number]][]) {
      const distance = calculateDistance(pos, nearby.position);
      if (distance < minDistance) {
        minDistance = distance;
        closestMovedEndpoint = endpoint;
      }
    }
    
    // Create the connection
    finalRails = finalRails.map(rail => {
      if (rail.id === movedRailId) {
        return {
          ...rail,
          connections: {
            ...rail.connections,
            [closestMovedEndpoint]: {
              railId: nearby.railId,
              endpoint: nearby.endpoint
            }
          }
        };
      }
      
      if (rail.id === nearby.railId) {
        return {
          ...rail,
          connections: {
            ...rail.connections,
            [nearby.endpoint]: {
              railId: movedRailId,
              endpoint: closestMovedEndpoint
            }
          }
        };
      }
      
      return rail;
    });
    
    // Only connect one endpoint at a time to avoid complex multi-connections
    break;
  }
  
  return finalRails;
}

export function getConnectedRails(rails: Rail[], startRailId: string): Rail[] {
  const visited = new Set<string>();
  const connected: Rail[] = [];
  const queue = [startRailId];
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    const rail = rails.find(r => r.id === currentId);
    if (!rail) continue;
    
    connected.push(rail);
    
    // Add connected rails to queue
    if (rail.connections?.start) {
      queue.push(rail.connections.start.railId);
    }
    if (rail.connections?.end) {
      queue.push(rail.connections.end.railId);
    }
  }
  
  return connected;
}