<template lang="pug">
.content
  h3 登录成功 {{user.email}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '后台管理首页'
    }
  },

  computed: mapState([
    'user'
  ])
}

</script>

<style lang='sass' src='public/static/sass/admin.sass'></style>