<template>
	<el-container>
		<el-main><div ref="myChart" style="width: 100%; height: 100%;"></div></el-main>
	</el-container>
</template>

<script>
import * as echarts from 'echarts';
import request from '../../../utils/request.js';
export default {
	data: function() {
		return {
			myChart: {}
		};
	},
	mounted() {
		this.initChart();
	},
	methods: {
		initChart: function() {
			let that = this;
			request({
				url: '/stat/dish',
				method: 'get'
			})
				.then(function(resp) {
					that.myChart = echarts.init(that.$refs.myChart);
					var option = {
						xAxis: {
							type: 'category',
							data: resp.data.result.x
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
								data: resp.data.result.y,
								type: 'bar',
								showBackground: true,
								backgroundStyle: {
									color: 'rgba(180, 180, 180, 0.2)'
								}
							}
						],
						title: {
							text: '点餐数统计',
							textStyle: {
								//文字颜色
								color: '#000000',
								//字体风格,'normal','italic','oblique'
								fontStyle: 'normal',
								//字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
								fontWeight: 'bold',
								//字体系列
								fontFamily: 'sans-serif',
								//字体大小
								fontSize: 18
							}
						},
					};
					that.myChart.setOption(option);
				})
				.catch(() => {
					that.$message('后端请求时发生链路错误，暂时不可用。');
				});
		}
	}
};
</script>

<style scoped="scoped">
.box-card {
	height: 400px;
}
</style>
