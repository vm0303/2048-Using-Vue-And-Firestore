<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="modal">
        <div class="modal__text">{{ text }}</div>
        <div class="modal-buttons">
          <button v-ripple="15" class="modal__button modal__restart-button" @click="$emit('restart')">
            Restart
          </button>
          <button id="scrolling-button" v-ripple="15" v-scroll class="modal__button cancel" @click="$emit('alt')">
            {{ alt }}
          </button>
        </div>
        <div class="backdrop"></div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {

  props: {
    text: String,
    show: Boolean,
    alt: String,
  },
  emits: ["restart", "alt"],

};
</script>

<style>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal__text {
  font-size: 70px;
  font-weight: 200;
  color: white;
  text-transform: uppercase;
  margin-bottom: 32px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.modal-buttons {
  z-index: 20;
  display: flex;
  gap: 16px;
}

.modal__button {
  width: 200px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  margin: 20px;
  height: 65px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 50px;
  -o-transition: all .4s ease-in-out;
  -webkit-transition: all .4s ease-in-out;
  transition: all .4s ease-in-out;
}

.modal__restart-button {
  background-image: linear-gradient(to right, #fc6076, #ff9a44, #ef9d43, #e75516);
  box-shadow: 0 4px 15px 0 rgba(252, 104, 110, 0.75);
}

.cancel {
  background-image: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7);
  box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
}

.backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  z-index: 10;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 2;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease-out;
}

@media (hover: hover) {
  .modal__button:hover {
    background-position: 100% 0;
    -o-transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    transition: all .4s ease-in-out;
  }
}

@media screen and (max-width: 800px) {
  .modal__text {
    font-size: 80px;

  }

  .modal__button {
    width: 200px;
    font-size: 16px;
  }
}
@media screen and (max-width: 600px)
{
  .modal__text {
    font-size: 60px;

  }

  .modal__button {
    width: 160px;
    font-size: 12px;
  }
}

@media screen and (max-width: 500px) {
  .modal__text {
    font-size: 50px;

  }

  .modal__button {
    width: 140px;
    font-size: 10px;
  }
}

@media screen and (max-width: 400px) {
  .modal__text {
    font-size: 40px;
  }

  .modal__button {
    width: 130px;
    font-size: 11px;


  }
}

@media screen and (max-width: 320px) {

  .modal__text {
    font-size: 35px;

  }

  .modal__button {
    width: 110px;
  }
}

@media screen and (max-width: 280px) {

  .modal__text {
    font-size: 32px;
  }

  .modal__button {
    width: 105px;
    height: 50px;
    font-size: 9px;
  }

  .modal-buttons {
    gap: 1px;
  }
}

</style>
