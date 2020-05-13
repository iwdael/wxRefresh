Page({
  data: {
    list1: [{}, {}, {}],
    list2: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    list3: [{}, {}, {}],
    // list1: [],
    // list2: [{}, {}, {}],
    // list3: [],
    refresh: false,
    load: false
    // list:[]
  },
  onRefresh(e) {
    setTimeout(() => {
      this.setData({
        "refresh": 0,
      })
    }, 1000)
  },

  onLoadmore(e) {
    setTimeout(() => {
      this.setData({
        "load": 1,
      })
    }, 1000)
  },


  onRefreshStatus(e) {
    this.setData({
      "refreshStatus": e.detail.status
    })
  },
  onLoadStatus(e) {
    this.setData({
      "loadStatus": e.detail.status
    })
  },
  onStickyChange(e) {
    var id = e.detail.id
    var pro = e.detail.progress
    if (id == '__sticky') {
      console.log(pro); 
    }
  },
  onReady() {
    this.setData({
      "refresh": 100
    })
  },
  onScrollBottom(e) {}
})