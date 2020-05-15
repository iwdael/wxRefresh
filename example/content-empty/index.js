const app = getApp()
Page({
  data: {
    articles: []
  },
  onRefresh(e) {
    this.data.articles = app.loadArticle(10)
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        refresh: 0,
      })
    }, 1000)
  },
  onLoadmore(e) {
    this.data.articles = []
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        load: 1,
      })
    }, 2000)
  },

  onRefreshStatus(e) {
    this.setData({
      "refreshStatus": e.detail
    })
  },

  onLoadStatus(e) {
    this.setData({
      "loadStatus": e.detail
    })
  },
})