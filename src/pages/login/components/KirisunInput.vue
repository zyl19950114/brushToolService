<template>
  <div class="kirisun-input">
    <input
      class="input__fill"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
    >
    <label class="input__label">{{ placeholder }}</label>
  </div>
</template>

<script>
export default {
  name: "KirisunInput",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput($event) {
      this.$emit('input', $event.target.value);
    }
  }
};
</script>

<style>
.kirisun-input {
  width: 100%;
  margin-bottom: 24px;
  position: relative;
}

.input__fill {
  border: none;
  outline: none;
  border-radius: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  transition: .2s all;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  color: #000;
  font-weight: 400!important;
  font-size: 14px;
}

.input__fill:not(:placeholder-shown),
.input__fill:focus {
  border-color: rgba(255, 255, 255, .6);
}

.input__fill::placeholder {
  color: transparent;
}

.input__label {
  position: absolute;
  left: 8px;
  top: 8px;
  transition: transform .25s;
  font-size: 14px;
  pointer-events: none;
  color: #515a6e;;
}

.input__fill:not(:placeholder-shown) ~ .input__label,
.input__fill:focus ~ .input__label {
  transform: translate(0, -28px);
  color: rgba(255, 255, 255, .6);
}
</style>
