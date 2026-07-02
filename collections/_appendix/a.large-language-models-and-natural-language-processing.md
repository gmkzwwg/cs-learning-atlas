---
title: "Large Language Models and Natural Language Processing"
subclass: "Occupation Introduction"
layout: post-split
---

# English

LLM and NLP engineering is the work of building systems that process language. These systems may read documents, answer questions, summarize conversations, translate text, classify messages, extract information, generate drafts, search knowledge bases, write code, or act as assistants inside larger products.

This field overlaps with AI application development, but it is not the same thing. AI application developers often focus on product integration: how to connect a model to a workflow. LLM and NLP engineers go deeper into language data, model behavior, evaluation, training, fine-tuning, retrieval, inference, and failure analysis. They ask not only “how do we use the model?” but also “why does the model behave this way, how do we measure it, how do we adapt it, and how do we make it reliable enough for a real use case?”

The field is broad. Some people work close to research and model training. Some build retrieval and question-answering systems. Some work on evaluation, safety, or alignment. Some optimize inference so models run faster and cheaper. Some prepare data, build benchmarks, or adapt models to legal, medical, financial, educational, or software-engineering domains. The common object is language, but the jobs are quite different.

### How the field developed

Natural language processing existed long before large language models. Earlier systems often used rules, dictionaries, grammars, or hand-built features. A spam filter might look for certain words. A grammar checker might use rules about sentence structure. A search engine might rely heavily on keyword matching. These systems could work in narrow cases, but they were brittle because human language is full of ambiguity, context, slang, missing information, and exceptions.

Statistical NLP changed the field by using data instead of only rules. Systems learned from examples: translated sentence pairs, labeled documents, speech transcripts, search clicks, or annotated text. This made NLP more flexible. Later, word embeddings represented words as vectors, making it possible for models to capture similarity between words and phrases. Deep learning then improved speech recognition, translation, sentiment analysis, question answering, and text classification.

The Transformer architecture, introduced in 2017, changed the field again. It made it possible to train models that handle long-range relationships in text more effectively and scale well with large datasets and compute. Models such as BERT showed the value of pretraining on large text corpora and then adapting the model to specific tasks. GPT-style models pushed this further by generating fluent text and solving many tasks through prompting.

The release of widely available chat-based models changed the public face of NLP. Language systems were no longer just hidden inside search, translation, and classification tools. They became products that ordinary users could talk to. This created new engineering problems: hallucination, prompt injection, data privacy, retrieval quality, safety filters, evaluation, tool use, latency, and cost.

By 2025, AI adoption had become widespread, but scaling remained difficult. McKinsey’s 2025 global survey reports that nearly nine in ten respondents say their organizations regularly use AI, and 62% say their organizations are at least experimenting with AI agents, but nearly two-thirds have not yet begun scaling AI across the enterprise. The same report emphasizes workflow redesign as a key part of getting value from AI. This matters for LLM and NLP engineering because language models do not become useful simply by existing. They must be shaped, evaluated, connected to data, and placed inside work that people actually do.

### How the industry works

There are several layers in the LLM and NLP industry.

At the top are model labs and frontier AI companies. These organizations train or develop large foundation models. Their work involves massive datasets, distributed training, model architecture, reinforcement learning from human feedback or related alignment methods, evaluation, safety research, inference infrastructure, and product deployment. Jobs in this layer are competitive and usually require strong research ability, systems ability, or both.

A second layer consists of companies building model platforms and infrastructure. They may provide APIs, model hosting, fine-tuning tools, vector search, evaluation platforms, prompt management, inference optimization, monitoring, guardrails, or agent frameworks. These companies serve other developers and enterprises. The work is more technical than ordinary application development because customers are building production AI systems and need reliability, observability, cost control, and security.

A third layer consists of product companies adding LLM features into existing products. Search engines, office tools, coding tools, customer support systems, legal software, analytics products, learning platforms, design tools, and developer platforms all use language models in different ways. These teams do not always train models themselves. They often choose models, prepare data, build retrieval systems, design user interactions, evaluate quality, and manage risk.

A fourth layer consists of enterprises adopting LLMs internally. Banks, hospitals, law firms, insurers, manufacturers, retailers, universities, and governments may want systems for document search, summarization, customer support, policy assistance, compliance, reporting, translation, or internal knowledge management. In these environments, the hardest problems are often not model architecture. They are data permissions, privacy, old document systems, unclear workflows, legal risk, and employee adoption.

A fifth layer consists of domain-specific AI companies. These companies build language systems for one field: legal research, medical documentation, financial analysis, education, software engineering, scientific literature, sales, recruiting, or customer support. Domain knowledge matters here. A general model may be fluent, but the product must understand what counts as a correct answer, an unacceptable error, a useful citation, or a risky recommendation.

### What different roles contribute

An **NLP engineer** works on systems that analyze or generate language. This may include classification, extraction, search, summarization, translation, question answering, entity recognition, moderation, or conversational systems. In older settings, NLP engineers may still use classic machine learning and task-specific models. In newer settings, they often use large language models, embeddings, fine-tuning, and retrieval.

An **LLM engineer** builds systems around large language models. This role may involve prompting, structured outputs, tool use, retrieval, fine-tuning, model selection, latency control, failure analysis, and evaluation. A weak LLM engineer only tries prompts until something works. A strong one can explain why the system fails, design tests, improve data, compare models, and make the system safer and more predictable.

A **model training engineer** works on training or fine-tuning models. This role may involve data preparation, distributed training, tokenization, loss curves, hyperparameters, checkpointing, GPU clusters, optimization, and debugging training failures. In frontier labs, this role can become very systems-heavy because training large models is an infrastructure problem as much as a modeling problem.

A **data engineer for LLMs** prepares the data that models or retrieval systems depend on. This may include cleaning text, removing duplicates, filtering low-quality content, labeling examples, creating instruction datasets, building evaluation sets, managing document metadata, and enforcing data permissions. This role is crucial because language models and RAG systems often fail because of data problems, not because the model is inherently incapable.

An **evaluation engineer** measures whether a language system works. This may involve benchmark design, human evaluation, automated scoring, rubric creation, adversarial testing, regression tests, factuality checks, retrieval evaluation, toxicity checks, and domain-specific test sets. Evaluation is one of the most important parts of the field because LLM outputs are rarely simple pass-or-fail results.

A **retrieval or search engineer** builds systems that find relevant information for the model or the user. This may involve embeddings, keyword search, hybrid search, reranking, chunking, metadata filters, query rewriting, citations, and permission-aware retrieval. In many enterprise systems, the difference between a useful AI assistant and a misleading one is retrieval quality.

An **inference optimization engineer** makes models run faster and cheaper. This role works on batching, caching, quantization, distillation, model serving, GPU utilization, memory management, speculative decoding, routing between models, and latency. As model use grows, inference cost becomes a major business issue. Faster models and better serving systems can directly determine whether a product is economically viable.

A **safety or alignment engineer** works on reducing harmful, misleading, biased, or unsafe behavior. This may include policy design, red teaming, reward modeling, refusal behavior, monitoring, jailbreak resistance, and safe tool use. This work is especially important when models are used in healthcare, education, finance, law, hiring, security, or public information.

A **computational linguist** brings deeper knowledge of language structure. This role is less common than it used to be in mainstream product teams, but it remains valuable in speech, translation, low-resource languages, grammar tools, language education, annotation design, and evaluation. Many LLM systems work surprisingly well without explicit linguistic engineering, but language expertise still matters when errors are subtle.

A **domain LLM specialist** combines model knowledge with field knowledge. In law, medicine, finance, education, or science, the specialist helps define what counts as correct, which sources matter, what the risks are, and how users actually work. This role is valuable because generic language fluency is not the same as professional correctness.

### What practitioners need to become good at

The first ability is understanding language data. Text is not clean by default. It contains ambiguity, missing context, repetition, outdated information, formatting noise, bias, private information, OCR errors, copied material, and contradictory sources. A language engineer must know that data quality shapes model behavior.

The second ability is evaluation. This field cannot rely on “it sounds good.” A generated answer may be fluent but false. A summary may omit the most important detail. A classifier may work overall but fail for one group of users. A retrieval system may return plausible but irrelevant documents. Practitioners need test sets, rubrics, human review, automated checks, and failure analysis.

The third ability is retrieval judgment. Many useful LLM systems depend on external information. Practitioners need to understand chunking, embeddings, keyword search, hybrid search, reranking, metadata, citations, freshness, and permissions. A model cannot answer well if it receives the wrong evidence.

The fourth ability is model literacy. Practitioners do not always need to train foundation models, but they should understand tokens, context windows, embeddings, attention at a high level, fine-tuning, temperature, sampling, structured output, tool use, and common failure modes. Without this literacy, they can only treat the model as a black box.

The fifth ability is software engineering. LLM systems are still software systems. They need authentication, APIs, databases, queues, logging, testing, deployment, monitoring, rollback, and incident handling. A language model can make the product feel intelligent, but the surrounding engineering determines whether it survives real users.

The sixth ability is cost and latency control. LLM calls can be slow and expensive. A good engineer knows when to use a small model, when to cache, when to batch, when to retrieve less, when to stream output, when to precompute embeddings, and when a rule-based or traditional ML method is enough.

The seventh ability is safety and privacy awareness. Language systems often handle documents, emails, chats, tickets, contracts, code, customer data, or medical and legal information. The system must respect access control, avoid leaking sensitive information, resist prompt injection, and log data carefully. This is especially important when the model can call tools or take actions.

The eighth ability is domain understanding. A general chatbot can sound helpful while being useless to a professional. In legal, medical, financial, educational, or engineering settings, correctness depends on domain standards. A practitioner must know when to involve experts and how to translate expert judgment into evaluation and product behavior.

The ninth ability is skepticism toward easy demos. A small demo can be built quickly. A reliable language system takes much longer. The difference lies in edge cases, data quality, permissions, evaluation, cost, latency, monitoring, and user trust.

### Employment outlook and risks

The opportunity is real, but the field is highly uneven. There is strong demand for AI-related skills, and the broader data-science labor market remains favorable. BLS projects data scientist employment to grow 34% from 2024 to 2034, with about 23,400 openings per year, and notes that data scientists create, validate, test, and update algorithms and models. Software employment also remains strong: BLS projects software developers, QA analysts, and testers to grow 15% over the same period, and cites AI, IoT, robotics, and automation as demand drivers. LLM and NLP engineering sits between these categories: part data science, part software engineering, part infrastructure.

However, there is a sharp difference between levels. Frontier model training and research roles are concentrated in a small number of labs and well-funded companies. They often require advanced degrees, strong publications, deep systems experience, or exceptional practical work. There are far more jobs in applied LLM engineering, RAG systems, AI evaluation, AI product integration, domain adaptation, and inference infrastructure.

Entry-level competition is high because many candidates can now build AI demos. A chatbot over documents is no longer enough. A strong portfolio should show evidence quality, evaluation, permissions, failure cases, latency, cost, monitoring, and clear product reasoning. It should also explain what the system cannot do. In this field, honesty about failure is a professional strength.

The role of “prompt engineer” is especially unstable. Prompting matters, but prompt writing alone is unlikely to remain a strong standalone career path in most organizations. The durable skill is broader: model behavior, evaluation, retrieval, structured output, tool use, domain judgment, and product integration. As tools improve, shallow prompting becomes less valuable.

The field is also affected by AI itself. Generative AI can help write code, create test cases, draft prompts, summarize papers, and inspect logs. But it also makes it easier to produce shallow work. Stack Overflow’s 2025 survey shows widespread AI-tool adoption among developers, but also limited trust: many developers distrust AI output, and only a small share highly trust it. LLM engineers must be more skeptical than ordinary users because they are building the systems that others will trust.

The long-term defensible positions are those tied to hard production problems: evaluation, data quality, retrieval, model serving, inference cost, safety, privacy, domain expertise, and workflow integration. The most exposed positions are those built around thin wrappers, generic chatbots, and surface-level prompt work. The field rewards people who can turn language-model ability into reliable systems, not people who only know how to ask a model to produce something impressive.

### Additional Resources for This Field


| Resource                                                | Best for                                      | What it helps with                                                                                  |
| ------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| The Illustrated Transformer / The Annotated Transformer | Learners needing intuition                    | Understanding attention and transformer architecture without starting from dense papers.            |
| BEIR / MTEB Benchmarks                                  | Retrieval and embedding engineers             | Evaluating retrieval systems and embedding models across tasks.                                     |
| TensorRT-LLM / llama.cpp documentation | Inference optimization learners               | Model serving, batching, quantization, GPU use, local inference, and latency reduction.             |
| Papers with Code / arXiv Sanity | Learners following research                   | Finding papers, implementations, and current NLP/LLM research directions.                           |

# 中文

LLM 和 NLP 工程，是构建处理语言的系统的工作。这些系统可能会阅读文档、回答问题、总结对话、翻译文本、分类消息、抽取信息、生成草稿、搜索知识库、编写代码，或在更大的产品中充当助手。

这个领域与 AI 应用开发有重叠，但并不相同。AI 应用开发者通常更关注产品集成：如何把模型连接到工作流中。LLM 和 NLP 工程师则更深入语言数据、模型行为、评估、训练、微调、检索、推理和失败分析。他们不仅会问“我们如何使用模型？”，还会问“模型为什么会这样表现？我们如何衡量它？如何适配它？如何让它对真实使用场景足够可靠？”

这个领域很宽。有些人接近研究和模型训练。有些人构建检索和问答系统。有些人处理评估、安全或对齐。有些人优化推理，让模型运行得更快、更便宜。有些人准备数据、构建基准，或把模型适配到法律、医疗、金融、教育或软件工程领域。共同对象是语言，但具体工作差异很大。

### 这个领域是如何发展起来的

自然语言处理早在大型语言模型之前就已经存在。早期系统常常使用规则、词典、语法或人工构造的特征。垃圾邮件过滤器可能会查找某些词。语法检查器可能使用关于句子结构的规则。搜索引擎可能高度依赖关键词匹配。这些系统在狭窄场景中可以工作，但很脆弱，因为人类语言充满歧义、上下文、俚语、缺失信息和例外。

统计 NLP 通过使用数据，而不只是规则，改变了这个领域。系统从样本中学习：翻译句对、标注文档、语音转录、搜索点击或标注文本。这让 NLP 更灵活。后来，词嵌入把词表示为向量，使模型能够捕捉词语和短语之间的相似性。深度学习随后改进了语音识别、翻译、情感分析、问答和文本分类。

2017 年提出的 Transformer 架构再次改变了这个领域。它让模型能够更有效地处理文本中的长距离关系，并能随着大规模数据集和算力扩展。BERT 等模型展示了先在大规模文本语料上预训练，再适配到特定任务的价值。GPT 风格模型进一步推进了这一点，它们能够生成流畅文本，并通过提示完成许多任务。

广泛可用的聊天式模型发布后，NLP 的公众形象发生了变化。语言系统不再只是隐藏在搜索、翻译和分类工具内部。它们变成了普通用户可以直接对话的产品。这创造了新的工程问题：幻觉、提示注入、数据隐私、检索质量、安全过滤、评估、工具使用、延迟和成本。

到 2025 年，AI 采用已经变得广泛，但规模化仍然困难。麦肯锡 2025 年全球调查报告称，近九成受访者表示其组织经常使用 AI，62% 表示其组织至少正在尝试 AI 智能体，但近三分之二尚未开始在企业范围内扩展 AI。该报告还强调，工作流重设计是从 AI 中获得价值的关键部分。这对 LLM 和 NLP 工程很重要，因为语言模型并不会仅仅因为存在就变得有用。它们必须被塑造、评估、连接到数据，并被放进人们真实从事的工作中。

### 这个行业如何运作

LLM 和 NLP 行业有几个层次。

最上层是模型实验室和前沿 AI 公司。这些组织训练或开发大型基础模型。它们的工作涉及海量数据集、分布式训练、模型架构、基于人类反馈的强化学习或相关对齐方法、评估、安全研究、推理基础设施和产品部署。这一层的岗位竞争激烈，通常要求很强的研究能力、系统能力，或两者兼具。

第二层是构建模型平台和基础设施的公司。它们可能提供 API、模型托管、微调工具、向量搜索、评估平台、提示管理、推理优化、监控、护栏或智能体框架。这些公司服务其他开发者和企业。它们的工作比普通应用开发更技术化，因为客户正在构建生产级 AI 系统，需要可靠性、可观测性、成本控制和安全性。

第三层是把 LLM 功能加入现有产品的产品公司。搜索引擎、办公工具、编码工具、客服系统、法律软件、分析产品、学习平台、设计工具和开发者平台，都以不同方式使用语言模型。这些团队不一定自己训练模型。它们通常选择模型、准备数据、构建检索系统、设计用户交互、评估质量并管理风险。

第四层是内部采用 LLM 的企业。银行、医院、律所、保险公司、制造商、零售商、大学和政府，可能想要文档搜索、摘要、客服、政策辅助、合规、报告、翻译或内部知识管理系统。在这些环境中，最难的问题通常不是模型架构，而是数据权限、隐私、旧文档系统、模糊工作流、法律风险和员工采纳。

第五层是领域专用 AI 公司。这些公司为某一个领域构建语言系统：法律研究、医学文书、金融分析、教育、软件工程、科学文献、销售、招聘或客服。在这里，领域知识很重要。通用模型可能很流畅，但产品必须理解什么算正确答案，什么是不可接受的错误，什么是有用引用，什么是有风险的建议。

### 不同角色分别贡献什么

**NLP 工程师**处理分析或生成语言的系统。这可能包括分类、抽取、搜索、摘要、翻译、问答、实体识别、内容审核或对话系统。在较旧的环境中，NLP 工程师可能仍然使用传统机器学习和任务专用模型。在较新的环境中，他们通常使用大型语言模型、嵌入、微调和检索。

**LLM 工程师**围绕大型语言模型构建系统。这个角色可能涉及提示、结构化输出、工具使用、检索、微调、模型选择、延迟控制、失败分析和评估。薄弱的 LLM 工程师只是不断尝试提示，直到某些东西看起来能工作。强的工程师能够解释系统为什么失败，设计测试，改进数据，比较模型，并让系统更安全、更可预测。

**模型训练工程师**处理模型训练或微调。这个角色可能涉及数据准备、分布式训练、分词、损失曲线、超参数、检查点、GPU 集群、优化和训练故障调试。在前沿实验室中，这个角色可能非常偏系统，因为训练大型模型既是建模问题，也是基础设施问题。

**LLM 数据工程师**准备模型或检索系统依赖的数据。这可能包括清洗文本、去重、过滤低质量内容、标注样本、创建指令数据集、构建评估集、管理文档元数据，以及执行数据权限。这个角色很关键，因为语言模型和 RAG 系统常常不是因为模型本身没有能力而失败，而是因为数据问题而失败。

**评估工程师**衡量语言系统是否有效。这可能涉及基准设计、人工评估、自动评分、评分标准创建、对抗测试、回归测试、事实性检查、检索评估、毒性检查和领域专用测试集。评估是该领域最重要的部分之一，因为 LLM 输出很少是简单的通过或失败结果。

**检索或搜索工程师**构建为模型或用户寻找相关信息的系统。这可能涉及嵌入、关键词搜索、混合搜索、重排序、切分、元数据过滤、查询改写、引用和权限感知检索。在许多企业系统中，一个有用的 AI 助手和一个误导性助手之间的差别，往往就是检索质量。

**推理优化工程师**让模型运行得更快、更便宜。这个角色处理批处理、缓存、量化、蒸馏、模型服务、GPU 利用率、内存管理、推测解码、模型路由和延迟。随着模型使用增长，推理成本会变成重大商业问题。更快的模型和更好的服务系统，可能直接决定一个产品在经济上是否可行。

**安全或对齐工程师**处理减少有害、误导、有偏或不安全行为的问题。这可能包括政策设计、红队测试、奖励建模、拒答行为、监控、越狱抵抗和安全工具使用。当模型用于医疗、教育、金融、法律、招聘、安全或公共信息时，这项工作尤其重要。

**计算语言学家**带来对语言结构的更深理解。这个角色在主流产品团队中不如过去常见，但在语音、翻译、低资源语言、语法工具、语言教育、标注设计和评估中仍然有价值。许多 LLM 系统在没有显式语言学工程的情况下也能出人意料地工作良好，但当错误很细微时，语言专业知识仍然重要。

**领域 LLM 专家**把模型知识与领域知识结合起来。在法律、医学、金融、教育或科学中，专家帮助定义什么算正确，哪些来源重要，风险是什么，以及用户实际如何工作。这个角色有价值，因为通用语言流畅性并不等于专业正确性。

### 从业者需要变得擅长什么

第一项能力是理解语言数据。文本默认并不干净。它包含歧义、缺失上下文、重复、过时信息、格式噪音、偏差、私人信息、OCR 错误、复制材料和相互矛盾的来源。语言工程师必须知道，数据质量会塑造模型行为。

第二项能力是评估。这个领域不能依赖“听起来不错”。生成答案可能流畅但错误。摘要可能漏掉最重要的细节。分类器可能总体表现良好，却对某一类用户失败。检索系统可能返回看似合理但不相关的文档。从业者需要测试集、评分标准、人工审查、自动检查和失败分析。

第三项能力是检索判断。许多有用的 LLM 系统依赖外部信息。从业者需要理解切分、嵌入、关键词搜索、混合搜索、重排序、元数据、引用、新鲜度和权限。如果模型收到错误证据，就无法很好地回答。

第四项能力是模型素养。从业者不一定需要训练基础模型，但应该理解 token、上下文窗口、嵌入、注意力的高层概念、微调、temperature、采样、结构化输出、工具使用和常见失败模式。没有这种素养，他们只能把模型当作黑箱。

第五项能力是软件工程。LLM 系统仍然是软件系统。它们需要认证、API、数据库、队列、日志、测试、部署、监控、回滚和事件处理。语言模型可以让产品显得智能，但周围的工程决定了它能否经受真实用户使用。

第六项能力是成本和延迟控制。LLM 调用可能很慢，也可能很贵。好的工程师知道什么时候使用小模型，什么时候缓存，什么时候批处理，什么时候减少检索，什么时候流式输出，什么时候预计算嵌入，以及什么时候基于规则或传统机器学习方法已经足够。

第七项能力是安全和隐私意识。语言系统经常处理文档、邮件、聊天、工单、合同、代码、客户数据，或医疗和法律信息。系统必须尊重访问控制，避免泄露敏感信息，抵抗提示注入，并谨慎记录数据。当模型能够调用工具或采取行动时，这一点尤其重要。

第八项能力是领域理解。一个通用聊天机器人可以听起来有帮助，却对专业人士毫无用处。在法律、医学、金融、教育或工程场景中，正确性取决于领域标准。从业者必须知道什么时候让专家参与，以及如何把专家判断转化为评估和产品行为。

第九项能力是怀疑简单演示。一个小演示可以很快建成。一个可靠的语言系统需要更长时间。差别在于边界情况、数据质量、权限、评估、成本、延迟、监控和用户信任。

### 就业前景与风险

机会是真实的，但这个领域高度不均衡。AI 相关技能有强需求，更广泛的数据科学劳动力市场也保持有利。美国劳工统计局预计，2024 至 2034 年，数据科学家就业将增长 34%，每年约有 23,400 个职位空缺，并指出数据科学家会创建、验证、测试和更新算法与模型。软件就业也保持强劲：美国劳工统计局预计，同期软件开发者、QA 分析师和测试人员将增长 15%，并将 AI、IoT、机器人和自动化列为需求驱动因素。LLM 和 NLP 工程位于这些类别之间：部分是数据科学，部分是软件工程，部分是基础设施。

但是，不同层级之间存在明显差异。前沿模型训练和研究岗位集中在少数实验室和资金充足的公司中。它们通常要求高级学位、强论文成果、深厚系统经验，或异常出色的实践工作。应用型 LLM 工程、RAG 系统、AI 评估、AI 产品集成、领域适配和推理基础设施的岗位要多得多。

入门级竞争很高，因为现在许多候选人都能构建 AI 演示。一个基于文档的聊天机器人已经不够了。强作品集应该展示证据质量、评估、权限、失败案例、延迟、成本、监控和清晰产品推理。它也应该解释系统不能做什么。在这个领域，对失败保持诚实是一种专业优势。

“提示工程师”这个角色尤其不稳定。提示很重要，但在大多数组织中，仅仅写提示词不太可能长期成为强独立职业路径。持久技能更宽：模型行为、评估、检索、结构化输出、工具使用、领域判断和产品集成。随着工具改进，浅层提示能力会变得不那么有价值。

这个领域也会受到 AI 本身影响。生成式 AI 可以帮助写代码、创建测试案例、起草提示、总结论文和检查日志。但它也让浅层工作更容易被生产出来。Stack Overflow 2025 年调查显示，开发者广泛采用 AI 工具，但信任度有限：许多开发者不信任 AI 输出，只有很小比例高度信任它。LLM 工程师必须比普通用户更怀疑，因为他们正在构建别人会信任的系统。

长期具备防御性的岗位，是那些与困难生产问题绑定的岗位：评估、数据质量、检索、模型服务、推理成本、安全、隐私、领域专业知识和工作流集成。最暴露在风险中的岗位，是那些围绕薄层封装、通用聊天机器人和表层提示工作建立起来的岗位。这个领域奖励的是能够把语言模型能力转化为可靠系统的人，而不是只知道如何让模型生成一些看起来惊艳内容的人。

### 该领域的补充资源

| 资源                                                      | 最适合谁       | 它能帮助什么                                  |
| ------------------------------------------------------- | ---------- | --------------------------------------- |
| The Illustrated Transformer / The Annotated Transformer | 需要直觉理解的学习者 | 在不一开始就阅读密集论文的情况下，理解注意力和 Transformer 架构。 |
| BEIR / MTEB Benchmarks                                  | 检索和嵌入工程师   | 跨任务评估检索系统和嵌入模型。                         |
| TensorRT-LLM / llama.cpp documentation                  | 推理优化学习者    | 模型服务、批处理、量化、GPU 使用、本地推理和降低延迟。           |
| Papers with Code / arXiv Sanity                         | 跟踪研究的学习者   | 查找论文、实现和当前 NLP / LLM 研究方向。              |
