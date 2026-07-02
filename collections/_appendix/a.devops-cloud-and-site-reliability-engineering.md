---
title: "DevOps, Cloud, and Site Reliability Engineering"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Most people notice software when it is released. They notice the app, the website, the button, the feature. They do not usually see the work required to keep it running after release.

DevOps, cloud platform engineering, operations, and SRE are about that hidden work. They deal with deployment, servers, cloud services, monitoring, incidents, scaling, backups, security settings, release pipelines, reliability, and cost. Their purpose is simple to state: software should not only be built; it should run safely, recover from failure, and be changed without breaking everything.

This field exists because modern software is rarely a program sitting on one machine. It is usually a service running across cloud infrastructure, databases, queues, containers, networks, storage systems, identity providers, observability tools, and third-party APIs. When something goes wrong, the problem may not be in the application code alone. It may be a deployment, configuration, certificate, database migration, network rule, memory limit, cloud permission, traffic spike, or dependency failure.

### How the field developed

Earlier computing environments often separated development and operations. Developers wrote software. Operations teams installed it, kept servers alive, handled backups, monitored systems, and responded to incidents. This separation worked tolerably when releases were infrequent and systems changed slowly. It became weaker as internet services began changing constantly.

Web companies needed to deploy more often, serve more users, recover quickly from failures, and operate systems that were too large for manual administration. If every deployment required a long handoff and manual server work, the organization slowed down. If developers did not understand production, they wrote software that was hard to operate. If operations teams did not understand development, they became gatekeepers rather than partners.

DevOps emerged as a response to that split. Its central idea is not a specific tool. It is closer to a working style: development and operations should share responsibility for delivering and running software. Automation, continuous integration, continuous delivery, infrastructure as code, monitoring, and collaboration all grew around that idea. The goal was to make releases smaller, safer, and more frequent, while reducing manual work.

Cloud computing changed the field again. Instead of buying and maintaining physical servers directly, teams could rent compute, storage, databases, networks, and managed services from cloud providers. This made infrastructure more flexible, but also more complex. A team could create a database in minutes, but also misconfigure permissions, overspend on compute, expose private data, or build a fragile system across dozens of services.

SRE, or site reliability engineering, developed as a more reliability-focused version of this shift. Google’s SRE book describes SRE as “what happens when you ask a software engineer to design an operations team.” It emphasizes replacing manual operational work with software and automation, while keeping systems reliable enough for users. This is important: SRE is not just being on call. It is software engineering applied to production reliability.

Platform engineering is a newer way to organize some of this work. As cloud and DevOps tools multiplied, product developers were often forced to understand too much infrastructure detail. Platform teams build internal tools and “golden paths” so other developers can deploy, monitor, configure, and operate services without reinventing the same setup each time. The goal is not to hide reality completely, but to make the common path safe and easy.

### How the industry works

In large technology companies, infrastructure and reliability work is usually specialized. There may be SRE teams, cloud platform teams, infrastructure teams, CI/CD teams, observability teams, security engineering teams, database reliability teams, and incident management processes. Product engineers may own the application logic, while platform and reliability teams provide shared systems for deployment, monitoring, scaling, and recovery.

In startups, the same person may write product code, set up cloud infrastructure, configure CI/CD, monitor errors, manage databases, respond to incidents, and control cloud bills. This can work early, but it becomes risky as traffic grows. Startups often delay serious operations work until something breaks: a failed deployment, a lost database, an outage, a runaway cloud bill, or a security incident.

In traditional enterprises, this field often appears during cloud migration or digital transformation. A bank, insurer, hospital, retailer, logistics company, or government department may already have old systems, internal networks, compliance rules, vendor platforms, and change-management processes. DevOps in this environment is not just “use Kubernetes.” It means changing release processes, security controls, approval flows, monitoring, and team responsibilities without breaking critical operations.

In SaaS companies, reliability is part of the product. Customers pay for software they expect to be available. Downtime, slow response, data loss, or repeated incidents directly affect trust and revenue. These companies often invest in observability, incident response, uptime targets, automated deployment, rollback, backups, and customer-facing status pages.

In consulting and managed-service companies, teams may set up cloud platforms, migrate workloads, operate infrastructure, manage Kubernetes clusters, build CI/CD systems, handle monitoring, or provide security and reliability support for clients. This can expose practitioners to many environments, but it may also mean working within client constraints and cleaning up systems designed by others.

### What different roles contribute

A **DevOps engineer** usually works on the bridge between development and operations. The role may involve CI/CD pipelines, cloud infrastructure, containers, deployment automation, environment configuration, monitoring, and release support. A weak DevOps engineer only knows how to operate tools. A strong one understands why delivery is slow or risky and redesigns the process so teams can ship more safely.

A **site reliability engineer**, or **SRE**, focuses on making production systems reliable. This may include service-level objectives, monitoring, incident response, automation, capacity planning, postmortems, and reducing repetitive manual work. SREs often combine software engineering and systems knowledge. Their value is not simply “keeping servers up”; it is making reliability measurable and improving it systematically.

A **cloud engineer** designs and manages cloud infrastructure. This may include compute, storage, databases, networking, identity and access management, load balancers, DNS, secrets, logging, backup, and cost controls. A strong cloud engineer knows that cloud services make infrastructure easier to create but not automatically easier to govern.

A **platform engineer** builds internal platforms for developers. This may include service templates, deployment systems, developer portals, observability defaults, infrastructure modules, authentication patterns, CI/CD standards, and self-service environments. The value is developer productivity and safety: product teams should not need to solve the same infrastructure problems repeatedly.

An **infrastructure engineer** works closer to the systems that everything runs on: Linux, networking, storage, virtualization, container platforms, databases, hardware, or cloud primitives. In some companies this role overlaps with cloud engineering; in others it remains closer to data centers, private clouds, or high-performance environments.

A **Kubernetes or container platform engineer** focuses on container orchestration. This role may manage clusters, networking, ingress, service discovery, autoscaling, resource limits, storage, upgrades, security policies, and developer workflows. Kubernetes is powerful, but it creates its own operational burden. The role exists because running it responsibly is not trivial.

An **observability engineer** helps teams understand what systems are doing. This may involve metrics, logs, traces, dashboards, alerts, service maps, and incident tools. Monitoring asks whether known things are broken. Observability goes further: it helps engineers ask new questions when a system behaves in an unexpected way.

A **release engineer** focuses on how code moves from development to production. This may include build systems, artifact management, versioning, branching, release gates, deployment strategies, rollback, canary releases, feature flags, and audit trails. This role is especially important in organizations where releases are risky, regulated, or frequent.

A **database reliability engineer** focuses on databases in production. This role may handle backups, replication, failover, migrations, query performance, capacity planning, schema changes, and incident response. Database failures are often more dangerous than application failures because data loss or corruption may be hard to reverse.

A **security or DevSecOps engineer** integrates security into the delivery process. This may include dependency scanning, secrets management, image scanning, infrastructure policy, access control, audit logs, vulnerability management, and secure deployment practices. The point is to make security part of normal engineering, not a final manual checkpoint.

A **network and systems administrator** is a more traditional operations role. This work includes installing, configuring, and maintaining networks, servers, operating systems, and user access. BLS describes these administrators as workers who maintain networks and systems, manage upgrades and security, optimize performance, and diagnose problems. The role still exists, especially in schools, hospitals, government, manufacturing, and internal IT, but some of its routine tasks are increasingly automated or absorbed into DevOps and cloud roles.

### What practitioners need to become good at

The first ability is Linux and command-line competence. Much of production infrastructure still depends on Unix-like systems, shells, processes, files, permissions, logs, networking tools, and service management. A practitioner who cannot inspect a running system will struggle when dashboards are incomplete.

The second ability is networking. Many production failures are network-shaped: DNS issues, TLS certificates, load balancer configuration, firewall rules, ports, latency, timeouts, retries, connection pools, or regional outages. DevOps and SRE work does not require becoming a network architect at the beginning, but it does require practical understanding of how services communicate.

The third ability is automation. Manual work does not scale. If a task is repeated often, it should usually become a script, pipeline, module, runbook, or self-service tool. Automation reduces mistakes, but bad automation can spread mistakes quickly. Good automation is tested, reviewed, documented, reversible, and observable.

The fourth ability is infrastructure as code. Cloud resources should not exist only as manually clicked settings in a console. They should be described, versioned, reviewed, and reproducible. This makes it possible to rebuild environments, track changes, audit permissions, and recover from mistakes.

The fifth ability is incident response. Systems fail. The question is whether the team can detect the failure, understand the impact, communicate clearly, mitigate quickly, and learn afterward. Good incident response requires calm thinking, clear roles, useful alerts, accurate dashboards, runbooks, and blameless postmortems.

The sixth ability is observability. A production system should explain itself. Practitioners need to know how to design metrics, logs, traces, alerts, and dashboards that answer real operational questions. Bad alerts create noise. Missing alerts create blind spots. Good observability lets teams debug unfamiliar failures.

The seventh ability is reliability thinking. Reliability is not infinite uptime at any cost. It is a tradeoff between user expectations, engineering effort, risk, and speed of change. SRE practices use ideas such as service-level indicators, service-level objectives, error budgets, and postmortems to make that tradeoff explicit.

The eighth ability is cloud cost awareness. Cloud systems are easy to scale and easy to overspend on. Idle resources, oversized databases, unbounded logs, inefficient queries, excessive data transfer, and poorly configured autoscaling can become expensive. A strong cloud practitioner treats cost as an engineering signal, not just a finance problem.

The ninth ability is security awareness. Infrastructure mistakes can expose entire systems. Practitioners need to understand identity and access management, secrets, least privilege, network boundaries, patching, dependency risk, container security, audit logs, and incident containment. Reliability without security is incomplete.

The tenth ability is developer empathy. Platform and DevOps teams serve other engineers. A tool that is theoretically correct but painful to use will be bypassed. A good platform makes the safe path the easy path. This requires understanding developer workflows, documentation, support, and feedback.

### Employment outlook and risks

The employment picture is mixed. The broad software market is strong: BLS projects employment for software developers, QA analysts, and testers to grow 15% from 2024 to 2034, with about 129,200 openings per year. This supports demand for infrastructure-aware software roles, platform engineering, automation, and reliability work.

Traditional system administration is weaker. BLS projects employment of network and computer systems administrators to decline 4% from 2024 to 2034, even though about 14,300 openings per year are still expected because of replacement needs. BLS also notes that some administrator tasks are increasingly done by software developers focused on DevOps, outsourced to network-as-a-service providers, or automated. This is the clearest labor-market signal in the field: manual operations work is less defensible than software-driven operations.

That does not mean operations disappear. It means the center of value moves upward. Installing servers by hand, manually copying files, restarting services without understanding cause, and clicking through cloud consoles are weaker skills. Designing reliable deployment systems, automating infrastructure, managing incidents, reducing toil, improving observability, securing cloud environments, and building internal platforms are stronger skills.

Entry-level DevOps roles can be difficult because the work touches production systems. Companies may hesitate to give a beginner access to deployment, cloud infrastructure, secrets, or databases. Many people enter through adjacent paths: backend engineering, QA automation, system administration, IT support, cloud support, networking, or internal tools. A strong portfolio should show safe practice: a small service with CI/CD, infrastructure as code, monitoring, logs, alerts, backup, rollback, and documentation.

The field is also tool-heavy, which creates a learning trap. Docker, Kubernetes, Terraform, AWS, GCP, Azure, Prometheus, Grafana, GitHub Actions, GitLab CI, Argo CD, Helm, Ansible, and many other tools matter. But knowing tool commands is not the same as understanding operations. A tool operator follows recipes. A strong practitioner understands deployment risk, system failure, observability, security, cost, and recovery.

AI will affect this field, but it is unlikely to replace it. AI can draft configuration, explain logs, suggest pipeline fixes, generate runbooks, summarize incidents, and help write infrastructure code. But production infrastructure is a high-consequence environment. A wrong permission rule, broken migration, bad rollback, or unsafe automation can cause outages or data exposure. AI is useful as an assistant, but humans still need to verify, test, constrain, and audit its output. Recent reporting on the 2026 State of DevOps notes that organizations with mature DevOps practices are more likely to embed AI successfully, while low-maturity organizations lag behind; the practical lesson is that AI amplifies disciplined engineering rather than replacing it.

The long-term defensible path is to become someone who can make systems safer to change. That may mean SRE, cloud platform engineering, infrastructure automation, DevSecOps, observability, incident response, database reliability, or internal developer platforms. The least defensible path is remaining a manual operator in systems that are steadily becoming automated and outsourced.

### Additional Resources for This Field


| Resource                                        | Best for                                | What it helps with                                                                                              |
| ----------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| The Missing Semester of Your CS Education       | Beginners                               | Shell, command line, editors, Git, debugging, profiling, and practical developer tools.                         |
| Linux Journey | Beginners entering operations work      | Linux files, permissions, processes, services, networking commands, and shell practice.                         |
| Docker Documentation                            | DevOps and backend learners             | Containers, images, volumes, networks, Compose, and local development environments.                             |
| AWS / Google Cloud / Azure fundamentals         | Cloud engineers                         | Compute, storage, IAM, networking, databases, monitoring, and managed services.                                 |
| Flux documentation | GitOps learners                         | Declarative Kubernetes deployment, continuous delivery, and environment synchronization.                        |
| OWASP DevSecOps Guideline / SLSA                | Security-aware DevOps practitioners     | Secure pipelines, supply-chain security, artifact integrity, and deployment controls.                           |
| The Phoenix Project | Readers needing organizational context  | Why development and operations conflict, and how delivery systems improve through collaboration and automation. |

# 中文

大多数人是在软件发布时才注意到它。他们看到的是 App、网站、按钮、功能。他们通常看不到软件发布之后，为了让它继续运行所需要的工作。

DevOps、云平台工程、运维和 SRE 处理的就是这些隐藏工作。它们处理部署、服务器、云服务、监控、事件、扩容、备份、安全设置、发布流水线、可靠性和成本。它们的目的很容易说明：软件不应该只是被构建出来；它还应该安全运行，在故障后恢复，并且能在不破坏一切的情况下被修改。

这个领域之所以存在，是因为现代软件很少只是运行在一台机器上的一个程序。它通常是一个运行在云基础设施、数据库、队列、容器、网络、存储系统、身份提供方、可观测性工具和第三方 API 之上的服务。当问题出现时，问题可能并不只在应用代码中。它可能是部署、配置、证书、数据库迁移、网络规则、内存限制、云权限、流量激增或依赖故障。

### 这个领域是如何发展起来的

早期计算环境通常把开发和运维分开。开发者编写软件。运维团队安装软件，保持服务器运行，处理备份，监控系统，并响应事件。当发布不频繁、系统变化缓慢时，这种分离还能勉强工作。但随着互联网服务开始不断变化，它变得越来越脆弱。

Web 公司需要更频繁地部署，服务更多用户，更快地从故障中恢复，并运行那些规模大到无法手工管理的系统。如果每次部署都需要漫长交接和手工服务器操作，组织就会变慢。如果开发者不了解生产环境，他们就会写出难以运维的软件。如果运维团队不了解开发，他们就会变成守门人，而不是合作伙伴。

DevOps 正是对这种分裂的回应。它的核心思想不是某个具体工具，而更接近一种工作方式：开发和运维应该共同负责软件的交付与运行。自动化、持续集成、持续交付、基础设施即代码、监控和协作，都是围绕这个思想发展起来的。目标是让发布更小、更安全、更频繁，同时减少手工工作。

云计算再次改变了这个领域。团队不再需要直接购买和维护物理服务器，而是可以从云提供商那里租用计算、存储、数据库、网络和托管服务。这让基础设施更加灵活，但也更加复杂。一个团队可以在几分钟内创建数据库，但也可能错误配置权限，过度消耗计算资源，暴露私有数据，或在几十个服务之间搭出一个脆弱系统。

SRE，也就是站点可靠性工程，是这场变化中更关注可靠性的版本。Google 的 SRE 书将 SRE 描述为“当你让一个软件工程师设计一个运维团队时会发生的事情”。它强调用软件和自动化取代手工运维工作，同时让系统对用户来说足够可靠。这一点很重要：SRE 不只是值班。它是应用于生产可靠性的软件工程。

平台工程是组织这类工作的一种较新方式。随着云和 DevOps 工具增多，产品开发者经常被迫理解过多基础设施细节。平台团队构建内部工具和“黄金路径”，让其他开发者能够部署、监控、配置和运维服务，而不必每次都重新发明同样的设置。目标不是完全隐藏现实，而是让常见路径变得安全且容易。

### 这个行业如何运作

在大型科技公司中，基础设施和可靠性工作通常是专门化的。可能会有 SRE 团队、云平台团队、基础设施团队、CI/CD 团队、可观测性团队、安全工程团队、数据库可靠性团队和事件管理流程。产品工程师可能负责应用逻辑，而平台和可靠性团队提供用于部署、监控、扩容和恢复的共享系统。

在创业公司中，同一个人可能既写产品代码，又设置云基础设施，配置 CI/CD，监控错误，管理数据库，响应事件，并控制云账单。早期这样可以运转，但随着流量增长会变得有风险。创业公司通常会推迟严肃的运维工作，直到某些东西坏掉：部署失败、数据库丢失、服务中断、云账单失控，或安全事件。

在传统企业中，这个领域通常出现在云迁移或数字化转型期间。银行、保险公司、医院、零售商、物流公司或政府部门，可能已经拥有旧系统、内部网络、合规规则、供应商平台和变更管理流程。在这种环境中的 DevOps 不只是“使用 Kubernetes”。它意味着在不破坏关键运营的前提下，改变发布流程、安全控制、审批流、监控和团队职责。

在 SaaS 公司中，可靠性是产品的一部分。客户为他们期望可用的软件付费。宕机、响应缓慢、数据丢失或反复发生的事件，会直接影响信任和收入。这些公司通常会投资可观测性、事件响应、可用性目标、自动化部署、回滚、备份和面向客户的状态页面。

在咨询和托管服务公司中，团队可能为客户设置云平台、迁移工作负载、运维基础设施、管理 Kubernetes 集群、构建 CI/CD 系统、处理监控，或提供安全和可靠性支持。这能让从业者接触许多环境，但也可能意味着要在客户约束下工作，并清理其他人设计的系统。

### 不同角色分别贡献什么

**DevOps 工程师**通常工作在开发和运维之间的桥梁位置。这个角色可能涉及 CI/CD 流水线、云基础设施、容器、部署自动化、环境配置、监控和发布支持。薄弱的 DevOps 工程师只知道如何操作工具。强的工程师理解为什么交付缓慢或有风险，并重新设计流程，让团队能更安全地发布。

**站点可靠性工程师**，也就是 **SRE**，专注于让生产系统可靠。这可能包括服务级目标、监控、事件响应、自动化、容量规划、事后复盘，以及减少重复手工工作。SRE 通常结合软件工程和系统知识。他们的价值不只是“保持服务器在线”，而是让可靠性变得可衡量，并系统性地改进它。

**云工程师**设计并管理云基础设施。这可能包括计算、存储、数据库、网络、身份与访问管理、负载均衡器、DNS、密钥、日志、备份和成本控制。强的云工程师知道，云服务让基础设施更容易创建，但不会自动让它更容易治理。

**平台工程师**为开发者构建内部平台。这可能包括服务模板、部署系统、开发者门户、可观测性默认配置、基础设施模块、认证模式、CI/CD 标准和自助式环境。它的价值是开发者生产力和安全性：产品团队不应该反复解决同样的基础设施问题。

**基础设施工程师**更接近一切运行其上的系统：Linux、网络、存储、虚拟化、容器平台、数据库、硬件或云原语。在一些公司中，这个角色与云工程重叠；在另一些公司中，它仍然更接近数据中心、私有云或高性能环境。

**Kubernetes 或容器平台工程师**专注于容器编排。这个角色可能管理集群、网络、入口、服务发现、自动扩缩容、资源限制、存储、升级、安全策略和开发者工作流。Kubernetes 很强大，但它也会产生自身的运维负担。这个角色之所以存在，是因为负责任地运行 Kubernetes 并不简单。

**可观测性工程师**帮助团队理解系统正在做什么。这可能涉及指标、日志、追踪、仪表盘、警报、服务地图和事件工具。监控会询问已知事物是否坏了。可观测性更进一步：当系统以意外方式表现时，它帮助工程师提出新的问题。

**发布工程师**专注于代码如何从开发流向生产。这可能包括构建系统、制品管理、版本管理、分支、发布门禁、部署策略、回滚、金丝雀发布、功能开关和审计轨迹。在发布风险高、受监管或频繁的组织中，这个角色尤其重要。

**数据库可靠性工程师**专注于生产环境中的数据库。这个角色可能处理备份、复制、故障转移、迁移、查询性能、容量规划、schema 变更和事件响应。数据库故障通常比应用故障更危险，因为数据丢失或损坏可能很难逆转。

**安全或 DevSecOps 工程师**把安全集成进交付流程。这可能包括依赖扫描、密钥管理、镜像扫描、基础设施策略、访问控制、审计日志、漏洞管理和安全部署实践。重点是让安全成为正常工程的一部分，而不是最后的手工检查点。

**网络和系统管理员**是更传统的运维角色。这项工作包括安装、配置和维护网络、服务器、操作系统和用户访问。美国劳工统计局将这些管理员描述为维护网络和系统、管理升级与安全、优化性能并诊断问题的工作人员。这个角色仍然存在，尤其是在学校、医院、政府、制造业和内部 IT 中，但它的一些常规任务正越来越多地被自动化，或被吸收到 DevOps 和云角色中。

### 从业者需要变得擅长什么

第一项能力是 Linux 和命令行能力。大量生产基础设施仍然依赖类 Unix 系统、shell、进程、文件、权限、日志、网络工具和服务管理。当仪表盘不完整时，无法检查运行中系统的从业者会很吃力。

第二项能力是网络。许多生产故障都呈现为网络问题：DNS 问题、TLS 证书、负载均衡配置、防火墙规则、端口、延迟、超时、重试、连接池或区域性故障。DevOps 和 SRE 工作一开始不要求成为网络架构师，但确实需要实际理解服务如何通信。

第三项能力是自动化。手工工作无法扩展。如果一项任务经常重复，通常就应该变成脚本、流水线、模块、运行手册或自助工具。自动化减少错误，但糟糕的自动化也会迅速传播错误。好的自动化应该被测试、审查、记录、可逆，并且可观测。

第四项能力是基础设施即代码。云资源不应该只以控制台里手工点击出来的设置形式存在。它们应该被描述、版本化、审查，并且可复现。这使重建环境、追踪变化、审计权限和从错误中恢复成为可能。

第五项能力是事件响应。系统会失败。问题在于团队是否能发现故障，理解影响，清楚沟通，快速缓解，并在事后学习。好的事件响应需要冷静思考、清晰角色、有用警报、准确仪表盘、运行手册和无责复盘。

第六项能力是可观测性。生产系统应该能够解释自己。从业者需要知道如何设计指标、日志、追踪、警报和仪表盘，使它们能够回答真实运维问题。糟糕警报会制造噪音。缺失警报会造成盲区。好的可观测性让团队能够调试不熟悉的故障。

第七项能力是可靠性思维。可靠性不是不惜任何代价追求无限正常运行时间。它是用户预期、工程投入、风险和变更速度之间的取舍。SRE 实践使用服务级指标、服务级目标、错误预算和事后复盘等概念，让这种取舍显性化。

第八项能力是云成本意识。云系统容易扩展，也容易超支。闲置资源、过大的数据库、无限制日志、低效查询、过量数据传输和配置不良的自动扩缩容，都可能变得昂贵。强的云从业者把成本当作工程信号，而不只是财务问题。

第九项能力是安全意识。基础设施错误可能暴露整个系统。从业者需要理解身份与访问管理、密钥、最小权限、网络边界、补丁、依赖风险、容器安全、审计日志和事件遏制。没有安全的可靠性是不完整的。

第十项能力是开发者同理心。平台和 DevOps 团队服务其他工程师。一个理论上正确但使用痛苦的工具会被绕开。好的平台会让安全路径成为容易路径。这需要理解开发者工作流、文档、支持和反馈。

### 就业前景与风险

就业图景是混合的。更广泛的软件市场较强：美国劳工统计局预计，2024 至 2034 年，软件开发者、QA 分析师和测试人员就业将增长 15%，每年约有 129,200 个职位空缺。这支撑了对具备基础设施意识的软件角色、平台工程、自动化和可靠性工作的需求。

传统系统管理较弱。美国劳工统计局预计，2024 至 2034 年，网络和计算机系统管理员就业将下降 4%，尽管由于替换需求，预计每年仍有约 14,300 个职位空缺。美国劳工统计局还指出，一些管理员任务正越来越多地由专注 DevOps 的软件开发者完成，外包给网络即服务提供商，或被自动化。这是该领域最清晰的劳动力市场信号：手工运维工作不如软件驱动的运维具备防御性。

这并不意味着运维消失。它意味着价值中心向上移动。手工安装服务器、手工复制文件、不理解原因就重启服务，以及在云控制台中点击操作，都是较弱技能。设计可靠部署系统、自动化基础设施、管理事件、减少琐碎工作、改进可观测性、保护云环境和构建内部平台，才是更强技能。

入门级 DevOps 岗位可能很难，因为这项工作接触生产系统。公司可能会犹豫是否让初学者接触部署、云基础设施、密钥或数据库。许多人从相邻路径进入：后端工程、QA 自动化、系统管理、IT 支持、云支持、网络或内部工具。强作品集应该展示安全实践：一个带有 CI/CD、基础设施即代码、监控、日志、警报、备份、回滚和文档的小型服务。

这个领域也高度依赖工具，这会制造学习陷阱。Docker、Kubernetes、Terraform、AWS、GCP、Azure、Prometheus、Grafana、GitHub Actions、GitLab CI、Argo CD、Helm、Ansible 和许多其他工具都很重要。但知道工具命令，不等于理解运维。工具操作员遵循教程。强的从业者理解部署风险、系统故障、可观测性、安全、成本和恢复。

AI 会影响这个领域，但不太可能取代它。AI 可以起草配置，解释日志，建议流水线修复，生成运行手册，总结事件，并帮助编写基础设施代码。但生产基础设施是高后果环境。错误的权限规则、破损迁移、糟糕回滚或不安全自动化，都可能导致宕机或数据暴露。AI 作为助手有用，但人仍然需要验证、测试、约束和审计它的输出。近期关于 2026 年 DevOps 状态的报道指出，DevOps 实践成熟的组织更有可能成功嵌入 AI，而成熟度低的组织则落后；实际教训是，AI 会放大有纪律的工程，而不是取代它。

长期具备防御性的路径，是成为能让系统更安全地变化的人。这可能意味着 SRE、云平台工程、基础设施自动化、DevSecOps、可观测性、事件响应、数据库可靠性，或内部开发者平台。最不具防御性的路径，是停留在手工操作员的位置，而这些系统正逐渐被自动化和外包。

### 该领域的补充资源

| 资源                                        | 最适合谁               | 它能帮助什么                            |
| ----------------------------------------- | ------------------ | --------------------------------- |
| The Missing Semester of Your CS Education | 初学者                | Shell、命令行、编辑器、Git、调试、性能分析和实用开发工具。 |
| Linux Journey                             | 进入运维工作的初学者         | Linux 文件、权限、进程、服务、网络命令和 shell 练习。 |
| Docker Documentation                      | DevOps 和后端学习者      | 容器、镜像、卷、网络、Compose 和本地开发环境。       |
| AWS / Google Cloud / Azure fundamentals   | 云工程师               | 计算、存储、IAM、网络、数据库、监控和托管服务。         |
| Flux documentation                        | GitOps 学习者         | 声明式 Kubernetes 部署、持续交付和环境同步。      |
| OWASP DevSecOps Guideline / SLSA          | 具备安全意识的 DevOps 从业者 | 安全流水线、供应链安全、制品完整性和部署控制。           |
| The Phoenix Project                       | 需要组织语境的读者          | 为什么开发和运维会冲突，以及交付系统如何通过协作和自动化改进。   |
