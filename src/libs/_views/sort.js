
export default [
	{
		_id: '_design/sort',
		views: {
			by_date: {
				map: function (doc) {
						var date = 0;

						if(!doc.metadata.timestamp){
							var id = doc._id.split('@');//get host.path | timestamp
							date = parseInt(id[1]);
						}
						else{
							date = parseInt(doc.metadata.timestamp);
						}

						emit([date, doc.metadata.type, doc.metadata.host], null);
					//}
				}.toString()
			},
			by_host: {
				map: function (doc) {
						var date = 0;

						if(!doc.metadata.timestamp){
							var id = doc._id.split('@');//get host.path | timestamp
							date = parseInt(id[1]);
						}
						else{
							date = parseInt(doc.metadata.timestamp);
						}

						//emit([doc.metadata.type, host, date], null);
						emit([doc.metadata.host, doc.metadata.type, date], null);
					//}
				}.toString()
			},
			by_path: {
				map: function (doc) {

						var date = 0;

						if(!doc.metadata.timestamp){
							var id = doc._id.split('@');//get host.path | timestamp
							date = parseInt(id[1]);
						}
						else{
							date = parseInt(doc.metadata.timestamp);
						}

						//emit([doc.metadata.type, doc.metadata.path, host, date], null);
						emit([doc.metadata.path, doc.metadata.host, doc.metadata.type, date], doc._rev);
					//}
				}.toString()
			}
		}
	},
	{
		_id: '_design/search',
		views: {
			hosts: {
				map: function (doc) {
					emit(doc.metadata.host, null);
				}.toString(),
				reduce: function(keys, values) {
					return null;
				}.toString()
			},
			paths: {
				map: function (doc) {
					emit(doc.metadata.path, null);
				}.toString(),
				reduce: function(keys, values) {
					return null;
				}.toString()
			},
		}
	}
]
