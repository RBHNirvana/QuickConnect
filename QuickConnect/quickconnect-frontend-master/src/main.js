import Vue from "vue";
import Moment from "vue-moment";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp, faPlus, faPlay, faInfoCircle, faStop, faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vueXlsxTable from "vue-xlsx-table";
import "./custom.scss";

// SOCKET STUFFS
// import * as io from 'socket.io-client'
// const connection = io.connect('http://localhost:3000', { transports: ['websocket'], upgrade: false});

Vue.use(BootstrapVue);
Vue.use(Moment);
Vue.use(vueXlsxTable, { rABS: false });

library.add(faThumbsUp, faPlus, faPlay, faInfoCircle, faStop, faPaperPlane, faCheck);

Vue.config.productionTip = false;

Vue.filter("amount", function(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.mixin({
  methods: {
    errorAlerts(error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return error.message;
      }
    },
    async jsonToFormData(data) {
      const formData = new FormData();
      await this.buildFormData(formData, data);
      return formData;
    },
    buildFormData(formData, data, parentKey) {
      if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File)
      ) {
        Object.keys(data).forEach(key => {
          this.buildFormData(
            formData,
            data[key],
            parentKey ? `${parentKey}[${key}]` : key
          );
        });
      } else {
        const value = data == null ? "" : data;
        formData.append(parentKey, value);
      }
    }
  }
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
