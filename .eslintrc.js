module.exports = {
  root: true,
  extends: "awzzm-vue/v3",
  rules: {
    "max-len": ["warn", {
      code: 180
    }],
    "vue/max-len": ["warn", {
      code: 180
    }],
    "vue/no-v-html": "off"
  },
  ignorePatterns: ["server"]
}
