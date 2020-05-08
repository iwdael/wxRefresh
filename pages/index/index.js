Page({
  data: {
    list1: [{}, {}, {}],
    list2: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    list3: [{}, {}, {}],
    refresh: false,
    load: false
    // list:[]
  },
  onRefresh(e) {
    setTimeout(() => {
      this.setData({
        "refresh": false,
      })
    }, 1000)
  },

  onLoad(e) {
    setTimeout(() => {
      this.setData({
        "load": false,
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
  onPinChange(e) {
    console.log("pin --- ", e.detail.progress)
  }
})