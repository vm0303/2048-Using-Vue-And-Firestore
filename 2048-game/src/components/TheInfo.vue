<template>
  <div class="text-content">
    <h1 class="game-title">2048 using Vue.js</h1>
    <h3 class="sub-title">What is 2048?</h3>
    <div class="info">
      <p> 2048 is a single-player sliding block puzzle game designed by Italian web developer Gabriele Cirulli</p>
    </div>
    <h3 class="sub-title">Objective</h3>
    <div class="info">
      <p> The objective of the game is to combine the same numbered tiles by sliding them around the board that's shown below
        in order to get
        the tile that is numbered "2048". </p>
      <p><b>NOTE:</b> These tiles can only contain integer values starting from 2. So, when the same numbered tiles
        are combined in the grid, they are raised by a power of 2.
        </p>
      <p>
        For example:
        2<sup>2</sup>=4,
        4<sup>2</sup>=8,
        8<sup>2</sup>=16,
        and so on.
      </p>
    </div>
    <h3 class="sub-title">How to Play</h3>
    <div class="info">
      <p><b>Computer/Laptop Users:</b> Use the arrow keys to move the tiles across the board </p>
      <p><b>Mobile/Tablet Users:</b> Use your finger to swipe the tiles across the board </p>
      <p><b>After you win or lose the game, enter your first and last name in the score form that will appear after the game is over,
        and see where you rank in the scoreboard!</b></p>
      <p>Good luck, and have fun playing the game!</p>
      <p class="special-note"><i>(Side Note: The score boxes and the buttons have a cool ripple effect for those
        using a mobile device, and a cool hover effect for those using a computer/laptop.)</i></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "TheInfo"
}
</script>

<style scoped>
.game-title {
  font-weight: 500;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 40px;
  background: linear-gradient(to right, #FFF 20%, #15afb2 40%, #2ecca1 60%, #FFF 80%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s linear infinite reverse;
}

.text-content {
  position: relative;

}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.sub-title {
  font-weight: 500;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 25px;
  background: linear-gradient(to right, #15afb2 20%, #04cc95 30%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 2px;
  padding: 2px;

}

.info {
  font-weight: 300;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  width: 85%;
  display: inline-block;
  margin: 2px;
  padding: 2px;
}

.special-note {
  font-size: 12px;
}

@media screen and (max-width: 600px) {
  .game-title {
    font-size: 40px;
  }

  .sub-title {
    font-size: 25px;
    margin: 2px;
    padding: 2px;
  }

  .info {
    font-size: 15px;
    margin: 2px;
    padding: 2px;
  }

  .special-note {
    font-size: 10px;
  }
}

@media screen and (max-width: 500px) {
  .game-title {
    font-size: 35px;
  }

  .sub-title {
    font-size: 25px;
    margin: 2px;
    padding: 2px;
  }

  .info {
    font-size: 14px;
    margin: 2px;
    padding: 2px;
  }

  .special-note {
    font-size: 10px;
  }
}

@media screen and (max-width: 400px) {
  .game-title {
    font-size: 28px;
  }

  .sub-title {
    font-size: 20px;
    margin: 2px;
    padding: 2px;
  }

  .info {
    font-size: 12px;
    margin: 2px;
    padding: 2px;
  }

  .special-note {
    font-size: 10px;
  }
}

@media screen and (max-width: 320px) {
  .game-title {
    font-size: 24px;
  }

  .sub-title {
    font-size: 18px;
    margin: 2px;
    padding: 2px;
  }

  .info {
    font-size: 10px;
    margin: 2px;
    padding: 2px;
  }

  .special-note {
    font-size: 8px;
  }

}

@media screen and (max-width: 280px) {
  .game-title {
    font-size: 20px;
  }

  .sub-title {
    font-size: 16px;
    margin: 2px;
    padding: 2px;
  }

  .info {
    font-size: 8px;
    margin: 2px;
    padding: 2px;
  }

  .special-note {
    font-size: 6px;
  }

}
</style>