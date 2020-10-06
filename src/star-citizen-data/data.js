const STATUS = {
	RELEASED: 0,
	WORKINPROGRESS: 1,
	PLANNED: 2,
	UNKNOWN: 3,
}

const SIZE = {
	MAJOR: 1,
	MINOR: 2,
	SMALL: 3,
	TINY: 4,
}


var data = {
	features: [
		{
			name: "Tech",
			size: SIZE.MAJOR,
			status: STATUS.UNKNOWN,
			dependsOn: [
				"Dynamic Server Meshing"
			]
		},
		{
			name: "Dynamic Server Meshing",
			size: SIZE.MAJOR,
			status: STATUS.PLANNED,
			dependsOn: [
				"Static Server Meshing",
				"Load Balancer"
			]
		},
		{
			name: "Static Server Meshing",
			size: SIZE.MINOR,
			status: STATUS.WORKINPROGRESS,
			dependsOn: [
				"Server Object Container Streaming (SOCS)",
				"Physicalized Items and Inventory",
				"Clocks & If-Statement Refactor",
				"Global Persistence",
				"Item Cache"
			]
		},
		{
			name: "Server Object Container Streaming (SOCS)",
			size: SIZE.MINOR,
			status: STATUS.RELEASED,
			dependsOn: [
				"Client Object Container Streaming (COCS)",
				"Location IDs",
				"Definitive State",
				"Entity Streaming Manager"
			]
		},
		{
			name: "Client Object Container Streaming (COCS)",
			size: SIZE.MINOR,
			status: STATUS.RELEASED,
			dependsOn: [
				"Object Containers",
				"Serialized Variable Culling",
				"Entity Spawn Batches & Entity Snapshots",
				"Entity Ownership Hierarchy / Entity Aggregates",
				"Entity Component Update Scheduler"
			]
		},
		{
			name: "Object Containers",
			size: SIZE.MINOR,
			status: STATUS.RELEASED,
			dependsOn: [
				"MegaMap & 64bit conversion",
				"Multi-Threaded Resource Loading",
				"Serialized Variables",
				"LUA Removal & C++ Entity Components"
			]
		}
	]
};
export default data;