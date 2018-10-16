
<script>
// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular

import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  tabular: {
    lastupdate: 0,
    data: []
  },

  name: 'chart',

  // updated () {
  //   if(this.stat.data.length > 0)
  //     this.__process_stat(this.chart, this.id, this.stat.data)
  // },
  methods: {
    visibilityChanged (isVisible, entry) {
      // if(
      //   isVisible == true
      // ){
      //     // this.__process_stat(this.chart, this.id, this.stat.data)
      //     this.create()
      // }
      // else{
      //   this.destroy()
      // }

      this.$options.visible = isVisible
    },

    create (){
      console.log('chart.vue create', this.id)
      // if(this.$refs[this.id] && typeof this.$refs[this.id].create == 'function')
      //   this.$refs[this.id].create()

      this.$options.tabular = {
        lastupdate: 0,
        data: []
      }



      let unwatch = this.$watch('stat.data', function (val, old) {


        // if(val && val.length > 1){
        if(val && val.length > 1){

          if(this.$options.__chart_init == false){

            this.__process_stat(this.chart, this.id, this.stat.data)
            this.$options.__chart_init = true

          }


          unwatch()
        }

      }, { deep: true } )
    },


    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_stat (chart, name, stat){
      //console.log('__process_stat', name, stat)
      if(!Array.isArray(stat))
        stat = [stat]


      if(isNaN(stat[0].value)){
        //sdX.stats.

        let filtered = false
        if(chart.watch && chart.watch.filters){
          Array.each(chart.watch.filters, function(filter){
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if(
              stat[0].value[prop_to_filter]
              && value_to_filter.test(stat[0].value[prop_to_filter]) == true
            ){
              filtered = true
            }

          })
        }
        else{
          filtered = true
        }

        if(filtered == true && typeof chart.pre_process == 'function'){

          chart = chart.pre_process(chart, name, stat)

          this.__process_chart(chart, name, stat)
        }

      }
      else{


        if(typeof chart.pre_process == 'function'){
          chart = chart.pre_process(chart, name, stat)
        }

        this.__process_chart(chart, name, stat)
      }

    },
    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_chart (chart, name, stat){
      console.log('__process_chart', this.stat.data, name, stat)

      if(chart.init && typeOf(chart.init) == 'function')
        chart.init(this, chart, name, stat, 'chart')

      /**
      * first update
      **/
      if(this.stat.data.length > 0){

        data_to_tabular(this.stat.data, chart, name, this.update_chart_stat.bind(this))
      }

      this.__create_watcher(name, chart)

    },

    __create_watcher(name, chart){
      let watcher = chart.watch || {}

      watcher.value = watcher.value || ''
      watcher.transform = watcher.transform || ''

      if(this.$options.__unwatcher){
        this.$options.__unwatcher()
        this.$options.__unwatcher == undefined
      }

      let generic_data_watcher = function(current){
        if(current){

          if(this.$options.visible){
            if(chart.watch && chart.watch.cumulative == true){//send all values
              //console.log('generic_data_watcher send all', name)
              data_to_tabular(current, chart, name, this.update_chart_stat.bind(this))
            }
            else{//send last only
              // console.log('generic_data_watcher send last', name, current)
              data_to_tabular([ current[current.length - 1] ], chart, name, this.update_chart_stat.bind(this))
            }

          }
        }
      }

      //console.log('gonna watch...', name, this.stat.data)

      this.$options.__unwatcher = this.$watch('stat.data', generic_data_watcher)

    },

    // generic_data_watcher: data_to_tabular,


    // update_chart_stat (name, data){
    //
    //   console.log('chart update_chart_stat', this.id, this.$refs[this.id])
    //
    //   if(this.$options.visible == true && data.length > 0){
    //     if(data.length == 1){
    //
    //       // this.tabular.data.shift()
    //       // this.tabular.data.push(data[0])
    //
    //       /**
    //       * ensures no "glitches" as a point may be in the incorrect posittion
    //       */
    //       let old_data = Array.clone(this.tabular.data)
    //       old_data.shift()
    //       old_data.push(data[0])
    //       old_data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
    //       this.$set(this.tabular, 'data', old_data)
    //     }
    //     else{
    //       // let length = this.stat.data.length
    //       // if(data.length > length)
    //       //   data.splice(
    //       //     -length -1,
    //       //     data.length - length
    //       //   )
    //
    //       data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
    //
    //       // console.log('update_chart_stat visibility', name, data)
    //
    //       this.$set(this.tabular, 'data', data)
    //
    //     }
    //
    //     this.tabular.lastupdate = Date.now()
    //     if(this.$refs[this.id] && typeof this.$refs[this.id].update == 'function')
    //       this.$refs[this.id].update(this.tabular.data)
    //
    //     // if(data.length == 1){
    //     //
    //     //   // this.tabular.data.shift()
    //     //   // this.tabular.data.push(data[0])
    //     //   // data = Array.clone(this.$options.data).push(data[0])
    //     //   this.$options.data.push(data[0])
    //     // }
    //     // else{
    //     //   // let length = this.stat.data.length
    //     //   // if(data.length > length)
    //     //   //   data.splice(
    //     //   //     -length -1,
    //     //   //     data.length - length
    //     //   //   )
    //     //
    //     //   this.$options.data = data
    //     // }
    //     //
    //     // this.$options.data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
    //     //
    //     // let length = this.stat.data.length
    //     // if(this.$options.data.length > length)
    //     //   this.$options.data.splice(
    //     //     -length -1,
    //     //     this.$options.data.length - length
    //     //   )
    //     //
    //     //
    //     //
    //     // this.$refs[this.id].update(this.$options.data)
    //     //
    //     // this.tabular.lastupdate = Date.now()
    //   }
    //
    //
    // },


  }
}
</script>
