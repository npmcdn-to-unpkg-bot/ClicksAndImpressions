import React from 'react';

var NumberWithLabel = React.createClass({
	render () {
		var outerSpanStyle = {
			marginRight: '1em',
			display: 'inline'
		}
		var innerSpanStyle = {
			color: '#DD0000',
			backgroundColor: '#EEEEEE',
			border : '1px gray',
			borderRadius: '3px',
			padding: '0.3em'
		}
		return (
			<span style={outerSpanStyle}>
				{this.props.labelText} <span style={innerSpanStyle}>{this.props.numberCount}</span>
			</span>
		);
	}
});

module.exports = NumberWithLabel;