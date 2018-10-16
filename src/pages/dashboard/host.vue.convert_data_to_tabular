let unwatch_networkInterfaces = this.$watch('networkInterfaces', function(val, old){

      // ////////console.log('$watch networkInterfaces ', JSON.parse(JSON.stringify(val)), Object.getLength(val) )

      if(val !== undefined && Object.getLength(val) > 0){

        // let iface_index = 0
        Object.each(val, function(iface, name){

          Object.each(iface, function(data, messure){
            // if(name == 'lo' && messure == 'bytes'){
            if(messure == 'bytes' || messure == 'packets' || messure == 'errs'){
              ////////console.log('adding networkInterface chart '+this.host+'_os_networkInterfaces_stats_'+name+'_'+messure)
              let chart_name = this.host+'_os_networkInterfaces_stats_'+name+'_'+messure

              this.available_charts[chart_name] = Object.merge(
                Object.clone(this.get_payload(charts_payloads,{
                  name: 'os_networkInterfaces_stats',
                  host: this.host,
                  seconds: this.seconds
                })),
                Object.clone({
                  wrapper: {
                    type: 'dygraph',
                    props: {}
                  },
                  name: chart_name,
                  chart: Object.clone(networkInterfaces_chart),
                  // init: this.__get_stat_for_chart.bind(this),
                  init: this.__get_stat_to_tabular_for_chart.bind(this),
                  // init: function(payload){
                  //   console.log('init ', payload.name, payload)
                  //   this.__get_stat_for_chart(payload)
                  // }.bind(this),
                  stop: function(payload){
                    // this.remove_watcher(payload.name)
                    // this.__update_chart_stat(payload.name, [], 1)
                    this.$store.dispatch('stats_tabular/flush', payload.stat)
                    // this.remove_chart(payload.name, {unwatch: true})
                    // this.$store.dispatch('stats_tabular/splice', payload.stat)
                  }.bind(this),
                  watcher: {
                    name: '$store.state.stats.'+this.host+'.os.networkInterfaces',
                    deep:true,
                    // cb: this.__watcher_callback.bind(this)
                    cb: (doc, old, payload) => {
                      // if(this.visibility[payload.name] === true)

                      if(payload.chart.watch && payload.chart.watch.cumulative == true){//send all values
                        //console.log('generic_data_watcher send all', name)
                        // data_to_tabular(current, chart, name, this.update_chart_stat.bind(this))
                        data_to_tabular( this.stats[payload.name], payload.chart, payload.name, function(name, data){
                          this.__update_chart_stat(name, data, payload.stat.length)
                        }.bind(this))
                      }
                      else{//send last only

                        let new_doc = [Object.clone(doc)]

                        new_doc[0].value = new_doc[0].value.data

                        data_to_tabular( new_doc, payload.chart, payload.name, function(name, data){
                          console.log('WATCHER', doc, name, data, payload)

                          this.__update_chart_stat(
                            name,
                            {
                              metadata: doc.value.metadata,
                              data: data
                            },
                            payload.stat.length
                          )
                        }.bind(this))
                      }


                    }
                  },

                })
              )

            }
          }.bind(this))
        }.bind(this))

        unwatch_networkInterfaces()
      }
    }.bind(this),{
      deep:true
    })



    __get_stat_to_tabular_for_chart: function(payload){

      let {name, stat, pipeline} = payload

      /**
      * if stat is not array convert it, so we can manage both cases with the same code
      **/
      if(!Array.isArray(stat))
        stat = [stat]

      // if(!Array.isArray(pipeline))
      //   pipeline = [pipeline]

      this.add_chart_stat(name)

      /**
      * buffer for _merge_stats
      **/
      let buffer = {}
      let buffer_length = stat.length
      let _original_payload = Object.clone(payload)

      // let count_events = 0
      Array.each(stat, function(stat, index){
        // //console.log('__get_stat_for_chart', stat)

        let range = stat.range || [Date.now() - stat.length * 1000, Date.now()]
        let range_length = (range) ? Math.trunc((range[1] - range[0]) / 1000) : undefined
        let tabular = (stat.tabular) ? stat.tabular : false
        let watch_name = (tabular == true) ? '_tabular' : ''
        stat.range = range


        let indexed_name = name+'_'+index
        let indexed_payload = Object.clone(_original_payload)
        indexed_payload.name = (Array.isArray(_original_payload.stat)) ? indexed_name : _original_payload.name
        indexed_payload.stat = stat
        if(_original_payload.watcher && Array.isArray(_original_payload.watcher)){
          indexed_payload.watcher = _original_payload.watcher[index]
        }
        else if (_original_payload.watcher){
          indexed_payload.watcher = _original_payload.watcher
        }

        //console.log('_original_payload.watcher', indexed_payload.watcher)

        this.remove_watcher(indexed_name)


        indexed_payload.watcher = indexed_payload.watcher ||  {
          name: '$store.state.stats'+ watch_name +'.'+stat.host+'.'+stat.path+'.'+stat.key,
          deep:true,
          // cb: this.__watcher_callback.bind(this)
          cb: (doc, old, payload) => {
            // if(this.visibility[payload.name] === true)

            // //console.log('_original_payload', _original_payload)
            /**
            * check original stat, if it's not array, just update as there is nothing to merge
            **/
            if(!Array.isArray(_original_payload.stat)){
              this.__update_chart_stat(name, doc.value, payload.stat.length)
            }
            else{
              buffer = this._merge_stats({
                buffer: buffer,
                length: buffer_length,
                stat_name: name,
                data_name: indexed_name,
                data: doc.value,
                splice: payload.stat.length
              })
            }
          }
        }



        this.__get_stat(stat, function(docs){


          let new_docs_range = this.__get_new_docs_range(docs, range)
          docs = new_docs_range.docs
          range = new_docs_range.range

          /**
          * why not encapsulate al this code under if(pipeline.range == true)??
          * becasue we may want, for example, only one chart fire "osRange" and
          * multiple ones reacting to it
          **/
          let pipe = undefined
          let eventRange = undefined
          if(Array.isArray(pipeline)){
            pipe = this.$options.pipelines[pipeline[index].name]
            pipe.inputs[0].options.conn[0].module.options.paths = [pipeline[index].path]
            eventRange = (tabular == true) ? 'tabularRange' : pipeline[index].path+'Range'
          }
          else{
            pipe = this.$options.pipelines[pipeline.name]
            pipe.inputs[0].options.conn[0].module.options.paths = [pipeline.path]
            eventRange = (tabular == true) ? 'tabularRange' : pipeline.path+'Range'
          }


          EventBus.$once(eventRange, () => this.__get_stat(stat, function(docs_range){

              let all_stats = docs.append(docs_range)
              all_stats.sort(function(a,b) {return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0);} )

              // //console.log('__get_stat_for_chart __update_chart_stat', indexed_payload, range, all_stats.length, range_length)
              // console.log('__get_stat_for_chart __update_chart_stat', payload.stat, range_length, all_stats)


              this.__process_stat (indexed_payload.chart, indexed_payload.name, all_stats, function(name, data){
                console.log('Event __process_stat', name, data)
                /**
                * check original stat, if it's not array, just update as there is nothing to merge
                **/
                if(!Array.isArray(_original_payload.stat)){
                  //console.log('_original_payload.stat', _original_payload)
                  this.__update_chart_stat(name, data, range_length)
                }
                else{
                  buffer = this._merge_stats({
                    buffer: buffer,
                    length: buffer_length,
                    stat_name: name,
                    data_name: indexed_name,
                    data: data,
                    splice: range_length,
                    range: true
                  })
                }
              }.bind(this))

              Vue.nextTick(this.add_watcher(indexed_payload))


            }.bind(this))
          )

          if(Array.isArray(pipeline)){
            if(pipeline[index].range && pipeline[index].range == true)
              pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          }
          else{
            if(pipeline.range && pipeline.range == true)
              pipe.fireEvent('onRange', { Range: 'posix '+ range[0] +'-'+ range[1] +'/*' })
          }




        }.bind(this))

      }.bind(this))



    },
