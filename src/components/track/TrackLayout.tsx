'use client';

import RoadSurface from './RoadSurface';
import Barriers from './Barriers';
import OffRoadTerrain from './OffRoadTerrain';
import TrackDecorations from './TrackDecorations';

export default function TrackLayout() {
  return (
    <group>
      <RoadSurface />
      <Barriers />
      <OffRoadTerrain />
      <TrackDecorations />
    </group>
  );
}
