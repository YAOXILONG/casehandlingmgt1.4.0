<template>
  <span class="working_time">
    {{ showTime }}
  </span>
</template>
<script>
export default {
  name: 'Time',
  data () {
    return {}
  },
  computed: {
    clock () {
      return Math.floor(((this.sysTime - this.input) < 0 ? 0 : (this.sysTime - this.input)) / 1000)
    },
    showTime () {
      return `${Math.floor(this.clock / 3600)}:${Math.floor(this.clock / 60) % 60 > 9 ? '' : '0'}${Math.floor(this.clock / 60) % 60}:${this.clock % 60 > 9 ? '' : '0'}${this.clock % 60}`
    }
  },
  props: {
    input: {
      type: null,
      default () {
        return 0
      }
    },
    sysTime: {
      type: null,
      default () {
        return 0
      }
    }
  },
  methods: {}
}
</script>
