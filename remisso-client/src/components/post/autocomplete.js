import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete';
let suggestion1 = '';

export class autocomplete extends Component {
	constructor(props) {
		super(props);
		this.state = { location: '' };
	}
	handleChange = (location) => {
		this.setState({ location });
	};

	handleSelect = (location) => {
		geocodeByAddress(location)
			.then((results) => getLatLng(results[0]))
			.then((results) => {
				this.setState({
					lat: results.lat,
					lng: results.lng
				});

				this.passState();
			})
			.catch((error) => console.error('Error', error));
		this.setState({ location });
	};

	passState = () => {
		this.props.callbackFromParent(this.state);
	};
	handleClickAway = () => {
		if (!this.state.location) {
			this.handleSelect(suggestion1);
		} else {
			this.handleSelect();
		}
	};

	render() {
		return (
			<div>
				<ClickAwayListener onClickAway={this.handleClickAway}>
					<PlacesAutocomplete
						value={this.state.location}
						onChange={this.handleChange}
						onSelect={this.handleSelect}
						highlightFirstSuggestion>
						{({
							getInputProps,
							suggestions,
							getSuggestionItemProps,
							loading
						}) => (
							<div>
								<div>
									<TextField
										name='location'
										type='text'
										label='Location'
										multiline
										rows='2'
										placeholder='Enter a location'
										fullWidth
										{...getInputProps({})}>
										{' '}
									</TextField>
								</div>

								<div className='autocomplete-dropdown-container'>
									{loading && <div>Loading...</div>}
									{suggestions.map((suggestion) => {
										const className = suggestion.active
											? 'suggestion-item--active'
											: 'suggestion-item';

										const style = suggestion.active
											? { color: '#46A2C8', cursor: 'pointer' }
											: {
													backgroundColor: '#ffffff',
													cursor: 'pointer'
											  };
										suggestion1 = suggestions[0].description;
										return (
											<div
												{...getSuggestionItemProps(suggestion, {
													className,
													style
												})}>
												<span>{suggestion.description}</span>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</PlacesAutocomplete>
				</ClickAwayListener>
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDj_9odVBkDDQJwwvudv1Buf6s-KCLomME'
})(autocomplete);
