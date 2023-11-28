'use client';

// Import important packages
import { useContext, useEffect } from 'react';
import { Context } from '../page';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import vt from './vt';

// Map react components
export default function Canvas(){
	// States
	const { Map, basemapUrl, roiGeojson, imageUrl } = useContext(Context);

	return (
		<MapContainer ref={Map} center={ { lat: 0, lng: 116 } } zoom={5} id='map' maxZoom={17} minZoom={5} >
			<TileLayer url={basemapUrl} attribution='Google Satellite' />
			<TileLayer url={imageUrl} attribution='Sentinel-2'/>
			<GeoJSONTile data={roiGeojson} />
		</MapContainer>
	)
}

/**
 * GeoJSON tile components
 * @param {{ data: GeoJSON }} props 
 * @returns 
 */
function GeoJSONTile(props) {
	// Container
	const container = useMap();
	
	// Data
	const { data } = props;
	
	// Add data to map
	useEffect(() => {
		if (data) {
			const bounds = L.geoJSON(data).getBounds();
			container.fitBounds(bounds);

			// Option for geojson tile
			const red = Math.floor(Math.random() * 255);
			const green = Math.floor(Math.random() * 255);
			const blue = Math.floor(Math.random() * 255);
			const fillColor = RGBAToHexA(red, green, blue, 0);
			const color = RGBAToHexA(red, green, blue, 1);
			const optionsVector = {
				maxZoom: 17,
				minZoom: 5,
				tolerance: 3,
				style: { 
					color,
					fillColor,
					weight: 3, 
				}
			};

			const tile = vt(data, optionsVector);
			container.addLayer(tile);

			return () => {
				container.removeLayer(tile);
			};
		}
	}, [ data ]);

	return null;
}

/**
 * Function to get hex color
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @param {number} a 
 * @returns 
 */
function RGBAToHexA(r, g, b, a) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  return "#" + r + g + b + a;
}