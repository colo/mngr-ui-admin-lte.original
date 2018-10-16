
<script>

export default {

  components: {
  },

  __unwatcher: undefined,

  // props: {
  //   EventBus: {
  //     type: [Object],
  //      default: () => ({})
  //   },
  //   id:{
  //     type: [String],
  //     default: ''
  //   },
  // },

  data () {
    return {
      lastupdate: 0,
      'data': []
    }

  },

  destroyed (){
    this.$off()
  },
  methods: {
    get: function(payload, cb){
      ////console.log('__get_stat', payload)
      if(payload.tabular == true){
        this.$store.dispatch('stats_tabular/get', payload).then((docs) => cb(docs))
      }
      else{
        this.$store.dispatch('stats/get', payload).then((docs) => cb(docs))
      }
    },
  }
}
</script>
