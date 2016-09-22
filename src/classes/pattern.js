import {calculatePixelIntensity, create2dArray, calculateAspectRatioFit, getRelativeMousePosition} from '../util/helpers.js';

export default class Pattern {

	constructor(image, parent) {
		this.image;
		this.edges = [];
		this.dimensionalArray;
		this.grayScaleArray;
		this.pixelArray;
		this.canvas;
		this.context;
		this.sensitvity = 0.15;
		this.analyze(image, parent).then(() => {
			this.detectEdges(parent ? true : false).then(() => {
			});
		});
	}

	analyze(image, parent) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.image = image;
			self.canvas = document.createElement('canvas');
			self.canvas.width = image.width;
			self.canvas.height = image.height;
			self.context = self.canvas.getContext('2d');
			self.context.drawImage(image, 0, 0, image.width, image.height);
			let i = self.context.getImageData(0, 0, image.width, image.height);
			this.pixelArray = i.data;
			self.generate2dArray(self.pixelArray, image);
			self.intergalImage = create2dArray(self.image.width);

			if(parent) {
				parent.appendChild(self.canvas);
			}
			resolve();
		});
	}

	detectEdges(draw) {
		let self = this;
		return new Promise((resolve, reject) => {
			let edgeLocation = [];
			let lastPixel;
			for(let x = 0; x < self.image.width; x++) {
				for(let y = 0; y < self.image.height; y++) {

					//We dont care about the first pixel
					if((x == 0 || y == 0)) {
						continue;
					}
					//Or any of the edges
					if(x == self.image.width -1 || y == self.image.height - 1) {
						continue;
					}

					let nextH = self.grayScaleArray[x + 1][y];
					let lastH = self.grayScaleArray[x - 1][y];

					let nextV = self.grayScaleArray[x][y + 1];
					let lastV = self.grayScaleArray[x][y - 1];

					let nextPixelIntensityH = (calculatePixelIntensity(nextH.r, nextH.g, nextH.b));
					let lastPixelIntensityH = (calculatePixelIntensity(lastH.r, lastH.g, lastH.b));

					let nextPixelIntensityV = (calculatePixelIntensity(nextV.r, nextV.g, nextV.b));
					let lastPixelIntensityV = (calculatePixelIntensity(lastV.r, lastV.g, lastV.b));

					if(Math.abs(nextPixelIntensityH - lastPixelIntensityH) > self.sensitvity ||
					   Math.abs(nextPixelIntensityV - lastPixelIntensityV) > self.sensitvity ) {

						edgeLocation.push({
							x: x,
							y: y,
							hIntensityDifference: Math.abs(nextPixelIntensityH - lastPixelIntensityH),
							vIntensityDifference: Math.abs(nextPixelIntensityV - lastPixelIntensityV)
						});
					}
				}
			}

			this.edges = edgeLocation;

			if(draw) {
				self.showEdges();
			}

			resolve();

		});
	}

	showEdges() {
		let self = this;
		return new Promise((resolve, reject) => {

			this.context.rect(0,0,this.image.width, this.image.height);
			this.context.fillStyle='black';
			this.context.fill();

			let edges = this.edges;
			for(let i = 0; i < edges.length; i++) {
				this.context.beginPath();
				this.context.arc(edges[i].x, edges[i].y, 0.5, 0, 2*Math.PI);
				this.context.fillStyle=`rgba(255,255,255,${(edges[i].hIntensityDifference + edges[i].vIntensityDifference) / 2})`;
				this.context.fill();

			}
			resolve();
		});
	}

	generate2dArray(pixelData, image) {
		this.dimensionalArray = create2dArray(image.width);
		this.grayScaleArray = create2dArray(image.width);
		for(let i = 0; i < pixelData.length; i+=4) {
			let y = Math.floor((i / 4) / image.width);
			let x = Math.floor((i / 4) - (y * image.width));

			let r = pixelData[i];
			let g = pixelData[i+1];
			let b = pixelData[i+2];
			let a = pixelData[i+3];

			let average = (r + g + b) / 3;


			this.dimensionalArray[x][y] = {r: r, g: g, b: b, a: a};
			this.grayScaleArray[x][y] = {r: average, g: average, b: average}
		}
	}

}
