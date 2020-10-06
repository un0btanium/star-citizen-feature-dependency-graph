import React, { Component } from 'react';
import { withRouter, Switch } from 'react-router'
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/bootstrap.css";

import update from 'immutability-helper';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import FeatureDependencyGraphPage from './components/pages/feature-dependency-graph-page.component';
import AboutPage from './components/pages/about-page.component';
import ContactPage from './components/pages/contact-page.component';

import data from './star-citizen-data/data.js';

import logo from "./images/ghost.svg";

const BG = "dark"; // primary, dark, light
const VARIANT = "dark"; // dark, light

const WEBSITE_URL = "un0btanium.github.io/star-citizen-feature-dependency-graph/";

const PATCH_VERSION = "Alpha 3.11.0";

class App extends Component {


  	constructor(props) {
		super(props);


		let featuresByName = {};
		data.features.forEach((feature) => {
			featuresByName[feature.name] = feature;
		});
		data.features.forEach((feature) => {
			feature.dependsOn.forEach((dependingFeatureName) => {
				if (featuresByName[dependingFeatureName] === undefined) {
					let dependingFeature = {
						name: dependingFeatureName,
						size: 4,
						status: -1,
						dependsOn: []
					}
					featuresByName[dependingFeatureName] = dependingFeature;
					data.features.push(dependingFeature);
				}
			});
		});
		data.features.forEach((feature) => {
			if (feature.parentFeatures === undefined) {
				feature.parentFeatures = [];
			}
			feature.dependsOn.forEach((dependingFeatureName) => {
				if (featuresByName[dependingFeatureName].parentFeatures === undefined) {
					featuresByName[dependingFeatureName].parentFeatures = [];
				}
				featuresByName[dependingFeatureName].parentFeatures.push(feature.name);
			});
		});
		data.features.forEach((feature) => {
			if (feature.status === -1) {
				let status = 0;
				feature.parentFeatures.forEach((dependingFeatureName) => {
					if (featuresByName[dependingFeatureName].status > status) {
						status = featuresByName[dependingFeatureName].status;
					}
				});
				feature.status = status;
			}
		});



		data.features.forEach((feature) => {
			if (feature.size === 1) {
				feature.isVisible = true;
			} else {
				feature.isVisible = false;
			}
		});




		this.selectFeature = this.selectFeature.bind(this);
		this.resetSelected = this.resetSelected.bind(this);
		this.toggleSetting = this.toggleSetting.bind(this);

		this.state = {
			data: data,
			featuresByName: featuresByName,
			
			selectFeature: this.selectFeature,
			resetSelected: this.resetSelected,
			toggleSetting: this.toggleSetting

		};

	}

  	render() {

		return (
			<Router>
				<div className="full-screenable-node">
					<Navbar bg={BG} variant={VARIANT} expand="xl" style={{ boxShadow: '0px 2px 5px #000000'}}>
						<Navbar.Brand style={{ marginLeft: "15%"}}>
							<a href={"http://" + WEBSITE_URL}>
								<img src={logo} width="35" height="35" alt="Logo" />
								<b>{' Star Citizen Feature Dependency Graph'}</b>
							</a>
						</Navbar.Brand>

						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav" style={{ marginRight: "10%"}}>
							<Nav className="mr-auto">
								<Nav.Link as={Link} variant="light" to="/star-citizen-feature-dependency-graph/featuredepdendencygraph"><b>Feature Depdendency Graph</b></Nav.Link>
							</Nav>

							<Nav>
								<Nav.Link as={Link} variant="light" to="/star-citizen-feature-dependency-graph/about"><b>About</b></Nav.Link>
								<Nav.Link as={Link} variant="light" to="/star-citizen-feature-dependency-graph/contact"><b>Contact</b></Nav.Link>
								<Navbar.Text style={{ color: "rgb(223, 105, 26)", marginLeft: "20px"}}><b>Patch <i>{PATCH_VERSION}</i></b></Navbar.Text>
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<Switch>
						<Route exact path="/star-citizen-feature-dependency-graph/featuredepdendencygraph" render={(props) => <FeatureDependencyGraphPage {...props}
								{...this.state}
							/>}
						/>
						<Route exact path="/star-citizen-feature-dependency-graph/about" render={(props) => <AboutPage {...props}
						
							/>}
						/>
						<Route exact path="/star-citizen-feature-dependency-graph/contact" render={(props) => <ContactPage {...props}
						
							/>}
						/>
						<Route render={(props) => <FeatureDependencyGraphPage {...props}
								{...this.state}
							/>}
						/>
					</Switch>
				</div>
			</Router>
		);
	}

	/* Settings */

	preventEvent(e) {
		e.preventDefault();
	}

	toggleSetting(key) {
		localStorage.setItem(key, !this.state[key]);
		this.setState({
			[key]: !this.state[key]
		});
	}


	selectFeature(node, cy, layout) {
		let feature = this.state.featuresByName[node.id()];
		let featuresByName = {...this.state.featuresByName};

		let didChange = false;

		// count child features
		let visibleChildFeaturesCount = 0;
		feature.dependsOn.forEach((dependingFeatureName) => {
			let dependingFeature = this.state.featuresByName[dependingFeatureName];
			if (dependingFeature.isVisible) {
				visibleChildFeaturesCount++;
			}
		});

		// count parent features
		let visibleParentFeaturesCount = 0;
		feature.parentFeatures.forEach((parentFeatureName) => {
			let dependantFeature = this.state.featuresByName[parentFeatureName];
			if (dependantFeature.isVisible) {
				visibleParentFeaturesCount++;
			}
		});

		if (visibleParentFeaturesCount < feature.parentFeatures.length) {
			feature.parentFeatures.forEach((parentFeatureName) => {
				let dependantFeature = this.state.featuresByName[parentFeatureName];
				if (!dependantFeature.isVisible) {
					didChange = true;
					featuresByName = update(featuresByName, {
						[parentFeatureName]: {
							isVisible: {
								$set: true
							}
						}
					});
				}
			});
		}
		
		// show/hide child features
		feature.dependsOn.forEach((dependingFeatureName) => {
			let dependingFeature = this.state.featuresByName[dependingFeatureName];
			if (!dependingFeature.isVisible) {
				didChange = true;
				featuresByName = update(featuresByName, {
					[dependingFeatureName]: {
						isVisible: {
							$set: true
						}
					}
				});
				featuresByName = this.recursivelyOpenDependedFeatures(featuresByName, dependingFeatureName, feature.size+1);
			} else if (visibleChildFeaturesCount+visibleParentFeaturesCount === feature.dependsOn.length+feature.parentFeatures.length) { // only close all child features if all child features are open/visible
				didChange = true;
				featuresByName = update(featuresByName, {
					[dependingFeatureName]: {
						isVisible: {
							$set: false
						}
					}
				});
				featuresByName = this.recursivelyCloseAllDependedFeatures(featuresByName, dependingFeatureName);
			}
		})
		
		if (didChange) {
			// update cytoscape layout with new or removed nodes
			let l = cy.layout(layout);
			l.stop();
			this.setState(
				{
					featuresByName: featuresByName
				},
				() => {
					l = cy.elements().makeLayout(layout);
					l.run();
				}
			);
		}
	}

	
	recursivelyCloseAllDependedFeatures(featuresByName, id) {
		let feature = featuresByName[id];
		feature.dependsOn.forEach((dependingFeatureName) => {
			let dependingFeature = featuresByName[dependingFeatureName];
			if (dependingFeature.isVisible) {
				featuresByName = update(featuresByName, {
					[dependingFeatureName]: {
						isVisible: {
							$set: false
						}
					}
				});
				featuresByName = this.recursivelyCloseAllDependedFeatures(featuresByName, dependingFeatureName);
			}
		})

		return featuresByName;
	}

	recursivelyOpenDependedFeatures(featuresByName, id, maxSize) {
		let feature = featuresByName[id];
		feature.dependsOn.forEach((dependingFeatureName) => {
			let dependingFeature = featuresByName[dependingFeatureName];
			if (!dependingFeature.isVisible && dependingFeature.size <= maxSize) {
				featuresByName = update(featuresByName, {
					[dependingFeatureName]: {
						isVisible: {
							$set: true
						}
					}
				});
				featuresByName = this.recursivelyOpenDependedFeatures(featuresByName, dependingFeatureName, maxSize);
			}
		})
		return featuresByName;
	}
	

	resetSelected() {

	}


}

export default withRouter(App);