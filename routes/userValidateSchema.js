const getUsers = {
	pageIndex: { in: ['query'],
		toInt: true
	},
	pageSize: { in: ['query'],
		toInt: true
	}
};
const getUser = {
	id: { in: ['query'],
		isInt: true,
		toInt: true
	}
};
const login = {
	email: { in: ['body'],
		isEmail: true,
	},
	password: { in: ['body'],
		isLength: {
			errorMessage: 'Password should be salt sha256',
			// Multiple options would be expressed as an array
			options: { min: 64, max: 256 }
		}
	}
};
const reg = {
	name: { in: ['body'],
		isLength: {
			errorMessage: 'name should be in [5,16]',
			// Multiple options would be expressed as an array
			options: { min: 5, max: 16 }
		}
	},
	email: { in: ['body'],
		isEmail: true,
	},
	password: { in: ['body'],
		isLength: {
			errorMessage: 'Password should be salt sha256',
			// Multiple options would be expressed as an array
			options: { min: 64, max: 256 }
		}
	}
};
const update = {
	email: { in: ['body'],
		isEmail: true,
	},
	name: { in: ['body'],
		isLength: {
			errorMessage: 'name should be in [5,16]',
			// Multiple options would be expressed as an array
			options: { min: 5, max: 16 }
		}
	},
	intro: { in: ['body'],
		isLength: {
			errorMessage: 'introduction should be in [20,120]',
			// Multiple options would be expressed as an array
			options: { min: 20, max: 120 }
		}
	}
};
module.exports = {
	getUsers: getUsers,
	getUser: getUser,
	login: login,
	reg: reg,
	update: update,
};
