

import Pattern from './classes/pattern';

export default class Detective {
	constructor() {
		this.patterns = [];
	}

	addImage(image, parent) {
		this.patterns.push(new Pattern(image, parent));
	}


}
