// pages/half_page/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{}, {}, {}],
  },
  onRefresh(e) {
    setTimeout(() => {
      this.setData({
        "refresh": 1,
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
})