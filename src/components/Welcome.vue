<template>
  <div>
    <p>贵客光临 随意挑选</p>
    <p>请问有什么可以帮您</p>
    <p>{{ token }}</p>
    <h2>{{ price }}</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  //   computed: {
  //       info: this.$store
  //   }
  created() {
    // console.log(this)
    console.log(this.$store.getters['my/price'])
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    ...mapState({
      token: state => {
        return state.my.myToken
      }
    })
    // price: this.$store.getters['my/price']
  }
}
</script>

<style lang="less" scoped>
div {
  font-size: 50px;
  color: red;
}
</style>
