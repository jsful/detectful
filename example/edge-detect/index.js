import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import Detective from '../../src/detective';


class App extends Component {
	constructor () {
		super();
		this.detective = new Detective();
	}

	componentDidMount() {
		this.refs.fileUpload.onchange = this.fileUploaded.bind(this);
	}

	fileUploaded() {
		let file = this.refs.fileUpload;
        let self = this;

        if(file.files && file.files[0]) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                let img = new Image();
                img.onload = () => {
                    self.process(img);
                }
                img.src = e.target.result;
            }
            fileReader.readAsDataURL(file.files[0]);
        }
	}

	process(img) {
		this.detective.processImage(img, true, this.refs.parent).then(() => {
			this.detective.detectEdges(true).then(() => {
				console.log("DONE");
			});
		})

		
	}

	render() {
		return (
			<div className='react'>
				<input type='file' ref='fileUpload' />

				<div ref='parent'></div>
			</div>
		);
	}
};

ReactDOM.render(<App />, document.getElementById('app'));