<template>
  <div class="game-container">
    <div class="console-container">
      <div class="theScore-boxes">
        <div v-ripple="30" class="theScore box">
          <div> Score </div>
          <div> {{ controller.theScore }}</div>
        </div>
        <div v-ripple="30" class="theScore box">
          <div> Best Score</div>
          <div> {{ getMaxScore()}}</div>
        </div>
      </div>

      <div class="button-placement">
        <button v-ripple="50" class="theBtn" @click="showFormAndScores =!showFormAndScores" v-on:click="restart">
          New Game
        </button>
      </div>
    </div>

    <div class="game-grid-layout">
      <div
          v-for="(row, rowIndex) in grid"
          :key="rowIndex"
          class="grid-layout__row"
      >
        <div
            v-for="(cell, index) in row"
            :key="index"
            class="grid-layout__cell"
        ></div>
      </div>
    </div>
    <div :class="{ restarting }" class="grid" ref="grid">
      <TheTile v-for="tile in tileCells" :key="tile.id" :tile="tile"/>
    </div>
  </div>

  <TheModal
      :show="gameOver"
      alt="Report Your Score"
      text="Game Over!"
      @alt="close_Lose"
      @restart="restart"
  />
  <TheModal
      :show="hasWon"
      alt="Continue Playing Or Report Your Score"
      text="You Win!"
      @alt="close_Win"
      @restart="restart"
  />
  <br>
  <Transition name="fadeFormAndScores">
    <div v-show="showFormAndScores" class="theScore-form">
      <h2 class="sub-title">Score Form</h2>
      <div class="info">
        <p> Enter your first and last name in the text boxes below to report your score, and see where you rank in the
          scoreboard!</p>
        <p> If you want to get a better score, refresh the page, or click on the "New Game" button above the game's board to
          start a new game.</p>
      </div>
      <form id="data" @submit.prevent="dataSubmit">
        <div class="input-box">
          <input id="first_name" v-model="first_name" required type="text"/>
          <label  for="">Enter Your First Name Here</label>
        </div>
        <div class="input-box">
          <input id="last_name" v-model="last_name" required type="text"/>
          <label for="">Enter Your Last Name Here</label>
        </div>
        <button v-ripple="35" class="submit-button" type="submit" value="Submit" @click=showOrHideModal>Submit</button>
      </form>
    </div>
  </Transition>
  <br>
  <br>

  <div class="high-score-board">
    <h2 class="sub-title">High Scores</h2>
    <div class="cards">
      <p v-for="user in scores" v-bind:key="user.id" v-ripple="120" class="info card gradient">
        Name: {{ user.first_name }} {{ user.last_name }}
        <br>
        Score: {{ user.theScore }}
      </p>
    </div>
  </div>
  <br>
  <br>
  <footer>
    <p class="footer-info">Copyright &copy; 2023
      <a class="theLink"
         href="https://github.com/PiggyDiggy/2048"
         rel="noreferrer"
         target="_blank">PiggyDiggy</a> from GitHub
    </p>
    <p class="footer-info">And  <a class="theLink"
                                   href="https://github.com/PiggyDiggy/2048"
                                   rel="noreferrer"
                                   target="_blank">The Coding Train</a></p>
    <p class="footer-info"> Edited and re-created by <a class="theLink"
                                                        href="#"
                                                        rel="noreferrer"
                                                        target="_blank">Vishal Madhav</a>  </p>
  </footer>

  <Transition name="fade">
    <div v-if="openScoreModal"
         class="theScore-modal-overlay"
    ></div>
  </Transition>
  <Transition name="slide-fade">
    <div v-if="openScoreModal"
         class="theScore-modal"
         role="dialog"
    >
      <p class="info">Thank you!</p>
      <p class="info">Your data for the scoreboard has been submitted and can be seen down below. </p>
      <button v-scroll class="theBtn" @click="openScoreModal = false">Close</button>
    </div>
  </Transition>
</template>
<script>

import {BoardGameControls} from "@/utils/GameCreation";
import {TouchMobileEvents} from "@/utils/TouchEvents";
import {Storage} from "@/utils/GameHistory";
import TheTile from "./TheTile.vue";
import TheModal from "@/components/TheModal.vue";
import db from '../firebase/firebaseInit'




export default {
  components: {
    TheModal,
    TheTile,
  },

  data() {
    const controller = new BoardGameControls();
    return {
      keys: {
        ArrowUp: controller.KeyArrowUp,
        ArrowDown: controller.keyArrowDown,
        ArrowLeft: controller.keyArrowLeft,
        ArrowRight: controller.keyArrowRight,
      },
      controller,
      gameOver: false,
      hasWon: false,
      restarting: false,
      history: [],
      scores: [],
      name: null,
      showFormAndScores: false,
      openScoreModal: false
    }
  },

  methods: {
    restart() {
      this.gameOver = false;
      this.hasWon = false;
      this.restarting = true;
      this.controller.restartGame();
      this.history = [];
      Storage.hasWon = false;
      this.showFormAndScores = false;

    },
    close_Lose() {
      this.gameOver = false;
      this.showFormAndScores = true;
    },
    close_Win() {
      this.hasWon = false
      Storage.hasWon = true
      this.history = [];
      this.showFormAndScores = true;
    },
    copyState() {
      return {
        grid: JSON.parse(JSON.stringify(this.grid)),
        tileCells: JSON.parse(JSON.stringify(this.tileCells)),
        theScore: this.controller.theScore,
      };
    },
    updateHistory(state) {
      if (this.history.length === 5) this.history.shift();
      this.history.push(state);
    },
    loadFromStorage() {
      const lastState = Storage.lastState;
      if (lastState && lastState.tileCells.length) {
        this.controller.replaceGridState(lastState);
      } else {
        this.controller.fill();
      }
      this.history = Storage.history;
    },
    getMaxScore() {
      return Math.max(Storage.maxScore, this.controller.theScore);
    },

    swipe({direction}) {
      const key = `Arrow${direction[0].toUpperCase()}${direction.slice(1)}`;
      this.move(key);
    },
    move(key) {
      if (!this.keys[key]) return;
      const lastState = this.copyState();
      this.restarting = false;
      this.controller.clearTheBoard();
      this.keys[key]();

      if (!this.flatGrid.some((cell) => cell.moved)) {
        return this.controller.restoreTheTiles(lastState);
      }

      this.controller.fill(1);
      this.updateHistory(lastState);

      if (this.controller.userLost()) {
        this.gameOver = true;
      }

      if (!Storage.hasWon && this.controller.userWon()) {
        this.hasWon = true;
        Storage.hasWon = true;
      }
    },
    highScore() {
      db.collection('userScores').orderBy('theScore', "desc").onSnapshot((querySnapshot => {
        this.scores = [];
        querySnapshot.forEach(doc => {
          const data = {
            'id': doc.id,
            'first_name': doc.data().first_name,
            'last_name': doc.data().last_name,
            'theScore': doc.data().theScore
          }
          this.scores.push(data)
        })
      }))
    },

    dataSubmit() {
      db.collection('userScores').add({
        first_name: this.first_name,
        last_name: this.last_name,
        theScore: this.controller.theScore
      })

    },
    showOrHideModal() {
      let value = document.getElementById("first_name").value;
      let value2 = document.getElementById("last_name").value;
      if(value == null || value === '' || value2 == null || value2 === '')
      {
        this.openScoreModal = false;
        this.showFormAndScores= true;
      }
      else
      {
        this.openScoreModal = true;
        this.showFormAndScores= false;
      }
    }
  },
  watch: {
    history: {
      handler() {
        Storage.maxScore = this.getMaxScore();
        Storage.history = this.history;
        Storage.lastState = {
          grid: this.grid,
          tileCells: this.tileCells,
          theScore: this.controller.theScore,
          nextId: this.controller.nextId,
        };
      },
      deep: true,
    },
  },
  computed: {
    grid() {
      return this.controller.grid;
    },
    flatGrid() {
      return this.grid.flat();
    },
    tileCells() {
      return this.controller.tileCells;
    },
  },
  created() {
    this.loadFromStorage();
    document.addEventListener("keydown", ({key}) => this.move(key));
    document.addEventListener("custom:swipe", ({detail}) => this.swipe(detail));
    this.highScore();
      this.controller.restartGame();
      this.history = [];
      this.restarting = true;
      Storage.hasWon = false;
      this.gameOver = false;
      this.hasWon = false;

  },
  mounted() {
    const gridRef = this.$refs.grid;
    new TouchMobileEvents(gridRef);
    gridRef.addEventListener("custom:swipe", ({ detail }) => this.swipe(detail));
  }

};


</script>

<style>
.game-container {
  position: relative;

}

.console-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  padding: 0 8px;
  font-size: 20px;
}

.button-placement {
  display: flex;
  justify-content: center;
  align-items: center;
}



.theBtn {
  border: none;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  width: 120px;
  height: 40px;
  border-radius: 50px;
  background-size: 400% 100%;
  padding: 6px;
  moz-transition: all .4s ease-in-out;
  -o-transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  transition: all .4s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-image: linear-gradient(to right, #0ba5b9, #40e495, #30dd8a, #2bb673);
  box-shadow: 0 4px 20px 0 #30db89;
}

.theBtn:focus {
  outline: none;
}

.grid {
  position: relative;
  height: 450px;
  width: 450px;
  border-radius: 8px;
  border: 10px solid transparent;

}

.game-grid-layout {
  z-index: -1;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 5px solid black;
  background-color: black;
  border-radius: 12px;
}

.grid-layout__row {
  display: flex;
}

.grid-layout__cell {
  height: 110px;
  width: 110px;
  background-image: linear-gradient(to right, #1e252c, #454f5a);
  border: 5px solid black;
  border-radius: 12px;
}

.theScore-boxes {
  display: flex;
  gap: 10px;
}

.theScore {
  background: linear-gradient(to right, #29323c, #5f6d7d, #707e8b, #34475c);
  color: white;
  flex-direction: column;
  border-radius: 4px;
  padding: 8px 16px;
  text-align: center;
  background-size: 300% 100%;
  -o-transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  transition: all .4s ease-in-out;
  moz-transition: all .4s ease-in-out;
}

.theScore div {
  font-size: 1.2rem;
}

.theScore div:first-child {
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.7rem;
  line-height: 14px;
}

.theScore-form {
  width: 420px;
  display: inline-block;
  margin: 5px;
  padding: 5px;
}

.input-box {
  position: relative;
  font-weight: 300;
  letter-spacing: 2px;
}

.input-box input {
  border-style: none;
  background: transparent;
  border-bottom: 1px solid white;
  width: 100%;
  position: relative;
  outline: none;
  padding: 10px 0;
  color: white;
  font-size: 16px;
  margin-bottom: 30px;
}

.input-box label {
  color: white;
  position: absolute;
  padding: 10px 0;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: 0.6s;
}

.input-box input:focus ~ label,
.input-box input:valid ~ label {
  color: #3fd3f6;
  font-size: 15px;
  top: -20px;
  transition: 0.6s;
}

.submit-button {
  border: none;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  width: 120px;
  height: 40px;
  border-radius: 50px;
  background-size: 400% 100%;
  padding: 6px;
  moz-transition: all .4s ease-in-out;
  -o-transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  transition: all .4s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-image: linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673);
  box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);

}

.submit-button:focus {
  outline: none;
}

.info {
  font-weight: 300;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  display: inline-block;
  margin: 5px;
  padding: 5px;
}

.footer-info {
  font-weight: 100;
  color: white;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cards {
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  margin: 15px;
  padding: 15px;
  width: 430px;
  height: 70px;
  display: block;
  grid-template-rows: 20px 50px 1fr 50px;
  border-radius: 50px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.25);
}

.card.gradient {
  background: linear-gradient(to right,
  #002661, #0aa289);
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

.fadeFormAndScores-enter-active,
.fadeFormAndScores-leave-active {
  transition: opacity 1s ease;
}

.fadeFormAndScores-enter-from,
.fadeFormAndScores-leave-to {
  opacity: 0;
}

.theScore-modal {
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 22em;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, rgba(43, 61, 74, 0.98), rgba(73, 120, 144, 0.98));
  color: #FFFFFF;
  z-index: 999;
  transform: none;
}


.theScore-modal-overlay {
  content: '';
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(50px);
  opacity: 0.6;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

footer {
  width: 100%;
  background-image: linear-gradient(to right, #17191c, #29323c, #030d19);
  color: white;
  padding: 10px 0;
}

.theLink {
  color: white;
}
.high-score-board
{
  padding: 3px;
  margin: 3px;
}


@media (hover: hover) {
  .submit-button:hover {
    background-position: 100% 0;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
    moz-transition: all .4s ease-in-out;
  }

  .theBtn:hover {
    background-position: 100% 0;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
    moz-transition: all .4s ease-in-out;
  }

  .theScore:hover {
    background-position: 100% 0;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
    moz-transition: all .4s ease-in-out;
  }
}

@media screen and (max-width: 600px) {
  .info {
    font-size: 15px;
    margin: 2px;
    padding: 2px;
  }

  .card {
    margin: 10px;
    padding: 10px;
    width: 400px;
    height: 58px;
  }

}

@media screen and (max-width: 500px) {
  .theScore-form {
    width: 350px;
  }

  .info {
    font-size: 14px;
    margin: 2px;
    padding: 2px;
  }

  .card {
    margin: 10px;
    padding: 10px;
    width: 370px;
  }

  .game-grid-layout {
    border-width: 4px;
    border-radius: 10px;
  }

  .grid-layout__cell {
    height: 90px;
    width: 90px;
    border-width: 4px;
    border-radius: 10px;
  }

  .grid {
    width: 370px;
    height: 370px;
    border-width: 11px;
  }

  .console-container {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .theScore-boxes {
    display: flex;
    gap: 10px;
  }

  .theScore {
    color: white;
    padding: 6px 14px;
    text-align: center;
  }

  .theScore div:first-child {
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.7rem;
    line-height: 12px;
  }

  .theScore div {
    font-size: 1.2rem;
  }
}

@media screen and (max-width: 430px) {
  .theScore-form {
    width: 320px;
  }

  .input-box input {
    font-size: 14px;
    margin-bottom: 28px;
  }

  .input-box input:focus ~ label,
  .input-box input:valid ~ label {

    font-size: 14px;

  }

  .info {
    font-size: 14px;
    margin: 2px;
    padding: 2px;
  }

  .card {
    margin: 10px;
    padding: 10px;
    width: 340px;
  }
}



@media screen and (max-width: 400px) {
  .info {
    font-size: 12px;
    margin: 2px;
    padding: 2px;
  }

  .card {
    margin: 10px;
    padding: 10px;
    width: 310px;
    height: 50px;
  }

  .game-grid-layout {
    border-width: 3px;
    border-radius: 8px;
  }

  .grid-layout__cell {
    height: 75px;
    width: 75px;
    border-width: 3px;
    border-radius: 8px;
  }

  .grid {
    width: 310px;
    height: 310px;
    border-width: 12px;
  }

  .console-container {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .theScore div {
    font-size: 0.9rem;
  }

  .theScore div:first-child {
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.6rem;
    line-height: 14px;
  }

  .theScore {
    background-image: linear-gradient(to right, #29323c, #5f6d7d, #707e8b, #34475c);
    color: white;
    flex-direction: column;
    border-radius: 4px;
    padding: 4px 12px;
    text-align: center;

  }

  .theScore-form {
    width: 320px;
  }

  .input-box input:focus ~ label,
  .input-box input:valid ~ label {
    font-size: 14px;
    top: -20px;
  }

  .theScore-modal {

    max-width: 20em;
  }
}

@media screen and (max-width: 360px)
{
  .footer-info {
    font-size: 9px;
  }
}
  @media screen and (max-width: 320px) {
  .theScore-form {
    width: 235px;

  }

  .input-box label {
    font-size: 12px;
  }

  .theScore-modal {
    max-width: 15em;
  }

  .card {
    margin: 25px;
    padding: 25px;
    width: 270px;
    display: inline-block;
    height: 30px;
  }

  .input-box input {
    font-size: 11px;
    margin-bottom: 25px;
  }

  .input-box input:focus ~ label,
  .input-box input:valid ~ label {

    font-size: 11px;

  }

  .info {
    font-size: 10px;
    margin: 2px;
    padding: 2px;
  }

  .game-grid-layout {
    border-width: 3px;
    border-radius: 8px;
  }

  .grid-layout__cell {
    height: 75px;
    width: 75px;
    border-width: 3px;
    border-radius: 8px;
  }

  .grid {
    width: 310px;
    height: 310px;
    border-width: 12px;
  }

  .console-container {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .theScore div {
    font-size: 0.9rem;
  }

  .theScore div:first-child {
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.6rem;
    line-height: 14px;
  }

  .theScore {
    background-image: linear-gradient(to right, #29323c, #5f6d7d, #707e8b, #34475c);
    color: white;
    flex-direction: column;
    border-radius: 4px;
    padding: 4px 12px;
    text-align: center;

  }
}

@media screen and (max-width: 280px) {
  .theScore-modal {

    max-width: 14em;
  }
  .theScore-form {
    width: 200px;
  }
  .footer-info {

    font-size: 8px;
  }

  .info {
    font-size: 8px;
    margin: 2px;
    padding: 2px;
  }

  .card {
    margin: 8px;
    padding: 8px;
    width: 210px;
    height: 35px;
  }

  .game-grid-layout {
    border-width: 3px;
    border-radius: 8px;
  }

  .grid-layout__cell {
    height: 67px;
    width: 67px;
    border-width: 3px;
    border-radius: 8px;
  }

  .grid {
    width: 275px;
    height: 275px;
    border-width: 9px;
    margin-top: 6px;
  }

  .console-container {
    font-size: 12px;
    margin-bottom: 3px;
  }

  .theScore div {
    font-size: 0.8rem;
  }

  .theScore div:first-child {
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.6rem;
    line-height: 12px;
  }

  .theScore {
    background-image: linear-gradient(to right, #29323c, #5f6d7d, #707e8b, #34475c);
    color: white;
    flex-direction: column;
    border-radius: 2px;
    padding: 3px 7px;
    text-align: center;

  }

  .theBtn {

    width: 100px;
    height: 31px;
    font-size: 12px;

  }
  .sub-title
  {
    font-size: 16px;
  }

  .input-box label {
    font-size: 9px;
  }



  .input-box input {
    font-size: 9px;
    margin-bottom: 20px;
  }

  .input-box input:focus ~ label,
  .input-box input:valid ~ label {

    font-size: 8px;

  }
}
</style>
