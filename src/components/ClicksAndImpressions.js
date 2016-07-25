import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import { pickBy, startsWith, reduce, tail, zipObject, concat, map } from 'lodash'
import NumberWithLabel from './NumberWithLabel'

const axios = require('axios')

export default class ClicksAndImpressions extends Component { 
	
	staticpropTypes: {
		label: PropTypes.string
	}

	state = {
		value: '',
		sumClicks: 0,
		sumImpressions: 0,
		options: [],
		adwordData: {}
	}

	onChange = (value) => {
		console.log('New Value', value);

		var result = pickBy(this.state.adwordData, function(v, k) {
		  return startsWith(v.campaign, value) || startsWith(v.channel, value);
		});

		//console.log(JSON.stringify(result));

		var sumClicks = reduce(result, (sum, n) => {
		  return sum + parseInt(n.clicks, 10);
		}, 0);

		//console.log(sumClicks);

		var sumImpressions = reduce(result, (sum, n) => {
		  return sum + parseInt(n.impressions, 10);
		}, 0);

		//console.log(sumImpressions);

		this.setState({ value, sumClicks, sumImpressions });
	}

	csvToJson = (csv) => {
		const content = csv.trim().split('\n');

		const header = content[0].split(',');
		var jsonData = tail(content).map(row => {
			var data = zipObject(header, row.split(','));
			return data
		});

		this.setState({ adwordData: jsonData });

		var uniques = concat(...new Set(jsonData.map(item => item.campaign)), ...new Set(jsonData.map(item => item.channel)));

		//console.log(JSON.stringify(uniques));

		const options = uniques.map((value, key) => {
			return { value: value, label: value };
		});

		return {items: options};
	}

	getOptions = (input) => {
		return axios.get('http://mockbin.org/bin/3f1037be-88f3-4e34-a8ec-d602779bf2d6').then((response) => {
			return this.csvToJson(response.data);
			})
		.then((json) => {
			//console.log(json)
			return { options: json.items };
		});
	}

	render () {
		const selectDivStyle = {
			display: 'inline-block',
			width: '300px'
		}
		return (
			<div className="section">
				<h4 className="section-heading">{this.props.label}</h4>
				<div style={selectDivStyle}>
					<Select.Async
						onChange={this.onChange}
						simpleValue
						minimumInput={1}
						value={this.state.value}
						loadOptions={this.getOptions}
						placeholder=''
					/>
				</div>
				<p>
					<NumberWithLabel labelText='Clicks:' numberCount={this.state.sumClicks}/>
					<NumberWithLabel labelText='Impressions:' numberCount={this.state.sumImpressions} />
				</p>
			</div>
		)
	}
}