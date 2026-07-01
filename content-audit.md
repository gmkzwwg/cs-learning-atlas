# CS Learning Atlas 内容审计报告

审计对象：`collections/**/*.md` 共 65 个正文文件；另参考 `pages/index.md` 与 `README.md` 的索引状态。

## 总体判断

- 双语完成状态并未全部闭合：65 个正文文件中，标准双语结构完整的为 47 个；17 个文件中文区仍为“占位”；1 个文件有中文译文但缺标准 `# 中文` 分区。
- 47 个已翻译文件末尾保留 HTML 注释形式的“分析与改进方案”。这些注释不会直接显示在网页正文中，但属于终稿残留，发布前应删除，或把其中有价值的补强建议落实到正文。
- 已完成的主体文章质量整体较高：体裁稳定，主题契合度强，资源推荐有层次，常见误区表格对初学者有实际指导价值。
- 资源质量的主要短板不是选择，而是“可点击性”：多数资源以书名、课程名、站点名呈现，真正的 Markdown/URL 链接很少。读者使用时需要自行搜索。
- 历史导论 `1.2` 的宏观框架较好，用“问题范式”组织 CS 历史，比机器年表更适合作为学习路线图导论；但缺独立延伸资源，也可以补充 Web、移动、云、开源、GPU、深度学习和基础模型时代的后续阶段。

## 评分维度

| 维度 | 含义 |
|---|---|
| 格式 | front matter、`# English/# 中文`、标题层级、占位符、HTML 编辑残留 |
| 内容 | 论述密度、概念关系、解释充分度、误区处理 |
| 主题 | 与章节主题和学习路线定位的契合度 |
| 历史/导论 | 历史脉络、背景引入、问题意识；非历史章节按导入与背景脉络评分 |
| 资源 | 书籍、课程、工具、实践路径的质量、层次和可用性 |
| 中英 | 中英文分区、长度比例、标题对应、是否存在中文占位 |
| 总评 | 加权结果；双语缺失会显著拉低总评 |

## 硬性问题

### 中文仍为占位的 17 个文件

- [collections/_practical/8.1.programming-languages-as-practitioner-tools.md](collections/_practical/8.1.programming-languages-as-practitioner-tools.md)
- [collections/_practical/8.2.development-environment-and-tooling.md](collections/_practical/8.2.development-environment-and-tooling.md)
- [collections/_practical/8.3.reading-code.md](collections/_practical/8.3.reading-code.md)
- [collections/_practical/8.4.writing-code-and-software-craftsmanship.md](collections/_practical/8.4.writing-code-and-software-craftsmanship.md)
- [collections/_practical/8.5.collaboration-version-control-and-code-review.md](collections/_practical/8.5.collaboration-version-control-and-code-review.md)
- [collections/_practical/8.6.debugging-as-methodological-discipline.md](collections/_practical/8.6.debugging-as-methodological-discipline.md)
- [collections/_practical/8.7.reading-technical-literature.md](collections/_practical/8.7.reading-technical-literature.md)
- [collections/_practical/8.8.technical-writing.md](collections/_practical/8.8.technical-writing.md)
- [collections/_practical/8.9.career-trajectories-and-professional-practice.md](collections/_practical/8.9.career-trajectories-and-professional-practice.md)
- [collections/_theoretical/3.1.logic-in-computer-science.md](collections/_theoretical/3.1.logic-in-computer-science.md)
- [collections/_theoretical/3.2.theory-of-computation.md](collections/_theoretical/3.2.theory-of-computation.md)
- [collections/_theoretical/3.3.complexity-theory.md](collections/_theoretical/3.3.complexity-theory.md)
- [collections/_theoretical/3.4.programming-language-theory-and-formal-semantics.md](collections/_theoretical/3.4.programming-language-theory-and-formal-semantics.md)
- [collections/_theoretical/3.5.type-theory.md](collections/_theoretical/3.5.type-theory.md)
- [collections/_theoretical/3.6.formal-methods-and-proof-assistants.md](collections/_theoretical/3.6.formal-methods-and-proof-assistants.md)
- [collections/_theoretical/3.7.category-theory-in-computer-science.md](collections/_theoretical/3.7.category-theory-in-computer-science.md)
- [collections/_theoretical/3.8.information-theory.md](collections/_theoretical/3.8.information-theory.md)

### 中文分区格式异常的文件

- [collections/_foundations/2.4.calculus-and-mathematical-analysis.md](collections/_foundations/2.4.calculus-and-mathematical-analysis.md)：有中文正文，但缺标准 `# 中文` 标题，并有编辑性残留。

### 隐藏编辑注释残留

- 共 47 个文件含 `<!-- ... -->` 或“分析与改进方案”。建议终稿删除，或把其中的“补例子/补导语/补连接”落实进正文。

## 分组概览

| Collection | 文件数 | 标准双语 | 中文占位/异常 | 平均总评 | 主要判断 |
|---|---:|---:|---:|---:|---|
| `_ai` | 7 | 7 | 0 | 95.0 | 整体完成度高；主要是清理隐藏注释和资源链接化。 |
| `_applied` | 7 | 7 | 0 | 95.0 | 整体完成度高；主要是清理隐藏注释和资源链接化。 |
| `_computer-systems` | 11 | 11 | 0 | 94.8 | 整体完成度高；主要是清理隐藏注释和资源链接化。 |
| `_engineering` | 6 | 6 | 0 | 95.1 | 整体完成度高；主要是清理隐藏注释和资源链接化。 |
| `_foundations` | 6 | 5 | 1 | 93.0 | 整体强；2.4 中文分区格式需修。 |
| `_interdisciplinary` | 9 | 9 | 0 | 93.0 | 主题契合，桥接性好；缺“学习改变”结构属体裁选择。 |
| `_introduction` | 2 | 2 | 0 | 91.0 | 入口内容完整；历史导论需补资源与近年阶段。 |
| `_practical` | 9 | 0 | 9 | 65.5 | 英文内容完整，但全组中文仍占位，是最大缺口之一。 |
| `_theoretical` | 8 | 0 | 8 | 65.5 | 英文内容完整，但全组中文仍占位，是最大缺口之一。 |

## 逐文件评分

### `_ai`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_ai/5.1.classical-ai-and-symbolic-approaches.md](collections/_ai/5.1.classical-ai-and-symbolic-approaches.md) | 94 | 99 | 96 | 92 | 88 | 100 | 95.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.2.machine-learning-foundations.md](collections/_ai/5.2.machine-learning-foundations.md) | 94 | 99 | 96 | 84 | 88 | 100 | 94.3 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.3.deep-learning.md](collections/_ai/5.3.deep-learning.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.4.reinforcement-learning.md](collections/_ai/5.4.reinforcement-learning.md) | 94 | 99 | 96 | 92 | 88 | 100 | 95.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.5.large-language-models-and-foundation-models.md](collections/_ai/5.5.large-language-models-and-foundation-models.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.6.interpretability-and-mechanistic-interpretability.md](collections/_ai/5.6.interpretability-and-mechanistic-interpretability.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_ai/5.7.ai-safety-and-alignment.md](collections/_ai/5.7.ai-safety-and-alignment.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_applied`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_applied/6.1.computer-graphics-and-visual-computing.md](collections/_applied/6.1.computer-graphics-and-visual-computing.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.2.human-computer-interaction-and-design.md](collections/_applied/6.2.human-computer-interaction-and-design.md) | 92 | 99 | 96 | 92 | 92 | 100 | 95.6 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.3.data-engineering-and-data-science.md](collections/_applied/6.3.data-engineering-and-data-science.md) | 92 | 99 | 96 | 84 | 88 | 100 | 93.9 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.4.robotics-and-autonomous-systems.md](collections/_applied/6.4.robotics-and-autonomous-systems.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.5.scientific-computing-and-simulation.md](collections/_applied/6.5.scientific-computing-and-simulation.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.6.quantum-computing.md](collections/_applied/6.6.quantum-computing.md) | 92 | 99 | 96 | 92 | 92 | 100 | 95.6 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_applied/6.7.web-and-application-development.md](collections/_applied/6.7.web-and-application-development.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_computer-systems`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_computer-systems/4.1.computer-organization-and-architecture.md](collections/_computer-systems/4.1.computer-organization-and-architecture.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.10.observability-and-reliability-engineering.md](collections/_computer-systems/4.10.observability-and-reliability-engineering.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.11.high-performance-computing.md](collections/_computer-systems/4.11.high-performance-computing.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.2.operating-systems.md](collections/_computer-systems/4.2.operating-systems.md) | 92 | 99 | 96 | 84 | 88 | 100 | 93.9 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.3.computer-networks.md](collections/_computer-systems/4.3.computer-networks.md) | 92 | 99 | 96 | 84 | 88 | 100 | 93.9 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.4.databases.md](collections/_computer-systems/4.4.databases.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.5.security-and-cryptography.md](collections/_computer-systems/4.5.security-and-cryptography.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.6.distributed-systems.md](collections/_computer-systems/4.6.distributed-systems.md) | 92 | 99 | 96 | 92 | 89 | 100 | 95.2 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.7.compilers-and-language-runtimes.md](collections/_computer-systems/4.7.compilers-and-language-runtimes.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.8.stream-processing-and-event-driven-architectures.md](collections/_computer-systems/4.8.stream-processing-and-event-driven-architectures.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_computer-systems/4.9.container-orchestration-and-cloud-native-infrastructure.md](collections/_computer-systems/4.9.container-orchestration-and-cloud-native-infrastructure.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_engineering`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_engineering/7.1.software-architecture.md](collections/_engineering/7.1.software-architecture.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_engineering/7.2.software-testing-and-quality-assurance.md](collections/_engineering/7.2.software-testing-and-quality-assurance.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_engineering/7.3.software-process-delivery-iteration-and-coordination.md](collections/_engineering/7.3.software-process-delivery-iteration-and-coordination.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_engineering/7.4.devops-operability-and-continuous-delivery.md](collections/_engineering/7.4.devops-operability-and-continuous-delivery.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_engineering/7.5.technical-debt-refactoring-and-software-economics.md](collections/_engineering/7.5.technical-debt-refactoring-and-software-economics.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_engineering/7.6.engineering-management-and-organizational-design.md](collections/_engineering/7.6.engineering-management-and-organizational-design.md) | 94 | 99 | 96 | 92 | 88 | 100 | 95.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_foundations`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_foundations/2.1.programming-as-conceptual-practice.md](collections/_foundations/2.1.programming-as-conceptual-practice.md) | 92 | 99 | 96 | 92 | 88 | 100 | 95.0 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_foundations/2.2.discrete-mathematics-and-the-foundations-of-proof.md](collections/_foundations/2.2.discrete-mathematics-and-the-foundations-of-proof.md) | 94 | 99 | 96 | 84 | 88 | 100 | 94.3 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_foundations/2.3.linear-algebra.md](collections/_foundations/2.3.linear-algebra.md) | 94 | 99 | 96 | 92 | 88 | 100 | 95.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_foundations/2.4.calculus-and-mathematical-analysis.md](collections/_foundations/2.4.calculus-and-mathematical-analysis.md) | 66 | 95 | 96 | 84 | 88 | 78 | 83.7 | 中文正文存在，但缺标准 `# 中文` 分区；开头有“按原文翻译如下/中文”等编辑性残留；末尾有 HTML 编辑注释。 |
| [collections/_foundations/2.5.probability-and-statistics.md](collections/_foundations/2.5.probability-and-statistics.md) | 94 | 99 | 96 | 92 | 88 | 100 | 95.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_foundations/2.6.algorithms-and-data-structures.md](collections/_foundations/2.6.algorithms-and-data-structures.md) | 94 | 99 | 96 | 84 | 88 | 100 | 94.3 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_interdisciplinary`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_interdisciplinary/9.1.cs-and-mathematics-debt-difference-and-dialogue.md](collections/_interdisciplinary/9.1.cs-and-mathematics-debt-difference-and-dialogue.md) | 94 | 93 | 96 | 82 | 87 | 100 | 92.8 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.2.cs-and-physics-information-entropy-and-computation.md](collections/_interdisciplinary/9.2.cs-and-physics-information-entropy-and-computation.md) | 94 | 93 | 96 | 82 | 87 | 100 | 92.8 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.3.cs-cognitive-science-and-neuroscience-intelligence-representation-embodiment.md](collections/_interdisciplinary/9.3.cs-cognitive-science-and-neuroscience-intelligence-representation-embodiment.md) | 94 | 97 | 96 | 82 | 87 | 100 | 93.5 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.4.cs-and-linguistics-language-grammar-and-computation.md](collections/_interdisciplinary/9.4.cs-and-linguistics-language-grammar-and-computation.md) | 92 | 93 | 96 | 82 | 87 | 100 | 92.4 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.5.cs-and-economics-mechanism-design-and-algorithmic-game-theory.md](collections/_interdisciplinary/9.5.cs-and-economics-mechanism-design-and-algorithmic-game-theory.md) | 94 | 93 | 96 | 82 | 87 | 100 | 92.8 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.6.cs-law-and-policy-privacy-ip-and-algorithmic-accountability.md](collections/_interdisciplinary/9.6.cs-law-and-policy-privacy-ip-and-algorithmic-accountability.md) | 94 | 97 | 96 | 82 | 87 | 100 | 93.5 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.7.cs-and-biology-computation-in-life.md](collections/_interdisciplinary/9.7.cs-and-biology-computation-in-life.md) | 94 | 93 | 96 | 82 | 87 | 100 | 92.8 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.8.cs-and-art-and-design-generativity-aesthetics-and-computation.md](collections/_interdisciplinary/9.8.cs-and-art-and-design-generativity-aesthetics-and-computation.md) | 94 | 93 | 96 | 82 | 87 | 100 | 92.8 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |
| [collections/_interdisciplinary/9.9.cs-and-philosophy-foundations-mind-and-ethics.md](collections/_interdisciplinary/9.9.cs-and-philosophy-foundations-mind-and-ethics.md) | 94 | 97 | 96 | 82 | 88 | 100 | 93.6 | 正文完成度较高；末尾保留 HTML 编辑注释，包含后续补强建议，公开前应删除或落实。 |

### `_introduction`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_introduction/1.1.qa.md](collections/_introduction/1.1.qa.md) | 100 | 88 | 92 | 84 | 72 | 100 | 90.6 | Q&A 体裁契合入口任务，中英标题对应；资源不是独立章节，AI 学习部分已有少量论文链接。 |
| [collections/_introduction/1.2.history.md](collections/_introduction/1.2.history.md) | 94 | 92 | 92 | 95 | 70 | 100 | 91.5 | 历史导论质量高；但没有独立资源/延伸阅读，且 Web、移动、云、开源、GPU 与深度学习后的近二十年可再扩一小节。 |

### `_practical`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_practical/8.1.programming-languages-as-practitioner-tools.md](collections/_practical/8.1.programming-languages-as-practitioner-tools.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.2.development-environment-and-tooling.md](collections/_practical/8.2.development-environment-and-tooling.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.3.reading-code.md](collections/_practical/8.3.reading-code.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.4.writing-code-and-software-craftsmanship.md](collections/_practical/8.4.writing-code-and-software-craftsmanship.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.5.collaboration-version-control-and-code-review.md](collections/_practical/8.5.collaboration-version-control-and-code-review.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.6.debugging-as-methodological-discipline.md](collections/_practical/8.6.debugging-as-methodological-discipline.md) | 75 | 82 | 88 | 82 | 87 | 5 | 65.3 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.7.reading-technical-literature.md](collections/_practical/8.7.reading-technical-literature.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.8.technical-writing.md](collections/_practical/8.8.technical-writing.md) | 75 | 82 | 88 | 82 | 87 | 5 | 65.3 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_practical/8.9.career-trajectories-and-professional-practice.md](collections/_practical/8.9.career-trajectories-and-professional-practice.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |

### `_theoretical`

| 文件 | 格式 | 内容 | 主题 | 历史/导论 | 资源 | 中英 | 总评 | 问题与遗漏说明 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| [collections/_theoretical/3.1.logic-in-computer-science.md](collections/_theoretical/3.1.logic-in-computer-science.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.2.theory-of-computation.md](collections/_theoretical/3.2.theory-of-computation.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.3.complexity-theory.md](collections/_theoretical/3.3.complexity-theory.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.4.programming-language-theory-and-formal-semantics.md](collections/_theoretical/3.4.programming-language-theory-and-formal-semantics.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.5.type-theory.md](collections/_theoretical/3.5.type-theory.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.6.formal-methods-and-proof-assistants.md](collections/_theoretical/3.6.formal-methods-and-proof-assistants.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.7.category-theory-in-computer-science.md](collections/_theoretical/3.7.category-theory-in-computer-science.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |
| [collections/_theoretical/3.8.information-theory.md](collections/_theoretical/3.8.information-theory.md) | 75 | 82 | 88 | 82 | 88 | 5 | 65.5 | 中文全文缺失，仅有“占位”；英文主体、资源和陷阱可作为翻译基础。 |

## 内容层面的共同补强点

1. 先补齐中文占位文件。理论计算机科学和从业者技能是路线图中非常关键的两组，如果中文缺失，会让“双语完成”这个前提不成立。
2. 修复 `2.4` 的中文分区：把普通文本 `中文` 改为标准 `# 中文`，删除“按原文翻译如下”这类编辑性句子，并移除末尾 HTML 注释。
3. 删除或落实 47 个 HTML 编辑注释。它们本身有价值，但作为终稿残留会暴露编辑过程，也会让源码显得未完成。
4. 资源链接化。当前资源选择整体可靠，但多数不是可点击链接；建议优先把免费课程、开放教材、工具站点、论文和代码仓库改成 Markdown 链接。
5. 历史导论可补 2000s-2020s：Web 平台化、开源生态、云计算、移动互联网、GPU/并行计算、数据中心规模、深度学习、基础模型与 AI 治理。
6. 已完成章节可按隐藏注释逐步补强小例子。许多评论都指出“需要一个最小例子/实践路径/更直接导语”，这类补充不必很长，但会显著提升初学者可读性。

## 结论

已完成双语的 47 个文件在内容质量、体裁一致性、主题契合度和资源选择上整体可用，适合作为初版发布前的主体基础。当前不能称为“所有正文已经完成”，因为仍有 18 个文件存在中文缺失或中文分区异常。若目标是正式双语版本，优先级应为：补中文占位 > 修复 2.4 分区 > 删除 HTML 编辑注释 > 资源链接化 > 补历史导论近年阶段。
