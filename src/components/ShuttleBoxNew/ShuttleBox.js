export default {
  data () {
    return {
      keyCode: 'personIndexCode',
      currentSelectIndexCode: '',
      // 左边
      leftSearchValue: '',
      leftSearchInput: '',
      leftMultipleSelection: [],
      // 右边
      rightTableData: [],
      rightTableDataFilterSelect: [],
      rightSearchValue: '',
      rightSearchInput: '',
      rightMultipleSelection: [],
      rightMultipleSelectionIdList: [],
      rightTableIdList: []
    }
  },
  props: {
    leftTableData: {
      type: Array,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    leftTableDataFilterSelect () {
      return this.leftTableData.filter(v => this.rightTableIdList.indexOf(v[this.keyCode]) === -1)
    }
  },
  watch: {
    rightTableData (val) {
      this.rightTableIdList = val.map(v => v[this.keyCode])
    },
    rightMultipleSelection (val) {
      this.rightMultipleSelectionIdList = val.map(v => v[this.keyCode])
      console.log(this.rightMultipleSelectionIdList)
    }
  },
  methods: {
    pushData () {
      this.rightTableData.push(...this.leftMultipleSelection)
      this.rightHandleIconClick()
    },
    deleteData () {
      this.rightTableData = this.rightTableData.filter(v => this.rightMultipleSelectionIdList.indexOf(v[this.keyCode]) === -1)
      this.rightHandleIconClick()
    },
    leftHandleIconClick () {
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: this.currentSelectIndexCode,
          [this.leftSearchValue]: this.leftSearchInput
        }
      })
    },
    leftClearIconClick () {
      this.$emit('ShuttleEvent', {
        type: 'getLeftData',
        payload: {
          indexCode: this.currentSelectIndexCode
        }
      })
    },
    leftHandleSelectionChange (val) {
      this.leftMultipleSelection = val
    },
    rightHandleIconClick () {
      if (!this.rightSearchValue) {
        this.rightTableDataFilterSelect = this.rightTableData
      } else {
        this.rightTableDataFilterSelect = this.rightTableData.filter(v => v[this.rightSearchValue].indexOf(this.rightSearchInput) > -1)
      }
    },
    rightClearIconClick () {
      this.rightTableDataFilterSelect = this.rightTableData
    },
    rightHandleSelectionChange (val) {
      this.rightMultipleSelection = val
    }
  }
}
