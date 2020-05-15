const app = getApp()
Page({
  data: {
    articles: app.data.articles.slice(0, 4)
  },


  onLoadmore(e) {
    var temp =[]
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


 
  onLoadStatus(e) {
    this.setData({
      "loadStatus": e.detail
    })
  },

})