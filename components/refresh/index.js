Component({
	options: {
		multipleSlots: true,
	},
	data: {
		refresherHeight: 0,
		headerHeight: 0,
		movableY: 0, //movable y方向的偏移量
		refreshStatus: 1, // 1: 下拉刷新, 2: 松开更新, 3: 加载中, 4: 加载完成
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#refresher").boundingClientRect((refresher) => {
				this.data.refresherHeight = refresher.height
				this.setData({
					refresherHeight: this.data.refresherHeight,
					movableY: - (this.data.refresherHeight + 1),
				})
			}).exec();
			this.createSelectorQuery().select("#header").boundingClientRect((header) => {
				this.data.headerHeight = header.height
			}).exec();
		},
		onMovableChange(e) {
			console.log('onMovableChange')
		},
		onMovableTouchEnd(e) {
			console.log(e)
			if(this.data.refreshStatus > 2) return
			if(this.data.refreshStatus ==1 ){
				this.setData({
					movableY:-(this.data.refresherHeight+1)
				})
			}else {
				this.setData({
					movableY:0
				})
			}
		},
		onScrollChanged(e) {
			// console.log(  e)
		},
		onScrollBottom() {
			console.log('onScrollBottom')
		},
	},
	ready() {
		this.init();
	}
});