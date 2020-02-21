const isEmail = (email) => {
	/* eslint-disable-next-line */
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	else return false;
};

//is empty helper function
const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

//Validate User data
exports.validateSignupData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) {
		errors.email = 'Email must not be empty';
	} else if (!isEmail(data.email)) {
		errors.email = 'Valid email address is required';
	}

	if (isEmpty(data.password)) errors.password = 'Cannot be empty';
	if (data.password !== data.confirmPassword)
		errors.confirmPassword = 'Passwords do not match';
	if (isEmpty(data.handle)) errors.handle = 'Cannot be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.validateLoginData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) errors.email = 'Cannot be empty';
	if (isEmpty(data.password)) errors.password = 'Cannot be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.reduceUserDetails = (data) => {
	let userDetails = {};
	if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
	if (!isEmpty(data.location.trim())) userDetails.location = data.location;
	if (!isEmpty(data.whatsapp.trim())) userDetails.whatsapp = data.whatsapp;
	return userDetails;
};
