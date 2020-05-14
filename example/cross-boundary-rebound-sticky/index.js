const app = getApp()
Page({
  data: {
    articles: app.data.articles
  },
  onRefreshSticky(e) {
    console.log(e.detail.percent)
  }
})