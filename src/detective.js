

export default class Detective {
	constructor() {
		this.image;
		this.dimensionalArray;
		this.grayScaleArray;
		this.pixelArray;
		this.canvas;
		this.context;
		this.edges = [];

		this.sensitvity = 0.15;
	}

	processImage(image, mount, parent) {
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

			if(mount) {
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

					if(x == self.image.width -1 || y == self.image.height - 1) {
						continue;
					}

					let nextH = self.grayScaleArray[x + 1][y];
					let lastH = self.grayScaleArray[x - 1][y];


					let nextV = self.grayScaleArray[x][y + 1];
					let lastV = self.grayScaleArray[x][y - 1];

					let nextPixelIntensityH = (self.calculatePixelIntensity(nextH.r, nextH.g, nextH.b));
					let lastPixelIntensityH = (self.calculatePixelIntensity(lastH.r, lastH.g, lastH.b));

					let nextPixelIntensityV = (self.calculatePixelIntensity(nextV.r, nextV.g, nextV.b));
					let lastPixelIntensityV = (self.calculatePixelIntensity(lastV.r, lastV.g, lastV.b));

					if(Math.abs(nextPixelIntensityH - lastPixelIntensityH) > self.sensitvity ||
					   Math.abs(nextPixelIntensityV - lastPixelIntensityV) > self.sensitvity ) {
						edgeLocation.push({x: x, y: y});
					}

				}
			}

			self.edges = edgeLocation;

			if(draw) {
				self.drawEdges();
			}

			resolve();

		});
	}

	calculatePixelIntensity(r, g, b) {
		let r1 = r/255;
		let g1 = g/255;
		let b1 = b/255;

		return (0.229 * r1 + 0.7152 * g1 + 0.0722 * b1);
	}

	showEdges() {

		for(let x = 0; x < self.image.width; x++) {
			for(let y = 0; y < self.image.height; y++) {
				this.context.beginPath();
				this.context.arc(x, y, 0.5, 0, 2*Math.PI);
				this.context.fillStyle='black';

				for(let i = 0; i < this.edges.length; i++) {
					if(this.edges[i].x == x && this.edges[i].y == y) {
						this.context.fillStyle='red';
					}
				}

				this.context.fill();

			}
		}
	}

	drawEdges() {
		for(let i = 0; i < this.edges.length; i++) {
			this.context.beginPath();
			this.context.arc(this.edges[i].x, this.edges[i].y, 0.5, 0, 2*Math.PI);
			this.context.fillStyle='red';
			this.context.fill();
	
		}
	}

	generate2dArray(pixelData, image) {
		this.dimensionalArray = this.create2dArray(image.width);
		this.grayScaleArray = this.create2dArray(image.width);
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

	create2dArray(rows) {
		var arr = [];
		for (var i=0; i < rows ; i++) {
			arr[i] = [];
		}
		return arr;
	}

	calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
	    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	    return { width: Math.floor(srcWidth*ratio), height: Math.floor(srcHeight*ratio) };
    }
}