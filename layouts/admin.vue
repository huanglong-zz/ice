<template lang="pug">
  #app
    v-header
    #container
      v-aside
      nuxt
</template>

<script>
import vHeader from 'public/components/header.vue'
import vAside from 'public/components/aside.vue'

export default {
  components: {
    vHeader,
    vAside
  }
}
</script>

<style lang='sass'>
#container
  display: flex
</style>