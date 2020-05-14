const app = getApp()
Page({
  data: {
    articles: app.data.articles.slice(0, 4)
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


  onLoadStatus(e) {
    this.setData({
      "loadStatus": e.detail.status
    })
  },

})