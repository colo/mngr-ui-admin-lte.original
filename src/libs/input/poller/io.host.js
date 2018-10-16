'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )

import { throttle } from 'quasar'

export default new Class({
  Extends: App,


  options: {

    path: '/os',

    status: undefined,

    stat_host: null,

  	requests : {
      range: [
    		{
					// sort_by_path: throttle(function(req, next, app){
          sort_by_path: function(req, next, app){
            //console.log('SORT_BY_PATH RANGE', app.options.paths, req, new Date(req.opt.range.start), new Date(req.opt.range.end))

            if(app.options.stat_host && this.status == 'ok'){
              // let start_key = (app.options.path_start_key != null) ? app.options.path_start_key: app.options.path_key
              // let end_key = (app.options.path_end_key != null ) ? app.options.path_end_key : app.options.path_key


              // // let CHUNK = 60000
              // let end = (req.opt.range.end != null) ?  req.opt.range.end : Date.now()
              // // let start = ((end - CHUNK) < req.opt.range.start) ? req.opt.range.start : end - CHUNK
              // let start = req.opt.range.start
              //
              // // do {

                Array.each(app.options.paths, function(path){

                  if(!app.options.paths_blacklist || app.options.paths_blacklist.test( path ) == false){

                    // this.io.emit('stats', {
                    //   host: app.options.stat_host,
                    //   path: path,
                    //   range: req.opt.range
        						// })
                    this.io.emit('stats', {
                      host: app.options.stat_host,
                      stat: path,
                      format: 'tabular',
                      // range: req.opt.range
                      range: req.Range
        						})
                  }

                }.bind(app))

            }



					// }, 500)
          }

				},

			],
      once: [
        {
					charts: function(req, next, app){

            if(app.options.stat_host){

              this.io.emit('charts', app.options.stat_host)

            }

					}
				},
        {
					stats: function(req, next, app){

            if(app.options.stat_host){

              this.io.emit('stats', app.options.stat_host)

            }

					}
				},
        // {
				// 	charts_by_host: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('charts', {
        //         host: app.options.stat_host,
        //       })
        //
        //     }
        //
				// 	}
				// }
			],
			periodical: [
        // {
				// 	sort_by_host: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('periodical', {
        //         host: app.options.stat_host,
        //       })
        //
        //     }
        //
				// 	}
				// }
			],

		},

    io: {
			// middlewares: [], //namespace.use(fn)
			// rooms: ['root'], //atomatically join connected sockets to this rooms
			routes: {
        // 'charts':[{
        //   callbacks: ['charts']
        // }],
        'charts': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['charts'],
					// middlewares: [], //socket.use(fn)
				}],
				'stats': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['stats'],
					// middlewares: [], //socket.use(fn)
				}],
				// '*': [{// catch all
				// 	path: '',
				// 	callbacks: ['not_found_message'],
				// 	middlewares: [], //socket.use(fn)
				// }]
			}
		}


  },
  // charts: function(socket, next){
  //   let {host, charts} = arguments[2]
  //   ////console.log('IO.HOST charts', host, charts)
  //
  //   this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
  // },
  charts: function(socket, next){
    let {host, status, charts} = arguments[2]
    // //console.log('IO.HOST charts', host, status, charts)
    this.status = status

    this.fireEvent('onDoc', [Object.merge({type: 'charts'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);

    // this.charts(socket, next, {host: host, charts: charts})
    // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
    //
    // if(status == 'ok')
    //   this.io.emit('range', )
  },
  stats: function(socket, next){
    let {type, doc, tabular} = arguments[2]
    // //console.log('IO.HOST stats', arguments[2])

    // if(tabular != true)
      this.fireEvent((type == 'range') ? 'onRangeDoc' : 'onPeriodicalDoc', [Object.merge(arguments[2], {type: 'stats', range: (type == 'range') ? true : false}), {type: type, input_type: this, app: null}]);

		// ////console.log('app_doc...', socket, arguments[2])
		// arguments[1]()
		// this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
		// next(socket)
	},

  initialize: function(options){
		this.parent(options);//override default options

		this.profile('root_init');//start profiling

    this.addEvent('onExit', function(){
      ////console.log('EXITING...')

      if(this.io.disconnected == false)
        this.io.close()
    })
    // ////console.log('this.io', this.io)
    // this.io.emit('host', this.options.stat_host)

		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },

});
