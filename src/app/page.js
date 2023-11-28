'use client';

import dynamic from 'next/dynamic';
import { useState, createContext, useRef } from 'react';
import Panel from './components/panel';
import { temporals, months, years } from './data/options';

// Context
export const Context = createContext();

// Import map components
const Canvas = dynamic(() => import('./components/map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// This application top components
export default function Home() {
  // Leaflet map ref
  const Map = useRef();

  // ROI features
  const [ roiGeojson, setRoiGeojson ] = useState(undefined);

  // Image url
  const [ imageUrl, setImageUrl ] = useState('');

  // Tile layer
  const [ basemapUrl, setBasemapUrl ] = useState('https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');

  // Temporal state
  const [ temporal, setTemporal ] = useState(temporals[0]);

  // Months state
  const [ month, setMonth ] = useState(months[0]);

  // Year state
  const [ year, setYear ] = useState(years[years.length - 1]);

  // Image disabled button
  const [ imageDisabled, setImageDisabled ] = useState(true);

  // Image disabled button
  const [ uploadGeometryDisabled, setUploadGeometryDisabled ] = useState(false);

  // Disabled temporal button	
	const [ temporalDisabled, setTemporalDisabled ] = useState(true);

  // State list
  const states = {
    Map,
    basemapUrl, setBasemapUrl,
    temporal, setTemporal,
    month, setMonth,
    year, setYear,
    roiGeojson, setRoiGeojson,
    imageUrl, setImageUrl,
    imageDisabled, setImageDisabled,
    uploadGeometryDisabled, setUploadGeometryDisabled,
    temporalDisabled, setTemporalDisabled
  };

  // All the state
  return (
    <>
      <Context.Provider value={states}>
        <Canvas />
        <Panel />
      </Context.Provider>
    </>
  )
}
