---
title: "Terminology Glossary"
subclass: "Reference"
layout: post-split
---

# English

This appendix is a bilingual crosswalk for recurring terms in the guide. It is not a dictionary in alphabetical order. The terms are grouped by the way computer science itself is built: first the language of computation and mathematics, then programming and software construction, then systems and data infrastructure, then artificial intelligence, and finally engineering practice and social context.

A term is useful only when it lets a reader see a distinction. `Algorithm` is not just a fancy word for code. `Runtime` is not the same thing as a compiler. `Reliability` is not the same thing as correctness. `Alignment` is not the same thing as capability. The purpose of this glossary is to keep those distinctions visible while moving between English and Chinese.

## Translation Notes

Most terms in this appendix have a preferred translation, but a few require context. `Specification` is translated as `规约` in formal methods, type theory, and executable tests; RFCs, protocol standards, and public normative documents are translated as `规范` or `标准`. In AI safety, `specification gaming` is kept as `规格博弈`, following the established usage around reward misspecification. `Representation` is `表征` when discussing internal, cognitive, or learned structures, and `表示` when discussing formal notation or data encoding. `Inference` is `推理` in deployed ML and language-model execution, but `推断` in statistical inference. `Accessibility` is `无障碍` in human-facing design and `可访问性` when the issue is technical access or reachability. In Chinese AI engineering text, high-circulation English forms such as `token`, `tokenizer`, `tokenization`, and model `checkpoint` are kept in English rather than replaced by low-frequency literal translations.

## Computation and Mathematical Language

Computer science begins by turning vague procedures into objects that can be described, proved, executed, measured, and compared. The first cluster of terms is therefore about form: what a process is, how it is represented, and how its limits are reasoned about.

| English term | Chinese term | Definition |
|---|---|---|
| computer science | 计算机科学 | The discipline that studies computation, representation, algorithms, systems, software, information, and their interaction with people and institutions. |
| computation | 计算 | A rule-governed transformation of symbols, states, data, or signals. It can be studied abstractly or realized in physical machines. |
| algorithm | 算法 | A finite, well-defined procedure for solving a class of problems. Code is one implementation of an algorithm, not the algorithm itself. |
| data structure | 数据结构 | A way of organizing data so that operations such as search, insertion, deletion, traversal, or update have useful behavior. |
| abstraction | 抽象 | The act of hiding irrelevant detail so that a concept, interface, or model can be used without tracking every lower-level mechanism. |
| representation | 表征 / 表示 | The way information, objects, states, or meanings are encoded. Use 表征 for internal, cognitive, or learned representations; use 表示 for formal or data encodings. |
| state | 状态 | The current configuration of a system. In programs, state may include memory, variables, files, network connections, and external resources. |
| model | 模型 | A simplified formal, mathematical, computational, or statistical description used to reason about a system or phenomenon. |
| proof | 证明 | A logically valid argument that a statement follows from assumptions. In CS, proofs often establish correctness, limits, or complexity bounds. |
| invariant | 不变量 | A property that remains true across steps of an algorithm, execution, or system transition. Invariants are central to correctness reasoning. |
| complexity | 复杂度 | A measure of resource use, usually time, space, communication, or computation, as input size grows. |
| reduction | 归约 | A method of transforming one problem into another, often used to compare difficulty or prove hardness. |
| recursion | 递归 | A definition or procedure that refers to itself through smaller or simpler cases. It is common in algorithms, data structures, and formal languages. |
| probability | 概率 | A mathematical language for uncertainty. It supports reasoning about random processes, evidence, prediction, and risk. |
| statistical inference | 统计推断 | Drawing justified conclusions from finite data under explicit assumptions. |
| Bayesian inference | 贝叶斯推断 | Updating beliefs or model parameters using prior distributions, likelihoods, and observed data. |
| causal inference | 因果推断 | Estimating causal effects from experiments or observational data under stated assumptions. |
| entropy | 熵 | A measure of uncertainty or information content. In CS it appears in information theory, compression, cryptography, statistics, and physics-adjacent topics. |
| formal language | 形式语言 | A language with precisely defined syntax and often formal semantics, used to state programs, logics, protocols, or models. |
| automaton | 自动机 | An abstract machine for studying computation, languages, states, and transitions. |
| decidability | 可判定性 | Whether a problem has an algorithm that always terminates with a correct yes-or-no answer. |
| lambda calculus | λ 演算 | A formal system based on function abstraction and application, central to computation theory, programming languages, and type theory. |
| temporal logic | 时序逻辑 | A logic for reasoning about how properties hold over time, widely used in concurrent and distributed system verification. |
| model checking | 模型检查 | An automated verification method that explores states of a model to determine whether specified properties hold. |
| theorem proving | 定理证明 | The construction or machine checking of formal proofs, often used when properties are too rich for finite-state model checking. |
| proof assistant | 证明助手 | A system such as Coq, Lean, Isabelle, or Agda that helps humans write proofs and checks them mechanically. |
| static analysis | 静态分析 | Analysis of code without running it, used to find bugs, prove properties, or enforce constraints. |
| abstract interpretation | 抽象解释 | A theory of sound static analysis that reasons about programs through approximations of their possible behaviors. |

## Programming and Software Construction

Programming turns abstract computation into maintainable artifacts. The important distinction is that software is not only instructions for a machine; it is also a structure read, changed, tested, reviewed, deployed, and trusted by people.

| English term | Chinese term | Definition |
|---|---|---|
| program | 程序 | A concrete description of computation written in a programming language and executed or interpreted by a system. |
| programming language | 编程语言 | A formal language for expressing programs, usually with syntax, semantics, type rules, libraries, and tooling. |
| syntax | 语法 | The surface form of valid expressions in a language. Syntax says what can be written; semantics says what it means. |
| semantics | 语义 | The meaning or behavior of a program construct. Formal semantics tries to define that meaning precisely. |
| type system | 类型系统 | A set of rules that classifies program expressions and restricts invalid operations, often catching errors before execution. |
| compiler | 编译器 | A tool that translates, checks, and often optimizes source code into another form such as machine code, bytecode, or intermediate representation. |
| interpreter | 解释器 | A system that executes program text or bytecode directly rather than producing a separate compiled artifact first. |
| runtime | 运行时 | The execution support behind a program, including memory management, scheduling, libraries, virtual machines, or language services. |
| API | API / 应用程序接口 | A defined interface through which software components, libraries, services, or platforms expose functionality. |
| library | 库 | Reusable code called by an application. A library usually gives control to the caller. |
| framework | 框架 | A reusable structure that organizes an application and often controls the program flow into which user code is inserted. |
| dependency | 依赖 | External code, services, data, or infrastructure that a system needs in order to build, run, or behave correctly. |
| package manager | 包管理器 | A tool for installing, versioning, resolving, and updating software packages and their dependencies. |
| specification | 规约 | A precise statement of what a system, function, or component is expected to do. Use 规范 or 标准 for RFCs, protocol standards, style guides, and public normative documents. |
| test | 测试 | A procedure that exercises a system under selected conditions to discover whether behavior matches expectations. |
| formal verification | 形式化验证 | The use of mathematical methods to prove that a system satisfies specified properties under defined assumptions. |
| refactoring | 重构 | Changing the internal structure of code without intentionally changing external behavior, usually to improve clarity, maintainability, or extensibility. |
| technical debt | 技术债 | Future cost created by expedient technical decisions. It is not merely messy code; it is a structural liability that affects change. |
| codebase | 代码库 | The body of source code, tests, configuration, documentation, and history that makes up a software project. |
| documentation | 文档 | Written material that explains how a system, tool, API, protocol, or codebase should be understood or used. |
| standard | 标准 / 规范 | A normative public document or convention that defines expected behavior, interfaces, formats, or practices. |
| build system | 构建系统 | Tooling that turns source code and assets into runnable, testable, or deployable artifacts. |
| continuous deployment | 持续部署 | The practice of automatically deploying every change that passes required checks. It is stricter than continuous delivery. |
| pull request | 拉取请求 / PR | A proposed code change submitted for review before merging, common in Git-based collaboration. |
| commit | 提交 | A recorded version-control change with content, metadata, and history. |

## Systems, Data, and Infrastructure

Systems terminology is about layers. Hardware provides resources; operating systems manage them; databases preserve structured truth; networks move data under uncertainty; distributed systems coordinate machines that may fail independently.

| English term | Chinese term | Definition |
|---|---|---|
| computer architecture | 计算机体系结构 | The organization of processors, memory, instructions, storage, and data movement that determines how computation is physically executed. |
| operating system | 操作系统 | Software that manages hardware resources and provides abstractions such as processes, files, memory, devices, and permissions. |
| process | 进程 | An executing program with its own address space and operating-system-managed resources. |
| thread | 线程 | A unit of execution inside a process. Threads may share memory, which makes coordination powerful and dangerous. |
| concurrency | 并发 | The structuring of multiple tasks so they may make progress during overlapping time periods. It is about coordination, not necessarily simultaneous execution. |
| parallelism | 并行 | Actual simultaneous execution, usually across multiple cores, processors, machines, or accelerators. |
| memory | 内存 | Fast storage used during execution. Its organization, safety, and locality strongly affect performance and correctness. |
| cache | 缓存 | A faster storage layer that keeps copies of frequently used data to reduce latency or cost. Caches improve performance but complicate consistency. |
| file system | 文件系统 | The operating-system abstraction for persistent files, directories, metadata, permissions, and storage layout. |
| database | 数据库 | A system for storing, querying, updating, and protecting structured or semi-structured data. |
| transaction | 事务 | A unit of database work treated as a coherent operation, often discussed through atomicity, consistency, isolation, and durability. |
| consistency | 一致性 | The property that different views, replicas, or operations obey defined rules. Its exact meaning depends on the system model. |
| distributed system | 分布式系统 | A system made of multiple networked components that coordinate despite partial failure, delay, and independent execution. |
| network protocol | 网络协议 | A rule set that defines how systems communicate over a network, including message formats, ordering, errors, and negotiation. |
| latency | 延迟 | The time it takes for an operation or message to complete. Low latency matters when users or systems wait for responses. |
| throughput | 吞吐量 | The amount of work completed per unit time. It is not the same as latency; a system can have high throughput and poor latency. |
| reliability | 可靠性 | The ability of a system to continue delivering acceptable service despite faults, overload, change, or imperfect conditions. |
| observability | 可观测性 | The ability to understand system behavior from external signals such as logs, metrics, traces, profiles, and events. |
| container | 容器 | A packaged execution environment that isolates an application and its dependencies while sharing the host operating-system kernel. |
| cloud computing | 云计算 | On-demand computing resources provided as network-accessible services, usually with elastic capacity and managed infrastructure. |
| kernel | 内核 | The core of an operating system that manages hardware, memory, scheduling, devices, and privileged operations. |
| virtual machine | 虚拟机 | An execution environment that emulates or abstracts a machine, often used for isolation, portability, or managed runtimes. |
| bytecode | 字节码 | A lower-level portable instruction format usually executed by a virtual machine or interpreter. |
| CPU | CPU / 中央处理器 | The general-purpose processor that executes instructions and coordinates computation. |
| GPU | GPU / 图形处理器 | A highly parallel processor originally designed for graphics and now central to machine learning and scientific computing. |
| accelerator | 加速器 | Specialized hardware designed to speed up particular workloads, such as graphics, neural networks, cryptography, or signal processing. |
| schema | 模式 | A defined structure for data, messages, databases, or documents. Schema choices shape validation, evolution, and interoperability. |
| load balancer | 负载均衡器 | Infrastructure that distributes requests or work across multiple servers or services. |

## Data, Machine Learning, and AI

AI vocabulary can become misleading when words sound more human than the mechanisms they name. A model does not understand in the ordinary human sense simply because it produces language. Training is not the same as deployment. Capability is not the same as reliability.

| English term | Chinese term | Definition |
|---|---|---|
| dataset | 数据集 | A collection of examples used for analysis, training, evaluation, or decision-making. Its quality often matters more than its size. |
| feature | 特征 | A measurable input variable or representation used by a model. Feature design shapes what a model can learn. |
| machine learning model | 机器学习模型 | In machine learning, a parameterized function or system learned from data and used for prediction, generation, classification, control, or representation. |
| training | 训练 | The process of adjusting model parameters using data and an objective function. |
| inference | 推理 / 推断 | Using a trained model to produce outputs. In AI engineering, inference often means deployed model execution. |
| generalization | 泛化 | A model's ability to perform well on data or situations not seen during training. |
| overfitting | 过拟合 | When a model captures noise or accidental patterns in training data and performs poorly on new data. |
| loss function | 损失函数 | The objective that measures how wrong a model's output is during training and guides optimization. |
| gradient descent | 梯度下降 | An optimization method that adjusts parameters in the direction that reduces loss. |
| neural network | 神经网络 | A model composed of layers of parameterized transformations, loosely inspired by neurons but mathematically better understood as differentiable function approximation. |
| transformer | Transformer / 变换器架构 | A neural-network architecture based on attention mechanisms, central to modern language, vision, and multimodal models. |
| embedding | 嵌入 | A vector representation of text, images, users, items, or other objects, usually designed so meaningful relationships appear as geometric relationships. |
| foundation model | 基础模型 | A large pretrained model whose learned representations can be adapted to many downstream tasks. |
| large language model | 大语言模型 | A large model trained primarily on text or token sequences to predict and generate language-like outputs. |
| prompt | 提示 / 提示词 | Input used to steer a language model's behavior without necessarily changing its parameters. Use 提示 for the general mechanism and 提示词 for concrete prompt text. |
| retrieval-augmented generation | 检索增强生成 | A pattern that combines model generation with retrieved external information to improve grounding and reduce unsupported answers. |
| alignment | 对齐 | The process and research problem of making AI systems behave in ways compatible with intended human goals, constraints, and values. |
| interpretability | 可解释性 | The study of how to understand why a model behaves as it does, from surface explanations to internal mechanisms. |
| reinforcement learning | 强化学习 | A learning framework in which an agent learns behavior through interaction, rewards, and feedback over time. |
| agent | 智能体 | A system that perceives, decides, and acts in an environment, often pursuing goals through sequences of actions. |
| token | token | A unit used by a language model tokenizer. It may correspond to a word, subword, character sequence, or symbol. |
| tokenizer | tokenizer | The component that converts text or other input into tokens and maps tokens back to text when possible. |
| tokenization | tokenization | The process of splitting input into tokens according to a tokenizer's vocabulary and rules. |
| checkpoint | checkpoint | In model training, a saved model or training state that can be resumed, evaluated, shared, or fine-tuned. |
| attention | 注意力 | A mechanism that lets a model weight relationships between positions, tokens, patches, or features. |
| self-attention | 自注意力 | Attention within one sequence or representation, allowing each position to attend to other positions in the same input. |
| pretraining | 预训练 | Large-scale training before task-specific adaptation, usually on broad data. |
| post-training | 后训练 | Training after pretraining, including instruction tuning, preference optimization, safety tuning, or domain adaptation. |
| fine-tuning | 微调 | Adapting a pretrained model to a narrower task, domain, or behavior using additional training. |
| instruction tuning | 指令微调 | Fine-tuning models to follow natural-language instructions more reliably. |
| RLHF | 基于人类反馈的强化学习 | Reinforcement learning from human feedback, used to shape model behavior through preference data or reward models. |
| DPO | 直接偏好优化 | Direct Preference Optimization, a preference-training method that avoids explicitly training a separate reward model. |
| benchmark | 基准 | A standardized task, dataset, or evaluation protocol used to compare systems. Benchmarks are useful but can be gamed or overfit. |
| evaluation | 评估 | The process of measuring whether a model or system behaves well enough for a defined purpose. |
| hallucination | 幻觉 | A fluent but unsupported or false model output. It is a structural risk of generative systems, not just a minor bug. |
| reward hacking | 奖励黑客 | A failure mode in which an agent finds unintended ways to obtain high reward while violating the designer's intent. |
| specification gaming | 规格博弈 | A broader AI safety failure mode in which a system exploits gaps between the specified objective and the intended behavior. |
| prompt injection | 提示注入 | An attack or failure mode in which input text manipulates a model to ignore intended instructions or reveal protected behavior. |
| vector database | 向量数据库 | A database optimized for storing and searching embeddings by similarity. |
| guardrail | 护栏 | A constraint, filter, policy, or runtime check intended to keep an AI system within acceptable behavior. |
| multimodal model | 多模态模型 | A model that handles more than one modality, such as text, image, audio, video, or actions. |
| diffusion model | 扩散模型 | A generative model that learns to reverse a gradual noising process, important in modern image, audio, and video generation. |

## Engineering Practice, People, and Society

Computing systems are built and operated by organizations. That makes engineering vocabulary partly technical and partly social. Terms such as `security`, `privacy`, `governance`, and `ethics` are not decorations around CS; they name constraints that affect what systems are allowed to do.

| English term | Chinese term | Definition |
|---|---|---|
| software architecture | 软件架构 | The high-level structure of a software system: components, boundaries, interfaces, data flow, deployment shape, and change strategy. |
| module | 模块 | A unit of organization that hides internal detail behind an interface. Good modules reduce coordination cost. |
| interface | 接口 | A boundary that defines how components interact while hiding implementation details. |
| code review | 代码审查 | A collaborative review of proposed code changes for correctness, maintainability, design fit, security, and shared understanding. |
| continuous integration | 持续集成 | The practice of frequently merging changes and automatically building and testing them to detect integration problems early. |
| continuous delivery | 持续交付 | The practice of keeping software in a deployable state through automation, testing, release discipline, and operational feedback. |
| DevOps | DevOps / 开发运维协作 | A set of practices and cultural changes that connect development, operations, reliability, automation, and feedback. |
| site reliability engineering | 站点可靠性工程 | An engineering approach to operations that uses software, measurement, error budgets, and automation to manage reliable services. |
| incident | 事故 / 故障事件 | An event in which a system fails to provide acceptable service, requiring detection, response, mitigation, and learning. |
| security | 安全 | Protection against unauthorized access, misuse, disruption, tampering, or harm. It includes technical, organizational, and human factors. |
| cryptography | 密码学 | The study and engineering of mathematical techniques for confidentiality, integrity, authentication, signatures, and secure protocols. |
| privacy | 隐私 | Control over personal information and protection against inappropriate collection, inference, exposure, or reuse. |
| usability | 可用性 | The degree to which people can effectively, efficiently, and safely use a system in context. |
| accessibility | 无障碍 / 可访问性 | The design of systems so people with different abilities, devices, and contexts can use them. Use 无障碍 for inclusive human-facing design; use 可访问性 for technical reachability or access. |
| simulation | 仿真 | The computational imitation of a physical, social, biological, economic, or engineered process. |
| robotics | 机器人学 | The field concerned with machines that sense, decide, and act in the physical world. |
| governance | 治理 | The rules, processes, accountability structures, and institutions that shape how systems are built, deployed, audited, and constrained. |
| ethics | 伦理 | The study and practice of reasoning about what should be done, who may be harmed, who is responsible, and what values a system encodes. |
| accountability | 问责 | The ability to assign responsibility, require explanation, provide remedy, and audit decisions or system behavior. |
| career trajectory | 职业路径 | The pattern by which a practitioner's skills, responsibilities, roles, and judgment develop over time. |
| incident response | 事故响应 | The organized process of detecting, triaging, mitigating, communicating, and learning from production failures or security events. |
| error budget | 错误预算 | The amount of unreliability a service can tolerate while still meeting its reliability target. |
| service-level objective | 服务等级目标 | A measurable reliability target for a service, often abbreviated SLO. |
| supply chain security | 供应链安全 | Protection of dependencies, build systems, artifacts, identities, and release paths from compromise. |

# 中文

本附录是整份指南中反复出现的术语对照表。它不是按字母排列的普通词典，而是按计算机科学的知识结构组织：先是计算与数学语言，然后是编程和软件构造，再到系统、数据基础设施、人工智能，最后进入工程实践、组织和社会语境。

术语的价值不在于显得专业，而在于帮助读者看见差异。`算法`不是“代码”的高级说法。`运行时`不是编译器。`可靠性`不等于正确性。`对齐`不等于能力。这个术语表的目的，是在中英文之间切换时保留这些差异。

## 译名规则

多数术语在本附录中都有主译名，但少数术语必须按语境处理。`specification` 在形式化方法、类型论和可执行测试语境中统一译为“规约”；RFC、协议标准、公开标准、风格指南和规范性文档则译为“规范”或“标准”。在 AI 安全中，`specification gaming` 按既有用法译为“规格博弈”，对应奖励目标被错误规定后的利用行为。`representation` 在内部结构、认知结构或学习到的结构中译为“表征”，在形式记号或数据编码中可译为“表示”。`inference` 在部署后的机器学习和语言模型执行中译为“推理”，在统计学中译为“推断”。`accessibility` 面向人的包容性设计时译为“无障碍”，技术访问或可达状态则可译为“可访问性”。在中文 AI 工程语境中，`token`、`tokenizer`、`tokenization` 和模型 `checkpoint` 等传播更广的英文形式保留英文，不强行替换成低频直译。

## 计算与数学语言

计算机科学首先把含糊的步骤变成可以描述、证明、执行、测量和比较的对象。因此，第一组术语处理的是形式问题：什么是过程，它如何被表示，以及如何讨论它的能力和边界。

| 中文术语 | English term | 定义 |
|---|---|---|
| 计算机科学 | computer science | 研究计算、表征、算法、系统、软件、信息，以及它们与人和制度互动的学科。 |
| 计算 | computation | 对符号、状态、数据或信号进行的规则化转换。它既可以被抽象研究，也可以在物理机器中实现。 |
| 算法 | algorithm | 用来解决一类问题的有限且明确的步骤。代码是算法的一种实现，不等同于算法本身。 |
| 数据结构 | data structure | 组织数据的方式，使查找、插入、删除、遍历或更新等操作具有合适的行为。 |
| 抽象 | abstraction | 隐藏暂时无关的细节，使概念、接口或模型可以在不追踪全部底层机制的情况下被使用。 |
| 表征 / 表示 | representation | 信息、对象、状态或意义的编码方式。内部、认知或学习到的 representation 通常译为“表征”；形式系统或数据编码语境可译为“表示”。 |
| 状态 | state | 系统当前的配置。在程序中，状态可能包括内存、变量、文件、网络连接和外部资源。 |
| 模型 | model | 用来推理系统或现象的简化描述，可以是形式化的、数学的、计算的或统计的。 |
| 证明 | proof | 说明某个命题从给定假设中逻辑推出的有效论证。在计算机科学中，证明常用于建立正确性、极限或复杂度边界。 |
| 不变量 | invariant | 在算法步骤、程序执行或系统转移中始终保持为真的性质。不变量是正确性推理的核心工具。 |
| 复杂度 | complexity | 对资源使用量的度量，通常包括时间、空间、通信或计算量，并关注它们如何随输入规模增长。 |
| 归约 | reduction | 把一个问题转换为另一个问题的方法，常用于比较难度或证明困难性。 |
| 递归 | recursion | 通过更小或更简单的情形来引用自身的定义或过程，常见于算法、数据结构和形式语言。 |
| 概率 | probability | 处理不确定性的数学语言，用于随机过程、证据、预测和风险推理。 |
| 统计推断 | statistical inference | 在明确假设下，从有限数据中得出可辩护结论的方法。 |
| 贝叶斯推断 | Bayesian inference | 使用先验分布、似然和观测数据更新信念或模型参数的方法。 |
| 因果推断 | causal inference | 在实验或明确假设支持下，从数据中估计因果效应的方法。 |
| 熵 | entropy | 对不确定性或信息含量的度量，出现在信息论、压缩、密码学、统计学以及与物理相邻的主题中。 |
| 形式语言 | formal language | 具有精确定义语法、并常常具有形式语义的语言，用于表达程序、逻辑、协议或模型。 |
| 自动机 | automaton | 用来研究计算、语言、状态和转移的抽象机器。 |
| 可判定性 | decidability | 一个问题是否存在总能终止并给出正确是/否答案的算法。 |
| λ 演算 | lambda calculus | 基于函数抽象和函数应用的形式系统，是计算理论、编程语言和类型论的核心基础。 |
| 时序逻辑 | temporal logic | 推理性质如何随时间成立的逻辑，广泛用于并发和分布式系统验证。 |
| 模型检查 | model checking | 自动探索模型状态，以判断指定性质是否成立的验证方法。 |
| 定理证明 | theorem proving | 构造或机器检查形式证明的方法，常用于性质过于丰富、无法只靠有限状态模型检查处理的场景。 |
| 证明助手 | proof assistant | Coq、Lean、Isabelle、Agda 等帮助人类书写证明并机械检查证明的系统。 |
| 静态分析 | static analysis | 在不运行代码的情况下分析代码，用于发现 bug、证明性质或执行约束。 |
| 抽象解释 | abstract interpretation | 一种可靠静态分析理论，通过对程序可能行为的近似来进行推理。 |

## 编程与软件构造

编程把抽象计算变成可维护的人工制品。关键在于，软件不只是给机器执行的指令；它也是由人阅读、修改、测试、审查、部署和信任的结构。

| 中文术语 | English term | 定义 |
|---|---|---|
| 程序 | program | 用编程语言写出的计算描述，由系统执行或解释。 |
| 编程语言 | programming language | 用来表达程序的形式语言，通常包含语法、语义、类型规则、库和工具生态。 |
| 语法 | syntax | 语言中合法表达式的表面形式。语法说明什么能写，语义说明它是什么意思。 |
| 语义 | semantics | 程序构造的含义或行为。形式语义试图精确界定这种含义。 |
| 类型系统 | type system | 对程序表达式进行分类并限制非法操作的一组规则，通常能在运行前发现错误。 |
| 编译器 | compiler | 把源代码翻译、检查并常常优化为另一种形式的工具，例如机器码、字节码或中间表示。 |
| 解释器 | interpreter | 直接执行程序文本或字节码的系统，而不是先产生一个独立的编译产物。 |
| 运行时 | runtime | 程序执行背后的支撑环境，包括内存管理、调度、库、虚拟机或语言服务。 |
| API / 应用程序接口 | API | 软件组件、库、服务或平台暴露功能时使用的明确定义接口。 |
| 库 | library | 可复用代码，由应用调用。库通常把控制权交给调用者。 |
| 框架 | framework | 组织应用的可复用结构，往往控制程序流程，并让用户代码嵌入其中。 |
| 依赖 | dependency | 系统构建、运行或正确行为所需要的外部代码、服务、数据或基础设施。 |
| 包管理器 | package manager | 安装、版本管理、依赖解析和更新软件包的工具。 |
| 规约 | specification | 对系统、函数或组件应当做什么的精确说明。RFC、协议标准、风格指南和公开规范则译为“规范”或“标准”。 |
| 测试 | test | 在选定条件下运行系统，以发现行为是否符合预期的过程。 |
| 形式化验证 | formal verification | 使用数学方法证明系统在给定假设下满足指定性质。 |
| 重构 | refactoring | 在不有意改变外部行为的前提下改变代码内部结构，通常为了提高清晰度、可维护性或可扩展性。 |
| 技术债 | technical debt | 由权宜性技术决策造成的未来成本。它不只是代码凌乱，而是影响变更能力的结构性负债。 |
| 代码库 | codebase | 构成一个软件项目的源代码、测试、配置、文档和历史。 |
| 文档 | documentation | 解释系统、工具、API、协议或代码库应如何理解或使用的文字材料。 |
| 标准 / 规范 | standard | 定义预期行为、接口、格式或实践的规范性公开文档或约定。 |
| 构建系统 | build system | 把源代码和资源转换为可运行、可测试或可部署产物的工具系统。 |
| 持续部署 | continuous deployment | 所有通过必要检查的改动都会自动部署的实践，比持续交付更严格。 |
| 拉取请求 / PR | pull request | 在合并前提交审查的代码改动，是 Git 协作中的常见形式。 |
| 提交 | commit | 版本控制系统中记录的一次改动，包含内容、元数据和历史位置。 |

## 系统、数据与基础设施

系统术语关注层次。硬件提供资源，操作系统管理资源，数据库保存结构化事实，网络在不确定条件下移动数据，分布式系统协调可能独立失败的机器。

| 中文术语 | English term | 定义 |
|---|---|---|
| 计算机体系结构 | computer architecture | 处理器、内存、指令、存储和数据移动的组织方式，决定计算如何在物理层面执行。 |
| 操作系统 | operating system | 管理硬件资源并提供进程、文件、内存、设备和权限等抽象的软件。 |
| 进程 | process | 一个正在执行的程序，拥有自己的地址空间和由操作系统管理的资源。 |
| 线程 | thread | 进程内部的执行单元。线程可能共享内存，因此协调能力强，也容易出错。 |
| 并发 | concurrency | 让多个任务在重叠的时间段内推进的结构安排。它关注协调，不必然意味着同时执行。 |
| 并行 | parallelism | 真正的同时执行，通常发生在多核、多处理器、多机器或加速器上。 |
| 内存 | memory | 执行期间使用的快速存储。它的组织、安全性和局部性强烈影响性能与正确性。 |
| 缓存 | cache | 更快的存储层，保存常用数据副本以降低延迟或成本。缓存提升性能，但会让一致性更复杂。 |
| 文件系统 | file system | 操作系统对持久文件、目录、元数据、权限和存储布局提供的抽象。 |
| 数据库 | database | 用于存储、查询、更新和保护结构化或半结构化数据的系统。 |
| 事务 | transaction | 被当作一个整体处理的数据库工作单元，常通过原子性、一致性、隔离性和持久性来讨论。 |
| 一致性 | consistency | 不同视图、副本或操作遵守定义规则的性质。它的确切含义取决于具体系统模型。 |
| 分布式系统 | distributed system | 由多个联网组件构成的系统，需要在局部失败、延迟和独立执行下协调。 |
| 网络协议 | network protocol | 定义系统如何通过网络通信的规则，包括消息格式、顺序、错误处理和协商。 |
| 延迟 | latency | 一个操作或消息完成所需的时间。当用户或系统等待响应时，低延迟很重要。 |
| 吞吐量 | throughput | 单位时间完成的工作量。它不等同于延迟；系统可以吞吐量高但延迟差。 |
| 可靠性 | reliability | 系统在故障、过载、变更或不完美条件下继续提供可接受服务的能力。 |
| 可观测性 | observability | 从日志、指标、追踪、剖析和事件等外部信号理解系统行为的能力。 |
| 容器 | container | 打包后的执行环境，在共享宿主操作系统内核的同时隔离应用及其依赖。 |
| 云计算 | cloud computing | 以网络服务形式按需提供的计算资源，通常具有弹性容量和托管基础设施。 |
| 内核 | kernel | 操作系统的核心部分，管理硬件、内存、调度、设备和特权操作。 |
| 虚拟机 | virtual machine | 模拟或抽象机器的执行环境，常用于隔离、可移植性或托管运行时。 |
| 字节码 | bytecode | 通常由虚拟机或解释器执行的较低层、可移植指令格式。 |
| CPU / 中央处理器 | CPU | 执行指令并协调计算的通用处理器。 |
| GPU / 图形处理器 | GPU | 最初为图形设计、如今在机器学习和科学计算中很关键的高度并行处理器。 |
| 加速器 | accelerator | 为图形、神经网络、密码学或信号处理等特定工作负载提速的专用硬件。 |
| 模式 | schema | 数据、消息、数据库或文档的定义结构，会影响验证、演化和互操作。 |
| 负载均衡器 | load balancer | 把请求或工作分配到多台服务器或多个服务上的基础设施。 |

## 数据、机器学习与人工智能

AI 术语最容易误导，因为很多词听起来比实际机制更像人类能力。一个模型能生成语言，并不意味着它按通常意义理解了语言。训练不等于部署。能力不等于可靠性。

| 中文术语 | English term | 定义 |
|---|---|---|
| 数据集 | dataset | 用于分析、训练、评估或决策的一组样本。它的质量往往比规模更重要。 |
| 特征 | feature | 模型使用的可测量输入变量或表征。特征设计会塑造模型能学到什么。 |
| 机器学习模型 | machine learning model | 在机器学习中，指从数据中学习得到、用于预测、生成、分类、控制或表征的参数化函数或系统。 |
| 训练 | training | 使用数据和目标函数调整模型参数的过程。 |
| 推理 / 推断 | inference | 使用训练好的模型产生输出。在 AI 工程中，推理常指部署后的模型执行。 |
| 泛化 | generalization | 模型在训练时未见过的数据或情境上仍然表现良好的能力。 |
| 过拟合 | overfitting | 模型捕捉训练数据中的噪声或偶然模式，导致在新数据上表现变差。 |
| 损失函数 | loss function | 衡量模型输出错误程度并指导优化的训练目标。 |
| 梯度下降 | gradient descent | 沿着降低损失的方向调整参数的优化方法。 |
| 神经网络 | neural network | 由多层参数化变换构成的模型，虽受神经元启发，但更适合理解为可微函数逼近。 |
| Transformer / 变换器架构 | transformer | 基于注意力机制的神经网络架构，是现代语言、视觉和多模态模型的核心。 |
| 嵌入 | embedding | 文本、图像、用户、物品或其他对象的向量表征，通常让有意义的关系表现为几何关系。 |
| 基础模型 | foundation model | 经过大规模预训练、其表征可以迁移到许多下游任务的大模型。 |
| 大语言模型 | large language model | 主要在文本或 token 序列上训练、用于预测和生成类语言输出的大模型。 |
| 提示 / 提示词 | prompt | 用来引导语言模型行为的输入，不一定改变模型参数。机制层面用“提示”，具体文本可用“提示词”。 |
| 检索增强生成 | retrieval-augmented generation | 把模型生成与外部信息检索结合起来的模式，用于提高 grounding 并减少无根据回答。 |
| 对齐 | alignment | 使 AI 系统行为符合预期人类目标、约束和价值的过程与研究问题。 |
| 可解释性 | interpretability | 研究如何理解模型为什么这样行为，从表层解释到内部机制都包括在内。 |
| 强化学习 | reinforcement learning | 智能体通过交互、奖励和随时间展开的反馈来学习行为的框架。 |
| 智能体 | agent | 能感知、决策并在环境中行动的系统，通常通过连续动作追求目标。 |
| token | token | 语言模型 tokenizer 使用的单位，可能对应词、子词、字符序列或符号。 |
| tokenizer | tokenizer | 把文本或其他输入转换为 token，并在可能时把 token 映射回文本的组件。 |
| tokenization | tokenization | 根据 tokenizer 的词表和规则把输入切分为 token 的过程。 |
| checkpoint | checkpoint | 在模型训练中保存下来的模型或训练状态，可用于恢复训练、评估、共享或继续微调。 |
| 注意力 | attention | 让模型为位置、token、图像块或特征之间的关系分配权重的机制。 |
| 自注意力 | self-attention | 同一序列或表征内部的注意力机制，使每个位置可以关注同一输入中的其他位置。 |
| 预训练 | pretraining | 在任务专门适配之前进行的大规模训练，通常使用广泛数据。 |
| 后训练 | post-training | 预训练之后的训练，包括指令微调、偏好优化、安全调优或领域适配。 |
| 微调 | fine-tuning | 用额外训练把预训练模型适配到更窄任务、领域或行为。 |
| 指令微调 | instruction tuning | 让模型更可靠地遵循自然语言指令的微调。 |
| 基于人类反馈的强化学习 | RLHF | Reinforcement learning from human feedback，通过偏好数据或奖励模型塑造模型行为。 |
| 直接偏好优化 | DPO | Direct Preference Optimization，一种不显式训练独立奖励模型的偏好训练方法。 |
| 基准 | benchmark | 用于比较系统的标准化任务、数据集或评估协议。基准有用，但也可能被刷分或过拟合。 |
| 评估 | evaluation | 衡量模型或系统是否足以满足特定目的的过程。 |
| 幻觉 | hallucination | 流畅但缺乏依据或错误的模型输出，是生成式系统的结构性风险，不只是小 bug。 |
| 奖励黑客 | reward hacking | 智能体以非预期方式获得高奖励、却违背设计者意图的失败模式。 |
| 规格博弈 | specification gaming | AI 安全中的一类失败模式，指系统利用指定目标与真实意图之间的缝隙。 |
| 提示注入 | prompt injection | 输入文本操纵模型，使其忽略预期指令或暴露受保护行为的攻击或失败模式。 |
| 向量数据库 | vector database | 为存储嵌入并按相似度搜索而优化的数据库。 |
| 护栏 | guardrail | 用来让 AI 系统保持在可接受行为范围内的约束、过滤器、策略或运行时检查。 |
| 多模态模型 | multimodal model | 处理文本、图像、音频、视频或动作等多种模态的模型。 |
| 扩散模型 | diffusion model | 学习逆转逐步加噪过程的生成模型，在现代图像、音频和视频生成中很重要。 |

## 工程实践、人与社会

计算系统由组织中的人构建和运行。因此，工程术语既是技术性的，也是社会性的。`安全`、`隐私`、`治理`、`伦理`并不是计算机科学外面的装饰，而是决定系统能做什么、该做什么、被允许做什么的约束。

| 中文术语 | English term | 定义 |
|---|---|---|
| 软件架构 | software architecture | 软件系统的高层结构，包括组件、边界、接口、数据流、部署形态和变更策略。 |
| 模块 | module | 通过接口隐藏内部细节的组织单元。好的模块能降低协作成本。 |
| 接口 | interface | 定义组件如何交互、同时隐藏实现细节的边界。 |
| 代码审查 | code review | 对拟议代码改动进行协作审查，关注正确性、可维护性、设计契合度、安全性和共同理解。 |
| 持续集成 | continuous integration | 频繁合并改动并自动构建、测试，以尽早发现集成问题的实践。 |
| 持续交付 | continuous delivery | 通过自动化、测试、发布纪律和运维反馈，让软件始终保持可部署状态的实践。 |
| DevOps / 开发运维协作 | DevOps | 连接开发、运维、可靠性、自动化和反馈的一组实践与文化变化。 |
| 站点可靠性工程 | site reliability engineering | 用软件、度量、错误预算和自动化管理可靠服务的工程化运维方法。 |
| 事故 / 故障事件 | incident | 系统未能提供可接受服务的事件，需要检测、响应、缓解和复盘学习。 |
| 安全 | security | 防止未授权访问、滥用、中断、篡改或伤害，包含技术、组织和人的因素。 |
| 密码学 | cryptography | 研究并工程化处理保密性、完整性、认证、签名和安全协议的数学技术。 |
| 隐私 | privacy | 对个人信息的控制，以及对不当收集、推断、暴露或再利用的保护。 |
| 可用性 | usability | 人在具体语境中有效、高效、安全使用系统的程度。 |
| 无障碍 / 可访问性 | accessibility | 让具有不同能力、设备和使用语境的人都能使用系统的设计。面向人的包容性设计优先用“无障碍”；技术可达性或访问状态可用“可访问性”。 |
| 仿真 | simulation | 对物理、社会、生物、经济或工程过程的计算化模仿。 |
| 机器人学 | robotics | 研究能在物理世界中感知、决策和行动的机器的领域。 |
| 治理 | governance | 影响系统如何被构建、部署、审计和约束的规则、流程、问责结构和制度。 |
| 伦理 | ethics | 关于应该做什么、谁可能受害、谁负责任、系统编码了什么价值的推理与实践。 |
| 问责 | accountability | 分配责任、要求解释、提供救济，并审计决策或系统行为的能力。 |
| 职业路径 | career trajectory | 实践者的能力、职责、角色和判断力随时间发展的模式。 |
| 事故响应 | incident response | 对生产故障或安全事件进行检测、分级、缓解、沟通和复盘学习的组织化过程。 |
| 错误预算 | error budget | 服务在仍满足可靠性目标的前提下可以容忍的不可靠性额度。 |
| 服务等级目标 | service-level objective | 服务可靠性的可度量目标，常缩写为 SLO。 |
| 供应链安全 | supply chain security | 对依赖、构建系统、产物、身份和发布路径的保护，防止它们被攻陷。 |
