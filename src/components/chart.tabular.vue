
<script>
// let array_to_tabular = require( 'node-tabular-data' ).array_to_tabular
// let number_to_tabular = require( 'node-tabular-data' ).number_to_tabular
// let nested_array_to_tabular = require( 'node-tabular-data' ).nested_array_to_tabular
// let data_to_tabular  = require( 'node-tabular-data' ).data_to_tabular


import chart from 'components/mixins/chart'

export default {
  mixins: [chart],

  name: 'chart-tabular',

  methods: {
    create (){
      console.log('create chart.tabular', this.id)

      // if(this.$refs[this.id] && typeof this.$refs[this.id].create == 'function')
      //   this.$refs[this.id].create()

      this.$options.tabular = {
        lastupdate: 0,
        data: []
      }



      let unwatch = this.$watch('stat.data', function (val, old) {
        // console.log('create chart.tabular', val)
        if(val && val.length > 1){

          if(this.$options.__chart_init == false){

            this.__create_watcher(this.id)
            this.$options.__chart_init = true


          }


          unwatch()
        }

      }, { deep: true } )
    },

    __create_watcher(name, chart){


      let generic_data_watcher = function(current){
        // console.log('chart.tabular generic_data_watcher', current)
        if(current && this.$options.visible){

          let data = []
          Array.each(current, function(row){
            data.push(row.value)
          })

          this.update_chart_stat(this.id, data)

        }
      }.bind(this)

      // //console.log('gonna watch...', name, this.stat.data)
      if(this.stat.data.length > 0)
        generic_data_watcher(this.stat.data)

      this.$options.__unwatcher = this.$watch('stat.data', generic_data_watcher)

    },

    // generic_data_watcher: data_to_tabular,

    // update_chart_stat (name, data){
    //   console.log('chart.tabular update_chart_stat', this.id, this.$refs[this.id])
    //
    //
    //   if(this.$options.visible == true && data.length > 0){
    //     // console.log('update_chart_stat visibility', this.id, data)
    //     if(data.length == 1){
    //
    //       // this.tabular.data.shift()
    //       // this.tabular.data.push(data[0])
    //       /**
    //       * ensures no "glitches" as a point may be in the incorrect posittion
    //       */
    //       // let old_data = Array.clone(this.tabular.data)
    //       // old_data.shift()
    //       // old_data.push(data[0])
    //       // old_data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //       // this.$set(this.tabular, 'data', old_data)
    //
    //       this.$options.tabular.data.shift()
    //       this.$options.tabular.data.push(data[0])
    //       this.$options.tabular.data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //       // this.$set(this.tabular, 'data', old_data)
    //
    //     }
    //     else{
    //
    //       data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
    //
    //       // this.$set(this.tabular, 'data', data)
    //       this.$options.tabular.data = data
    //
    //     }
    //
    //     // this.tabular.lastupdate = Date.now()
    //     this.$options.tabular.lastupdate = Date.now()
    //     if(this.$refs[this.id] && typeof this.$refs[this.id].update == 'function'){
    //       this.$refs[this.id].update(this.$options.tabular.data)
    //     }
    //     else{
    //       this.$set(this, 'tabular', this.$options.tabular)
    //     }
    //
    //   }
    //
    // },


  }
}
</script>
