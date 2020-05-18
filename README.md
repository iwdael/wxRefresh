# wxRefresh
微信小程序上拉刷新、下拉加载组件，支持自定义刷新和加载动画，越界回弹，粘性布局。
## 特点
* 自定义刷新和加载
* 越界回弹
* 粘性布局(Sticky)
* 空内容默认显示

## 概述
wxRefresh能够满足大多数微信小程序列表的需求，减免了繁琐且重复的开发，提高了开发效率。同时wxRefresh提供了多种事件和属性，给开发提供做够多的扩展能力。

|属性|类型|默认值|必填|功能|备注|
|:------:|:------:|:------:|:------:|:------:|:------:|
|refresh|boolean|true|否|刷新标识|100:强制刷新;0:正常刷新完成;1:刷新完成且没有数据了;-1:刷新失败|
|load|boolean|true|否|加载标识|100:未超过一页加载;0:正常加载完成;1:加载完成且没有数据了;-1:加载失败|
|duration|number|1800|否|动画展示时长|结束刷新或者加载时，动画展示时长|
|refresh-enable|boolean|true|否|刷新是否启动|默认启用、若无刷新头，则自动禁用|
|load-enable|boolean|true|否|加载是否启动|默认启用、若无加载头，则自动禁用|
|refresh-success-height|number|0|否|刷新成功高度|若有刷新头，填写，单位rpx|
|load-success-height|number|0|否|加载成功高度|若有加载头，填写，单位rpx|
|space-color|string|rgba(255, 255, 255, 0)|否|页面不超过一页填充颜色|
|top-size|number|0|否|距离顶部的距离|若存在遮盖问题，请添加z-index，单位rpx|
|bottom-size|number|0|否|距离底部的距离|若存在遮盖问题，请添加z-index，单位rpx|
|cross-boundary-rebound-height|number|0|否|越界回弹拖拽距离|单位rpx|
|scroll-space|string|0px|否|页面滚动的距离|若填写纯数字默认为px|
|rebuild|boolean|false|否|是否重新测量各组件|非slot='content'，高度发生改变时，设置为true|
|no-data-to-load-more-enable|boolean|false|否|加载控制|load=1，即没有更多数据，是否能够上拉加载|
