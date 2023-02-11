<template>
  <main>
    <TheInfo/>
    <TheGrid/>
  </main>
</template>
<script>


window.addEventListener("keydown", function (e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
}, false);

document.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, {passive: false});


import TheInfo from "@/components/TheInfo.vue"
import TheGrid from "@/components/TheGridAndScore.vue";


export default {
  name: "App",
  components: {
    TheInfo,
    TheGrid,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  text-align: center;
  height: 100%;
}

main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

}

body {
  font-family: "Nunito Sans", sans-serif;
  background: black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}


html,
body {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

}
</style>
