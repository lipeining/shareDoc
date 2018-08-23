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
const importDoc = {
	fileName: { in: ['body']
	},
	delta: { in: ['body']
	},
};
const getDocUsers = {
	docId: { in: ['query']
	},
	type: { in: ['query']}
};
const addDocUser = {
	docId: { in: ['body']
	},
	userId: { in: ['body']
	},
	status: { in: ['body'],
		isInt: true,
		toInt: true
	}
};
const getMyDocNames = {

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
	importDoc: importDoc,
	getDocUsers: getDocUsers,
	addDocUser: addDocUser,
	getMyDocNames: getMyDocNames,
	getDocs: getDocs,
	getDoc: getDoc,
	getDocOps: getDocOps,
	getSnapshots: getSnapshots
};
