 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      value: 1,
      observer: 'statusObserver'
    }
  },
 
  data: {

  },
 
  methods: {
    statusObserver() {
      console.log('statusObserver--', this.properties.status)
    },
  }
})