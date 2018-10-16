<template>
  <div>
    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box bg-aqua">
        <span class="info-box-icon"><i class="fa fa-envelope-o"></i></span>

        <div class="info-box-content">
          <span class="info-box-text"></span>
          <span class="info-box-number"></span>
        </div>
        <!-- /.info-box-content -->
      </div>
      <!-- /.info-box -->
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <div class="info-box bg-yellow">
        <span class="info-box-icon"><i class="fa fa-files-o"></i></span>

        <div class="info-box-content">
          <span class="info-box-text"></span>
          <span class="info-box-number"></span>
        </div>
        <!-- /.info-box-content -->
      </div>
      <!-- /.info-box -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin-lte-dashboard-host-summary',

  props: {
    // docs_per_sec: {
    //   type: [Number],
    //    default: 0
    // },
    // number_of_hosts: {
    //   type: [Number],
    //    default: 0
    // },

  },

  data () {
    return {
    }
  },

}

</script>
