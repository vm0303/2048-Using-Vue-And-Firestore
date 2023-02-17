<template>
  <div :style="pos" class="grid-tile">
    <transition appear name="tile">
      <div :class="boardTiles" :style="color" class="inside-tile-container">
        {{ tile.value }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: {
        2: "#40d5f8",
        4: "#17b4da",
        8: "#0D98BA",
        16: "#0CA0B1",
        32: "#0BA9A8",
        64: "#0AB19F",
        128: "#09BA96",
        256: "#08C28D",
        512: "#19c784",
        1024: "#28ca6e",
        2048: "#58e590",
      },
    };
  },
  props: {
    tile: Object,
  },
  computed: {
    pos() {
      return `
        transform: translate(${(this.tile.index % 4) * 100}%, ${
          Math.floor(this.tile.index / 4) * 100
      }%)`;
    },
    boardTiles() {
      return {
        new: this.tile.isNew,
        merged: this.tile.delete,
      };
    },
    color() {
      const color = this.colors[this.tile.value] || "#095cf8";
      return this.tile.value < 2048
          ? `background-color: ${color}`
          : `background-color: ${color}; color: white`;
    },
  },
};
</script>

<style>
.grid-tile {
  position: absolute;
  width: 110px;
  height: 110px;
  top: -5px;
  left: -5px;
  padding: 5px;
  font-size: 36px;
  transition: transform 0.2s ease;
}

.inside-tile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  font-weight: bold;
  color: black;
  will-change: transform;
}

.tile-enter-from.new {
  transform: scale(0);
}

.tile-enter-to.new {
  transform: scale(1);
}

.tile-enter-active.new {
  transition: transform 0.3s 0.05s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

.restarting .tile-enter-active.new {
  transition-delay: 0s;
}

.backwards .tile-enter-active {
  transition: transform 0s;
}

.backwards .tile-enter-active.merged {
  transition: none 0.2s;
  opacity: 0;
}


@media screen and (max-width: 500px) {
  .grid-tile {
    height: 90px;
    width: 90px;
    padding: 4px;
    font-size: 28px;
  }
}

@media screen and (max-width: 400px) {
  .grid-tile {
    height: 75px;
    width: 75px;
    padding: 3px;
    font-size: 24px;
  }
}

@media screen and (max-width: 280px) {
  .grid-tile {
    height: 67px;
    width: 67px;
    padding: 2px;
    font-size: 28px;
  }


}
</style>
