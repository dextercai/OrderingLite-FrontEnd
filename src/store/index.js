import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		dishList: [] // {id,name,price,amount}
	},
	mutations: {
		F_ADD_DISH: (state, v) => {
			if (state.dishList[v.id] == null) {
				state.dishList.splice(v.id, 1); 
				let thisItem = v;
				thisItem.amount = 1;
				state.dishList[v.id] = thisItem;
			} else {
				let thisItem = state.dishList[v.id];
				state.dishList.splice(v.id, 1);
				thisItem.amount += 1;
				state.dishList[v.id] = thisItem;
			}
		},
		F_DEL_DISH: (state, v) => {
			if (state.dishList[v.id] == null) {
				return
			} else {
				let thisItem = state.dishList[v.id];
				state.dishList.splice(v.id, 1);
				thisItem.amount -= 1;
				state.dishList[v.id] = thisItem;
				if (state.dishList[v.id].amount == 0) {
					state.dishList.splice(v.id, 1);
				}
			}
		},
		F_FSH_DISH: (state) => {
			state.dishList.splice(0, state.dishList.length);
		},
	},
	actions: {},
	modules: {},
	getters: {
		dishList(state) {
			return state.dishList
		}
	}
})
