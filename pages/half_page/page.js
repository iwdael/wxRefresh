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
})