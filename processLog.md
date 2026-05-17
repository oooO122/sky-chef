# Sky Chef 项目处理日志

## 2026-05-12 16:34 — 食材图片改为直接加载单张
- 去掉精灵表 `icons_food.png` / `food_sprites_sheet.png` 的坐标映射
- 改为直接加载 `assets/sprites/` 下 20 张独立食材 PNG
- 文件名映射：咖啡→coffee, 果汁→juice, 冰沙→smoothie, 奶昔→milkshake, 苹果→apple, 橙子→orange, 葡萄→grape, 西瓜→watermelon, 薯条→fries, 鸡块→nuggets, 鸡腿→chicken, 天妇罗→tempura, 汉堡→burger, 披萨→pizza, 牛排→steak, 小龙虾→lobster, 甜甜圈→donut, 甜筒→ice_cream, 果冻→pudding, 蛋糕→cake
- 缺少奶昔.png，届时用 emoji 兜底
- 多余橙汁.png 未使用

## 2026-05-12 16:45 — 图片批量处理
- 食材 20 张从 2048×2048 缩放到 128×128 (RGB)
- 厨师 4 张 WebP→PNG，重命名为 Chef_W1/A1/B1/Icon.png（~200px高 RGBA）
- 一二布布 4 张 WebP/JPG→PNG，放入 yierbubu/ (240×240 RGBA)：happy, normal, surprised, love
- 缺少 angry.png 和 sad.png 待补

## 2026-05-12 16:50 — NPC 改为使用一二布布独立表情
- 移除 npc_display.png 精灵表加载
- drawPassenger 改为根据乘客状态选择一二布布表情图：
  - angry → angry/surprised/normal
  - eating → happy/love/normal
  - normal → normal/happy/surprised
- 图片未加载时自动降级到代码绘制的几何小人和 emoji

## 2026-05-12 17:10 — 站台系统重构：5类站台动态分配
- 水果(fruit)站台从 drink 改为 board（砧板 🔪）
- 甜点(dessert)站台从 drink 改为 fridge（甜品台 🍰）
- STATIONS 新增 board 和 fridge 定义，移除固定 x/y 坐标
- 每个关卡配置 `stations` 数组，最多3个站台，位置 x=80/240/400 动态分配
- initGame 只创建关卡指定的站台，不再固定全创建
- 关卡站台分配：
  - 第1章: drink+board+fridge (饮料+水果+甜点)
  - 第2章: drink+fryer+board (饮料+炸物+水果)
  - 第3章: fryer+oven+board (炸物+烤物+水果)
  - 第4章: drink+oven+fridge (饮料+烤物+甜点)
  - 第5章: fryer+oven+fridge (炸物+烤物+甜点)
  - 第6-8章: drink+fryer+oven (经典组合)
- 新增 board_speed 和 fridge_speed 升级项
- 砧板音效用切菜声(chop)，甜品台音效复用饮料

## 2026-05-12 17:30 — Bug修复
- 修复 drawFoodImg 引用已删除的精灵表属性 foodSrc/foodSheet/foodIcons 导致崩溃
- 修复 availFoods 不过滤站台：乘客只点当前关卡有对应站台的食物
- 修复 normal.png 无透明通道（JPG 白色背景转透明）
- 厨师图片移到屏幕中下方

## 2026-05-12 17:45 — 玩法丰富：金币飞行、垃圾桶、情绪反馈
- 金币飞行动画：送餐后6个💎粒子从乘客飞向分数栏
- 垃圾桶：托盘右侧添加🗑️按钮，点击丢弃最后加入的食物，也可直接点击托盘食物
- 乘客情绪：耐心>0.7冒💕爱心，耐心<0.35冒💢怒火，带浮动动画
- 站台粒子：新增砧板(绿色碎片)和甜品台(粉色冷气)的专用粒子特效

## 2026-05-12 18:00 — 核心玩法：多步烹饪 + 特殊乘客
- 8种高级食材需要先在砧板备料再送去对应站台烹饪：
  - 饮料：冰沙、奶昔 → 砧板备料 → 饮料机
  - 炸物：炸鸡、天妇罗 → 砧板备料 → 炸锅
  - 烤物：汉堡、披萨、牛排、龙虾 → 砧板备料 → 烤箱
- 砧板备料时间=正常烹饪时间×0.5，产出半成品(🔪标记)
- 半成品在托盘中半透明显示+🔪标记，不能直接送给乘客
- 主站台检测托盘中有对应半成品才会显示食物选项
- 无砧板的关卡不会出现需要备料的食物
- 特殊乘客系统：
  - 👑VIP：2.5倍金币，70%耐心，点3个菜
  - ⚡急性子：1.3倍金币，50%耐心，点2个菜
  - 🧒小孩：0.6倍金币，150%耐心，只点简单食物（无需备料）
- 乘客头顶显示VIP/小孩标识，价格计算包含乘客类型倍率

## 2026-05-18 04:22 - 舱内场景与工作台贴图提交准备
- `sky_chef.html` 增加场景图片加载，优先绘制 `assets/sprites/scene/cabin_bg.png` 作为舱内背景
- 新增工作台贴图映射，饮料机、砧板、炸锅、烤箱、甜品台在可用且未完成时优先使用 PNG 贴图绘制
- 新增 `assets/sprites/scene/` 下 6 张场景资源：舱内背景与工作台贴图
- `.gitignore` 忽略 `.codex/`、`.playwright-mcp/`、`cc_temp/` 等本地工具和临时目录
