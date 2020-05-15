const app = getApp()
Page({
  data: {
    articles: app.data.articles.slice(0, 3)
  },
  onRefresh(e) {
    this.data.articles = app.loadArticle(10).slice(0, 3)
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        refresh: 0,
      })
    }, 1000)
  },

  onLoadmore(e) {
    var temp = app.loadArticle(10)
    temp.forEach(item => {
      this.data.articles.push(item)
    });
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        load: 0,
      })
    }, 800)
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