<script>
export default {
  computed: {
    inlineCss() {
      return this.calcInlineCss();
    },

    cssClass() {
      const position = this.position.replace(" ", "-");
      return `ubi-notify-root ubi-notify-root-${position}`;
    }
  },

  methods: {
    useInlineCssPosition() {
      return (
        this.position.search(":") !== -1 ||
        this.position.toLowerCase().search("center") !== -1
      );
    },

    useInlineWidth() {
      return this.width !== "";
    },

    calcInlineCss() {
      let css = "";
      if (this.useInlineCssPosition()) {
        css += this.calcPosition() + " ";
      }
      if (this.useInlineWidth()) css += `width: ${this.width};`;
      return css;
    },

    calcPosition() {
      const words = this.position.toLowerCase().split(" ");
      let positionStyle = "";
      words.forEach((word, index) => {
        if (["top", "bottom", "left", "right"].indexOf(word) != -1) {
          positionStyle += `${word}: 0; `;
        } else if (word === "center") {
          if (index === 0) {
            // vertically center
            let height = getComputedStyle(this.$refs["root"]).height;
            const numericHeight = parseFloat(height.match(/[\d.]+/));
            const heightType = height.replace(/[\d.]+/, "");
            const marginTop = `-${numericHeight / 2}${heightType}`;
            positionStyle += `top: 50%; margin-top:${marginTop}; `;
          } else if (index === 1) {
            // horizontally center
            let width = null;
            width = getComputedStyle(this.$refs["root"]).width;
            const numericWidth = parseFloat(width.match(/[\d.]+/));
            const widthType = width.replace(/[\d.]+/, "");
            const marginLeft = `-${numericWidth / 2}${widthType}`;
            positionStyle += `left: 50%; margin-left:${marginLeft}; `;
          }
        }
      });
      return positionStyle;
    }
  }
};
</script>
