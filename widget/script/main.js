loader.define(function(){

    var pageview = {};

    pageview.bind = function () {
        var uiSlide = bui.slide({
            id: "#slide",
            height: 300,
            autopage: true,
            loop: true,
            cross: true,
            data: [{
              image: "images/banner01.png"
            },{
              image: "images/banner02.png"
            },{
              image: "images/banner03.png"
            }]
        })
        var uiDoropdown = bui.dropdown({
            id: "#uiDoropdownArea",
            data: [{
                name: "广州",
                value: "gz"
            }, {
                name: "深圳",
                value: "gd"
            }],
            //设置relative为false,二级菜单继承父层宽度
            relative: true,
            value: "广东",
            callback: function (e) {}
        })
    };
    pageview.wave = function () {
        var canvas = document.getElementById('wave');
        var ctx = canvas.getContext('2d');
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
        //如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
        // 波浪大小
        var boHeight = canvas.height / 5;
        var posHeight = canvas.height / 1.5;
        //初始角度为0
        var step = 0;
        //定义波浪的颜色
        var lines = ["rgba(0,222,255, 0.2)"];

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            step++;
            //画3个不同颜色的矩形
            for (var j = lines.length - 1; j >= 0; j--) {
                ctx.fillStyle = lines[j];
                //每个矩形的角度都不同，每个之间相差45度
                var angle = (step + j * 50) * Math.PI / 180;
                var deltaHeight = Math.sin(angle) * boHeight;
                var deltaHeightRight = Math.cos(angle) * boHeight;
                ctx.beginPath();
                ctx.moveTo(0, posHeight + deltaHeight);
                ctx.bezierCurveTo(canvas.width / 2, posHeight + deltaHeight - boHeight, canvas.width / 2, posHeight + deltaHeightRight - boHeight, canvas.width, posHeight + deltaHeightRight);
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.lineTo(0, posHeight + deltaHeight);
                ctx.closePath();
                ctx.fill();
            }
            requestAnimFrame(loop);
        }
        loop();
    };
    pageview.initPie = function() {

		// 指定图表的配置项和数据
		var optionPieChart = {
			title: {
				show: true,
				text: '3',
				subtext: '今日待处理',
				left: 'center',
                top: '20%',
				textStyle: {
					color: '#fff',
					lineHeight: 1,
					fontWeight: 'normal',
                    fontSize: 30,
				},
				subtextStyle: {
					color: 'rgba(255,255,255,.5)',
					fontWeight: 'normal',
					fontSize: 12
				}
			},
			//配置色块颜色
			color: ['#fff', "RGBA(98, 182, 255, 1)"],
			tooltip: {
				show: false,
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				show: false,
			},
			series: [{
				name: '数据来源',
                type: 'pie',
                center: ['50%', '50%'],
				radius: ['90%', '100%'],
				hoverAnimation: false, //禁止滑过变大效果
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '30',
							fontWeight: 'normal',
							color: '#fff'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				itemStyle: {

				},
				center: ['50%', '50%'],
				data: [{
					value: 38,
					name: '利用率'
				}, {
					value: 62,
					name: '可用率'
				}]
			}]
		};
		return optionPieChart;
    };
    pageview.initChart=function(){
        loader.import("js/plugins/echarts.min.js", function() {
            var pieChart = echarts.init($("#chart-pie")[0]);
            pieChart.setOption(pageview.initPie());
        });
    };
    pageview.init = function () {
        this.bind();
        this.wave();
        this.initChart();
    };
    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
