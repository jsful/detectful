
const calculatePixelIntensity = (r, g, b, i = false) => {

	let r1 = r/(i ? 1 : 255);
	let g1 = g/(i ? 1 : 255);
	let b1 = b/(i ? 1 : 255);
	return (0.229 * r1 + 0.7152 * g1 + 0.0722 * b1);
}

const create2dArray = (rows) => {
	var arr = [];
	for (var i=0; i < rows ; i++) {
		arr[i] = [];
	}
	return arr;
}

const getRelativeMousePosition = (clientX, clientY, element) => {
	let box = element.getBoundingClientRect();
	return {
		x: clientX - box.left,
		y: clientY - box.top
	};
}

const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: Math.floor(srcWidth*ratio), height: Math.floor(srcHeight*ratio) };
}

export {calculatePixelIntensity, create2dArray, calculateAspectRatioFit, getRelativeMousePosition};
