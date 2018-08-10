const getDocOps = {
	collection: { in: ['query']
	},
	documentId: { in: ['query'],
		isLength: {
			options: {
				min: 2,
				max: 50
			}
		}
	},
	from: { in: ['query'],
		isInt: {
			options: {
				min: 1
			}
		},
		toInt: true,

	},
	to: { in: ['query'],
		isInt: {
			options: {
				min: 1
			}
		},
		toInt: true,

	}
};
const getSnapshots = {
	collection: { in: ['query']
	},
	documentId: { in: ['query'],
		isLength: {
			options: {
				min: 2,
				max: 50
			}
		}
	}
};

module.exports = {
	getDocOps: getDocOps,
	getSnapshots: getSnapshots
};
