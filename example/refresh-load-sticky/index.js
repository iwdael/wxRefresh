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
    // var temp = app.loadArticle(10)
    // temp.forEach(item => {
    //   this.data.articles.push(item)
    // });
    setTimeout(() => {
      this.setData({
        articles: this.data.articles,
        load: 1,
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

  onDrag(e){
      console.log(e.detail.space);
      
  },
})