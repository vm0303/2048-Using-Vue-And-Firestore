import {createApp} from 'vue'
import App from './App.vue'

import Ripple from "./directives/rippleEffect";
import vScroll from "@/directives/scrollEffect";

const app = createApp(App)
app.directive('scroll', vScroll)
app.directive("ripple", Ripple)

app.mount('#app')

