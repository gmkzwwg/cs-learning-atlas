---
title: "Data Engineering and Platforms"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Data engineering is the work of making data usable before anyone analyzes it. A company may collect millions of events, transactions, logs, messages, payments, clicks, sensor readings, and customer records. But raw data is usually messy. It may arrive late, appear twice, use inconsistent names, miss important fields, or live in systems that do not talk to one another.

A data engineer builds the systems that collect, move, clean, organize, store, document, and deliver this data. Analysts, data scientists, machine learning engineers, product teams, finance teams, and operations teams all depend on that work. If the data foundation is weak, every dashboard, report, model, and AI product built on top of it becomes unreliable.

Data analysis asks, “What does the data tell us?” Data engineering asks, “Can the data be trusted, found, processed, and used at all?”

### How the field developed

Data engineering grew out of several older kinds of work: database administration, data warehousing, ETL development, business intelligence, backend systems, and large-scale distributed computing.

Early business data lived in operational databases. These systems were built to run the business: record orders, store customer accounts, process payments, track inventory, or manage employees. They were not always good for analysis. A database optimized for transactions may not be efficient for large reports. A customer table used by one application may not match the customer table used by another. Companies needed a separate place where data from many systems could be brought together and queried for reporting. This produced the data warehouse.

ETL became the common pattern: extract data from source systems, transform it into a consistent structure, and load it into a warehouse. This work was often slow, batch-oriented, and hidden from the rest of the organization. If a report was wrong, the cause might be in the source system, the extraction process, the transformation logic, the warehouse schema, or the dashboard. Data engineering emerged because this hidden work became too important to treat as a side task.

The internet made the problem larger. Websites and apps produced clickstreams, logs, search records, recommendation events, ads data, experiment data, and user behavior data at a scale that traditional warehouses could not always handle. Hadoop, Spark, distributed storage, and cloud computing changed how companies processed large datasets. Later, cloud data warehouses such as BigQuery, Snowflake, and Redshift made it easier to store and query large data without running all infrastructure manually.

The field then split into several styles. Some teams focused on batch pipelines: daily or hourly jobs that process large volumes of data. Others focused on streaming: events processed within seconds or minutes. Some teams built centralized data platforms. Others moved toward “analytics engineering,” where analysts and engineers use software engineering practices to maintain clean transformation layers in tools such as dbt. Airflow, originally created at Airbnb and later developed under the Apache Software Foundation, became one of the common tools for authoring, scheduling, and monitoring data workflows. 

AI has made data engineering more visible. Many organizations want to build AI products, but AI systems need reliable data: training data, evaluation data, retrieval data, metadata, permissions, logs, and monitoring signals. Poor data quality can make an AI project fail even when the model is strong. Recent industry reporting based on MIT Technology Review and Snowflake research found that many business leaders now see data engineers as critical to organizational success, especially as AI increases the need for usable and governed data.

### How the industry works

Data engineering differs across organizations.

In large technology companies, data engineering is often a platform function. Teams build shared pipelines, event systems, data warehouses, feature stores, governance tools, catalog systems, and quality checks. Other teams depend on them. A product analyst cannot analyze retention if user events are missing. A machine learning engineer cannot train a recommendation model if item and user features are inconsistent. A finance team cannot close the books if revenue data does not reconcile.

In smaller companies, data engineering may be done by backend engineers, analysts, or one generalist data person. This can work at first, but problems appear as the business grows. Dashboards disagree. Metrics change without documentation. Tables become impossible to understand. Every team creates its own version of “active user,” “revenue,” or “customer.” At that point, the company needs stronger data modeling, ownership, and pipeline discipline.

In traditional enterprises, data engineering often has to connect old systems with new platforms. A bank, hospital, retailer, logistics company, or manufacturer may have decades of databases, vendor tools, spreadsheets, file exports, and compliance requirements. The work is not always technically fashionable, but it is often difficult. The data may be sensitive, regulated, duplicated, and politically contested. Moving it safely requires more than writing scripts.

In AI-focused companies, data engineering may be closer to model development. Teams need datasets for training, fine-tuning, evaluation, feedback loops, retrieval systems, labeling workflows, and monitoring. The boundary between data engineer, machine learning engineer, and platform engineer can become blurry. In this environment, data engineering is no longer just “supporting analytics”; it becomes part of the AI product itself.

Consulting and outsourcing firms also do data engineering work. They may migrate companies to cloud warehouses, build data lakes, implement BI platforms, clean up pipelines, or modernize reporting systems. This can expose practitioners to many industries, but it may also mean working within client constraints: old systems, unclear ownership, political disagreements, and short project timelines.

### What different roles contribute

A **data engineer** builds and maintains data pipelines. This role moves data from source systems into warehouses, lakes, or platforms where others can use it. The work may involve SQL, Python, Spark, Airflow, Kafka, cloud storage, orchestration tools, APIs, and monitoring. A weak data engineer makes a pipeline that works once. A strong data engineer makes a pipeline that is reliable, observable, documented, recoverable, and understandable to the people who depend on it.

A **data warehouse engineer** focuses on organizing data for analysis. This role designs schemas, fact tables, dimension tables, marts, partitions, transformations, and query patterns. The value is making business data easier to use. A good warehouse engineer understands both technical performance and business definitions.

An **analytics engineer** sits between data engineering and data analysis. This role often works in SQL and tools such as dbt, turning raw warehouse tables into clean, tested, documented models for analysts and business users. The value is reducing chaos in the middle layer: instead of every analyst writing their own fragile query, the organization gets shared, reusable, version-controlled data models.

A **data platform engineer** builds the infrastructure that other data workers use. This may include orchestration systems, data catalogs, permissions, lineage tracking, quality checks, CI/CD for data transformations, compute environments, and cost monitoring. In large companies, platform engineers prevent every team from reinventing the same data tooling badly.

A **streaming data engineer** works with real-time or near-real-time data. This may involve Kafka, Flink, Pulsar, Spark Structured Streaming, event schemas, message ordering, late-arriving data, backpressure, exactly-once or at-least-once processing, and operational monitoring. This role matters when data must be acted on quickly: fraud detection, recommendations, observability, logistics, trading, ads, IoT, or live product personalization.

A **data quality engineer** focuses on whether data is complete, correct, timely, and consistent. This role creates checks, alerts, validation rules, reconciliation processes, and data contracts. The value is trust. A dashboard that looks polished but uses broken data is worse than no dashboard because it creates false confidence.

A **data governance specialist** or **data steward** focuses on ownership, access, privacy, definitions, retention, lineage, and compliance. This is especially important in healthcare, finance, education, government, and large enterprises. Governance can sound bureaucratic, but without it, sensitive data spreads into uncontrolled tables, permissions become unclear, and no one knows which dataset is authoritative.

A **database administrator** or **database architect** may overlap with data engineering, but the focus is different. DBAs keep database systems secure, backed up, available, and efficient. Database architects design systems for storing and organizing data. BLS describes database administrators and architects as workers who create or organize systems to store and secure data, keep data available to authorized users, back up and restore data, manage permissions, and improve performance.

A **machine learning data engineer** supports ML and AI workflows. This role prepares training datasets, feature pipelines, evaluation data, feedback logs, retrieval indexes, and monitoring data. It requires understanding how data errors affect models. A mislabeled field, a data leak, a biased sample, or a delayed feature can quietly damage a model.

### What practitioners need to become good at

The first ability is SQL. Data engineering uses many tools, but SQL remains central. A data engineer should understand joins, grouping, window functions, transactions, indexes, partitions, query plans, and performance. SQL is also a shared language with analysts, data scientists, and many business users.

The second ability is data modeling. Data must be organized so that other people can understand and use it. A good model makes common questions easy to answer and hard to misinterpret. A bad model creates confusion for years. Data engineers need to understand normalized models, dimensional modeling, fact and dimension tables, event modeling, slowly changing dimensions, and when to denormalize for analytical use.

The third ability is pipeline reliability. A pipeline is not finished when it runs successfully once. Real pipelines fail because source systems change, network calls timeout, files arrive late, schemas drift, jobs overlap, credentials expire, partitions are missing, or upstream data is wrong. A strong data engineer builds retries, alerts, backfills, idempotent jobs, logging, tests, and clear ownership.

The fourth ability is understanding batch and streaming tradeoffs. Batch processing is simpler and often cheaper. Streaming is faster but more operationally difficult. Not every business problem needs real-time data. A good engineer can ask whether freshness actually matters, how late data should be handled, and what cost the organization is willing to pay for speed.

The fifth ability is data quality judgment. Data quality is not just a technical issue. It is often an organizational issue. Who owns this field? Who changed this event name? Why does finance revenue differ from product revenue? Which table should be trusted? A data engineer must trace problems across systems and teams, not only across code.

The sixth ability is cloud and cost awareness. Modern data engineering often runs on cloud warehouses, object storage, managed Spark, serverless jobs, or containerized workloads. These systems scale easily, which also means they can waste money easily. Inefficient queries, unnecessary recomputation, oversized clusters, and uncontrolled storage can become expensive. Cloud data work requires cost discipline.

The seventh ability is communication. Data engineers support many users who do not know how the pipelines work. They need to document tables, explain delays, warn about breaking changes, negotiate event definitions, and tell analysts when data is not reliable. The best data engineers are not just pipeline builders; they are maintainers of organizational trust in data.

The eighth ability is software engineering discipline. Data pipelines are software. They need version control, tests, code review, deployment processes, monitoring, documentation, and incident response. Many data systems become fragile because teams treat transformations as throwaway scripts instead of production code.

### Employment outlook and risks

Data engineering has strong long-term relevance because data volume, AI adoption, cloud migration, and business analytics all depend on reliable data infrastructure. But the job title “data engineer” does not map neatly onto one official labor category, so labor-market data must be read through adjacent roles.

BLS projects employment for database administrators and architects to grow 4% from 2024 to 2034 overall, with about 7,800 openings per year. The split is important: database architects are projected to grow 9%, while database administrators are projected to decline 1%. BLS explains that demand for database architects is supported by the need for quality data infrastructure, including AI-related adoption, while demand for administrators may be limited as cloud platforms allow fewer administrators to serve more companies. This distinction fits the broader data engineering market: routine administration is more exposed to automation and cloud platforms, while architecture, modeling, infrastructure, and governance remain valuable.

Data scientists are projected to grow much faster: BLS projects 34% growth from 2024 to 2034 and about 23,400 openings per year. Data engineering is not the same as data science, but the growth of data science increases demand for usable datasets, feature pipelines, warehouses, governance, and platform infrastructure. Models do not train themselves on clean, well-documented, permission-safe data.

Entry-level data engineering can be difficult because real work depends on production systems. A beginner can practice SQL and build toy pipelines, but companies often want someone who understands scheduling, monitoring, cloud storage, permissions, schema changes, and failure recovery. This makes internships, realistic projects, and open-source or work-like experience especially important.

Automation will reduce some parts of the job. Managed warehouses reduce manual database administration. ELT tools reduce custom ingestion work. AI can draft SQL, generate pipeline code, write documentation, and suggest transformations. But automation also creates new needs: someone must decide which data is authoritative, how transformations should be tested, how sensitive data is governed, how cost is controlled, and whether AI-generated transformations are correct.

The biggest risk in this field is becoming a tool operator. A person who only knows “Airflow plus dbt plus Snowflake” at the surface may struggle when tools change. The defensible data engineer understands the underlying problems: movement, storage, schema, lineage, freshness, quality, permissions, cost, reliability, and user trust. Tools change; those problems remain.

AI increases the importance of this field rather than replacing it. Many AI projects fail not because the model is impossible, but because the data is not ready: missing, inconsistent, private, ungoverned, biased, undocumented, or disconnected from the product. Data engineers who can make data usable for analytics and AI will remain important. Data engineers who only write brittle pipelines without understanding data quality and business use will be more exposed.

### Additional Resources for This Field


| Resource                                                       | Best for                                                 | What it helps with                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| *The Data Warehouse Toolkit*                                   | Data warehouse and BI engineers                          | Dimensional modeling, fact tables, dimension tables, and business-friendly analytical schemas.                          |
| Apache Airflow Documentation                                   | Data engineers building scheduled pipelines              | Workflow orchestration, DAGs, scheduling, retries, dependencies, and operational pipeline management.                   |
| Kafka Documentation | Streaming data engineers                                 | Event streaming, topics, partitions, consumers, producers, and streaming architecture.                                  |
| Spark Documentation                                            | Data engineers working with large-scale batch processing | Distributed data processing, DataFrames, SQL, jobs, partitions, and performance tuning.                                 |
| Google Cloud BigQuery / Snowflake / AWS Redshift Documentation | Cloud data warehouse learners                            | Cloud warehouse concepts, storage-compute separation, query optimization, permissions, and cost management.             |
| Soda data quality documentation | Data quality-focused practitioners                       | Testing assumptions about data, validating tables, and catching pipeline errors before users do.                        |
| OpenLineage / DataHub / Amundsen                               | Data platform and governance learners                    | Metadata, lineage, discovery, ownership, and data catalog concepts.                                                     |

# 中文

数据工程，是在任何人分析数据之前，让数据变得可用的工作。一家公司可能会收集数百万条事件、交易、日志、消息、支付记录、点击、传感器读数和客户记录。但原始数据通常很混乱。它可能迟到，重复出现，使用不一致的命名，缺少重要字段，或者存在于彼此无法沟通的系统中。

数据工程师构建用于收集、移动、清洗、组织、存储、记录和交付这些数据的系统。分析师、数据科学家、机器学习工程师、产品团队、财务团队和运营团队都依赖这项工作。如果数据基础薄弱，那么建立在它之上的每一个仪表盘、报告、模型和 AI 产品都会变得不可靠。

数据分析问的是：“数据告诉了我们什么？”数据工程问的是：“数据是否可信、能否被找到、处理和使用？”

### 这个领域是如何发展起来的

数据工程源自几类更早的工作：数据库管理、数据仓库、ETL 开发、商业智能、后端系统和大规模分布式计算。

早期商业数据存在于运营数据库中。这些系统是为了运行业务而构建的：记录订单、存储客户账户、处理支付、追踪库存或管理员工。它们并不总是适合分析。为交易优化的数据库，可能不适合大型报表。某个应用使用的客户表，可能与另一个应用使用的客户表并不一致。公司需要一个独立位置，把来自多个系统的数据汇集起来，并用于报表查询。数据仓库由此产生。

ETL 成为常见模式：从源系统抽取数据，把它转换成一致结构，然后加载到数据仓库。这项工作通常缓慢、批处理导向，并且对组织其他部分不可见。如果一份报告出错，原因可能在源系统、抽取过程、转换逻辑、仓库结构，或仪表盘中。数据工程之所以出现，是因为这类隐藏工作变得太重要，不能再被当成附带任务处理。

互联网让问题变得更大。网站和应用产生点击流、日志、搜索记录、推荐事件、广告数据、实验数据和用户行为数据，其规模是传统数据仓库不一定能处理的。Hadoop、Spark、分布式存储和云计算改变了公司处理大型数据集的方式。后来，BigQuery、Snowflake 和 Redshift 等云数据仓库，让存储和查询大规模数据变得更容易，而不必手动运行所有基础设施。

随后，这个领域分化出几种风格。有些团队专注于批处理流水线：按天或按小时处理大量数据的任务。另一些团队专注于流式处理：在几秒或几分钟内处理事件。有些团队构建集中式数据平台。另一些团队转向“分析工程”，即分析师和工程师使用软件工程实践，在 dbt 等工具中维护干净的转换层。Airflow 最初由 Airbnb 创建，后来在 Apache 软件基金会下发展，成为编写、调度和监控数据工作流的常见工具之一。

AI 让数据工程变得更显眼。许多组织想构建 AI 产品，但 AI 系统需要可靠数据：训练数据、评估数据、检索数据、元数据、权限、日志和监控信号。即使模型很强，糟糕的数据质量也可能让 AI 项目失败。近期基于 MIT Technology Review 和 Snowflake 研究的行业报道发现，许多商业领导者现在把数据工程师视为组织成功的关键，尤其是在 AI 提高了对可用、可治理数据的需求之后。

### 这个行业如何运作

数据工程在不同组织中差异很大。

在大型科技公司中，数据工程通常是一种平台职能。团队构建共享流水线、事件系统、数据仓库、特征存储、治理工具、目录系统和质量检查。其他团队依赖它们。如果用户事件缺失，产品分析师就无法分析留存。如果商品和用户特征不一致，机器学习工程师就无法训练推荐模型。如果收入数据无法对账，财务团队就无法完成结账。

在小公司中，数据工程可能由后端工程师、分析师或一个通用型数据人员承担。起初这可以运转，但随着业务增长，问题会出现。仪表盘彼此不一致。指标变化没有文档。表变得难以理解。每个团队都创造自己的“活跃用户”“收入”或“客户”版本。到了这个阶段，公司就需要更强的数据建模、所有权和流水线纪律。

在传统企业中，数据工程常常需要把旧系统与新平台连接起来。银行、医院、零售商、物流公司或制造商，可能拥有几十年的数据库、供应商工具、电子表格、文件导出和合规要求。这项工作不一定技术上时髦，但往往很困难。数据可能敏感、受监管、重复，并且存在组织政治争议。安全地移动它，需要的不只是写脚本。

在 AI 重点公司中，数据工程可能更接近模型开发。团队需要用于训练、微调、评估、反馈循环、检索系统、标注工作流和监控的数据集。数据工程师、机器学习工程师和平台工程师之间的边界可能变得模糊。在这种环境中，数据工程不再只是“支持分析”；它会成为 AI 产品本身的一部分。

咨询和外包公司也会做数据工程工作。它们可能帮助公司迁移到云数据仓库，构建数据湖，实现 BI 平台，清理流水线，或现代化报表系统。这能让从业者接触许多行业，但也可能意味着要在客户约束下工作：旧系统、所有权不清、组织政治分歧和紧张项目周期。

### 不同角色分别贡献什么

**数据工程师**构建并维护数据流水线。这个角色把数据从源系统移动到其他人可以使用的数据仓库、数据湖或平台中。工作可能涉及 SQL、Python、Spark、Airflow、Kafka、云存储、编排工具、API 和监控。薄弱的数据工程师做出一条运行一次的流水线。强的数据工程师做出的流水线可靠、可观测、有文档、可恢复，并且依赖它的人能够理解。

**数据仓库工程师**专注于为分析组织数据。这个角色设计 schema、事实表、维度表、数据集市、分区、转换和查询模式。价值在于让业务数据更容易使用。好的数据仓库工程师同时理解技术性能和业务定义。

**分析工程师**位于数据工程和数据分析之间。这个角色通常使用 SQL 和 dbt 等工具，把原始数据仓库表转化为面向分析师和业务用户的干净、经过测试、有文档的数据模型。价值在于减少中间层混乱：不是让每个分析师都写自己脆弱的查询，而是让组织拥有共享、可复用、版本控制的数据模型。

**数据平台工程师**构建其他数据从业者使用的基础设施。这可能包括编排系统、数据目录、权限、血缘追踪、质量检查、数据转换的 CI/CD、计算环境和成本监控。在大公司中，平台工程师会防止每个团队都糟糕地重复发明同一套数据工具。

**流式数据工程师**处理实时或近实时数据。这可能涉及 Kafka、Flink、Pulsar、Spark Structured Streaming、事件 schema、消息顺序、迟到数据、背压、exactly-once 或 at-least-once 处理，以及运行监控。当数据必须被快速采取行动时，这个角色很重要：欺诈检测、推荐、可观测性、物流、交易、广告、IoT 或实时产品个性化。

**数据质量工程师**关注数据是否完整、正确、及时且一致。这个角色创建检查、警报、验证规则、对账流程和数据契约。价值在于信任。一个外观精美却使用坏数据的仪表盘，比没有仪表盘更糟，因为它会制造虚假的自信。

**数据治理专家**或**数据管理员**关注所有权、访问、隐私、定义、保留、血缘和合规。这在医疗、金融、教育、政府和大型企业中尤其重要。治理听起来可能像官僚流程，但没有它，敏感数据会扩散到不受控的表中，权限会变得不清，没有人知道哪个数据集是权威的。

**数据库管理员**或**数据库架构师**可能与数据工程重叠，但重点不同。DBA 保持数据库系统安全、已备份、可用并且高效。数据库架构师设计用于存储和组织数据的系统。美国劳工统计局将数据库管理员和架构师描述为创建或组织系统以存储和保护数据、让授权用户能够访问数据、备份和恢复数据、管理权限并提升性能的工作人员。

**机器学习数据工程师**支持 ML 和 AI 工作流。这个角色准备训练数据集、特征流水线、评估数据、反馈日志、检索索引和监控数据。它要求理解数据错误如何影响模型。一个标注错误的字段、一次数据泄漏、一个有偏样本，或一个延迟特征，都可能悄悄损害模型。

### 从业者需要变得擅长什么

第一项能力是 SQL。数据工程使用许多工具，但 SQL 仍然居于中心。数据工程师应该理解连接、分组、窗口函数、事务、索引、分区、查询计划和性能。SQL 也是与分析师、数据科学家和许多业务用户共享的语言。

第二项能力是数据建模。数据必须被组织起来，让其他人能够理解和使用。好的模型让常见问题容易回答，也不容易被误解。坏模型会制造多年的混乱。数据工程师需要理解规范化模型、维度建模、事实表和维度表、事件建模、缓慢变化维度，以及什么时候为了分析用途而进行反规范化。

第三项能力是流水线可靠性。流水线并不是成功运行一次就完成了。真实流水线会失败，因为源系统变化、网络调用超时、文件迟到、schema 漂移、任务重叠、凭据过期、分区缺失，或上游数据错误。强的数据工程师会构建重试、警报、回填、幂等任务、日志、测试和清晰所有权。

第四项能力是理解批处理和流式处理的取舍。批处理更简单，通常也更便宜。流式处理更快，但运行上更困难。不是每个业务问题都需要实时数据。好的工程师会询问新鲜度是否真的重要，迟到数据应该如何处理，以及组织愿意为速度支付什么成本。

第五项能力是数据质量判断。数据质量不只是技术问题，它往往也是组织问题。谁拥有这个字段？谁改了这个事件名称？为什么财务收入和产品收入不同？应该信任哪张表？数据工程师必须跨系统和团队追踪问题，而不只是跨代码追踪问题。

第六项能力是云和成本意识。现代数据工程经常运行在云数据仓库、对象存储、托管 Spark、无服务器任务或容器化工作负载上。这些系统很容易扩展，也意味着它们很容易浪费钱。低效查询、不必要的重复计算、过大的集群和失控存储都可能变得昂贵。云数据工作需要成本纪律。

第七项能力是沟通。数据工程师支持许多并不知道流水线如何工作的用户。他们需要记录表文档，解释延迟，提醒破坏性变更，协商事件定义，并在数据不可靠时告知分析师。最好的数据工程师不只是流水线构建者；他们是组织数据信任的维护者。

第八项能力是软件工程纪律。数据流水线也是软件。它们需要版本控制、测试、代码审查、部署流程、监控、文档和事件响应。许多数据系统变得脆弱，是因为团队把转换逻辑当成一次性脚本，而不是生产代码。

### 就业前景与风险

数据工程有很强的长期相关性，因为数据量、AI 采用、云迁移和商业分析都依赖可靠的数据基础设施。但“数据工程师”这个岗位名称并不能整齐对应到某一个官方职业类别，因此劳动力市场数据必须通过相邻角色来理解。

美国劳工统计局预计，2024 至 2034 年，数据库管理员和架构师总体就业将增长 4%，每年约有 7,800 个职位空缺。这里的拆分很重要：数据库架构师预计增长 9%，而数据库管理员预计下降 1%。美国劳工统计局解释说，对数据库架构师的需求受到高质量数据基础设施需求的支撑，其中包括 AI 相关采用；而管理员需求可能受到限制，因为云平台让更少的管理员能服务更多公司。这一区分符合更广泛的数据工程市场：常规管理更暴露在自动化和云平台风险下，而架构、建模、基础设施和治理仍然有价值。

数据科学家预计增长快得多：美国劳工统计局预计，2024 至 2034 年，该岗位增长 34%，每年约有 23,400 个职位空缺。数据工程不同于数据科学，但数据科学增长会增加对可用数据集、特征流水线、数据仓库、治理和平台基础设施的需求。模型不会自动在干净、文档完善、权限安全的数据上训练自己。

入门级数据工程可能很难，因为真实工作依赖生产系统。初学者可以练习 SQL，构建玩具流水线，但公司通常想要理解调度、监控、云存储、权限、schema 变化和故障恢复的人。这让实习、真实项目、开源或类似工作环境的经验尤其重要。

自动化会减少这项工作的一部分。托管数据仓库减少了手动数据库管理。ELT 工具减少了自定义摄取工作。AI 可以起草 SQL、生成流水线代码、编写文档并建议转换。但自动化也创造了新需求：必须有人决定哪些数据是权威的，转换应该如何测试，敏感数据如何治理，成本如何控制，以及 AI 生成的转换是否正确。

这个领域最大的风险，是变成工具操作员。一个只在表面上懂“Airflow 加 dbt 加 Snowflake”的人，在工具变化时可能会吃力。具备防御性的数据工程师理解底层问题：移动、存储、schema、血缘、新鲜度、质量、权限、成本、可靠性和用户信任。工具会变；这些问题不会变。

AI 提高了这个领域的重要性，而不是取代它。许多 AI 项目失败，不是因为模型不可能，而是因为数据没有准备好：缺失、不一致、私密、未治理、有偏、没有文档，或与产品断开。能够让数据为分析和 AI 所用的数据工程师仍然重要。只会编写脆弱流水线、却不理解数据质量和业务用途的数据工程师，会更容易受到冲击。

### 该领域的补充资源

| 资源                                                             | 最适合谁           | 它能帮助什么                            |
| -------------------------------------------------------------- | -------------- | --------------------------------- |
| *The Data Warehouse Toolkit*                                   | 数据仓库和 BI 工程师   | 维度建模、事实表、维度表，以及对业务友好的分析型 schema。  |
| Apache Airflow Documentation                                   | 构建定时流水线的数据工程师  | 工作流编排、DAG、调度、重试、依赖关系和流水线运行管理。     |
| Kafka Documentation                                            | 流式数据工程师        | 事件流、topic、分区、消费者、生产者和流式架构。        |
| Spark Documentation                                            | 处理大规模批处理的数据工程师 | 分布式数据处理、DataFrame、SQL、任务、分区和性能调优。 |
| Google Cloud BigQuery / Snowflake / AWS Redshift Documentation | 云数据仓库学习者       | 云数仓概念、存储-计算分离、查询优化、权限和成本管理。       |
| Soda data quality documentation                                | 专注数据质量的从业者     | 测试关于数据的假设，验证表，并在用户发现之前捕获流水线错误。    |
| OpenLineage / DataHub / Amundsen                               | 数据平台和治理学习者     | 元数据、血缘、发现、所有权和数据目录概念。             |

