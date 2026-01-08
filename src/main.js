import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#vue-root',
  render: (h) => h(App),
});
