export default function() {
  return {
    docs: {
      count: null,
      search: null,
      os: null,
    },
    docs_per_sec: 0,
    paths: [],
    /**
    *
    **/
    reset: false,
    suspend: false,
    pause: false,
    freeze: false,
    /**
    *
    **/
    range: [],
    // charts_tree_menu: [],
    // default_chart_icon: 'mdi-pulse',
    // icons: {
    //   'mdi-chart-line': /^os$/,
    //   'mdi-flash': /cpus.*/,
    //   'mdi-memory': /^.*mem.*$/,
    //   'mdi-clock': /minute.*/,
    //   'mdi-harddisk': /blockdevices.*|mounts.*/,
    //   'mdi-network': /networkInterfaces.*/
    //   // 'mdi-pulse': /.*/
    // },
  }
}
