<template>
	<div id='Main'>
		<v-nav/>
		<transition name="slide">
			<router-view/>
		</transition>
	</div>
</template>

<script>
	import NavBar from './common/navbar.vue'
	export default{
		components:{
			'v-nav': NavBar,
		}
	}
</script>

<style>
	#Main{
		height: 100%;
	}
</style>
