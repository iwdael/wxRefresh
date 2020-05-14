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
  onLoadmore(e) {
    var temp = app.loadArticle(10)
    temp.forEach(item => {
      this.data.articles.push(item)
    });
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        load: 1,
      })
    }, 800)
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
  onRefreshInfo(e) {
    console.log(e);
  },
  onRefreshDrag(e) {
    console.log('drag --- ', e.detail.space);
  },
  onRefreshDragEnd(e) {
    console.log(e);
  },
  onRefreshScroll(e) {
    console.log('scroll --- ', e.detail.space);
  },
  onRefreshTop(e) {
    console.log(e);
  },
  onRefreshBottom(e) {
    console.log(e);
  },
})