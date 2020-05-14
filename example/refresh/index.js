const app = getApp()
Page({
  data: {
    articles: app.data.articles
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
 

  onRefreshStatus(e) {
    this.setData({
      "refreshStatus": e.detail.status
    })
  }, 
})