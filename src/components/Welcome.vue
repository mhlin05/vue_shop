<template>
  <div>
    <h2>{{ num }}</h2>
    <el-button @click="go_add">action +</el-button>
    <el-button @click="add">muation +</el-button>
    <p>{{ token }}</p>
    <h2>{{ price }}</h2>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
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
  methods: {
    // go_add 等于 this.$store.dispatch('go_add')
    ...mapActions('my', ['go_add']),
    ...mapMutations('my', ['add'])
  },
  computed: {
    ...mapState({
      token: state => {
        return state.my.myToken
      },
      num: state => {
        return state.my.num
      }
    }),
    ...mapGetters('my', ['price'])
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
