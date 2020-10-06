import React, {Component} from 'react';

// import { Form, Button } from 'react-bootstrap';

import CytoscapeComponent from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';
import cytoscape from 'cytoscape';

const STATUS = ["released", "workinprogress", "planned", "unknown"];

export default class FeatureDependencyGraphPage extends Component {
	

	constructor(props) {
		super(props);
		cytoscape.use(dagre);
	}

	render () {

		let nodes = [];
		let edges = [];

		for (const [featureName, feature] of Object.entries(this.props.featuresByName)) {
			
			if (feature.isVisible) {
				let node = {
					data: {
						id: feature.name,
						label: feature.name,
					},
					classes: STATUS[feature.status] + " tier" + feature.size
				}

				let hasMoreDependingFeatures = false;
				feature.dependsOn.forEach(dependingFeatureName => {
					if (this.props.featuresByName[dependingFeatureName].isVisible) {
						let edge = {
							data: {
								source: dependingFeatureName,
								target: feature.name,
							}
						}
						edges.push(edge);
					} else {
						hasMoreDependingFeatures = true;
					}
				});

				
				feature.parentFeatures.forEach((parentFeatureName) => {
					let dependantFeature = this.props.featuresByName[parentFeatureName];
					if (!dependantFeature.isVisible) {
						hasMoreDependingFeatures = true;
					}
				});

				if (hasMoreDependingFeatures) {
					node.classes += " hasMoreNodes";
				}
				
				nodes.push(node);
			}
		}

		const elements = CytoscapeComponent.normalizeElements({
			nodes: nodes,
			edges: edges
		});

		console.log(elements)

		

		const layout = {
			name: "dagre",
			spacingFactor: 1.2,
			animate: true,
			fit: true,
			padding: 200,
		};

		const style = {
			width: "100%",
			height: "1000px",
		}
		
		
		let stylesheet = [
			{
				selector: 'node',
				style: {
					label: 'data(label)',
					textHalign: 'center',
					textValign: 'center',
					padding: '10px',
					textWrap: 'wrap',
					textMaxWidth: '75px',
					color: '#ffffff'
				}
			},
			{
				selector: 'edge',
				style: {
					targetArrowShape: 'triangle',
					'width': 5,
					'target-arrow-shape': 'triangle',
					'source-arrow-shape': 'triangle',
					'target-arrow-fill': 'filled',
					'source-arrow-fill': 'filled',
					'arrow-scale': 3
				}
			},

			{
				selector: '.hasMoreNodes',
				style: {
					shape: 'roundrectangle',
				}
			},

			{
				selector: '.tier1',
				style: {
					width: '400px',
					height: '400px',
					'font-size': '50px'
				}
			},
			{
				selector: '.tier2',
				style: {
					width: '300px',
					height: '300px',
					'font-size': '35px'
				}
			},
			{
				selector: '.tier3',
				style: {
					width: '200px',
					height: '200px',
					'font-size': '30px'
				}
			},
			{
				selector: '.tier4',
				style: {
					width: '200px',
					height: '200px',
					'font-size': '25px'
				}
			},

			{
				selector: '.released',
				style: {
					backgroundColor: '#517c40',
				}
			},
			{
				selector: '.workinprogress',
				style: {
					backgroundColor: '#5d8ab3',
				}
			},
			{
				selector: '.planned',
				style: {
					backgroundColor: '#86352f',
				}
			},
			{
				selector: '.unknown',
				style: {
					backgroundColor: '#ffffff',	
					color: '#000000'
				}
			},
		];
		


		return <div style={{width: "100%", height:"100%"}}>
			<CytoscapeComponent
				elements={elements}
				layout={layout}
				style={style}
				stylesheet={stylesheet}
				wheelSensitivity={0.25}
				boxSelectionEnabled={false}
				cy={(cy) => {
					this.cy = cy;
					// set event handler only once
					if (!cy.eventHandlerWasSet) {
						cy.eventHandlerWasSet = true;
						layout.fit = false;
						cy.on('tap', 'node', (evt) => {
							this.props.selectFeature(evt.target, cy, layout);
						});
					}
				}} 
			/>
		</div>
	}

}