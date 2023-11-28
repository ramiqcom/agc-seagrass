'use server';

// Import ee library
import 'node-self';
import ee from '@google/earthengine';
import { authenticateViaPrivateKey, initialize, getMapId } from './eePromise';

// Key
const key = JSON.parse(process.env.KEY);

/**
 * Import ee promise library
 * @param {{ features: GeoJSON, bands: [ string, string, string ] }} props 
 * @returns {Promise.<{ url: string | undefined, bounds: GeoJSON | undefined, ok: boolean, message: undefined | string }>}
 */
export async function image(props) {
	try {
		// Data parameter
		const { polygon, bands } = props;

		// Authenticate file
		await authenticateViaPrivateKey(key);
		await initialize(null, null);

		// Sentinel-2 collection
		const s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

		// Geometry
		const geometry = ee.Feature(polygon).geometry();

		// Image filter
		const image = s2.filterBounds(geometry)
			.filterDate('2023-01-01', '2023-12-31')
			.map(cloudMasking)
			.median()
			.clip(geometry);
		
		// Visualized image
		const visual = visualize(image, bands);

		// Get image url
		const [ obj, error ] = await getMapId({ image: visual });

		if (error) {
			throw new Error(error);
		}

		return { ok: true, url: obj.urlFormat };
	} catch (error) {
		return { ok: false, message: error.message };
	}
}

/**
 * Function to do cloud masking
 * @param {ee.Image} image
 * @returns {ee.Image}
 */
function cloudMasking(image) {
	const cloud = image.select('MSK_CLDPRB');
	const mask = cloud.lte(10);
	return image.select(['B.*']).updateMask(mask).divide(10000);
}

/**
 * Function to create visualized image
 * @param {ee.Image} image 
 * @param {[ string, string, string ]} bands
 * @returns {ee.Image}
 */
function visualize(image, bands) {
	const percentile = image.select(bands).reduceRegion({
		geometry: image.geometry(),
		scale: 100,
		maxPixels: 1e13,
		reducer: ee.Reducer.percentile([1, 99])
	});

	const min = bands.map(band => ee.Number(percentile.get(band + '_p1')));
	const max = bands.map(band => ee.Number(percentile.get(band + '_p99')));

	const visualized = image.visualize({
		bands: bands,
		min,
		max
	});

	return visualized;
}