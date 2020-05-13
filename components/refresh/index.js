Component({
	properties: {
		//刷新
		refresh: {
			type: Number,
			value: 0, // 0 表示成功  -1失败  1没有数据了  100成功
			observer: 'refreshObserver'
		},
		load: {
			type: Number,
			value: 0, // 0 表示成功  -1失败  1没有数据了  100成功
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
			value: 0,
			observer: "topSizeObserver"
		},
		bottom_size: {
			type: Number,
			value: 0,
			observer: "bottomSizeObserver"
		},
		cross_boundary_rebound_height: {
			type: Number,
			value: 0
		},
		scroll_distance: {
			type: String,
			value: '0px'
		},
		calc_page: {
			value: false,
			type: Boolean,
			observer: "calcPageObserver"
		},
		no_data_to_load_more_enable: {
			value: false,
			type: Boolean,
		},
	},
	options: {
		multipleSlots: true,
	},
	data: {
		//sticky
		header_height: 0,
		sticky_height: 0,
		sticky: false,

		//sticky_2
		header_height_2: 0,
		sticky_height_2: 0,
		sticky_2: false,

		movable_height: 0,
		//刷新  
		refresher_height: 0,
		movable_y: 0, //movable y方向的偏移量
		refresh_status: 1, // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成

		//加载
		footer_height: 0,
		load_status: 1, // 1: 上拉加载, 2: 松开加载, 3: 加载中, 4: 加载完成

		//other 
		over_page: false, //超过一页
		content_height: 0, //slot=content 高度
		scroll_height: 0, //滚动布局的高度
		space_height: 0, //填充到一页的高度
		current_scroll: 0, //当前滚动的位置
		empty_height: 0, // content 为空 展示的高度
		top_size_px: 0,
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

			this.createSelectorQuery().select("#__sticky").boundingClientRect((__sticky) => {
				this.data.sticky_height = __sticky.height
				this.setData({
					sticky_height: this.data.sticky_height,
					top_size_px: this.rpx2px(this.properties.top_size)
				})
			}).exec();

			this.createSelectorQuery().select("#__sticky_2").boundingClientRect((__sticky) => {
				this.data.sticky_height_2 = __sticky.height
				this.setData({
					sticky_height_2: this.data.sticky_height_2,
					top_size_px: this.rpx2px(this.properties.top_size)
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
					over_page_footer_height: this.data.footer_height,
				})
			}).exec();
			this.createSelectorQuery().select("#__scroll_view").boundingClientRect((__scroll_view) => {
				this.data.scroll_height = __scroll_view.height
			}).exec();
			this.createSelectorQuery().select("#__content_empty").boundingClientRect((__content_empty) => {
				this.data.empty_height = __content_empty.height
				this.setData({
					empty_height: this.data.empty_height
				})
			}).exec();
			this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {

				this.data.content_height = __content.height
				var diff = this.data.scroll_height - this.data.content_height - this.data.sticky_height - this.data.sticky_height_2 - this.data.header_height - this.data.header_height_2 - this.rpx2px(this.properties.top_size) - this.rpx2px(this.properties.bottom_size)
				this.data.space_height = diff
				if (this.data.empty_height > 0 && this.data.content_height == 0 && (this.data.space_height < this.data.empty_height)) {
					this.data.space_height = this.data.space_height - this.data.empty_height
				}
				this.setData({
					content_height: this.data.content_height
				})
				if (this.data.space_height < 0) {
					this.data.over_page = true
					this.setData({
						over_page: true
					})
				} else {
					this.setData({
						space_height: this.data.space_height
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
					"sticky_height": this.data.sticky_height,
					"header_height_2": this.data.header_height_2,
					"scroll_height": this.data.scroll_height,
					"content_height": this.data.content_height,
					"footer_height": this.data.footer_height,
					"over_page": this.data.over_page,
					"empty_height": this.data.empty_height,
					"space_height": this.data.space_height,
				}
				// console.log(info)
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
			this.onScrollChanged({
				detail: {
					scrollTop: this.data.current_scroll - (this.data.refresher_height + this.data.footer_height) - e.detail.y,
					manual: true,
				}
			})
			this.triggerEvent("drag", e.detail, {})
			if (this.data.refresh_status > 2 || this.data.load_status > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			var y = e.detail.y
			if (y >= -this.data.refresher_height && this.properties.refresh_enable) { // |-| | | |
				if (this.data.refresh_status != 2) {
					this.data.refresh_status = 2
					this.triggerEvent("refresh-status", {
						'status': this.data.refresh_status
					}, {})
				}
			} else if (y >= -2 * this.data.refresher_height && y < -this.data.refresher_height && this.properties.refresh_enable) { // | |-| | |
				if (this.data.refresh_status != 1) {
					this.data.refresh_status = 1
					this.triggerEvent("refresh-status", {
						'status': this.data.refresh_status
					}, {})
				}

			} else if (y >= -2 * this.data.refresher_height - this.data.footer_height && y < -2 * this.data.refresher_height && !this.data.over_page && this.properties.load_enable) { // | | |-| |
				if (this.data.load_status != 1) {
					this.data.load_status = 1
					if (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable) {
						// this.setData({
						// 	over_page_footer_height: this.rpx2px(this.properties.load_success_height)
						// })
					} else {
						this.triggerEvent("load-status", {
							'status': this.data.load_status
						}, {})
					}
				}
			} else if (y >= -2 * this.data.refresher_height - 2 * this.data.footer_height && y < -2 * this.data.refresher_height - this.data.footer_height && !this.data.over_page && this.properties.load_enable) { // | | | |-|
				if (this.data.load_status != 2) {
					this.data.load_status = 2
					if (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable) {
						// this.setData({
						// 	over_page_footer_height: this.rpx2px(this.properties.load_success_height)
						// })
					} else {
						this.triggerEvent("load-status", {
							'status': this.data.load_status
						}, {})
					}
				}
			} else if (y >= -2 * this.data.refresher_height - 2 * this.data.footer_height && y < -2 * this.data.refresher_height && this.data.over_page && this.properties.load_enable) {
				if (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable) {
					// this.setData({
					// 	over_page_footer_height: this.rpx2px(this.properties.load_success_height)
					// })
				} else {
					this.data.load_status = 1
					this.properties.load = 0
					this.onScrollBottom('')
					this.setData({
						movable_y: -2 * this.data.refresher_height
					})
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
				this.properties.refresh = 100
				this.properties.load = 0
				this.triggerEvent("load-status", {
					'status': 1
				}, {})
				this.setData({
					movable_y: -this.data.refresher_height,
					refresh_status: this.data.refresh_status,
					over_page_footer_height: this.data.footer_height
				})

				this.triggerEvent('refresh');
			} else if (this.data.load_status == 2 && (this.properties.load != 1 || this.properties.no_data_to_load_more_enable)) {
				this.data.load_status = 3
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.properties.load = 100
				this.setData({
					movable_y: -2 * this.data.refresher_height - this.data.footer_height,
					load_status: this.data.load_status,
				})
				this.triggerEvent('load');
			} else if (this.data.load_status == 2) {
				this.setData({
					movable_y: -2 * this.data.refresher_height
				})
			}
		},
		onScrollChanged(e) {
			var top = e.detail.scrollTop
			if (e.detail.manual == null) {
				this.data.current_scroll = top
			}
			this.triggerEvent("scroll", {
				scroll_distance: top
			}, {})
			if (this.data.sticky_height != 0) {
				if (this.data.sticky) {} else {
					var progress = top * 1.00 / this.data.header_height
					this.triggerEvent("sticky", {
						"id": "__sticky",
						"progress": progress
					}, {})
				}
			}
			if (this.data.sticky_height_2 != 0) {
				if (this.data.sticky_2) {} else {
					var progress = top * 1.00 / (this.data.header_height + this.data.header_height_2)
					this.triggerEvent("sticky", {
						"id": "__sticky_2",
						"progress": progress
					}, {})
				}
			}
		},
		onPinSticky(e) {
			var id = e.currentTarget.id
			var sticky = e.detail.sticky
			if (sticky) {
				this.triggerEvent("sticky", {
					"id": id,
					"progress": 1
				}, {})
			}
			if (id == '__sticky' && this.data.sticky != sticky) {
				this.data.sticky = sticky
				this.setData({
					sticky: this.data.sticky
				})
			} else if (id == '__sticky_2' && this.data.sticky_2 != sticky) {
				this.data.sticky_2 = sticky
				this.setData({
					sticky_2: this.data.sticky_2
				})
			}
		},
		refreshObserver() {
			this.calcPage(true)
			if (this.properties.refresh == 100 && !this.properties.load) {
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
			if (this.properties.refresh == 100) return

			if (this.data.refresh_success_height != 0) {
				this.data.refresh_status = this.properties.refresh == 0 ? 4 : (this.properties.refresh == 1 ? 5 : 6)
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
			this.calcPage(false)
			if (this.properties.load == 100 && this.properties.refresh != 100 && !this.data.over_page) {
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.refresher_height - this.data.footer_height - 20
					})
					setTimeout(() => {
						this.onMovableTouchEnd(null)
					}, 500)
				}, 500)
				return
			}

			if (this.properties.load == 100) return
			if (this.data.load_success_height != 0 && !this.data.over_page) {
				this.data.load_status = this.properties.load == 0 ? 4 : (this.properties.load == 1 ? 5 : 6)
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
						this.setData({
							load_status: this.data.load_status
						})
						if (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable) {
							this.setData({
								over_page_footer_height: this.rpx2px(this.properties.load_success_height)
							})
						} else {
							this.triggerEvent("load-status", {
								'status': this.data.load_status
							}, {})
						}
					}, 1000)
				}, this.properties.duration)
			} else if (this.data.load_success_height != 0 && this.data.over_page) {
				if (this.properties.load != 0) {
					this.data.load_status = this.properties.load == 1 ? 5 : 6
					this.triggerEvent("load-status", {
						'status': this.data.load_status
					}, {})
					this.setData({
						load_status: this.data.load_status
					})
					//当刷新完成之前，布局由于手动操作滚上去。

					if (this.data.current_scroll > this.rpx2px(this.properties.load_success_height) - this.data.space_height) {
						this.setData({
							scroll_distance: -this.data.space_height + this.rpx2px(this.properties.load_success_height)
						})
					}

					if (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable) {
						setTimeout(() => {
							this.setData({
								over_page_footer_height: this.rpx2px(this.properties.load_success_height)
							})
						}, 500)
					}
					this.data.load_status = 1
					this.setData({
						load_status: this.data.load_status
					})

				} else {
					this.data.load_status = 1
					this.triggerEvent("load-status", {
						'status': this.data.load_status
					}, {})
					this.setData({
						load_status: this.data.load_status
					})
				}
			} else if (this.data.load_success_height == 0 && this.data.over_page) {
				this.data.load_status = 1
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.setData({
					load_status: this.data.load_status
				})
			} else if (this.data.load_success_height == 0 && !this.data.over_page) {
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
		calcPageObserver() {
			if (this.properties.calc_page)
				this.calcPage(true)
			this.properties.calc_page = false
		},
		topSizeObserver() {
			this.calcPage(true)
		},
		bottomSizeObserver() {
			this.calcPage(true)
		},
		onScrollBottom(e) {
			this.triggerEvent('bottom');
			if (!this.properties.load_enable) return
			if (this.properties.load == 100 || (this.properties.load == 1 && !this.properties.no_data_to_load_more_enable)) return
			this.properties.load = 100
			if (this.data.load_status == 1) {
				this.data.load_status = 2
				this.setData({
					load_status: this.data.load_status
				})
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.data.load_status = 3
				this.setData({
					load_status: this.data.load_status
				})
				this.triggerEvent("load-status", {
					'status': this.data.load_status
				}, {})
				this.triggerEvent('load');
			}
		},
		onScrollTop(e) {
			this.triggerEvent("top");
		},

		calcPage(_is_refresh) {
			if (!this.data.over_page || _is_refresh || (this.data.over_page && this.data.content_height == 0) || (this.data.over_page && this.data.load_enable)) {
				this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {
					this.data.content_height = __content.height
					var diff = this.data.scroll_height - this.data.content_height - this.data.sticky_height - this.data.sticky_height_2 - this.data.header_height - this.data.header_height_2 - this.rpx2px(this.properties.top_size) - this.rpx2px(this.properties.bottom_size)
					this.data.space_height = diff
					if (this.data.empty_height > 0 && this.data.content_height == 0 && (this.data.space_height < this.data.empty_height)) {
						this.data.space_height = this.data.space_height - this.data.empty_height
					}
					this.setData({
						content_height: this.data.content_height
					})
					if (this.data.space_height < 0) {
						this.data.over_page = true
						this.setData({
							over_page: this.data.over_page
						})
					} else {
						this.data.over_page = false
						this.setData({
							space_height: this.data.space_height,
							over_page: this.data.over_page
						})
					}
					var info = {
						"refresher_height": this.data.refresher_height,
						"header_height": this.data.header_height,
						"sticky_height": this.data.sticky_height,
						"header_height_2": this.data.header_height_2,
						"scroll_height": this.data.scroll_height,
						"content_height": this.data.content_height,
						"footer_height": this.data.footer_height,
						"over_page": this.data.over_page,
						"empty_height": this.data.empty_height,
						"space_height": this.data.space_height,
					}
					// console.log(info)
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