<template lang="pug">
.container
  .character-header
    img.background(v-if='character.images', :src='imageCDN + character.images[character.images.length - 1]')
    .media
      img(v-if='character.profile', :src='imageCDN + character.profile + "?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim"')
      .desc
        .names
          p.cname {{character.cname}}
          p.name {{character.name}}

  .character-body
    .intro
      p(v-for='item in character.intro') {{item}}

    .stills
      img(v-for='(item, index) in character.images', :src='imageCDN + item + "?imageView2/1/w/750/h/460/format/jpg/q/80|imageslim"', :key='index')

    .items(v-for='item in character.sections')
      .title {{ item.title }}
      .body(v-for='text in item.content') {{text}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: '家族成员详情'
    }
  },

  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      character: 'currentCharacter'
    })
  },

  beforeCreate () {
    let id = this.$route.query.id

    this.$store.dispatch('showCharacter', id)
  }
}
</script>

<style scoped lang='sass' src='public/static/sass/character.sass'></style>



