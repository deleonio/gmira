**简体中文** | [English](README.en.md)

<h1 align="center">GMIRA ܓܡܝܪܐ</h1>

<p align="center">
<em>gmīrā</em>，叙利亚语，意为“完美、完整、已完成”，词根 <em>g-m-r</em> 意为“完成”。《别西大译本》在《马太福音》5:48 里用的就是这个词。
</p>

<p align="center">
  <strong>组件库能抬高上限，抬不动下限。</strong>
</p>

<p align="center">
GMIRA 是 21 个 Claude Code 技能，用来做一眼看不出是 AI 生成的网页。它要求在放下第一个元素之前先把视觉方向写成文字，接好 7 个 shadcn 组件注册表（514 个组件）并对每个装进来的组件跑一遍修复，为 WebGL 和 canvas 定了一条 GPU 性能底线，最后用 Playwright 在 5 个视口上卡验收。技术栈是 Next.js、React、Tailwind v4。
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="MIT 许可证"></a>
  <a href="#21-个技能"><img src="https://img.shields.io/badge/skills-21-black?style=flat" alt="21 个技能"></a>
  <a href="#安装"><img src="https://img.shields.io/badge/registries-7-black?style=flat" alt="7 个组件注册表"></a>
  <a href="#安装"><img src="https://img.shields.io/badge/components-514-black?style=flat" alt="514 个组件"></a>
  <a href="#验收"><img src="https://img.shields.io/badge/gate-5%20viewports-2da44e?style=flat" alt="Playwright 五视口验收"></a>
  <a href="https://github.com/OthmanAdi/gmira/stargazers"><img src="https://img.shields.io/github/stars/OthmanAdi/gmira?style=flat&color=yellow" alt="Star 数"></a>
</p>

<p align="center">
  <a href="#问题在哪">问题在哪</a> ·
  <a href="#它做什么">它做什么</a> ·
  <a href="#安装">安装</a> ·
  <a href="#21-个技能">技能清单</a> ·
  <a href="#gpu-底线">GPU 底线</a> ·
  <a href="#四份实证">实证</a>
</p>

---

## 问题在哪

让任何一个编码 agent 做个网站，出来的都是同一个页面。卡片网格、渐变标题、每个板块头上顶一行加了字间距的大写小标题、居中首屏配两个按钮。做得没错，可以互换，也记不住。

常规解法是换一套更好的组件库。这条路走不通，而且有截图为证。

### 证据 A：给了一套刻意压暗的配色，组件当没看见

从 514 个组件的军火库里第一次安装。一个 WebGL 首屏组件，配色给的是近黑、深绿、金。给汽车经销商用的克制暗色首屏。

![WebGL 首屏组件渲染出一整条彩虹涂抹，正中间焊着一个过曝的白色圆盘，传入的近黑、深绿、金三色一个都看不见](proofs/finding-01/01-defaults-slop.png)

彩虹涂抹。正中间焊着一个过曝的白盘。控制台零报错，所以组件“跑通了”。配色根本没有到达像素。

原因在着色器里，读一遍源码就清楚。整支着色器有九层：配色只在第 2 层生效一次，后面六层直接往颜色上**加**，中间不做任何归一化，只有最后一行做了 clamp。最狠的是一处辉光，在 clamp 之前每个通道大约加了 **+1.84**，不管配色是什么，出来都是白的。这处辉光的位置和强度写死在 uniform 块里，而且每一帧都重新赋值，没有任何 prop 能碰到它。组件自己的源码注释里写着 “VISIBLE Mouse interaction”，但它从头到尾没接过鼠标。

### 证据 B：改四行之后

![同一个 WebGL 首屏组件在打过补丁之后，渲染出预期的近黑底色配深绿与金，标题文字完全可读](proofs/finding-01/02-tamed.png)

同一个组件，同一份需求，同一组配色 prop。补丁做的事是把那个焊死的常量提成 prop，并且默认关掉。

**注册表里的组件是一台引擎，不是一份设计。它的默认值是为了赢下五秒的展示 GIF，而这种展示 GIF 就是新的套路。** 2026 年的彩虹 WebGL 团块，坐的正是 2021 年紫色 CSS 渐变的那个位置。

完整记录见 [`research/FINDING-01-tame-the-arsenal.md`](research/FINDING-01-tame-the-arsenal.md)。

## 它做什么

输出显得套路，不是能力问题，是**回避决策**的问题。模型对设计选项的排序，是它自身先验的确定性函数，所以让它“有创意一点”没有用：这条指令会被它本来要纠正的那个东西拿去评判。

只有外部指派能打败先验。所以 GMIRA 先把决策逼出来，再给执行决策的材料。

```
1  BRIEF      事实是什么，给谁看，内容到底是什么
2  DIRECTION  一份 5 段式方向契约，写成文字，在放下任何元素之前
3  BUILD      用军火库里的组件搭页面，先修复，再驯服
4  GATE       套路审计、无障碍、性能，最后用眼睛看真实截图
```

第 2 步成本是 150 个字，差别全在这里。契约有五段，外加一条可证伪性测试：

```
THESIS         一句话：这个页面在主张什么
OWN-WORLD      它借用的那个物质世界，要指名道姓
STORY          从首屏到最后一屏之间发生了什么变化
FIRST VIEWPORT 滚动之前屏幕上有什么，用名词写
FORM           结构性决策：页面是怎么搭起来的，而不是它感觉如何
```

如果某一段读起来像一种情绪，那方向就还没定下来。“高端、现代”是情绪。“1970 年代保时捷零件目录：等宽字体的零件号、发丝线分隔、照片压在中性色卡纸上、任何地方都不用圆角”才是方向。

物质世界是**按外部索引抽出来的**，不是挑出来的。指派，而不是选择。方向技能抽取的目录里有 40 个物质世界。

## 安装

把技能复制进 Claude Code 的技能目录：

```bash
git clone https://github.com/OthmanAdi/gmira.git
cp -r gmira/skills/* ~/.claude/skills/
```

然后把组件注册表接进项目的 `components.json`：

```json
{
  "registries": {
    "@componentry": "https://componentry.dev/r/{name}.json",
    "@canvas-ui":   "https://canvasui.dev/r/{name}.json",
    "@bklit":       "https://ui.bklit.com/r/{name}.json",
    "@ncdai":       "https://chanhdai.com/r/{name}.json",
    "@kibo-ui":     "https://kibo-ui.com/r/{name}.json",
    "@react-bits":  "https://reactbits.dev/r/{name}.json",
    "@soundcn":     "https://soundcn.xyz/r/{name}.json"
  }
}
```

7 个注册表共 514 个组件，全部验证可达。用 `npx shadcn@latest mcp init` 接上 shadcn MCP，agent 就能在这 7 个注册表里搜索和安装。

依赖保持轻。`framer-motion`、`lenis`、`lucide-react` 三个就覆盖了所有非 three.js 组件，包括四个纯 WebGL 首屏组件，因为纯 WebGL 不需要任何库。three.js 大约 600 KB，只有当某个具体组件确实值这个体积时才装。

输入 `/gmira` 让路由技能分派，也可以直接调用其中任何一个。

## 21 个技能

一个路由技能加二十个，每一个都是可以单独调用的技能，各自带一份 `SKILL.md`。

### 决策

| 技能 | 什么时候用 |
|---|---|
| `gmira-brief` | 任何事情的开头。抽出产品事实、模式，以及真实的内容模型。 |
| `gmira-direction` | 5 段式方向契约，带一整套反默认机制。这一步之前不动手。 |
| `gmira-palette` | 色彩世界。有承诺的配色策略，主色覆盖 30% 到 60% 的表面，对比度实测。 |
| `gmira-typeset` | 排版语气。行宽、字号级差、字间距，以及等宽字体到底允许表示什么。 |

### 构建

| 技能 | 什么时候用 |
|---|---|
| `gmira-hero` | 首屏。管着效果预算和第 0 帧问题。 |
| `gmira-scroll` | 滚动编排：钉住、scrub、倾斜、揭示。只留一个被设计过的时刻。 |
| `gmira-catalog` | 任何一组东西：库存、商品、课程、创意墙。反卡片网格的那个技能。 |
| `gmira-detail` | 单个东西的深度页：商品详情页、车辆详情页、课程页。参数表和变体状态。 |
| `gmira-flow` | 多步流程：结算、报名、金融试算、预约、申请。 |
| `gmira-proof` | 口碑、成果、logo 墙、案例，并且一个都不编。 |
| `gmira-nav` | 页头、命令面板、页脚，以及承载整个世界的那层外壳。 |

### 手艺

| 技能 | 什么时候用 |
|---|---|
| `gmira-arsenal` | 安装任何注册表组件时。跑修复与驯服流程。不可跳过。 |
| `gmira-canvas` | 写或者审 canvas 与 WebGL 的活。GPU 底线归它管。 |
| `gmira-motion` | 挑选并做出那一个被设计过的动效时刻。 |
| `gmira-states` | 悬停、焦点、禁用、加载、错误、空态。最常被跳过的六个。 |

### 验收

| 技能 | 什么时候用 |
|---|---|
| `gmira-slop` | 审查检测器抓不到的视觉痕迹。交给用户之前先跑。 |
| `gmira-a11y` | 对比度、焦点顺序、语义化、canvas 兜底后的可读性。 |
| `gmira-perf` | 帧预算、包体积、DPR 上限、GPU 销毁。 |
| `gmira-verify` | Playwright 跑五个视口，然后用你自己的眼睛读截图。 |
| `gmira-ship` | 构建、暂存、发布。没有明确指令绝不部署。 |

另外还有五份垂直行业参考手册（汽车经销商、电商、应用型 AI 工程学院、GTM 与 UGC 投放学院），以及一份 40 个物质世界的目录。

## 三条由构建验证出来的定律

不是从风格指南里抄来的。这三条是把军火库装上、看渲染结果得出来的。

1. **注册表里的组件是一台引擎，不是一份设计。** 它的默认值是为了赢下五秒的展示 GIF。装进来就当场驯服，一口气做完。用之前先 grep 焊死的常量：某个东西明明有 prop，另一处却有个硬编码值每帧把它覆盖掉。
2. **军火库到手就是坏的。** componentry 的 56 个组件里，12 个的 `cn` 导入路径根本解析不了，10 个引用了自己没声明的包。写页面之前先修。
3. **一个效果必须在第 0 帧、没有任何输入的时候就站得住。** 指针驱动的效果，在大多数访客真正看到的那个状态里等于不存在。展示 GIF 永远不会暴露这一点，因为录制的人手已经在动鼠标了。

## GPU 底线

这套库学得最多的那个设计技能，为字体、色彩、布局、动效都给了数值底线，唯独 GPU 这块没有。它自己的差距分析里就是这么写的。下面这些是我们补的。

| 检查项 | 底线 |
|---|---|
| 帧预算 | 60fps 下一共 16.7ms，效果层最多占 8ms。要测，不要估 |
| 像素比 | 全屏背景封顶 1.5，局部区域封顶 2.0。绝不直接把原始 `devicePixelRatio` 传进去 |
| 精度 | 桌面端 `highp`，移动端 `mediump`，显式声明，不吃默认值 |
| 模拟网格 | 全屏时 sim grid 不超过 128，显示纹理不超过 512 |
| 上下文丢失 | 必须监听 `webglcontextlost` 并写恢复路径 |
| 销毁 | 必须暴露并调用显式的 `destroy()`。浏览器同时存活的上下文大约只有 16 个，泄漏不会报错，只会让之后每一个 canvas 静默失效 |
| 离屏 | IntersectionObserver 离开视口时暂停，`visibilitychange` 隐藏时也暂停 |
| 减少动态效果 | `prefers-reduced-motion` 时冻结在一帧你亲眼挑过的静帧上，而不是 t=0 |
| 首帧 | 内容之后再挂载。绝不让首次内容绘制卡在着色器编译上 |
| 失败态 | **把 canvas 元素整个删掉**，页面说的每一句话仍然读得到 |

性能在这里被当作一种设计材料，不只是约束。加载时间、首帧时间、发热表现都有肉眼可见的后果，所以它们是决策。

## 验收

`gmira-verify` 用 Playwright 跑 1920x1080、1440x900、1024x768、834x1112、390x844 五个视口。它测计算后的对比度、文本溢出、行宽、字间距、逐个元素真实聚焦之后的焦点样式、标题层级顺序，以及 canvas 的 DPR。它写出截图和一份报告。

它做不了判断，而且它自己就是这么说的。最后一道关是 G10：**截图被 agent 亲眼读过，并且把发现写了下来。**

它强制执行的其中一条方法，单独拿出来也值得抄。当你手上同时有一个确定性检查器和一次判断性审阅时，**先做判断，而且要隔离着做**，否则检查器的输出就成了判断的天花板。先看截图，写下你看到了什么，再去打开报告。报告读完之后，那第一眼就再也拿不回来了。

## 四份实证

四个垂直行业，全部经由这套库构建，每一个都按外部哈希索引抽出自己的物质世界，而不是凭偏好挑。同一套技术栈，同一批技能，四个页面彼此之间没有任何相似之处。

| 垂直行业 | 抽中的物质世界 | 它改变了什么 |
|---|---|---|
| 汽车经销商 | 工业设备拍卖图录 | 库存变成了拍品清单。车况等级取代价格成为组织页面的那一列。事故与损伤报告成了页面上最强的物件，而不是垫在底部的一句道歉 |
| 应用型 AI 工程学院 | 车间流转卡（随工单） | 课程表变成一条九道工序的工艺路线，每道工序带一枚盖了章的验收标准，付款之前就能完整读到 |
| GTM 与 UGC 投放学院 | 拳赛节目单与垫场赛 | 每一条广告都按一场拳赛来排位，包括亏钱的那条。垫场赛部分的字号是按每周产出量算出来的 |
| 商店 | 种子袋货架融合染坊色卡 | 商品挂在导轨上，而不是摆在网格里。每个颜色都带一个耐光牢度数值，画成八个填色方块 |

下面每一张都是 `lab/` 里的真实截图，由 `scripts/shot.mjs` 在同一天、同一尺寸、同一套技能库下拍出来的。没有一张是效果图。

<table>
  <tr>
    <td width="25%"><img src="docs/screenshots/car.jpg" alt="汽车经销商拍品清单：等宽拍品编号、发丝线、旋转的车况等级章、落槌估价，没有首屏大图也没有卡片" /></td>
    <td width="25%"><img src="docs/screenshots/school.jpg" alt="AI 学院工艺路线卡：零件号、工艺版本、旋转的 RELEASED 印章、左边缘的装订孔，右侧是派工单" /></td>
    <td width="25%"><img src="docs/screenshots/ads.jpg" alt="投放学院拳赛节目单：土黄色纸张、粗黑木活字、主赛对阵行与垫场赛" /></td>
    <td width="25%"><img src="docs/screenshots/shop.jpg" alt="商店导轨：天然染料批次，带植物学名与画成填色方块的耐光牢度" /></td>
  </tr>
  <tr>
    <td><b>汽车经销商</b><br/><sub>工业设备拍卖图录</sub></td>
    <td><b>应用型 AI 学院</b><br/><sub>车间流转卡</sub></td>
    <td><b>投放与 UGC 学院</b><br/><sub>拳赛节目单</sub></td>
    <td><b>商店</b><br/><sub>种子袋货架</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/car-lot.jpg" alt="单车详情页：先列出车况提示和修复报价，再是按系统分组、单位写在标签里的测量登记表" /></td>
    <td><img src="docs/screenshots/school-op.jpg" alt="工艺路线里的单道工序页，带验收标准和操作者印章" /></td>
    <td><img src="docs/screenshots/ads-teardown.jpg" alt="创意拆解页，每一个投放数字都标了示例，并注明不可核验" /></td>
    <td><img src="docs/screenshots/shop-order.jpg" alt="结账配送步骤：把还没做的步骤也一并列出，真实的库存保留倒计时，总价里写明增值税" /></td>
  </tr>
  <tr>
    <td><sub>详情页，车况提示在最前</sub></td>
    <td><sub>单道工序页</sub></td>
    <td><sub>拆解页，含亏损案例</sub></td>
    <td><sub>结账，特效预算为零</sub></td>
  </tr>
</table>

汽车经销商抽到索引 0，工业设备拍卖图录。没有首屏大图。没有卡片。没有渐变。拍品编号用等宽字体，车况等级做成旋转的印章，价格印成落槌估价，全页只有一种 0.5px 的横线粗细。

商店抽到的是 Operate 模式，所以它的特效预算接近零，全程没有装任何一个 WebGL 组件。这份实证的存在，就是为了证明这套库知道什么时候该收手。

十道关在五个视口上全绿，上面每一条路由都是。

## 常见问题

### 为什么 AI 生成的落地页都长一个样？

因为什么都没定。一个没有承诺过方向的 agent 只会去够中位数，而中位数渲染成 HTML 就是卡片网格、渐变标题、每个板块头上一行小标题、居中首屏配两个按钮。换一套更唬人的组件库只是把问题挪了个地方。GMIRA 要求在放下任何元素之前先写一份 5 段式方向契约，而且契约里那个物质世界是按外部索引抽的，模型自己的先验够不着。

### 为什么我传的配色，shadcn 或者 WebGL 组件根本不认？

多半是焊死的常量。注册表组件常常一边给了 prop，一边在别处有个硬编码值每帧把它覆盖掉；而且叠加式的着色器根本没法尊重一套暗色配色：两次以上的 `col += ...` 中间不做归一化，结果一定趋向白色。验证方式是拿渲染出来的像素跟源配色的十六进制值比对，绝不能只信 prop 的名字。`gmira-arsenal` 会对每一次安装跑一遍修复与驯服。

### 它是要替掉我的组件库吗？

不是，它压在组件库上面。GMIRA 接了 7 个 shadcn 注册表共 514 个组件，并且把每一个装进来的组件都当成一台待修待驯的引擎，而不是一份成品设计。shadcn 把源码复制进你的仓库，本来就是为了让你改它。

### 怎么确认页面是真的无障碍、真的不卡，而不只是 lint 通过？

`gmira-verify` 跑五个视口，读的是计算后的真实值而不是假定值：对比度取自 computed style，焦点样式靠逐个元素真实聚焦之后再读，另外还有文本溢出、行宽、字间距、标题层级顺序和 canvas DPR。GPU 底线补的是任何无障碍 lint 工具都没有的几项：上下文丢失处理、显式销毁、离屏暂停、把减少动态效果当成彻底的关闭开关，以及删掉 canvas 元素之后页面仍然可读。

### 它假设什么技术栈？

Next.js 16、React 19、Tailwind v4、shadcn v4，以及用于注册表搜索和安装的 shadcn MCP。教义、手艺底线和 GPU 底线本身不依赖技术栈，安装命令和注册表配置依赖。

## 每个技能一张样张

二十张样张，每个技能一张，全部由这套库自己构建，按同一尺寸拍摄。每一张都刻意做成不同的印刷世界：如果它们长得都一样，这套库就在自己的文档里推翻了自己的主张。源码在 [`lab/src/app/specimen/`](lab/src/app/specimen/)。

<table>
  <tr>
    <td width="25%"><img src="docs/specimens/brief.jpg" alt="gmira-brief：填写在纸质受理单上的页面简报，不可编造的项目已标出" /></td>
    <td width="25%"><img src="docs/specimens/direction.jpg" alt="gmira-direction：盖章确认的五段式方向契约，旁边是被排除的行业套路和它的反面" /></td>
    <td width="25%"><img src="docs/specimens/palette.jpg" alt="gmira-palette：矿物颜料色卡，每块印着实测对比度，其中一块不达标" /></td>
    <td width="25%"><img src="docs/specimens/typeset.jpg" alt="gmira-typeset：字号阶梯、压在段落上的行宽标尺、以及两行标题演示的字距下限" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-brief</code></b><br/><sub>打在受理单上的简报</sub></td>
    <td><b><code>gmira-direction</code></b><br/><sub>契约盖章，两份反面证物被否</sub></td>
    <td><b><code>gmira-palette</code></b><br/><sub>色卡带实测对比度，一块不达标</sub></td>
    <td><b><code>gmira-typeset</code></b><br/><sub>字阶、行宽标尺、字距下限</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/hero.jpg" alt="gmira-hero：胶片小样，对比第 0 帧空白面板与已播种的面板" /></td>
    <td><img src="docs/specimens/scroll.jpg" alt="gmira-scroll：六段一模一样的淡入，对比一个真正编排过的高潮" /></td>
    <td><img src="docs/specimens/catalog.jpg" alt="gmira-catalog：同样六件东西的四种排布方式，等大卡片网格被标为默认选项" /></td>
    <td><img src="docs/specimens/detail.jpg" alt="gmira-detail：分组且标注来源的参数表，旁边是被标为失败的平铺列表" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-hero</code></b><br/><sub>第 0 帧空白对比已播种</sub></td>
    <td><b><code>gmira-scroll</code></b><br/><sub>六段淡入对比一个高潮</sub></td>
    <td><b><code>gmira-catalog</code></b><br/><sub>四种结构，一个默认被标出</sub></td>
    <td><b><code>gmira-detail</code></b><br/><sub>分组参数表对比它的失败版</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/flow.jpg" alt="gmira-flow：六种字段状态，以及一条把没做的步骤也写出来的进度条" /></td>
    <td><img src="docs/specimens/proof.jpg" alt="gmira-proof：被划掉的假客户墙和五星条，旁边是可用的替代阶梯" /></td>
    <td><img src="docs/specimens/nav.jpg" alt="gmira-nav：印刷校样，横线式页头通过，悬浮胶囊导航被毙" /></td>
    <td><img src="docs/specimens/arsenal.jpg" alt="gmira-arsenal：修复清单，下面是焊死常量与提为 prop 之后的对照" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-flow</code></b><br/><sub>六种字段状态，诚实的进度条</sub></td>
    <td><b><code>gmira-proof</code></b><br/><sub>禁用的背书对比真实替代</sub></td>
    <td><b><code>gmira-nav</code></b><br/><sub>横线页头通过，胶囊导航被毙</sub></td>
    <td><b><code>gmira-arsenal</code></b><br/><sub>修复清单，焊死对比驯服</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/canvas.jpg" alt="gmira-canvas：GPU 底线做成一组带铆钉的仪表盘，读数是真实数值" /></td>
    <td><img src="docs/specimens/motion.jpg" alt="gmira-motion：时长与缓动表画成实体的时间轨" /></td>
    <td><img src="docs/specimens/states.jpg" alt="gmira-states：一块板上的六种按钮状态与三类空状态" /></td>
    <td><img src="docs/specimens/slop.jpg" alt="gmira-slop：十二条视觉破绽的印刷审计表，五条命中七条通过" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-canvas</code></b><br/><sub>GPU 底线做成仪表盘</sub></td>
    <td><b><code>gmira-motion</code></b><br/><sub>时长与缓动画成时间轨</sub></td>
    <td><b><code>gmira-states</code></b><br/><sub>六种状态，三类空状态</sub></td>
    <td><b><code>gmira-slop</code></b><br/><sub>十二条破绽的审计表</sub></td>
  </tr>
  <tr>
    <td><img src="docs/specimens/a11y.jpg" alt="gmira-a11y：五组文字与底色的对比度，标在 WCAG 阈值线上" /></td>
    <td><img src="docs/specimens/perf.jpg" alt="gmira-perf：绿格账簿，记着包体积、WebGL 上下文上限和 LCP 规则" /></td>
    <td><img src="docs/specimens/verify.jpg" alt="gmira-verify：按比例画出的五个视口，配验收表和隔离判断规则" /></td>
    <td><img src="docs/specimens/ship.jpg" alt="gmira-ship：钢制写字板上的放行清单，全部打勾，部署一项等明确指令" /></td>
  </tr>
  <tr>
    <td><b><code>gmira-a11y</code></b><br/><sub>对比度对照 WCAG 阈值线</sub></td>
    <td><b><code>gmira-perf</code></b><br/><sub>预算的绿格账簿</sub></td>
    <td><b><code>gmira-verify</code></b><br/><sub>五个视口、验收关、隔离规则</sub></td>
    <td><b><code>gmira-ship</code></b><br/><sub>放行清单，部署等指令</sub></td>
  </tr>
</table>

## 站在谁的肩膀上

研究过，并致谢：[pbakaus/impeccable](https://github.com/pbakaus/impeccable) 提供了品味引擎与反默认机制，[DavidHDev/canvas-ui](https://github.com/DavidHDev/canvas-ui) 提供了 html-in-canvas 的技法，[bklit/bklit-ui](https://github.com/bklit/bklit-ui) 提供了图表构成与技能打包方式，[ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com) 提供了结构层面的手艺，[componentry](https://componentry.dev) 提供了军火库。

他们的技法被提取到了 [`research/`](research/) 里，附带该抄什么、以及往前还能走到哪。

## 许可证

MIT。

---

**作者：** [Ahmad-Othman Adi](https://github.com/OthmanAdi)
