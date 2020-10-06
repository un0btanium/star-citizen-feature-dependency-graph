import React, {Component} from 'react';


export default class AboutPage extends Component {
	
	render () {

		return <div style={{ display: "inline-block", width: "100%", height:"100%"}}>
			<div style={{ margin: "auto", width: "600px", backgroundColor: "#4e5d6c", borderRadius: "5px", textAlign: "justify", marginTop: "100px", boxShadow: '2px 2px 5px #000000' }}>
				<div className="fadeIn" style={{margin: "5px", padding: "30px"}}>
					<h2 style={{ textAlign: "center"}}>About Star Citizen Feature Depdendency Graph</h2>
					<br/>
					<p>Star Citizen Feature Depdendency Graph provides an interactive graph overview about features and their depdendencies. Click on a feature to open their depending features.</p>
					<br/>
					<p>Icons erstellt von <a href="https://www.flaticon.com/de/autoren/pixelmeetup" title="Pixelmeetup">Pixelmeetup</a> from <a href="https://www.flaticon.com/de/" title="Flaticon"> www.flaticon.com</a></p>
					<br/>
					<p>Star Citizen Feature Depdendency Graph is not officially endorsed by Cloud Imperium and doesn’t reflect the views or opinions of Cloud Imperium or anyone officially involved in producing or managing Star Citizen!</p>
				</div>
			</div>
		</div>
	}
}