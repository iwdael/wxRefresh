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
     refreshStatus: 1,
   },

   methods: {
     statusObserver() {
       console.log('refresh statusObserver---', this.properties.status);

       this.setData({
         refreshStatus: this.properties.status,
       })
     },
   }
 })