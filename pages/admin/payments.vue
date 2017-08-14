<template lang="pug">
.content
  .related-products
    table.table
      thead
        tr
          th 图片
          th 标题
          th 价格
          th 支付价格
          th 姓名
          th 电话
          th 地址
          th 支付方式
      tbody
        tr(v-for='item in payments')
          td
            .img(v-for='image in item.images')
              img(:src='imageCDN + image + "?imageView2/1/format/jpg/q/75/imageslim"')
          td {{item.product.title}}
          td {{item.product.price}}
          td {{item.product.totalFee}}
          td {{item.name}}
          td {{item.phoneNumber}}
          td {{item.address}}
          td {{item.payType}}
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
import vSnackbar from '~components/snackbar'

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '订单列表'
    }
  },

  data () {
    return {}
  },

  async created () {
    this.$store.dispatch('fetchPayments')
  },

  computed: mapState([
    'imageCDN',
    'payments'
  ]),

  methods: {},

  components: {
    vSnackbar
  }
}
</script>
<style lang='sass' src='~static/sass/admin.sass'></style>