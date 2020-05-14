Page({
    data: {
        list: [{
            id: 'widget',
            name: '特性功能',
            open: false,
            pages: [{
                'title': '刷新加载',
                'url': 'refresh-load'
            }, {
                'title': '越界回弹',
                'url': 'cross-boundary-rebound'
            }, {
                'title': '刷新加载-粘性',
                'url': 'refresh-load-sticky'
            }, {
                'title': '刷新加载-粘性-2',
                'url': 'refresh-load-sticky-2'
            }, {
                'title': '越界回弹-粘性',
                'url': 'cross-boundary-rebound-sticky'
            }, {
                'title': '越界回弹-粘性2',
                'url': 'cross-boundary-rebound-sticky-2'
            }, {
                'title': '刷新',
                'url': 'refresh'
            }, {
                'title': '加载',
                'url': 'load'
            }, ]
        }]
    },
    kindToggle: function (e) {
        var id = e.currentTarget.id,
            list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    }
});