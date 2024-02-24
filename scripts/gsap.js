gsap.fromTo(
  ".box", //アニメーションしたい要素
  {
    //アニメーション前の記入
    y: 50, //アニメーション開始前の位置
    autoAlpha: 0, //アニメーション開始前の状態
  },
  {
    //アニメーション後の記入
    y: 0, //アニメーション後の位置
    autoAlpha: 1, //アニメーション後の状態
    scrollTrigger: {
      trigger: ".marginTop", //アニメーションが始まるトリガーとなる要素
        start: "bottom top", //アニメーションが始まる位置を指定
    },
  }
);
