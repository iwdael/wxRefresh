Component({
	properties: {
		//刷新
		refresh: {
			type: Boolean,
			value: false,
			observer: 'refreshObserver'
		},
		load: {
			type: Boolean,
			value: false,
			observer: 'loadObserver'
		},
		duration: {
			type: Number,
			value: 1800,
		},
		refresh_success_height: {
			type: Number,
			value: 0
		},
		load_success_height: {
			type: Number,
			value: 0
		}
	},
	options: {
		multipleSlots: true,
	},
	data: {
		//pin
		headerHeight: 0,
		pinHeight: 0,
		pin: false,

		//pin2
		headerHeight2: 0,
		pinHeight2: 0,
		pin2: false,

		movableHeight: 0,
		//刷新  
		refresherHeight: 0,
		movableY: 0, //movable y方向的偏移量
		refreshStatus: 1, // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成

		//加载
		footerHeight: 0,
		loadStatus: 1, // 1: 上拉加载, 2: 松开加载, 3: 加载中, 4: 加载完成
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#__refresher").boundingClientRect((__refresher) => {
				this.data.refresherHeight = __refresher.height
				console.log('refresherHeight -- ', this.data.refresherHeight)
				this.setData({
					refresherHeight: this.data.refresherHeight,
					movableY: -2 * this.data.refresherHeight,
				})
			}).exec();

			this.createSelectorQuery().select("#__header").boundingClientRect((__header) => {
				this.data.headerHeight = __header.height
				console.log('headerHeight -- ', this.data.headerHeight)
			}).exec();
			this.createSelectorQuery().select("#__header2").boundingClientRect((__header) => {
				this.data.headerHeight2 = __header.height
				console.log('headerHeight2 -- ', this.data.headerHeight2)
			}).exec();

			this.createSelectorQuery().select("#__pin").boundingClientRect((__pin) => {
				this.data.pinHeight = __pin.height
				console.log('pinHeight -- ', this.data.pinHeight)
				this.setData({
					pinHeight: this.data.pinHeight,
				})
			}).exec();

			this.createSelectorQuery().select("#__pin2").boundingClientRect((__pin) => {
				this.data.pinHeight2 = __pin.height
				console.log('pinHeight2 -- ', this.data.pinHeight2)
				this.setData({
					pinHeight2: this.data.pinHeight2,
				})
			}).exec();

			this.createSelectorQuery().select("#__movable_view").boundingClientRect((__movable_view) => {
				this.data.movableHeight = __movable_view.height
				console.log('movableHeight -- ', this.data.movableHeight)
				this.setData({
					movableHeight: this.data.movableHeight,
				})
			}).exec();

			this.createSelectorQuery().select("#__footer").boundingClientRect((__footer) => {
				this.data.footerHeight = __footer.height
				console.log('footerHeight -- ', this.data.footerHeight)
				this.setData({
					footerHeight: this.data.footerHeight,
				})
			}).exec();
			this.createSelectorQuery().select("#__scroll_view").boundingClientRect((__scroll_view) => {

				console.log('scrollviewHeight -- ', __scroll_view.height)

			}).exec();
		},
		onMovableChange(e) {
			// console.log('onMovableChange', e.detail.y)
			if (this.data.refreshStatus > 2 || this.data.loadStatus > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			var y = e.detail.y
			if (y >= -this.data.refresherHeight) {
				if (this.data.refreshStatus != 2) {
					this.data.refreshStatus = 2
					this.triggerEvent("refresh-status", {
						'status': this.data.refreshStatus
					}, {})
				}
			} else if (y >= -2 * this.data.refresherHeight && y < -this.data.refresherHeight) {
				if (this.data.refreshStatus != 1) {
					this.data.refreshStatus = 1
					this.triggerEvent("refresh-status", {
						'status': this.data.refreshStatus
					}, {})
				}

			} else if (y >= -2 * this.data.refresherHeight - this.data.footerHeight && y < -2 * this.data.refresherHeight) {
				if (this.data.loadStatus != 1) {
					this.data.loadStatus = 1
					this.triggerEvent("load-status", {
						'status': this.data.loadStatus
					}, {})
				}
			} else {
				if (this.data.loadStatus != 2) {
					this.data.loadStatus = 2
					this.triggerEvent("load-status", {
						'status': this.data.loadStatus
					}, {})
				}
			}
		},
		onMovableTouchEnd(e) {
			if (this.data.refreshStatus > 2 || this.data.loadStatus > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			// console.log(e)
			if (this.data.refreshStatus == 1 && this.data.loadStatus == 1) {
				this.setData({
					movableY: -2 * this.data.refresherHeight
				})
			} else if (this.data.refreshStatus == 2) {
				this.data.refreshStatus = 3
				this.triggerEvent("refresh-status", {
					'status': this.data.refreshStatus
				}, {})
				this.properties.refresh = true
				this.setData({
					movableY: -this.data.refresherHeight,
					refreshStatus: this.data.refreshStatus,
				})
				this.triggerEvent('refresh');
			} else if (this.data.loadStatus == 2) {
				this.data.loadStatus = 3
				this.triggerEvent("load-status", {
					'status': this.data.loadStatus
				}, {})
				this.properties.load = true
				this.setData({
					movableY: -2 * this.data.refresherHeight - this.data.footerHeight,
					loadStatus: this.data.loadStatus,
				})
				this.triggerEvent('load');
			}
		},
		onScrollChanged(e) {
			var top = e.detail.scrollTop
			console.log('scroll --- ', top);
			if (this.data.pinHeight != 0) {

				if (top >= this.data.headerHeight) {
					if (!this.data.pin) {
						this.triggerEvent("pin", {
							"progress": 1
						}, {})
						this.data.pin = true
						this.setData({
							pin: this.data.pin
						})
					}
				} else {
					var progress = top * 1.00 / this.data.headerHeight
					this.triggerEvent("pin", {
						"progress": progress
					}, {})
					if (this.data.pin) {
						this.data.pin = false
						this.setData({
							pin: this.data.pin
						})
					}
				}
			}

			if (this.data.pinHeight2 != 0) {

				if (top >= this.data.headerHeight + this.data.headerHeight2) {
					if (!this.data.pin2) {
						this.triggerEvent("pin2", {
							"progress": 1.00
						}, {})
						this.data.pin2 = true
						this.setData({
							pin2: this.data.pin2
						})
					}
				} else {
					var progress = top * 1.00 / (this.data.headerHeight + this.data.headerHeight2)
					this.triggerEvent("pin2", {
						"progress": progress
					}, {})
					if (this.data.pin2) {
						this.data.pin2 = false
						this.setData({
							pin2: this.data.pin2
						})
					}
				}
			}
		},

		refreshObserver() {
			if (this.properties.refresh) return
			if (this.data.refresh_success_height != 0) {
				this.data.refreshStatus = 4
				this.triggerEvent("refresh-status", {
					'status': this.data.refreshStatus
				}, {})

				this.setData({
					movableY: -2 * this.data.refresherHeight + this.rpx2px(this.properties.refresh_success_height),
					refreshStatus: this.data.refreshStatus
				})
				setTimeout(() => {
					this.setData({
						movableY: -2 * this.data.refresherHeight,

					})
					setTimeout(() => {
						this.data.refreshStatus = 1
						this.triggerEvent("refresh-status", {
							'status': this.data.refreshStatus
						}, {})
						this.setData({
							refreshStatus: this.data.refreshStatus
						})
					}, 500)
				}, this.properties.duration)
			} else {
				this.data.refreshStatus = 1
				this.triggerEvent("refresh-status", {
					'status': this.data.refreshStatus
				}, {})
				this.setData({
					movableY: -2 * this.data.refresherHeight,
					refreshStatus: this.data.refreshStatus
				})
			}


		},
		loadObserver() {
			if (this.properties.load) return
			if (this.data.load_success_height != 0) {
				this.data.loadStatus = 4
				this.triggerEvent("load-status", {
					'status': this.data.loadStatus
				}, {})

				this.setData({
					movableY: -2 * this.data.refresherHeight - this.rpx2px(this.properties.load_success_height),
					loadStatus: this.data.loadStatus
				})
				setTimeout(() => {
					this.setData({
						movableY: -2 * this.data.refresherHeight,
					})
					setTimeout(() => {
						this.data.loadStatus = 1
						this.triggerEvent("load-status", {
							'status': this.data.loadStatus
						}, {})
						this.setData({
							loadStatus: this.data.loadStatus
						})
					}, 500)
				}, this.properties.duration)
			} else {
				this.data.loadStatus = 1
				this.triggerEvent("load-status", {
					'status': this.data.loadStatus
				}, {})
				this.setData({
					movableY: -2 * this.data.refresherHeight,
					loadStatus: this.data.loadStatus
				})
			}
		},
		rpx2px(_rpx) {
			return wx.getSystemInfoSync().screenWidth / 750.00 * _rpx
		},
	},
	ready() {
		this.init();
	}
});