const getDocOps = {
	collection: { in: ['query'] },
	documentId: { in: ['query'],
		isLength: {
			options: { min: 2, max: 50 }
		}
	},
	from: { in: ['query'],
		isInt: true,
		toInt: true,
		min: 1
	},
	to: { in: ['query'],
		isInt: true,
		toInt: true,
		min: 1
	}
};
const getSnapshots = {
	collection: { in: ['query'] },
	documentId: { in: ['query'],
		isLength: {
			options: { min: 2, max: 50 }
		}
	}
};

module.exports = {
	getDocOps: getDocOps,
	getSnapshots: getSnapshots
};
