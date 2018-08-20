const getMessages = {
	pageIndex: { in: ['query'],
		isInt: {
			options: {
				min: 1
			}
		},
		toInt: true
	},
	pageSize: { in: ['query'],
		isInt: {
			options: {
				min: 1
			}
		},
		toInt: true
	}
};

module.exports = {
    getMessages: getMessages
}
