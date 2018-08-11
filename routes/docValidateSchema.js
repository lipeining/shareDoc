const createDoc = {
	collectionName: { in: ['body'],
		isLength: {
			options: {
				min: 2,
				max: 50
			}
		}
	},
	documentId: { in: ['body'],
		isLength: {
			options: {
				min: 2,
				max: 50
			}
		}
	},
};
const addDocUser = {
	docId: { in: ['body']
	},
	userId: { in: ['body']
	}
};
const getDoc = {
	id: { in: ['query']
	}
};
const getDocs = {
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
const getDocOps = {
	collectionName: { in: ['query']
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
	collectionName: { in: ['query']
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
	createDoc: createDoc,
	addDocUser: addDocUser,
	getDocs: getDocs,
	getDoc: getDoc,
	getDocOps: getDocOps,
	getSnapshots: getSnapshots
};
