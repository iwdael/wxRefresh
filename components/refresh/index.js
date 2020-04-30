Component({
	options: {
		multipleSlots: true,
	},
	data: {
		refresherHeight: 0,
		headerHeight: 0,
		movableY: 0,
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#refresher").boundingClientRect((refresher) => {
				this.data.refresherHeight = refresher.height
				this.setData({
					refresherHeight: this.data.refresherHeight,
					movableY: -this.data.refresherHeight - 1,
				})
			}).exec();
			this.createSelectorQuery().select("#header").boundingClientRect((header) => {
				this.data.headerHeight = header.height
			}).exec();
		},
		onMovableChange(e) {
			console.log('onMovableChange')
		},
		onMovableTouchEnd() {
			console.log('onMovableTouchEnd')
		},
		onScrollChanged(e) {
			console.log('onScrollChanged')
		},
		onScrollBottom() {
			console.log('onScrollBottom')
		},
	},
	ready() {
		this.init();
	}
});