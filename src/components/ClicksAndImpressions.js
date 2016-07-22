import React from 'react';
import Select from 'react-select';

var axios = require('axios');

var _ = require('lodash');

var ClicksAndImpressions = React.createClass({
	displayName: 'ClicksAndImpressions',
	propTypes: {
		label: React.PropTypes.string
	},
	getInitialState () {
		return {
			value: "",
			sumClicks: 0,
			sumImpressions: 0,
			options: [],
			adwordData: {}
		}
	},

	onChange(value) {
		console.log('New Value', value);

		var result = _.pickBy(this.state.adwordData, function(v, k) {
		  return _.startsWith(v.campaign, value) || _.startsWith(v.channel, value);
		});

		//console.log(JSON.stringify(result));

		var sumClicks = _.reduce(result, function(sum, n){
		  return sum + parseFloat(n.clicks);
		}, 0);

		//console.log(sumClicks);

		var sumImpressions = _.reduce(result, function(sum, n){
		  return sum + parseFloat(n.impressions);
		}, 0);

		//console.log(sumImpressions);

		this.setState({value: value, sumClicks: sumClicks, sumImpressions: sumImpressions});

	},
	csvToJson(csv) {
		const content = csv.trim().split('\n');
		//console.log(content)
		const header = content[0].split(',');
		var jsonData = _.tail(content).map((row) => {
			var data = _.zipObject(header, row.split(','));
			return data;
		});

		this.setState({adwordData : jsonData});

		var uniques = _.concat(...new Set(jsonData.map(item => item.campaign)), ...new Set(jsonData.map(item => item.channel)));

		//console.log(JSON.stringify(uniques));

		const options = _.map(uniques, function(value, key) {
			return { value: value, label: value };
		});

		return {items: options};
	},
	getOptions (input) {
		return axios.get('http://mockbin.org/bin/3f1037be-88f3-4e34-a8ec-d602779bf2d6').then((response) => {
			return this.csvToJson(response.data);
		})
      .then((json) => {
      	//console.log(json)
        return { options: json.items };
      });
	},

	render () {
		return (
			
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select.Async
					onChange={this.onChange}
					simpleValue
					minimumInput={1}
					value={this.state.value}
					loadOptions={this.getOptions}
				/>
				<div>Clicks: {this.state.sumClicks} Impressions: {this.state.sumImpressions}</div>
			</div>
		);
	}
});

module.exports = ClicksAndImpressions;