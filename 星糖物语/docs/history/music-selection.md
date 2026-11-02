# 星糖物语配乐选择

用户选择：主界面 B「午后轻语」，关卡 A「星光旅途」。

- 来源：`assets/music-ai/menu-b.wav`、`assets/music-ai/game-a.wav`，Stable Audio SA3 已生成原始音频。
- 主页、地图、伙伴与结算使用 menu-b；实际游戏页使用 game-a。
- `scripts/prepare-selected-music.py` 从原始 WAV 制作循环片段，按生成时标注的 BPM 取整小节，并对首尾做 0.6 秒交叉淡化。此处理不是对实际节拍或听感的实测保证。
- 音量统一到 -20 LUFS 目标；页面通过 Web Audio 增益降低背景音量，切曲约 0.7 秒淡化。
- 用户交互后才启动音频；设置中的音乐开关仍有效；隐藏页面暂停。
- `scripts/build-game.cjs` 内嵌两首 MP3，手机包上限由 1 MiB 提至 2 MiB；当前 `star-candy-elements-v6.html` 为 1,251,163 字节。
- v5 与试听页保留。新版本已打包，未执行浏览器或手机实机测试。
