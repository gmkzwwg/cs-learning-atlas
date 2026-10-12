---
title: "Data Analysis and Business Intelligence"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Data analysis is the work of helping people make better decisions from data. A data analyst does not simply “look at numbers.” The job is to understand a question, find the relevant data, clean it, check whether it can be trusted, analyze it, and explain what should be done next.

In many companies, data analysis sits between business, product, operations, marketing, and engineering. A product team may ask why user retention dropped. A marketing team may ask which channel brings valuable customers. A finance team may ask where costs increased. An operations team may ask why delivery times became slower. A data analyst turns these vague questions into measurable problems.

This field is less about building new software systems and more about making existing activity visible. It gives organizations a way to see what is happening, whether a change worked, where a problem begins, and which decision is likely to matter.

### How the field developed

Organizations have always counted things: sales, inventory, costs, customers, production, traffic, errors, and profit. What changed was the amount of data and the speed at which it could be collected. Before modern databases and analytics tools, reports were slow, manual, and often disconnected from daily decisions. Managers might receive monthly or quarterly summaries long after the events had happened.

The rise of databases, spreadsheets, and business intelligence tools made regular reporting much easier. Companies could collect transactional data, build dashboards, and track performance over time. This created the first common form of modern data analysis: reporting. A report answers questions like: How many users did we have this week? What was revenue by region? Which products sold best? What was the conversion rate?

The internet made analysis more detailed. Websites and apps could track clicks, sessions, searches, purchases, signups, cancellations, and user paths. Product teams could observe how people actually used software. Marketing teams could compare campaigns. Growth teams could test onboarding flows, pricing pages, recommendation modules, and notification strategies. Data analysis became part of product development rather than a separate reporting function.

A/B testing changed the field again. Instead of arguing abstractly about which version is better, teams could show different versions to different groups and measure the result. This made experimentation central to many internet companies. A good analyst in this environment does not only report what happened; they help design experiments, choose metrics, avoid misleading conclusions, and explain tradeoffs.

Today, the field is being reshaped by automation and AI. Dashboards are easier to build, SQL can be drafted by AI tools, and many BI platforms now include natural-language querying. This reduces the value of simple reporting. But it increases the value of analysts who can ask better questions, detect bad data, interpret results carefully, understand business context, and prevent teams from making confident but wrong decisions.

### How the industry works

Data analysis appears in many kinds of organizations.

In large technology companies, analysts are often embedded in product, growth, marketplace, ads, trust and safety, operations, or finance teams. They work with product managers, engineers, designers, researchers, and leadership. Their work may include dashboard design, metric definitions, experiment analysis, funnel analysis, cohort analysis, user segmentation, forecasting, and decision support. In mature teams, analysts often become guardians of metric quality: they make sure people are not optimizing a number that no longer means what they think it means.

In startups, analysts may be generalists. One person may own dashboards, investor metrics, product analysis, marketing attribution, customer reporting, and ad hoc questions from founders. This can build broad experience quickly, but it also creates risk: if the data pipeline is weak, the analyst may spend more time cleaning and fixing data than doing analysis.

In traditional businesses, analysts often work closer to operations and finance. Retailers analyze inventory, pricing, store performance, and customer behavior. Logistics companies analyze delivery times, routing, delays, and capacity. Banks analyze risk, fraud, customer value, and compliance. Healthcare organizations analyze patient flow, staffing, claims, and outcomes. The tools may be less fashionable than in technology companies, but the decisions can be important.

In marketing and growth teams, analysts focus on acquisition, conversion, retention, activation, churn, and lifetime value. They help decide which channels are worth spending money on, which users return, which campaigns are ineffective, and which product changes improve business outcomes. This work requires caution because marketing data is often messy: attribution can be unclear, channels overlap, user privacy rules limit tracking, and short-term metrics can conflict with long-term value.

In BI teams, the work is more about shared visibility. BI analysts and developers build dashboards, define metrics, maintain reporting layers, and support self-service analysis for the organization. Good BI work reduces repeated manual reporting. Bad BI work creates a dashboard graveyard: many charts, unclear definitions, no ownership, and little trust.

### What different roles contribute

A **data analyst** answers business and product questions with data. The role usually involves SQL, spreadsheets, dashboards, visualization, statistics, and written explanation. A weak analyst can produce charts. A strong analyst can clarify the question, challenge bad assumptions, explain uncertainty, and connect the result to a decision.

A **BI analyst** focuses on recurring reports and dashboards. This role creates shared views of the business: revenue, active users, conversion, retention, costs, support volume, sales pipeline, and operational performance. The value of BI is not simply making charts look good. It is creating stable definitions that different teams can trust.

A **product analyst** studies how users interact with a product. They analyze funnels, feature adoption, retention, user cohorts, activation, churn, and experiments. Product analysts help teams decide whether a feature is working, where users drop off, and what kind of users behave differently. This role requires understanding both data and product behavior.

A **growth analyst** focuses on the path from first contact to long-term value. They may analyze acquisition channels, signup flows, referrals, onboarding, notifications, pricing, and lifecycle campaigns. Growth analysis is often tied to experiments. The risk is metric manipulation: a change may increase one number while harming user trust or long-term retention.

A **marketing analyst** studies campaigns, channels, audiences, and customer acquisition. They may work with ad platforms, attribution tools, CRM systems, web analytics, and sales data. This role requires skepticism because marketing numbers are often affected by tracking limits, duplicated attribution, delayed conversion, and platform-reported metrics that do not always match internal data.

A **business analyst** or **operations analyst** works with business processes rather than only digital products. They may analyze staffing, supply chains, inventory, sales operations, customer support, pricing, or internal workflows. The strongest people in these roles combine data skills with domain knowledge. They understand how the business actually works, not just what the spreadsheet says.

An **experimentation analyst** helps design and evaluate A/B tests. This role defines hypotheses, chooses metrics, estimates sample size, checks randomization, monitors guardrail metrics, and interprets results. The value is preventing false confidence. Many experiments are inconclusive, underpowered, badly measured, or misread.

An **analytics engineer** sits between data analysis and data engineering. This role builds clean data models, maintains transformation logic, documents metrics, and makes data easier for analysts to use. In teams using tools such as dbt, analytics engineers often own the layer between raw warehouse tables and business-facing analysis. This role exists because analysts cannot do good work if the data foundation is messy.

A **data visualization specialist** focuses on communicating data clearly. This does not mean decorating charts. It means choosing the right visual form, reducing confusion, showing comparisons honestly, and making patterns visible. In executive reporting, journalism, public policy, and research communication, visualization can strongly affect how decisions are made.

### What practitioners need to become good at

The first ability is asking the real question. Many requests arrive in a misleading form: “Can you make a dashboard?” “Can you pull this number?” “Can you prove this campaign worked?” A good analyst asks what decision the number is meant to support. If there is no decision, the analysis may become decorative work.

The second ability is SQL. SQL is still the everyday language of business data. An analyst should be comfortable joining tables, filtering, grouping, using window functions, checking duplicates, handling missing values, and understanding why a query result may be wrong. SQL is not just a tool; it is how analysts inspect the structure of organizational reality.

The third ability is metric definition. A metric sounds simple until teams disagree about it. What counts as an active user? Is revenue counted before or after refunds? Does churn mean cancellation, non-renewal, or inactivity? Does conversion count the first purchase or every purchase? Many business conflicts are hidden metric conflicts. Analysts create value by making definitions explicit.

The fourth ability is statistical caution. Analysts do not need to become theoretical statisticians, but they must understand sampling, variance, confidence intervals, statistical significance, selection bias, survivorship bias, correlation versus causation, and regression to the mean. Without this caution, analysis becomes storytelling with numbers.

The fifth ability is experiment reasoning. A/B testing is not just splitting users into two groups. A good experiment needs a hypothesis, a primary metric, guardrail metrics, enough sample size, stable assignment, and a plan for interpretation. Analysts must also know when an experiment is inappropriate, unethical, too slow, or unable to answer the real question.

The sixth ability is visualization and communication. The final output of analysis is often not code or a model. It is a decision. A good analyst explains the result in plain language, shows the evidence, states uncertainty, and makes the tradeoff visible. A technically correct analysis that no one understands has limited value.

The seventh ability is business context. The same number can mean different things in different businesses. A rising cancellation rate may be a serious product problem, a pricing change effect, a seasonal pattern, or a sign that low-quality users are leaving. Analysts who understand the domain can separate meaningful signals from noise.

The eighth ability is data quality judgment. Real data is late, duplicated, incomplete, mislabeled, inconsistent, and sometimes politically shaped. Analysts must check whether tables are trustworthy, whether events are logged correctly, whether definitions changed, whether data is missing for some users, and whether the data source measures what people think it measures.

### Employment outlook and risks

Data analysis has broad demand because most organizations want better decisions from data. But the field is split between low-value reporting work and high-value decision support. The low end is exposed to automation. Dashboards, standard reports, SQL drafts, chart generation, and basic summaries are becoming easier to produce with BI tools and AI. The higher end is more defensible because it depends on judgment: framing questions, designing metrics, understanding business context, identifying bias, and explaining what action should follow.

There is no single official labor category that perfectly matches “data analyst.” Adjacent categories show why the market is mixed. BLS projects employment for [data scientists](https://www.bls.gov/ooh/math/data-scientists.htm) to grow 34% from 2024 to 2034, with about 23,400 openings per year, but data scientist roles usually require stronger programming, statistics, and modeling than many analyst jobs. BLS also projects [operations research analysts](https://www.bls.gov/ooh/math/operations-research-analysts.htm) to grow 21% over the same period, with about 9,600 openings per year; these roles are closer to quantitative decision support and optimization. [Market research analysts](https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm), a much larger occupation with 941,700 jobs in 2024, are projected to grow 7% and have about 87,200 openings per year.

This means the opportunity is real, but not uniform. Business-facing analyst roles may be numerous, but competition is high because the entry tools are accessible. Many people can learn spreadsheets, SQL basics, and dashboard tools. Stronger candidates distinguish themselves through better reasoning, cleaner communication, experiment design, domain knowledge, and the ability to work with messy real data.

Entry-level analysts often face a credibility problem. Employers want people who can answer ambiguous business questions, but beginners usually have clean coursework datasets and pre-defined exercises. A strong portfolio should therefore include messy, realistic projects: defining a metric, cleaning imperfect data, explaining assumptions, analyzing a funnel, designing an experiment, or writing a decision memo. A polished chart alone is not enough.

AI will probably compress routine analyst work. If a manager can ask a BI system “show weekly revenue by region” and receive a usable chart, the value of manual report generation falls. But AI can also make bad analysis easier to produce. It may write a plausible SQL query against the wrong table, ignore metric definitions, confuse correlation with causation, or explain a chart without knowing the business context. Analysts who can verify AI output, inspect assumptions, and correct misleading conclusions will remain valuable.

The long-term defensible analyst is not a dashboard operator. The defensible analyst is someone who understands data, business, statistics, experiments, and communication well enough to improve decisions. The field rewards people who can say not only “here is the number,” but “here is what the number means, here is what it does not prove, here is the risk, and here is what we should do next.”

### Additional Resources for This Field


| Resource                                                        | Best for                                     | What it helps with                                                                        |
| --------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| SQLBolt / Mode SQL Tutorial                                     | Beginners                                    | Learning SQL through practical querying exercises.                                        |
| Khan Academy Statistics and Probability                         | Beginners needing statistics basics          | Probability, distributions, sampling, confidence intervals, and basic inference.          |
| *Practical Statistics for Data Scientists*                      | Analysts moving beyond dashboards            | Statistical concepts used in real data work, explained with practical orientation.        |
| *Storytelling with Data*                                        | Analysts who need communication skills       | Turning analysis into clear charts and explanations for nontechnical audiences.           |
| *Trustworthy Online Controlled Experiments*                     | Product and growth analysts                  | A/B testing, experiment design, metrics, pitfalls, and online experimentation systems.    |
| *Lean Analytics*                                                | Startup and product analysts                 | Choosing useful metrics at different stages of a business.                                |
| Tableau Public / Power BI Learning Paths                        | BI analysts                                  | Building dashboards and learning common BI workflows.                                     |
| Google Analytics Academy / product analytics tool documentation | Marketing and product analysts               | Understanding web and product behavior data, acquisition, conversion, and retention.      |
| *The Visual Display of Quantitative Information*                | Visualization-focused analysts               | A deeper foundation for honest and information-dense data visualization.                  |

# 中文

数据分析，是帮助人们从数据中做出更好决策的工作。数据分析师并不是简单地“看数字”。这项工作的核心是理解问题，找到相关数据，清洗数据，检查数据是否可信，进行分析，并解释下一步应该怎么做。

在许多公司中，数据分析位于业务、产品、运营、市场和工程之间。产品团队可能会问，为什么用户留存下降了。市场团队可能会问，哪个渠道带来了有价值的客户。财务团队可能会问，成本在哪里上升了。运营团队可能会问，为什么配送时间变慢了。数据分析师会把这些模糊问题转化为可衡量的问题。

这个领域更少是在构建新的软件系统，更多是在让既有活动变得可见。它让组织能够看见正在发生什么，某个改变是否有效，问题从哪里开始，以及哪个决策可能真正重要。

### 这个领域是如何发展起来的

组织一直都在计数：销售、库存、成本、客户、生产、流量、错误和利润。真正改变的是数据量，以及数据被收集的速度。在现代数据库和分析工具出现之前，报告制作缓慢、手工化，并且常常与日常决策脱节。管理者可能在事件发生很久之后，才收到月度或季度摘要。

数据库、电子表格和商业智能工具的兴起，让定期报告变得容易得多。公司可以收集交易数据，构建仪表盘，并长期追踪表现。这创造了现代数据分析的第一种常见形式：报告。报告回答的问题包括：这周我们有多少用户？按地区划分的收入是多少？哪些产品卖得最好？转化率是多少？

互联网让分析变得更细致。网站和应用可以追踪点击、会话、搜索、购买、注册、取消和用户路径。产品团队可以观察人们实际如何使用软件。市场团队可以比较不同活动。增长团队可以测试新用户引导流程、定价页面、推荐模块和通知策略。数据分析从一个独立的报告职能，变成了产品开发的一部分。

A/B 测试再次改变了这个领域。团队不再抽象地争论哪个版本更好，而是可以把不同版本展示给不同群体，并衡量结果。这让实验成为许多互联网公司的核心工作。处在这种环境中的优秀分析师，不只是报告发生了什么；他们还会帮助设计实验、选择指标、避免误导性结论，并解释取舍。

今天，这个领域正在被自动化和 AI 重塑。仪表盘更容易构建，SQL 可以由 AI 工具起草，许多 BI 平台现在也包含自然语言查询。这降低了简单报告的价值。但它提高了那些能够提出更好问题、识别坏数据、谨慎解释结果、理解业务背景，并防止团队做出自信但错误决策的分析师的价值。

### 这个行业如何运作

数据分析出现在许多类型的组织中。

在大型科技公司中，分析师通常嵌入在产品、增长、市场、广告、信任与安全、运营或财务团队中。他们与产品经理、工程师、设计师、研究员和管理层合作。他们的工作可能包括仪表盘设计、指标定义、实验分析、漏斗分析、群组分析、用户分群、预测和决策支持。在成熟团队中，分析师往往会成为指标质量的守门人：他们确保人们没有在优化一个已经不再表示他们所理解含义的数字。

在创业公司中，分析师可能是通才。一个人可能负责仪表盘、投资人指标、产品分析、市场归因、客户报告，以及创始人提出的临时问题。这可以很快积累广泛经验，但也有风险：如果数据管道薄弱，分析师可能会花更多时间清洗和修复数据，而不是做分析。

在传统企业中，分析师通常更接近运营和财务。零售商分析库存、定价、门店表现和客户行为。物流公司分析配送时间、路线、延误和运力。银行分析风险、欺诈、客户价值和合规。医疗机构分析患者流动、人员配置、理赔和结果。这些工具可能没有科技公司里那么时髦，但它们支持的决策可能很重要。

在市场和增长团队中，分析师关注获客、转化、留存、激活、流失和生命周期价值。他们帮助判断哪些渠道值得投入资金，哪些用户会回来，哪些活动无效，以及哪些产品变化改善了业务结果。这项工作需要谨慎，因为市场数据常常很混乱：归因可能不清楚，渠道会重叠，用户隐私规则会限制追踪，短期指标也可能与长期价值冲突。

在 BI 团队中，工作更多是关于共享可见性。BI 分析师和开发者构建仪表盘，定义指标，维护报告层，并支持组织中的自助分析。好的 BI 工作会减少重复的手工报告。糟糕的 BI 工作会创造仪表盘坟场：许多图表、模糊定义、无人负责，并且缺乏信任。

### 不同角色分别贡献什么

**数据分析师**用数据回答业务和产品问题。这个角色通常涉及 SQL、电子表格、仪表盘、可视化、统计和书面解释。薄弱的分析师可以产出图表。强的分析师能够澄清问题，挑战错误假设，解释不确定性，并把结果连接到决策。

**BI 分析师**专注于周期性报告和仪表盘。这个角色创建业务的共享视图：收入、活跃用户、转化、留存、成本、支持量、销售管线和运营表现。BI 的价值不只是让图表看起来好看，而是创建不同团队都可以信任的稳定定义。

**产品分析师**研究用户如何与产品互动。他们分析漏斗、功能采用、留存、用户群组、激活、流失和实验。产品分析师帮助团队判断某个功能是否有效、用户在哪里流失，以及哪些类型的用户行为不同。这个角色需要同时理解数据和产品行为。

**增长分析师**关注从首次接触到长期价值的路径。他们可能分析获客渠道、注册流程、推荐、入门引导、通知、定价和生命周期活动。增长分析通常与实验绑定。风险在于指标操纵：某个变化可能提升一个数字，却损害用户信任或长期留存。

**市场分析师**研究营销活动、渠道、受众和客户获取。他们可能使用广告平台、归因工具、CRM 系统、网站分析和销售数据。这个角色需要怀疑精神，因为市场数字经常受到追踪限制、重复归因、延迟转化，以及平台报告指标与内部数据不一致的影响。

**业务分析师**或**运营分析师**处理业务流程，而不只是数字产品。他们可能分析人员配置、供应链、库存、销售运营、客户支持、定价或内部工作流。这些角色中最强的人，会把数据技能和领域知识结合起来。他们理解业务实际如何运转，而不只是电子表格怎么说。

**实验分析师**帮助设计和评估 A/B 测试。这个角色定义假设，选择指标，估算样本量，检查随机分配，监控护栏指标，并解释结果。它的价值在于防止虚假的自信。许多实验要么结论不明确，要么样本不足，要么测量糟糕，要么被误读。

**分析工程师**位于数据分析和数据工程之间。这个角色构建干净的数据模型，维护转换逻辑，记录指标文档，并让数据更容易被分析师使用。在使用 dbt 等工具的团队中，分析工程师通常负责原始数仓表和面向业务分析之间的那一层。这个角色之所以存在，是因为如果数据基础混乱，分析师就无法做好工作。

**数据可视化专家**专注于清楚地传达数据。这并不意味着装饰图表，而是选择正确的视觉形式，减少混乱，诚实地展示比较，并让模式变得可见。在高管报告、新闻、公共政策和研究传播中，可视化会强烈影响决策如何形成。

### 从业者需要变得擅长什么

第一项能力是提出真正的问题。许多请求会以误导形式出现：“能不能做个仪表盘？”“能不能拉一下这个数字？”“能不能证明这个活动有效？”好的分析师会问，这个数字是为了支持什么决策。如果没有决策，分析就可能变成装饰性工作。

第二项能力是 SQL。SQL 仍然是业务数据的日常语言。分析师应该熟悉表连接、筛选、分组、窗口函数、重复值检查、缺失值处理，并理解查询结果为什么可能出错。SQL 不只是工具；它是分析师检查组织现实结构的方式。

第三项能力是指标定义。一个指标听起来简单，直到团队开始对它产生分歧。什么算活跃用户？收入是在退款前还是退款后计算？流失指取消、未续费，还是不活跃？转化是指第一次购买，还是每一次购买？许多业务冲突本质上是隐藏的指标冲突。分析师通过让定义显性化来创造价值。

第四项能力是统计谨慎。分析师不需要成为理论统计学家，但必须理解抽样、方差、置信区间、统计显著性、选择偏差、幸存者偏差、相关与因果，以及均值回归。没有这种谨慎，分析就会变成带数字的讲故事。

第五项能力是实验推理。A/B 测试不只是把用户分成两组。好的实验需要假设、主指标、护栏指标、足够样本量、稳定分配，以及解释结果的计划。分析师也必须知道什么时候实验不合适、不道德、太慢，或无法回答真正的问题。

第六项能力是可视化和沟通。分析的最终输出通常不是代码或模型，而是一个决策。好的分析师用普通语言解释结果，展示证据，说明不确定性，并让取舍变得可见。没人理解的技术正确分析，价值有限。

第七项能力是业务背景。同一个数字在不同业务中可能意味着不同东西。取消率上升可能是严重产品问题，可能是定价变化的影响，可能是季节性模式，也可能意味着低质量用户正在离开。理解领域的分析师能够把有意义的信号和噪音区分开。

第八项能力是数据质量判断。真实数据会迟到、重复、不完整、标注错误、不一致，有时还被组织政治塑造。分析师必须检查表是否可信，事件是否被正确记录，定义是否发生过变化，某些用户的数据是否缺失，以及数据源测量的是否真是人们以为它在测量的东西。

### 就业前景与风险

数据分析有广泛需求，因为大多数组织都希望用数据做出更好的决策。但这个领域分裂为低价值报告工作和高价值决策支持。低端工作暴露在自动化风险下。仪表盘、标准报告、SQL 草稿、图表生成和基础摘要，正随着 BI 工具和 AI 变得更容易生产。高端工作更具防御性，因为它依赖判断：界定问题、设计指标、理解业务背景、识别偏差，并解释接下来应该采取什么行动。

没有一个官方劳动类别能完美对应“数据分析师”。相邻类别显示了为什么这个市场是混合的。美国劳工统计局预计，2024 至 2034 年，数据科学家就业将增长 34%，每年约有 23,400 个职位空缺，但数据科学家角色通常比许多分析师岗位需要更强的编程、统计和建模能力。美国劳工统计局也预计，同期运筹研究分析师就业将增长 21%，每年约有 9,600 个职位空缺；这些角色更接近定量决策支持和优化。市场研究分析师是一个规模大得多的职业，2024 年有 941,700 个岗位，预计增长 7%，每年约有 87,200 个职位空缺。

这意味着机会是真实的，但并不均匀。面向业务的分析师岗位数量可能很多，但竞争很高，因为入门工具容易获得。许多人都能学习电子表格、SQL 基础和仪表盘工具。更强的候选人通过更好的推理、更清楚的沟通、实验设计、领域知识，以及处理混乱真实数据的能力来区分自己。

入门级分析师常常面临可信度问题。雇主希望有人能回答模糊的业务问题，但初学者通常只有干净的课程数据集和预先定义好的练习。因此，强作品集应该包含混乱、现实的项目：定义一个指标，清洗不完美数据，解释假设，分析一个漏斗，设计一个实验，或写一份决策备忘录。仅有精美图表是不够的。

AI 可能会压缩常规分析工作。如果管理者可以直接问 BI 系统“按地区显示每周收入”，并得到可用图表，那么手工报告生成的价值就会下降。但 AI 也会让糟糕分析更容易被生产出来。它可能针对错误表写出看似合理的 SQL 查询，忽略指标定义，把相关性误认为因果，或在不了解业务背景的情况下解释图表。能够验证 AI 输出、检查假设，并纠正误导性结论的分析师，仍然会有价值。

长期具备防御性的分析师，不是仪表盘操作员。具备防御性的分析师，是足够理解数据、业务、统计、实验和沟通，从而能够改进决策的人。这个领域奖励的不只是会说“这是数字”的人，而是能说“这个数字意味着什么，它不能证明什么，风险是什么，以及下一步我们应该做什么”的人。

### 该领域的补充资源

| 资源                                                              | 最适合谁       | 它能帮助什么                    |
| --------------------------------------------------------------- | ---------- | ------------------------- |
| SQLBolt / Mode SQL Tutorial                                     | 初学者        | 通过实际查询练习学习 SQL。           |
| Khan Academy Statistics and Probability                         | 需要统计基础的初学者 | 概率、分布、抽样、置信区间和基础推断。       |
| *Practical Statistics for Data Scientists*                      | 想超越仪表盘的分析师 | 用实践导向解释真实数据工作中使用的统计概念。    |
| *Storytelling with Data*                                        | 需要沟通能力的分析师 | 把分析转化为面向非技术受众的清晰图表和解释。    |
| *Trustworthy Online Controlled Experiments*                     | 产品和增长分析师   | A/B 测试、实验设计、指标、陷阱和在线实验系统。 |
| *Lean Analytics*                                                | 创业公司和产品分析师 | 在业务不同阶段选择有用指标。            |
| Tableau Public / Power BI Learning Paths                        | BI 分析师     | 构建仪表盘，学习常见 BI 工作流。        |
| Google Analytics Academy / product analytics tool documentation | 市场和产品分析师   | 理解 Web 和产品行为数据、获客、转化和留存。  |
| *The Visual Display of Quantitative Information*                | 专注可视化的分析师  | 为诚实且信息密集的数据可视化建立更深基础。     |

