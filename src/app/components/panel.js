// Import important packages
import { useContext, useEffect, useState } from "react";
import { Context } from "../page";
import { temporals, months, years, bands } from '../data/options';
import Select from 'react-select';
import shp from "shpjs";
import { image } from '../server/image'
import { toggle } from "./util";
import { bbox, bboxPolygon } from '@turf/turf';

// Panel application components
export default function Panel() {
	// State of menu disabled
	const [ imageButtonDisabled, setImageButtonDisabled ] = useState(true);
	const [ analysisButtonDisabled, setAnalysisButtonDisabled ] = useState(false);

	// Display of menu
	const [ imageDisplay, setImageDisplay ] = useState('flex');
	const [ analysisDisplay, setAnalysisDisplay ] = useState('none');

	return (
		<div id='panel' className="flexible vertical padding big-space">
			<div id='title'>
				Seagrass AGC Modelling
			</div>

			<Geometry />

			<div>
				<div id='menu=button' className="flexible">
					<button className="select-button" style={{ flex: 1 }} disabled={imageButtonDisabled} onClick={() => {
						setAnalysisButtonDisabled(false);
						setImageButtonDisabled(true);
						setImageDisplay('flex');
						setAnalysisDisplay('none');
					}}>Image</button>
					
					<button className="select-button" style={{ flex: 1 }} disabled={analysisButtonDisabled} onClick={() =>  {
						setAnalysisButtonDisabled(true);
						setImageButtonDisabled(false);
						setImageDisplay('none');
						setAnalysisDisplay('flex');
					}}>Analysis</button>
				</div>

				<div id='menu'>
					<Image display={imageDisplay} />
					<Temporal display={analysisDisplay} />
				</div>
			</div>
		</div>
	)
}

// Geometry upload
function Geometry() {
	const { setRoiGeojson, uploadGeometryDisabled, setUploadGeometryDisabled, setTemporalDisabled, setImageDisabled } = useContext(Context);

	return (
		<div id='geometry' className="flexible vertical small-space">
			<div style={{ fontSize: 'small' }}>
				Upload a ZIP with all shapefile file inside
			</div>
			<div style={{ fontSize: 'small' }}>
				Only accept shapefile with EPGS:4326 projection
			</div>
			<input type="file" disabled={uploadGeometryDisabled} accept=".zip" onChange={async e => {
				try {
					toggle(true, [ setUploadGeometryDisabled, setTemporalDisabled, setImageDisabled ]);
					const file = await e.target.files[0].arrayBuffer();
					const geojson = await shp(file);
					setRoiGeojson(geojson);
				} catch (error) {
				} finally {
					toggle(false, [ setUploadGeometryDisabled ]);
				}
			}}/>			
		</div>	
	)
}

// Image show
function Image(prop) {
	const { imageDisabled, setImageDisabled, roiGeojson, setImageUrl, setUploadGeometryDisabled } = useContext(Context);

	// Visualization state
	const [ red, setRed ] = useState(bands[3]);
	const [ green, setGreen ] = useState(bands[2]);
	const [ blue, setBlue ] = useState(bands[1]);

	// Enable image visualization button when the geometry is correct
	useEffect(() => {
		if (roiGeojson) {
			setImageDisabled(false);
		}
	}, [ roiGeojson ]);

	return (
		<div id='image' className="flexible vertical small-space" style={{ display: prop.display }}>
			<div id='bands' className="flexible">
				<Select 
					options={bands}
					value={red}
					onChange={value => setRed(value)}
					isDisabled={imageDisabled}
					className="select"
				/>
				<Select 
					options={bands}
					value={green}
					onChange={value => setGreen(value)}
					isDisabled={imageDisabled}
					className="select"
				/>
				<Select 
					options={bands}
					value={blue}
					onChange={value => setBlue(value)}
					isDisabled={imageDisabled}
					className="select"
				/>
			</div>

			<button disabled={imageDisabled} className="menu-button" onClick={async () => {
				try {
					toggle(true, [ setImageDisabled, setUploadGeometryDisabled ]);

					// BBOX polygon
					const bounds = bbox(roiGeojson);
					const polygon = bboxPolygon(bounds);

					const { url, ok, message } = await image({
						polygon,
						bands: [
							red.value,
							green.value,
							blue.value
						]
					});

					if (!ok) {
						throw new Error(message);
					}

					// Set image url to show on map
					setImageUrl(url);

				} catch (error) {
				} finally {
					toggle(false, [ setImageDisabled, setUploadGeometryDisabled ]);
				}
			}}>Show Image</button>
		</div>	
	)
}

// Temporal selection
function Temporal(prop) {
	const { 
		temporal, setTemporal, 
		month, setMonth,
		year, setYear,
		roiGeojson,
		temporalDisabled, setTemporalDisabled
	} = useContext(Context);

	// Options visualization
	const [ monthDisabled, setMonthDisabled ] = useState(true);
	const [ yearDisabled, setYearDisabled ] = useState(true);

	// Allow to change analysis if roigeojson is fill
	useEffect(() => {
		if (roiGeojson) {
			setTemporalDisabled(false);
		}
	}, [ roiGeojson ]);

	// Change the options if some value is selected
	useEffect(() => {
		if (!temporalDisabled) {
			switch (temporal.value) {
				case 'bimonthly':
					setMonthDisabled(false);
					setYearDisabled(false);
					break;
				case 'bimonthly-year':
					setMonthDisabled(false);
					setYearDisabled(true);
					break;
				case 'year':
					setMonthDisabled(true);
					setYearDisabled(false);
					break;
				case 'multi-year':
					setMonthDisabled(true);
					setYearDisabled(true);
					break;
			}
		} else {
			setMonthDisabled(true);
			setYearDisabled(true);
		}
	}, [ temporal, temporalDisabled ]);

	return (
		<div id='temporal' className="flexible vertical small-space" style={{ display: prop.display }}>
			<Select 
				options={temporals}
				value={temporal}
				onChange={value => setTemporal(value)}
				className="select"
				isDisabled={temporalDisabled}
			/>

			<Select 
				options={months}
				value={month}
				onChange={value => setMonth(value)}
				isDisabled={monthDisabled}
				className="select"
			/>

			<Select 
				options={years}
				value={year}
				onChange={value => setYear(value)}
				isDisabled={yearDisabled}
				className="select"
			/>
		</div>
	)
}