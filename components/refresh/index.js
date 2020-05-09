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
			value: '0px'
		},
		refresh_enable: {
			type: Boolean,
			value: true,
		},
		load_enable: {
			type: Boolean,
			value: true,
		},
		space_color: {
			type: String,
			value: "rgba(255, 255, 255, 0)"
		},
		top_size: {
			type: Number,
			value: 0
		},
		bottom_size: {
			type: Number,
			value: 0
		},
		cross_boundary_rebound_height: {
			type: Number,
			value: 0
		},
		scroll_height: {
			type: String,
			value: '0px'
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

		//other 
		overflow: false,
		contentHeight: 0,
		scrollHeight: 0,
		spaceHeight: 0
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#__refresher").boundingClientRect((__refresher) => {
				this.data.refresherHeight = __refresher.height

				this.setData({
					refresherHeight: this.data.refresherHeight,
					movableY: -2 * this.data.refresherHeight,
					animation: ''
				})
				setTimeout(() => {
					this.setData({
						animation: 'true'
					}, 50)
				})
			}).exec();

			this.createSelectorQuery().select("#__header").boundingClientRect((__header) => {
				this.data.headerHeight = __header.height

			}).exec();
			this.createSelectorQuery().select("#__header2").boundingClientRect((__header) => {
				this.data.headerHeight2 = __header.height

			}).exec();

			this.createSelectorQuery().select("#__pin").boundingClientRect((__pin) => {
				this.data.pinHeight = __pin.height

				this.setData({
					pinHeight: this.data.pinHeight,
				})
			}).exec();

			this.createSelectorQuery().select("#__pin2").boundingClientRect((__pin) => {
				this.data.pinHeight2 = __pin.height

				this.setData({
					pinHeight2: this.data.pinHeight2,
				})
			}).exec();

			this.createSelectorQuery().select("#__movable_view").boundingClientRect((__movable_view) => {
				this.data.movableHeight = __movable_view.height

				this.setData({
					movableHeight: this.data.movableHeight,
				})
			}).exec();

			this.createSelectorQuery().select("#__footer").boundingClientRect((__footer) => {
				this.data.footerHeight = __footer.height

				this.setData({
					footerHeight: this.data.footerHeight,
				})
			}).exec();
			this.createSelectorQuery().select("#__scroll_view").boundingClientRect((__scroll_view) => {

				this.data.scrollHeight = __scroll_view.height
			}).exec();
			this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {

				this.data.contentHeight = __content.height
				var diff = this.data.scrollHeight - this.data.contentHeight - this.data.pinHeight - this.data.pinHeight2 - this.data.headerHeight - this.data.headerHeight2 - this.rpx2px(this.properties.top_size) - this.rpx2px(this.properties.bottom_size)

				if (diff < 0) {
					this.data.overflow = true
					this.setData({
						overflow: true
					})
				} else {
					this.setData({
						spaceHeight: diff
					})
					this.triggerEvent("load-status", {
						'status': 0
					}, {})
				}

				if (this.properties.cross_boundary_rebound_height > 0 && this.data.footerHeight == 0 && this.data.headerHeight == 0 && !this.properties.refresh_enable && !this.properties.load_enable) {
					this.data.refresherHeight = this.rpx2px(this.properties.cross_boundary_rebound_height) / 2
					this.data.footerHeight = this.rpx2px(this.properties.cross_boundary_rebound_height) / 2
					this.setData({
						refresherHeight: this.data.refresherHeight,
						footerHeight: this.data.footerHeight,
						movableY: -2 * this.data.refresherHeight,
						animation: ''
					})
					setTimeout(() => {
						this.setData({
							animation: 'true'
						}, 50)
					})

				}
				var info = {
					"refresher_height": this.data.refresherHeight,
					"header_height": this.data.headerHeight,
					"pin_height": this.data.pinHeight,
					"header_height_2": this.data.headerHeight2,
					"scroll_height": this.data.scrollHeight,
					"content_height": this.data.contentHeight,
					"footer_height": this.data.footerHeight,
					"overflow": this.data.overflow
				}
				console.log(info)
				this.triggerEvent("info", info, {})
			}).exec();
			this.triggerEvent("refresh-status", {
				'status': this.properties.refresh_enable ? 1 : 0
			}, {})
			this.triggerEvent("load-status", {
				'status': this.properties.load_enable ? 1 : 0
			}, {})
		},
		onMovableChange(e) {
			// console.log('onMovableChange', e.detail.y)
			this.triggerEvent("drag", e.detail, {})
			if (this.data.refreshStatus > 2 || this.data.loadStatus > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			var y = e.detail.y
			if (y >= -this.data.refresherHeight && this.properties.refresh_enable) {
				if (this.data.refreshStatus != 2) {
					this.data.refreshStatus = 2
					this.triggerEvent("refresh-status", {
						'status': this.data.refreshStatus
					}, {})
				}
			} else if (y >= -2 * this.data.refresherHeight && y < -this.data.refresherHeight && this.properties.refresh_enable) {
				if (this.data.refreshStatus != 1) {
					this.data.refreshStatus = 1
					this.triggerEvent("refresh-status", {
						'status': this.data.refreshStatus
					}, {})
				}

			} else if (y >= -2 * this.data.refresherHeight - this.data.footerHeight && y < -2 * this.data.refresherHeight && this.data.overflow && this.properties.load_enable) {
				if (this.data.loadStatus != 1) {
					this.data.loadStatus = 1
					this.triggerEvent("load-status", {
						'status': this.data.loadStatus
					}, {})
				}
			} else if (this.data.overflow && this.properties.load_enable) {
				if (this.data.loadStatus != 2) {
					this.data.loadStatus = 2
					this.triggerEvent("load-status", {
						'status': this.data.loadStatus
					}, {})
				}
			}
		},
		onMovableTouchEnd(e) {
			this.triggerEvent("drag_end")
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
			this.triggerEvent("scroll", e.detail, {})
			// console.log('scroll --- ', e.detail);
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
			if (this.properties.refresh && !this.properties.load) {
				setTimeout(() => {
					this.setData({
						movableY: -this.data.refresherHeight + 20
					})
					setTimeout(() => {
						this.onMovableTouchEnd(null)
					}, 500)
				}, 500)
				return
			}
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
					}, 1000)
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
					}, 1000)
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
		onScrollBottom(e) {
			this.triggerEvent("bottom");
		},
		onScrollTop(e) {
			this.triggerEvent("top");
		},
		rpx2px(_rpx) {
			return wx.getSystemInfoSync().screenWidth / 750.00 * _rpx
		},
	},
	ready() {
		this.init();
	}
});