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
		header_height: 0,
		pin_height: 0,
		pin: false,

		//pin_2
		header_height_2: 0,
		pin_height_2: 0,
		pin_2: false,

		movable_height: 0,
		//刷新  
		refresher_height: 0,
		movable_y: 0, //movable y方向的偏移量
		refresh_status: 1, // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成

		//加载
		footer_height: 0,
		load_status: 1, // 1: 上拉加载, 2: 松开加载, 3: 加载中, 4: 加载完成

		//other 
		overflow: false,
		content_height: 0,
		scroll_height: 0,
		space_height: 0
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#__refresher").boundingClientRect((__refresher) => {
				this.data.refresher_height = __refresher.height

				this.setData({
					refresher_height: this.data.refresher_height,
					movable_y: -2 * this.data.refresher_height,
					animation: ''
				})
				setTimeout(() => {
					this.setData({
						animation: 'true'
					}, 50)
				})
			}).exec();

			this.createSelectorQuery().select("#__header").boundingClientRect((__header) => {
				this.data.header_height = __header.height

			}).exec();
			this.createSelectorQuery().select("#__header_2").boundingClientRect((__header) => {
				this.data.header_height_2 = __header.height
			}).exec();

			this.createSelectorQuery().select("#__pin").boundingClientRect((__pin) => {
				this.data.pin_height = __pin.height

				this.setData({
					pin_height: this.data.pin_height,
				})
			}).exec();

			this.createSelectorQuery().select("#__pin_2").boundingClientRect((__pin) => {
				this.data.pin_height_2 = __pin.height

				this.setData({
					pin_height_2: this.data.pin_height_2,
				})
			}).exec();

			this.createSelectorQuery().select("#__movable_view").boundingClientRect((__movable_view) => {
				this.data.movable_height = __movable_view.height

				this.setData({
					movable_height: this.data.movable_height,
				})
			}).exec();

			this.createSelectorQuery().select("#__footer").boundingClientRect((__footer) => {
				this.data.footer_height = __footer.height

				this.setData({
					footer_height: this.data.footer_height,
				})
			}).exec();
			this.createSelectorQuery().select("#__scroll_view").boundingClientRect((__scroll_view) => {

				this.data.scroll_height = __scroll_view.height
			}).exec();
			this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {

				this.data.content_height = __content.height
				var diff = this.data.scroll_height - this.data.content_height - this.data.pin_height - this.data.pin_height_2 - this.data.header_height - this.data.header_height_2 - this.rpx2px(this.properties.top_size) - this.rpx2px(this.properties.bottom_size)

				if (diff < 0) {
					this.data.overflow = true
					this.setData({
						overflow: true
					})
				} else {
					this.setData({
						space_height: diff
					})
					this.triggerEvent("load-status", {
						'status': 0
					}, {})
				}

				if (this.properties.cross_boundary_rebound_height > 0 && this.data.footer_height == 0 && this.data.header_height == 0 && !this.properties.refresh_enable && !this.properties.load_enable) {
					this.data.refresher_height = this.rpx2px(this.properties.cross_boundary_rebound_height) / 2
					this.data.footer_height = this.rpx2px(this.properties.cross_boundary_rebound_height) / 2
					this.setData({
						refresher_height: this.data.refresher_height,
						footer_height: this.data.footer_height,
						movable_y: -2 * this.data.refresher_height,
						animation: ''
					})
					setTimeout(() => {
						this.setData({
							animation: 'true'
						}, 50)
					})

				}
				var info = {
					"refresher_height": this.data.refresher_height,
					"header_height": this.data.header_height,
					"pin_height": this.data.pin_height,
					"header_height_2": this.data.header_height_2,
					"scroll_height": this.data.scroll_height,
					"content_height": this.data.content_height,
					"footer_height": this.data.footer_height,
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
			if (this.data.refresh_status > 2 || this.data.load_status > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			var y = e.detail.y
			if (y >= -this.data.refresher_height && this.properties.refresh_enable) {
				if (this.data.refresh_status != 2) {
					this.data.refresh_status = 2
					this.triggerEvent("refresh-status", {
						'status': this.data.refresh_status
					}, {})
				}
			} else if (y >= -2 * this.data.refresher_height && y < -this.data.refresher_height && this.properties.refresh_enable) {
				if (this.data.refresh_status != 1) {
					this.data.refresh_status = 1
					this.triggerEvent("refresh-status", {
						'status': this.data.refresh_status
					}, {})
				}

			} else if (y >= -2 * this.data.refresher_height - this.data.footer_height && y < -2 * this.data.refresher_height && this.data.overflow && this.properties.load_enable) {
				if (this.data.load_status != 1) {
					this.data.load_status = 1
					this.triggerEvent("load-status", {
						'status': this.data.load_status
					}, {})
				}
			} else if (this.data.overflow && this.properties.load_enable) {
				if (this.data.load_status != 2) {
					this.data.load_status = 2
					this.triggerEvent("load-status", {
						'status': this.data.load_status
					}, {})
				}
			}
		},
		onMovableTouchEnd(e) {
			this.triggerEvent("drag_end")
			if (this.data.refresh_status > 2 || this.data.load_status > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			// console.log(e)
			if (this.data.refresh_status == 1 && this.data.load_status == 1) {
				this.setData({
					movable_y: -2 * this.data.refresher_height
				})
			} else if (this.data.refresh_status == 2) {
				this.data.refresh_status = 3
				this.triggerEvent("refresh-status", {
					'status': this.data.refresh_status
				}, {})
				this.properties.refresh = true
				this.setData({
					movable_y: -this.data.refresher_height,
					refresh_status: this.data.refresh_status,
				})
				this.triggerEvent('refresh');
			} else if (this.data.load_status == 2) {
				this.data.load_status = 3
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.properties.load = true
				this.setData({
					movable_y: -2 * this.data.refresher_height - this.data.footer_height,
					load_status: this.data.load_status,
				})
				this.triggerEvent('load');
			}
		},
		onScrollChanged(e) {
			var top = e.detail.scrollTop
			this.triggerEvent("scroll", e.detail, {})
			// console.log('scroll --- ', e.detail);
			if (this.data.pin_height != 0) {

				if (top >= this.data.header_height) {
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
					var progress = top * 1.00 / this.data.header_height
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

			if (this.data.pin_height_2 != 0) {

				if (top >= this.data.header_height + this.data.header_height_2) {
					if (!this.data.pin_2) {
						this.triggerEvent("pin_2", {
							"progress": 1.00
						}, {})
						this.data.pin_2 = true
						this.setData({
							pin_2: this.data.pin_2
						})
					}
				} else {
					var progress = top * 1.00 / (this.data.header_height + this.data.header_height_2)
					this.triggerEvent("pin_2", {
						"progress": progress
					}, {})
					if (this.data.pin_2) {
						this.data.pin_2 = false
						this.setData({
							pin_2: this.data.pin_2
						})
					}
				}
			}
		},

		refreshObserver() {
			this.reCalcOverflow()
			if (this.properties.refresh && !this.properties.load) {
				setTimeout(() => {
					this.setData({
						movable_y: -this.data.refresher_height + 20
					})
					setTimeout(() => {
						this.onMovableTouchEnd(null)
					}, 500)
				}, 500)
				return
			}
			if (this.properties.refresh) return

			if (this.data.refresh_success_height != 0) {
				this.data.refresh_status = 4
				this.triggerEvent("refresh-status", {
					'status': this.data.refresh_status
				}, {})

				this.setData({
					movable_y: -2 * this.data.refresher_height + this.rpx2px(this.properties.refresh_success_height),
					refresh_status: this.data.refresh_status
				})
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.refresher_height,
					})
					setTimeout(() => {
						this.data.refresh_status = 1
						this.triggerEvent("refresh-status", {
							'status': this.data.refresh_status
						}, {})
						this.setData({
							refresh_status: this.data.refresh_status
						})
					}, 1000)
				}, this.properties.duration)
			} else {
				this.data.refresh_status = 1
				this.triggerEvent("refresh-status", {
					'status': this.data.refresh_status
				}, {})
				this.setData({
					movable_y: -2 * this.data.refresher_height,
					refresh_status: this.data.refresh_status
				})
			}


		},
		loadObserver() {
			this.reCalcOverflow()
			if (this.properties.load) return
			if (this.data.load_success_height != 0) {
				this.data.load_status = 4
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})

				this.setData({
					movable_y: -2 * this.data.refresher_height - this.rpx2px(this.properties.load_success_height),
					load_status: this.data.load_status
				})
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.refresher_height,
					})
					setTimeout(() => {
						this.data.load_status = 1
						this.triggerEvent("load-status", {
							'status': this.data.load_status
						}, {})
						this.setData({
							load_status: this.data.load_status
						})
					}, 1000)
				}, this.properties.duration)
			} else {
				this.data.load_status = 1
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.setData({
					movable_y: -2 * this.data.refresher_height,
					load_status: this.data.load_status
				})
			}
		},
		onScrollBottom(e) {
			this.triggerEvent("bottom");
		},
		onScrollTop(e) {
			this.triggerEvent("top");
		},
		reCalcOverflow() {
			if (!this.data.overflow) {
				this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {
					console.log('______content_height__________', __content)
					this.data.content_height = __content.height
					var diff = this.data.scroll_height - this.data.content_height - this.data.pin_height - this.data.pin_height_2 - this.data.header_height - this.data.header_height_2 - this.rpx2px(this.properties.top_size) - this.rpx2px(this.properties.bottom_size)

					if (diff < 0) {
						this.data.overflow = true
						this.setData({
							overflow: true
						})
					} else {
						this.setData({
							space_height: diff
						})
						this.triggerEvent("load-status", {
							'status': 0
						}, {})
					}
					var info = {
						"refresher_height": this.data.refresher_height,
						"header_height": this.data.header_height,
						"pin_height": this.data.pin_height,
						"header_height_2": this.data.header_height_2,
						"scroll_height": this.data.scroll_height,
						"content_height": this.data.content_height,
						"footer_height": this.data.footer_height,
						"overflow": this.data.overflow
					}
					console.log(info)
					this.triggerEvent("info", info, {})
				}).exec()
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