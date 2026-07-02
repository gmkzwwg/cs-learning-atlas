# Content Audit — CS Learning Atlas

Date: 2026-07-02

Scope: all 83 Markdown files under `collections/_*/`. Line-end or block HTML comments are explicitly ignored and are not counted as problems.

## Scoring Rubric

Scores are out of 10. I intentionally did not treat completion as excellence: a complete, readable file can still lose points for missing context, weak resource coverage, or a mismatch between topic and genre.

| Score | Meaning |
|---|---|
| 9-10 | Excellent: strong structure, accurate scope, durable resources, few meaningful omissions. |
| 8-8.9 | Good: usable and well organized, but with identifiable gaps or maintenance risks. |
| 7-7.9 | Serviceable: clear enough, but missing important context, examples, or resource depth. |
| 6-6.9 | Weak: useful draft, but needs substantial additions or rebalancing. |
| <6 | Problematic: format, content, or correspondence issues block reliable use. |

Columns: `Hist` = historical introduction quality; `Res` = resource quality; `Genre` = fit between topic and chosen form; `Comp` = completeness/omission risk; `Fmt` = Markdown/front matter/structural consistency; `Bi` = Chinese-English correspondence; `Overall` = weighted editorial score.

## Global Findings

- **No blocking format failures found.** All 83 collection files have front matter, `# English`, `# 中文`, no `中文占位`, and no undefined reference-style links under tolerant heading parsing.
- **Chinese-English section counts are broadly aligned.** No file has a heading-count mismatch greater than one. This does not prove sentence-level translation fidelity, but it rules out large structural omissions.
- **29 files use `# 中文 ` with a trailing space.** Jekyll builds successfully, and this is minor, but strict normalization should remove the trailing space.
- **Main roadmap chapters are stronger than appendix career guides.** Main chapters usually have a robust pattern: history, conceptual core, what changes, resources, traps. Appendix guides are useful but several now have only three resources after deduplication.
- **Resource quality is generally strong in core CS chapters.** The main recurring issue is maintenance: fast-moving AI, cloud, security, and career-market claims need periodic review.
- **The largest content risk is under-contextualized breadth.** Some chapters cover very broad areas in a compact essay, which is good for a map but can hide important subfields.
- **Build status:** `bundle exec jekyll build --disable-disk-cache --destination /tmp/cs-learning-atlas-audit-build` passed.

## Priority Fixes

1. Normalize `# 中文 ` to `# 中文` in the 29 affected files. This is low-risk but improves exact-format consistency.
2. Add source/resource sections to introduction files or explicitly mark them as non-resource essays. `1.2.history.md` especially should cite a small historical bibliography.
3. Strengthen appendix resource lists with 2-4 non-overlapping resources where the list has only three entries: Web, Network, Databases, Systems, Computer Graphics, Programming Languages/Tools, Large Language Models/NLP.
4. Re-check fast-moving chapters every 6-12 months: LLMs, AI safety, interpretability, cloud-native infrastructure, observability, cybersecurity, AI application engineering.
5. Add more explicit “what is omitted” notes to broad chapters so readers understand boundaries: security vs cryptography, data engineering vs data science, HCI vs product design, quantum algorithms vs quantum hardware.

## Per-File Scores

| File | Hist | Res | Genre | Comp | Fmt | Bi | Overall | Main issue or missing information |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `collections/_introduction/1.1.qa.md`<br>1.1 — Introduction Q&A | 7.4 | 5.5 | 8.6 | 7.6 | 8.8 | 8.8 | 8.0 | 问答体裁友好，覆盖学习焦虑和 AI 使用；缺少资源/延伸阅读区，部分回答可加入学习路径实例和反例。 |
| `collections/_introduction/1.2.history.md`<br>1.2 — History of Computing | 8.8 | 5.0 | 8.5 | 8.0 | 8.8 | 8.8 | 8.1 | 历史主线强，能把理论、机器、软件、网络串起来；但没有来源/参考表，硬件产业、开源、移动互联网和云的权重可再加强。 |
| `collections/_foundations/2.1.programming-as-conceptual-practice.md`<br>2.1 — Programming as Conceptual Practice | 8.0 | 8.2 | 8.8 | 7.8 | 8.2 | 8.5 | 8.3 | 从 Ada 到软件危机的导入有效；遗漏风险是并发、I/O、测试反馈和现代包生态只作为背景出现，初学者可能仍把编程理解得偏抽象。 |
| `collections/_foundations/2.2.discrete-mathematics-and-the-foundations-of-proof.md`<br>2.2 — Discrete Mathematics and Proof | 8.1 | 8.6 | 8.7 | 8.3 | 8.8 | 8.8 | 8.6 | 证明、结构和离散对象的关系讲得稳；可补充 SAT/SMT、图算法建模和计数组合在实际 CS 中的例子。 |
| `collections/_foundations/2.3.linear-algebra.md`<br>2.3 — Linear Algebra | 8.0 | 8.4 | 8.6 | 7.9 | 8.8 | 8.7 | 8.4 | 几何直觉与机器学习连接清楚；数值线性代数、病态矩阵、稀疏矩阵和实际计算误差可更突出。 |
| `collections/_foundations/2.4.calculus-and-mathematical-analysis.md`<br>2.4 — Calculus and Mathematical Analysis | 8.2 | 8.2 | 8.5 | 7.9 | 8.8 | 8.7 | 8.3 | 从微积分到自动微分的路线好；多变量微积分、优化中的 Hessian/曲率、ODE/PDE 与仿真的连接仍可补足。 |
| `collections/_foundations/2.5.probability-and-statistics.md`<br>2.5 — Probability and Statistics | 8.2 | 8.5 | 8.7 | 8.1 | 8.8 | 8.8 | 8.5 | 条件、推断和信息量组织得好；因果推断、贝叶斯计算、实验设计和误用统计的实际案例可更强。 |
| `collections/_foundations/2.6.algorithms-and-data-structures.md`<br>2.6 — Algorithms and Data Structures | 8.4 | 8.6 | 8.8 | 8.2 | 8.8 | 8.8 | 8.6 | 正确性、代价和硬度主线强；可补随机算法、近似算法、在线算法以及工程数据结构取舍。 |
| `collections/_theoretical/3.1.logic-in-computer-science.md`<br>3.1 — Logic in Computer Science | 8.3 | 8.7 | 8.7 | 8.2 | 8.8 | 8.8 | 8.6 | 逻辑与计算关系清楚；可补 SAT/SMT 工具链、模型检查实践和程序验证中的工业案例。 |
| `collections/_theoretical/3.2.theory-of-computation.md`<br>3.2 — Theory of Computation | 8.5 | 8.5 | 8.8 | 8.2 | 8.8 | 8.8 | 8.6 | 模型、不可判定性、复杂性入口完整；可补随机/交互式计算、Oracle/归约边界和实际语言识别例子。 |
| `collections/_theoretical/3.3.complexity-theory.md`<br>3.3 — Complexity Theory | 8.2 | 8.6 | 8.5 | 7.9 | 8.8 | 8.8 | 8.4 | 从 NP 完全性到 PCP 的结构不错；初学者可能缺少复杂性与密码、学习理论、平均情形复杂度的桥接。 |
| `collections/_theoretical/3.4.programming-language-theory-and-formal-semantics.md`<br>3.4 — Programming Language Theory and Formal Semantics | 8.4 | 8.8 | 8.8 | 8.4 | 8.8 | 8.8 | 8.7 | 语义、等价和类型健全性组织得很好；可补 effect systems、gradual typing、并发语义和现代语言实现案例。 |
| `collections/_theoretical/3.5.type-theory.md`<br>3.5 — Type Theory | 8.0 | 8.4 | 8.0 | 7.6 | 8.8 | 8.7 | 8.1 | Curry-Howard 和依赖类型路径清楚；对初学者偏陡，HoTT、线性类型、Rust/Lean/Idris 等实际联系可加强。 |
| `collections/_theoretical/3.6.formal-methods-and-proof-assistants.md`<br>3.6 — Formal Methods and Proof Assistants | 8.3 | 8.7 | 8.4 | 8.1 | 8.8 | 8.8 | 8.5 | 规格、模型检查、定理证明和静态分析分层合理；可补 TLA+、Dafny、Coq/Lean 工业案例对比。 |
| `collections/_theoretical/3.7.category-theory-in-computer-science.md`<br>3.7 — Category Theory in Computer Science | 7.8 | 8.0 | 7.3 | 7.0 | 8.8 | 8.6 | 7.6 | 结构语言讲得克制；主题本身高级，和函数式编程、数据库、类型论的实际收益还可更具体。 |
| `collections/_theoretical/3.8.information-theory.md`<br>3.8 — Information Theory | 8.0 | 8.4 | 8.2 | 7.8 | 8.8 | 8.6 | 8.2 | 熵、信道、编码主线完整；可补压缩实践、信息瓶颈、隐私/泄漏度量和 ML 中的信息论滥用边界。 |
| `collections/_computer-systems/4.1.computer-organization-and-architecture.md`<br>4.1 — Computer Organization and Architecture | 8.5 | 8.4 | 8.7 | 8.0 | 8.2 | 8.5 | 8.4 | 从硬件史到性能成本的导入强；现代 GPU/TPU、内存一致性、安全侧信道和能耗可更突出。 |
| `collections/_computer-systems/4.2.operating-systems.md`<br>4.2 — Operating Systems | 8.7 | 8.8 | 8.8 | 8.3 | 8.2 | 8.5 | 8.6 | 虚拟化、并发、持久化三分法非常稳；可补移动 OS、实时系统、容器内核机制与安全隔离。 |
| `collections/_computer-systems/4.3.computer-networks.md`<br>4.3 — Computer Networks | 8.5 | 8.6 | 8.8 | 8.2 | 8.2 | 8.5 | 8.5 | 网络分层和工程视角好；QUIC/HTTP3、CDN、BGP 事故、移动网络和网络测量可再加强。 |
| `collections/_computer-systems/4.4.databases.md`<br>4.4 — Databases | 8.4 | 8.8 | 8.8 | 8.3 | 8.2 | 8.5 | 8.6 | 关系模型、事务、存储和查询优化均衡；可补云数据库、LSM、向量数据库与数据库可靠性实践。 |
| `collections/_computer-systems/4.5.security-and-cryptography.md`<br>4.5 — Security and Cryptography | 8.0 | 8.5 | 7.9 | 7.5 | 8.2 | 8.5 | 8.1 | 安全和密码学合并导致范围过宽；可补威胁建模、应用安全、供应链安全、可用安全和现代密码协议边界。 |
| `collections/_computer-systems/4.6.distributed-systems.md`<br>4.6 — Distributed Systems | 8.7 | 8.8 | 8.8 | 8.4 | 8.2 | 8.5 | 8.7 | 一致性、复制、共识和失败处理主线强；可补多区域云、隐私/合规、成本和服务网格实践。 |
| `collections/_computer-systems/4.7.compilers-and-language-runtimes.md`<br>4.7 — Compilers and Language Runtimes | 8.2 | 8.5 | 8.5 | 8.0 | 8.2 | 8.5 | 8.4 | 编译与运行时结合合理；JIT、GC、VM、WASM 和优化器验证可更系统。 |
| `collections/_computer-systems/4.8.stream-processing-and-event-driven-architectures.md`<br>4.8 — Stream Processing and Event-Driven Architectures | 7.8 | 8.1 | 8.1 | 7.6 | 8.2 | 8.5 | 8.0 | 流处理和事件架构定位明确；需要更多 exactly-once 误解、schema evolution、backfill、运营事故案例。 |
| `collections/_computer-systems/4.9.container-orchestration-and-cloud-native-infrastructure.md`<br>4.9 — Container Orchestration and Cloud-Native Infrastructure | 8.0 | 8.3 | 8.4 | 7.9 | 8.2 | 8.5 | 8.3 | 容器到编排的路线清楚；可补供应链安全、成本治理、多集群、平台工程和 Kubernetes 反模式。 |
| `collections/_computer-systems/4.10.observability-and-reliability-engineering.md`<br>4.10 — Observability and Reliability Engineering | 8.1 | 8.6 | 8.6 | 8.2 | 8.2 | 8.5 | 8.5 | SLI/SLO、事故分析和可观测性逻辑扎实；可补 OpenTelemetry、日志成本、告警疲劳和组织学习案例。 |
| `collections/_computer-systems/4.11.high-performance-computing.md`<br>4.11 — High-Performance Computing | 8.0 | 8.1 | 8.0 | 7.5 | 8.2 | 8.5 | 8.1 | 并行、数据移动和浮点正确性不错；现代 AI/HPC 融合、GPU 编程、MPI 实战和性能可移植性不足。 |
| `collections/_ai/5.1.classical-ai-and-symbolic-approaches.md`<br>5.1 — Classical AI and Symbolic Approaches | 8.3 | 8.3 | 8.5 | 7.9 | 8.8 | 8.8 | 8.4 | 符号 AI 历史和知识表示危机讲得好；可补约束规划、知识图谱、SAT/SMT 与神经符号方法。 |
| `collections/_ai/5.2.machine-learning-foundations.md`<br>5.2 — Machine Learning Foundations | 8.2 | 8.7 | 8.8 | 8.4 | 8.8 | 8.8 | 8.7 | 泛化、归纳偏置、优化和评估四轴很强；可补数据泄漏、因果推断和模型治理实践案例。 |
| `collections/_ai/5.3.deep-learning.md`<br>5.3 — Deep Learning | 8.7 | 8.7 | 8.8 | 8.5 | 8.2 | 8.5 | 8.7 | 历史导论强，覆盖 perceptron、CNN、Transformer、scaling；可补扩散/多模态/高效训练的最新工程边界。 |
| `collections/_ai/5.4.reinforcement-learning.md`<br>5.4 — Reinforcement Learning | 8.1 | 8.4 | 8.3 | 7.7 | 8.8 | 8.8 | 8.3 | MDP、价值函数和策略学习清楚；离线 RL、安全探索、奖励黑客和现实部署困难可更强。 |
| `collections/_ai/5.5.large-language-models-and-foundation-models.md`<br>5.5 — Large Language Models and Foundation Models | 8.4 | 8.2 | 8.5 | 7.8 | 8.2 | 8.5 | 8.3 | 从词向量到基础模型有清楚历史；领域更新太快，评测、安全、成本、数据来源和版权风险需周期维护。 |
| `collections/_ai/5.6.interpretability-and-mechanistic-interpretability.md`<br>5.6 — Interpretability and Mechanistic Interpretability | 7.8 | 8.0 | 8.0 | 7.4 | 8.2 | 8.5 | 7.9 | 能区分解释性与机制解释性；该领域争议和可验证边界应更明确，资源需持续更新。 |
| `collections/_ai/5.7.ai-safety-and-alignment.md`<br>5.7 — AI Safety and Alignment | 7.7 | 7.8 | 7.9 | 7.3 | 8.2 | 8.5 | 7.8 | 规格、监督和部署安全结构可用；政治/治理/评测争议、能力外推风险、不同学派观点需更平衡。 |
| `collections/_applied/6.1.computer-graphics-and-visual-computing.md`<br>6.1 — Computer Graphics and Visual Computing | 8.5 | 8.6 | 8.6 | 8.2 | 8.2 | 8.5 | 8.5 | 图形史和渲染管线组织强；可补 DCC 管线、WebGPU、神经渲染工程和生产美术约束。 |
| `collections/_applied/6.2.human-computer-interaction-and-design.md`<br>6.2 — Human-Computer Interaction and Design | 8.2 | 8.4 | 8.7 | 8.1 | 8.2 | 8.5 | 8.4 | 认知、评估和包容性设计贴合主题；可补设计系统、可访问性法规、实验伦理和 AI 交互模式。 |
| `collections/_applied/6.3.data-engineering-and-data-science.md`<br>6.3 — Data Engineering and Data Science | 8.0 | 8.5 | 8.5 | 8.0 | 8.2 | 8.5 | 8.4 | 管道、质量和分析栈讲得稳；可补湖仓、数据契约、数据治理、feature store 和现代语义层。 |
| `collections/_applied/6.4.robotics-and-autonomous-systems.md`<br>6.4 — Robotics and Autonomous Systems | 8.3 | 8.6 | 8.7 | 8.1 | 8.2 | 8.5 | 8.5 | 几何、估计、控制闭环准确；可补安全认证、仿真到现实、硬件成本和多传感器数据工程。 |
| `collections/_applied/6.5.scientific-computing-and-simulation.md`<br>6.5 — Scientific Computing and Simulation | 8.0 | 8.4 | 8.5 | 7.9 | 8.2 | 8.5 | 8.3 | 数值分析、微分方程和科学机器学习连接好；可补可复现科学、网格/有限元软件和不确定性传播案例。 |
| `collections/_applied/6.6.quantum-computing.md`<br>6.6 — Quantum Computing | 7.8 | 8.2 | 7.9 | 7.4 | 8.2 | 8.5 | 8.0 | 量子门和算法路径清楚；硬件噪声、纠错门槛、NISQ 现实和初学者先修要求可更直说。 |
| `collections/_applied/6.7.web-and-application-development.md`<br>6.7 — Web and Application Development | 8.4 | 8.5 | 8.8 | 8.2 | 8.2 | 8.5 | 8.6 | 从 Web 史到全栈、性能、状态管理很贴合；可补可访问性、隐私、前端构建复杂性和支付/身份实践。 |
| `collections/_engineering/7.1.software-architecture.md`<br>7.1 — Software Architecture | 8.0 | 8.5 | 8.7 | 8.1 | 8.2 | 8.5 | 8.4 | 架构作为约束管理的体裁契合；可补架构决策记录、演进式架构、平台边界和反模式案例。 |
| `collections/_engineering/7.2.software-testing-and-quality-assurance.md`<br>7.2 — Software Testing and Quality Assurance | 7.8 | 8.4 | 8.5 | 7.9 | 8.2 | 8.5 | 8.3 | 测试层次和质量观念明确；可补 property-based testing、mutation testing、测试数据管理和 flaky tests。 |
| `collections/_engineering/7.3.software-process-delivery-iteration-and-coordination.md`<br>7.3 — Software Process | 7.7 | 8.1 | 8.3 | 7.8 | 8.2 | 8.5 | 8.1 | 交付、迭代和协调主题贴合；敏捷商业化误区、远程协作和产品发现可更具体。 |
| `collections/_engineering/7.4.devops-operability-and-continuous-delivery.md`<br>7.4 — DevOps, Operability, and Continuous Delivery | 8.0 | 8.4 | 8.6 | 8.0 | 8.2 | 8.5 | 8.4 | 可运维性和持续交付定位好；可补 DORA 指标误用、供应链安全、发布策略和平台工程。 |
| `collections/_engineering/7.5.technical-debt-refactoring-and-software-economics.md`<br>7.5 — Technical Debt, Refactoring, and Software Economics | 7.8 | 8.3 | 8.5 | 8.0 | 8.2 | 8.5 | 8.3 | 把债务与经济学连接得好；可补债务度量、遗留系统迁移和组织激励导致的债务。 |
| `collections/_engineering/7.6.engineering-management-and-organizational-design.md`<br>7.6 — Engineering Management and Organizational Design | 7.5 | 8.2 | 8.3 | 7.7 | 8.8 | 8.6 | 8.2 | 管理角色、团队和 Conway 定律清楚；需要更多绩效、公平、招聘、跨文化/远程组织和失败案例。 |
| `collections/_practical/8.1.programming-languages-as-practitioner-tools.md`<br>8.1 — Programming Languages as Practitioner Tools | 7.6 | 8.2 | 8.7 | 7.9 | 8.8 | 8.8 | 8.4 | 作为实践技能的体裁很好；可补语言生态选择、迁移成本和类型/并发/内存模型的实战判断。 |
| `collections/_practical/8.2.development-environment-and-tooling.md`<br>8.2 — Development Environment and Tooling | 7.7 | 8.6 | 8.8 | 8.2 | 8.8 | 8.8 | 8.6 | shell、编辑器、构建和 AI 工具链很实用；可补容器化开发环境、密钥管理和跨平台差异。 |
| `collections/_practical/8.3.reading-code.md`<br>8.3 — Reading Code | 7.8 | 8.5 | 8.9 | 8.3 | 8.8 | 8.8 | 8.6 | 阅读代码作为建模技能讲得很好；可补大型重构前的风险评估和安全审计阅读。 |
| `collections/_practical/8.4.writing-code-and-software-craftsmanship.md`<br>8.4 — Writing Code and Software Craftsmanship | 7.8 | 8.4 | 8.9 | 8.2 | 8.8 | 8.8 | 8.6 | 命名、分解、简洁和 AI 审查很贴合；可补性能敏感代码、API 设计和可测试性。 |
| `collections/_practical/8.5.collaboration-version-control-and-code-review.md`<br>8.5 — Collaboration: Version Control and Code Review | 7.8 | 8.5 | 8.9 | 8.2 | 8.8 | 8.8 | 8.6 | Git、变更粒度和 code review 的社技属性强；可补大型 monorepo、变更管理和安全审查。 |
| `collections/_practical/8.6.debugging-as-methodological-discipline.md`<br>8.6 — Debugging as Methodological Discipline | 7.7 | 8.6 | 9.0 | 8.3 | 8.8 | 8.8 | 8.7 | 调试方法论非常实用；可补分布式系统调试、生产事故和可观测性工具链。 |
| `collections/_practical/8.7.reading-technical-literature.md`<br>8.7 — Reading Technical Literature | 7.6 | 8.5 | 8.8 | 8.1 | 8.8 | 8.8 | 8.5 | 论文/规范/文档阅读分得清楚；可补复现实验、论文质量判断和 AI 摘要误导。 |
| `collections/_practical/8.8.technical-writing.md`<br>8.8 — Technical Writing | 7.6 | 8.3 | 8.9 | 8.1 | 8.8 | 8.8 | 8.5 | 写作体裁覆盖好；可补 RFC、API docs、incident review 和面向非技术读者的沟通。 |
| `collections/_practical/8.9.career-trajectories-and-professional-practice.md`<br>8.9 — Career Trajectories and Professional Practice | 7.3 | 7.8 | 8.4 | 7.4 | 8.8 | 8.8 | 8.1 | 职业路径和专业判断有用；就业市场变化、地区差异、薪酬/签证/学历门槛和作品集评估可更具体。 |
| `collections/_interdisciplinary/9.1.cs-and-mathematics-debt-difference-and-dialogue.md`<br>9.1 — CS and Mathematics | 7.8 | 8.2 | 8.2 | 7.7 | 8.8 | 8.7 | 8.2 | 债务/差异/对话框架好；可补概率、优化、数值分析与 CS 分化的更多例子。 |
| `collections/_interdisciplinary/9.2.cs-and-physics-information-entropy-and-computation.md`<br>9.2 — CS and Physics | 7.9 | 8.1 | 8.2 | 7.7 | 8.8 | 8.7 | 8.2 | 信息物理性、熵和量子信息连接自然；可补统计物理、复杂系统、硬件能耗和物理限制。 |
| `collections/_interdisciplinary/9.3.cs-cognitive-science-and-neuroscience-intelligence-representation-embodiment.md`<br>9.3 — CS, Cognitive Science, and Neuroscience | 7.8 | 8.0 | 7.9 | 7.3 | 8.8 | 8.7 | 8.0 | 表征、智能和具身组织合理；神经科学对应关系争议大，需要更强限定和反例。 |
| `collections/_interdisciplinary/9.4.cs-and-linguistics-language-grammar-and-computation.md`<br>9.4 — CS and Linguistics | 7.9 | 8.2 | 8.2 | 7.6 | 8.2 | 8.5 | 8.1 | 形式语言、统计 NLP、LLM 与语言学关系清楚；可补语音、语义学、低资源语言和社会语言学。 |
| `collections/_interdisciplinary/9.5.cs-and-economics-mechanism-design-and-algorithmic-game-theory.md`<br>9.5 — CS and Economics | 8.0 | 8.3 | 8.3 | 7.8 | 8.8 | 8.7 | 8.3 | 战略互动、机制设计和计算约束贴合；可补平台经济、拍卖实践、隐私激励和行为经济学边界。 |
| `collections/_interdisciplinary/9.6.cs-law-and-policy-privacy-ip-and-algorithmic-accountability.md`<br>9.6 — CS, Law, and Policy | 7.8 | 8.1 | 8.2 | 7.5 | 8.8 | 8.7 | 8.1 | 代码与法律治理关系清楚；各法域差异、AI 法规、数据跨境和合规实践需要维护。 |
| `collections/_interdisciplinary/9.7.cs-and-biology-computation-in-life.md`<br>9.7 — CS and Biology | 7.7 | 8.0 | 8.0 | 7.4 | 8.8 | 8.7 | 8.0 | 生命作为信息处理的框架有启发；可补生物信息学工具、单细胞/蛋白设计和湿实验限制。 |
| `collections/_interdisciplinary/9.8.cs-and-art-and-design-generativity-aesthetics-and-computation.md`<br>9.8 — CS and Art and Design | 7.7 | 8.0 | 8.1 | 7.5 | 8.8 | 8.7 | 8.1 | 计算作为创作媒介讲得清楚；生成式 AI 的版权、劳动、审美同质化和工具实践可更具体。 |
| `collections/_interdisciplinary/9.9.cs-and-philosophy-foundations-mind-and-ethics.md`<br>9.9 — CS and Philosophy | 7.8 | 8.0 | 8.0 | 7.4 | 8.8 | 8.7 | 8.0 | 基础、心智、伦理三线完整；意识/智能/责任的争议需要更多反方和概念边界。 |
| `collections/_appendix/a.web-and-product-applications.md`<br>A.1 — Web and Product Applications | 7.2 | 6.8 | 8.2 | 7.2 | 8.4 | 8.2 | 7.5 | 职业导览结构清楚；资源仅 3 条，缺少后端、数据库、部署、可访问性和安全的非重复补充资源。 |
| `collections/_appendix/a.mobile-and-cross-platform-development.md`<br>A.2 — Mobile and Cross-Platform Development | 7.6 | 7.8 | 8.4 | 7.7 | 8.4 | 8.3 | 8.0 | 移动生态和岗位分工完整；可补应用商店政策、隐私权限、可访问性、崩溃分析和性能监控。 |
| `collections/_appendix/a.data-analysis-and-business-intelligence.md`<br>A.3 — Data Analysis and Business Intelligence | 7.4 | 7.8 | 8.5 | 7.7 | 8.4 | 8.3 | 8.0 | 分析/BI/增长实验区分清楚；可补指标治理、语义层、因果推断和组织决策失败案例。 |
| `collections/_appendix/a.data-engineering-and-platforms.md`<br>A.4 — Data Engineering and Platforms | 7.5 | 7.6 | 8.4 | 7.8 | 8.4 | 8.3 | 8.0 | 数据平台职业现实写得好；可补数据契约、数据治理、数据隐私、lakehouse 和平台运营。 |
| `collections/_appendix/a.ai-application-engineering.md`<br>A.5 — AI Application Engineering | 7.6 | 7.3 | 8.5 | 7.7 | 8.4 | 8.3 | 7.9 | 生产级 AI 的评估、权限、成本意识不错；资源偏工具文档，缺少系统设计、AI 产品失败案例和治理材料。 |
| `collections/_appendix/a.machine-learning-recommendation-search-and-advertising.md`<br>A.6 — Machine Learning, Recommendation, Search, and Advertising | 7.6 | 7.7 | 8.4 | 7.7 | 8.4 | 8.3 | 8.0 | 推荐/搜索/广告的生产属性讲得好；可补 ranking evaluation、auction ethics、feedback loop 和在线实验案例。 |
| `collections/_appendix/a.large-language-models-and-natural-language-processing.md`<br>A.7 — Large Language Models and Natural Language Processing | 7.4 | 6.9 | 8.2 | 7.3 | 8.4 | 8.3 | 7.6 | 语言系统职业导览可用；资源仅 4 条，缺少评测、安全、低资源语言、语音和推理服务材料。 |
| `collections/_appendix/a.computer-vision-and-perception.md`<br>A.8 — Computer Vision and Perception | 7.7 | 8.0 | 8.5 | 7.8 | 8.4 | 8.3 | 8.1 | 行业覆盖较广，资源足；可补数据标注伦理、隐私、边缘部署、视频理解和安全关键场景。 |
| `collections/_appendix/a.devops-cloud-and-site-reliability-engineering.md`<br>A.9 — DevOps, Cloud, and Site Reliability Engineering | 7.5 | 7.5 | 8.4 | 7.7 | 8.4 | 8.3 | 7.9 | 岗位结构和风险现实准确；可补云成本、平台工程、供应链安全、值班健康和多云现实。 |
| `collections/_appendix/a.network-systems-and-protocols.md`<br>A.10 — Network Systems and Protocols | 7.3 | 6.9 | 8.2 | 7.2 | 8.4 | 8.3 | 7.5 | 网络职业导览清楚；资源仅 3 条，缺少可观测性、BGP/CDN、Wireshark 实战和云网络材料。 |
| `collections/_appendix/a.databases-and-storage-systems.md`<br>A.11 — Databases and Storage Systems | 7.3 | 6.9 | 8.2 | 7.3 | 8.4 | 8.3 | 7.5 | 数据库岗位区分可用；资源仅 3 条，缺少数据库内核、DBA/SRE、云数据库和存储系统实践材料。 |
| `collections/_appendix/a.systems-and-performance-programming.md`<br>A.12 — Systems and Performance Programming | 7.4 | 6.9 | 8.2 | 7.3 | 8.4 | 8.3 | 7.5 | 系统职业现实准确；资源仅 3 条，缺少内核/驱动、性能工程、编译器工具链和安全低层材料。 |
| `collections/_appendix/a.embedded-iot-and-edge-systems.md`<br>A.13 — Embedded, IoT, and Edge Systems | 7.7 | 8.0 | 8.5 | 7.8 | 8.4 | 8.3 | 8.1 | 硬件约束、现场可靠性和 IoT 风险讲得好；可补安全认证、硬件调试设备、法规和供应链现实。 |
| `collections/_appendix/a.cybersecurity-and-application-security.md`<br>A.14 — Cybersecurity and Application Security | 7.5 | 7.6 | 8.4 | 7.5 | 8.4 | 8.3 | 7.9 | 攻防岗位和风险意识明确；可补 GRC、隐私工程、云安全、供应链安全和安全运营职业路径。 |
| `collections/_appendix/a.game-development.md`<br>A.15 — Game Development and Interactive Media | 7.8 | 7.8 | 8.6 | 7.8 | 8.6 | 8.5 | 8.2 | 行业风险、制作流程和岗位分工扎实；可补游戏商业模式伦理、平台认证、工会/劳动议题和技术美术路径。 |
| `collections/_appendix/a.computer-graphics-and-rendering.md`<br>A.16 — Computer Graphics and Rendering | 7.3 | 6.8 | 8.2 | 7.2 | 8.4 | 8.3 | 7.5 | 图形职业导览准确；资源仅 3 条，缺少入门代码、GPU 调试、DCC 管线和影视/游戏差异材料。 |
| `collections/_appendix/a.robotics-and-autonomous-systems.md`<br>A.17 — Robotics and Autonomous Systems | 7.8 | 7.8 | 8.5 | 7.8 | 8.4 | 8.3 | 8.1 | 机器人岗位和行业场景较全面；可补安全认证、仿真平台、数据闭环、法规和硬件团队协作。 |
| `collections/_appendix/a.programming-languages-and-developer-tools.md`<br>A.18 — Programming Languages and Developer Tools | 7.3 | 6.9 | 8.2 | 7.2 | 8.4 | 8.3 | 7.5 | 职业方向有辨识度；资源仅 3 条，缺少语言服务器、包管理、静态分析、编译器工程和开发者体验研究。 |

## Collection-Level Summary

- **Introduction:** strong reader onboarding, but weak explicit source/resource support.
- **Foundations:** consistently strong; main gaps are applied examples and numerical/engineering realities.
- **Theoretical:** conceptually strong; category theory, type theory, and AI-adjacent theory chapters need clearer bridges for non-specialists.
- **Computer Systems:** one of the strongest groups; modern hardware/cloud/security additions would raise completeness.
- **Artificial Intelligence:** good conceptual coverage; fast-moving chapters require maintenance and more explicit uncertainty boundaries.
- **Applied Domains:** strong maps; some chapters should clarify industry/practice boundaries and current toolchains.
- **Software Engineering:** good professional framing; could use more cases and organizational failure modes.
- **Practitioner Skills:** very strong fit to target readers; low historical scores are not severe because these are method chapters.
- **Interdisciplinary:** useful bridges; several chapters need stronger caveats because interdisciplinary analogies can overstate correspondence.
- **Appendix:** useful career-field guide layer; weakest point is resource depth after deduplication, not bilingual structure.

## Format and Correspondence Checklist

| Check | Result |
|---|---|
| Collection files scanned | 83 |
| Front matter present | 83/83 |
| `# English` present | 83/83 |
| `# 中文` present under tolerant parsing | 83/83 |
| `中文占位` remains | 0 |
| Undefined reference-style links | 0 |
| Large heading-count mismatch | 0 |
| HTML comments | ignored by instruction |
| Jekyll build | passed |

