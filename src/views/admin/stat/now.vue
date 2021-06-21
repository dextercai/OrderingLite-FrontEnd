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
				url: '/stat/now',
				method: 'get'
			})
				.then(function(resp) {
					that.myChart = echarts.init(that.$refs.myChart);
					var option = {
						tooltip: {
							trigger: 'item'
						},
						title: {
							text: '当前桌台占用情况',
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
						legend: {
							top: '5%',
							left: 'center'
						},
						series: [
							{
								name: '桌台占用',
								type: 'pie',
								radius: ['40%', '70%'],
								avoidLabelOverlap: false,
								itemStyle: {
									borderRadius: 10,
									borderColor: '#fff',
									borderWidth: 2
								},
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '40',
										fontWeight: 'bold'
									}
								},
								labelLine: {
									show: false
								},
								data: resp.data.result
							}
						]
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
