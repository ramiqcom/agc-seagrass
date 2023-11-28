/**
 * Function to enable or disabled many button
 * @param {boolean} status 
 * @param {Array.<React.SetStateAction>} setters 
 */
export function toggle(status, setters) {
	setters.map((set, index) => {
		set(status)
	});
}