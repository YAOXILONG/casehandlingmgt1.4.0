export default {
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    renderContent (h, {node, data, store}) {
      let filterText = this.filterText
      let showNodeLabel = []
      if (filterText && node.label.indexOf(filterText) > -1) {
        showNodeLabel = node.label.split(filterText)
      } else {
        showNodeLabel.push(node.label)
      }
      return (
        <span title={node.label} class="el-tree-node__label">
          {showNodeLabel.map((val, i) => {
            let res = <span>{val}</span>
            if (i !== 0) {
              res = <span><span style={{color: 'red'}}>{filterText}</span>{val}</span>
            }
            return res
          })}
        </span>
      )
    }
  }
}
