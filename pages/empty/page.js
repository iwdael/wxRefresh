// pages/half_page/page.js
Page({


  data: {
    list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    // list: []
  },
  onRefresh(e) {
    // this.data.list = []
    setTimeout(() => {
      this.setData({
        "refresh": 0,
        list: this.data.list
      })
    }, 1000)
  },

  onLoadmore(e) {
    this.data.list.push()
    setTimeout(() => {
      this.setData({
        "load": 1,
        list: this.data.list
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
})