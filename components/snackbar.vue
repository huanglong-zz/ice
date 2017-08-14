<template lang="pug">
transition(name=swing)
  .snackbar(v-if='open')
    .snackbar-content
      slot(name='body')
      slot(name='action', @click='$emit("update:open", false)')
</template>

<script>
export default {
  props: {
    open: {
      default: false
    }
  },

  watch: {
    'open': function (newVal, oldVal) {
      if (newVal) {
        var timer = setTimeout(() => {
          this.$emit('update:open', false)
          clearTimeout(timer)
        }, 3 * 1000)
      }
    }
  }
}

</script>

<style lang='sass' src='~static/sass/snackbar.sass'></style>
