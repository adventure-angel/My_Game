# 工程分层

原项目由单文件 H5 原型不断演进而来，因此部分模块通过全局变量、DOM 标识和构建脚本拼接，不是已发布的独立三消 SDK。下面按职责拆解，供阅读和迁移。

| 层 | 主要文件 | 职责与依赖 |
| --- | --- | --- |
| 棋盘规则 | `src/engine.js` | 7×7 棋盘、合法交换、匹配、特殊糖、掉落、死局重排；不负责页面 |
| 元素规则 | `src/elements.js`、`scripts/element-effects.js` | 元素附着、反应、场地效果与反馈；依赖棋盘和项目的效果定义 |
| 对局与关卡 | `src/appScript.js`、`src/game-flow.js`、`src/difficulty-bridge.js`、`src/journey-expansion.js`、`src/weekly-challenge.js` | 目标、步数、伙伴技能、关卡推进、挑战赛与结算 |
| 游戏内容 | `src/prologue.js`、`src/first-chapter.js`、`src/room-growth.js`、`src/room-life.js`、`src/world-flow.js` 等 | 序章、角色、小屋收藏、章节与日常回应；属于星糖物语的具体设计 |
| 资源与存档 | `src/save-store.js`、`src/economy-flow.js`、`src/ad-economy.js`、`src/music.js` | 本地进度、背包、奖励、音乐；改动时需考虑旧存档迁移与失败回滚 |
| 平台适配 | `src/taptap-ads.js`、`src/taptap-cloud.js`、`src/taptap-cloud-ui.js`、`src/weekly-challenge.js`、`src/release-config.js` | TapTap 广告、云端与榜单接口；本地浏览器不能证明真实平台回执 |
| 表现层 | `src/*.css`、`src/art-flow.js`、`index.html` | 手机布局、画面、动效、操作与文本 |
| 构建与发布候选 | `scripts/build-game.cjs`、`scripts/package-mobile.cjs`、`scripts/package-mirror-ads.cjs` | 把源码与资源打进 HTML，再拆成带资源哈希的静态 H5 包 |

## 数据流

`template/index.html.parts/` 还原模板 + `src/` + `assets/` → `build-game.cjs` → 内嵌版 `index.html` → `package-mobile.cjs` → `mobile-play.html` → `package-mirror-ads.cjs` → `release/h5-mirror-ads-v47/game/`。

`package-mirror-ads.cjs` 经 `package-room-lighting.cjs` 和 `package-free-play-72.cjs` 复用旧打包逻辑，再把版本与资源 URL 调整为 v47。这是历史演进留下的构建链，适合阅读现状；若用于新项目，建议改成单一配置驱动的构建流程，并独立测试结果一致性。

## 移植顺序

1. 先用 `CandyEngine` 做最小棋盘，验证交换、三连、掉落、死局处理。
2. 再选择是否加入 `ElementSystem`；元素与特殊糖结算顺序应保持确定。
3. 用新游戏自己的关卡数据、目标、道具、界面和素材接入对局。
4. 单独接入存档和平台服务；先确定旧档兼容与奖励领取时机，再公开测试。

`playable/v47/` 是完整游戏展示包，可以本地试玩；它不承诺是一个可直接改名换图的模板。
