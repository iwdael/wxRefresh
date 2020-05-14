 Component({
   /**
    * 组件的属性列表
    */
   properties: {
     status: {
       type: Number,
       value: 1,
       observer: 'statusObserver'
     }
   },

   data: {
     loadStatus: 1,
   },

   methods: {
     statusObserver() {
      //  console.log('load statusObserver---', this.properties.status); 
       this.setData({
        loadStatus: this.properties.status,
       })
     },
   }
 })