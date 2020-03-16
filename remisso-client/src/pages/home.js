import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

export class home extends Component {
	render() {
		return (
			<div>
				<Grid container spacing={16}>
					<Grid item sm={8} xs={12}>
						info here
					</Grid>
					<Grid item sm={4} xs={12}>
						profile here
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default home;
