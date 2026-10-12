---
title: "Web and Product Applications"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Web and application software development is the work of building software that people use through browsers, phones, internal dashboards, online services, business tools, and connected products. In daily language, people often split it into frontend, backend, and full-stack development. That split is useful for hiring and team organization, but it can also hide the real point: most modern software products are systems made of user interfaces, servers, databases, APIs, authentication, deployment pipelines, monitoring, and maintenance work.

A simple website may only need a few pages and a contact form. A modern application may need login, payments, search, notifications, file uploads, dashboards, permissions, analytics, third-party integrations, mobile layouts, automated tests, background jobs, and security controls. The job of web and application developers is to make all of this usable, reliable, maintainable, and safe enough for real people and organizations to depend on.

### How the field developed

The early web was mostly a way to publish documents. HTML described page structure, links connected pages, and the browser displayed information. That was already powerful: anyone could publish something reachable from anywhere. But the web quickly became more than a publishing system. Businesses wanted forms, accounts, shopping carts, search, payments, discussion boards, customer portals, and internal tools. The browser became a software delivery platform.

The first major shift was dynamic web pages. Instead of serving the same static file to every visitor, servers began generating pages based on users, database records, sessions, and business rules. A shopping site could show different carts to different customers. A news site could load fresh stories from a database. An internal company tool could show different permissions to different employees. This made backend development central: the server was no longer just sending files; it was enforcing rules, storing data, and coordinating work.

The second shift was the rise of rich client-side interfaces. JavaScript, Ajax, and later frontend frameworks made websites feel more like applications. Instead of reloading the whole page for every action, parts of the page could update immediately. Email, maps, dashboards, collaborative editors, design tools, and social platforms all pushed the browser closer to a full application environment. This made frontend development more demanding. It was no longer enough to place text and images on a page; developers had to manage state, responsiveness, accessibility, performance, complex UI behavior, and interaction design.

The third shift was cloud and API-driven software. Applications increasingly became collections of services: a frontend talks to an API, the API talks to databases, queues, authentication providers, storage services, payment providers, analytics tools, and other internal systems. Many products now serve both humans and other software. A web application is not just a page; it is often a platform with public or private APIs, background jobs, admin panels, audit logs, and integration points.

The fourth shift is AI-assisted development. AI can now generate interface components, API handlers, tests, SQL drafts, documentation, and bug-fix suggestions. This changes the work, but it does not remove the need for developers. Stack Overflow’s 2025 survey reports that 84% of respondents are using or planning to use AI tools in development, and 51% of professional developers use them daily. The same survey also shows caution: many developers still distrust AI outputs, and professional developers report limited confidence in AI tools for complex tasks.  The practical result is that first drafts are easier to produce, but judgment becomes more important: someone still has to decide whether the code is correct, secure, maintainable, and suitable for the product.

### How the industry works

Web and application software appears in many kinds of organizations, and the work changes depending on where it is done.

In large technology companies, teams are usually specialized. A frontend team may focus on user-facing interfaces, design systems, performance, accessibility, and frontend infrastructure. A backend team may own APIs, data models, business logic, permissions, reliability, and service performance. Platform teams may build internal tools, shared components, deployment systems, observability, authentication, or developer experience tooling. Work is usually reviewed through design documents, tickets, code review, tests, release processes, and production monitoring.

In startups and small companies, the boundaries are looser. A developer may build the database schema, write the API, implement the interface, deploy the application, fix bugs, talk to users, and adjust the product based on feedback. This is why “full-stack developer” is common in smaller teams. The advantage is speed and ownership. The risk is that rushed choices become technical debt: weak data modeling, missing tests, poor security, fragile deployment, and code that becomes difficult to maintain once the product grows.

In agencies and outsourcing companies, work is often project-based. Clients pay for websites, e-commerce stores, internal tools, landing pages, dashboards, or custom systems. The work trains delivery discipline: understanding requirements, estimating scope, meeting deadlines, communicating with nontechnical clients, and shipping something usable. But some agency work can remain shallow if it only repeats similar websites without deeper system design, testing, security, or long-term maintenance.

In enterprise IT departments, the focus is often internal software: HR systems, finance dashboards, approval workflows, inventory tools, customer portals, reporting systems, and integrations between older systems. This work may look less glamorous than consumer apps, but it can be technically and organizationally complex. Enterprise applications often deal with permissions, audit trails, compliance, data consistency, old databases, vendor systems, and users who cannot simply abandon the product if it is badly designed.

SaaS companies sit somewhere between product companies and infrastructure companies. They sell software that customers use continuously, usually through a subscription. This creates a different pressure: the product must not only work once, but stay reliable, secure, updated, and valuable over time. SaaS work often emphasizes onboarding, billing, permissions, analytics, customer feedback, uptime, documentation, and gradual improvement.

### What different roles contribute

A **frontend developer** builds the part of the application that users see and touch. This includes layout, forms, navigation, state changes, error messages, loading states, accessibility, browser compatibility, and performance. A weak frontend developer can make a page appear correct in one happy path. A strong frontend developer thinks about slow networks, mobile screens, keyboard navigation, failed API calls, confusing forms, broken states, and how the interface will be maintained as the product grows.

A **backend developer** builds the server-side logic that makes the application work. This includes APIs, authentication, authorization, database access, business rules, background jobs, integrations, caching, logging, and error handling. A weak backend developer can make an endpoint return the expected data once. A strong backend developer thinks about data integrity, security, permissions, concurrency, performance, failure recovery, migrations, and how other teams will use the service.

A **full-stack developer** works across both frontend and backend. The value of this role is not that one person is equally deep in everything, but that they can carry a feature from idea to usable product. Full-stack developers are especially useful in startups, internal tools, prototypes, SaaS products, and AI applications, where fast end-to-end delivery matters. The risk is superficiality: “full-stack” should not mean knowing only a thin layer of many tools.

A **web application engineer** or **product engineer** focuses on building product features, not just technical pieces. This role cares about what users are trying to do, how the interface supports them, how data flows through the system, and how the feature will be measured after release. Product engineers often work closely with designers, product managers, data analysts, and support teams.

An **API engineer** designs interfaces between systems. APIs may serve web frontends, mobile apps, partners, customers, internal tools, or third-party developers. Good API work is not just “make an endpoint.” It involves naming, versioning, authentication, permissions, rate limits, documentation, error design, backward compatibility, observability, and security.

A **web performance engineer** focuses on speed and responsiveness. Slow applications lose users, waste infrastructure, and create frustration. This role may optimize bundle size, caching, rendering, database queries, API latency, image delivery, Core Web Vitals, and server response times. Performance work is valuable because it requires seeing the whole path from browser to network to server to database and back.

A **QA engineer** or **test automation engineer** helps prevent broken software from reaching users. In modern teams, testing is not only manual clicking. It may include unit tests, integration tests, end-to-end tests, visual regression tests, load tests, accessibility checks, and release validation. The best QA practitioners understand both user behavior and technical risk.

A **security-focused application engineer** looks for ways the application can be misused. Web applications commonly handle accounts, payments, personal data, internal permissions, uploads, and business records. Security work includes authentication, authorization, session handling, input validation, dependency risk, secrets management, audit logs, and protection against common web vulnerabilities. Security cannot be added at the end; it has to shape design decisions early.

A **UX/UI designer** is not a software engineer, but the role is essential to web application work. Designers shape layout, navigation, interaction patterns, visual hierarchy, and user flows. Developers who understand design constraints work better with designers; designers who understand technical constraints produce more realistic and maintainable designs.

A **product manager** decides what should be built and why. In web software, this often means balancing user needs, business goals, engineering effort, metrics, and risk. Developers do not need to become product managers, but strong developers understand product reasoning well enough to avoid building technically correct features that do not solve the real problem.

### What practitioners need to become good at

The first ability is product delivery. A web developer should be able to turn a small need into a working feature: model the data, build the interface, write the server logic, handle errors, test the behavior, deploy it, and fix what breaks. Tutorials often stop at “it works on my machine.” Professional work begins when other people use the software, enter unexpected data, lose network connection, need support, and return months later expecting old features to still work.

The second ability is understanding existing code. Most professional work is not greenfield. Developers spend much of their time reading, modifying, and debugging systems written by other people. A strong web developer can trace how a button in the interface leads to an API call, how that API call reaches a service, how the service reads from a database, and how the result returns to the user. This is more valuable than memorizing framework syntax.

The third ability is designing maintainable boundaries. A growing application needs clear separation between interface, business rules, data access, authentication, background work, and external integrations. Bad boundaries make every change dangerous. Good boundaries let teams change one part without breaking everything else. This is where software design matters: naming, module structure, API shape, database schema, and test strategy all affect future speed.

The fourth ability is security awareness. Web applications are exposed to real users and real attackers. A developer should know the basics of authentication, authorization, cross-site scripting, SQL injection, CSRF, password storage, session security, dependency risk, and access control. A beginner does not need to become a security researcher, but they must stop treating security as somebody else’s problem.

The fifth ability is database and data modeling judgment. Many web applications fail because the data model is confused. A clean interface cannot compensate for a bad schema, unclear ownership of data, missing constraints, or poorly planned migrations. Developers should understand relational modeling, indexes, transactions, query performance, and when not to overcomplicate the data layer.

The sixth ability is communication. Web software is usually built for people who are not developers. A developer must clarify vague requirements, explain tradeoffs, write useful tickets, document decisions, review code respectfully, and report risks early. The stereotype of the isolated programmer is especially misleading here. Software development is collaborative work.

The seventh ability is judgment about AI-generated code. AI can produce useful drafts, but web development has many hidden edge cases: permissions, security, accessibility, state management, failed requests, database migrations, deployment settings, and test coverage. AI often performs better on local snippets than on long-lived systems. Developers need to use AI as a helper, not as an authority.

### Employment outlook and risks

This field has large job volume, but it is also crowded. In the United States, the Bureau of Labor Statistics projects overall employment for software developers, software QA analysts, and testers to grow 15% from 2024 to 2034, with about 129,200 openings per year on average. The same source reports 1,895,500 jobs in this broad category in 2024.  For the narrower category of web developers and digital designers, BLS projects 7% growth from 2024 to 2034, with about 14,500 openings per year. 

These numbers should be read carefully. They show that software and web work remain large employment areas, but they do not mean entry-level hiring is easy. The market is divided. Basic website work, simple CRUD applications, template-based pages, and thin frontend tasks face heavy competition and increasing automation. Stronger opportunities tend to involve business-critical systems, complex frontend state, backend reliability, security, data modeling, performance, internal platforms, SaaS products, and products that require long-term maintenance.

Frontend-only entry-level work is especially competitive because the visible learning path is accessible. Many beginners can build attractive demos. Employers therefore look for evidence that a candidate can handle real complexity: forms with validation, authentication, state management, API failures, accessibility, responsive design, testing, performance, and maintainable component structure.

Backend work usually has a higher invisible barrier. It may look less visual, but it often carries more responsibility for data, permissions, reliability, and business rules. A backend mistake can leak data, corrupt records, break payments, or make a product unusable. Candidates who understand databases, HTTP, authentication, authorization, logging, and deployment stand out more than candidates who only know how to create routes.

Full-stack work has strong demand in small teams, startups, SaaS products, and AI application companies. But the title can be misleading. A strong full-stack developer has enough depth to make responsible choices across layers. A weak full-stack developer only connects tools together without understanding failure modes. AI tools make this distinction sharper: they make it easier to assemble a demo, but not easier to design a robust product.

AI will change the lower end of this field. It can generate components, boilerplate, tests, SQL drafts, API handlers, and documentation. That reduces the value of mechanical code production. But it increases the value of people who can understand requirements, design systems, review generated code, test edge cases, secure applications, debug production issues, and maintain systems over time. The future is not that web developers disappear; it is that shallow web development becomes less defensible.

### Additional Resources for This Field


| Resource                              | Best for                                   | What it helps with                                                                                                  |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| You Don’t Know JS Yet                 | JavaScript learners who want depth         | Understanding JavaScript more seriously instead of only using framework patterns.                                   |
| The A11Y Project | Web developers learning accessibility | Practical accessibility basics, checklist habits, audits, and inclusive UI decisions. |
| Patterns.dev | Frontend and full-stack developers | Modern JavaScript, React, rendering, and performance patterns for web application architecture. |

# 中文

Web 和应用软件开发，是构建人们通过浏览器、手机、内部仪表盘、在线服务、业务工具和联网产品使用的软件的工作。在日常语言中，人们通常把它分成前端、后端和全栈开发。这种划分对招聘和团队组织有用，但也可能掩盖真正的重点：大多数现代软件产品都是由用户界面、服务器、数据库、API、认证、部署流水线、监控和维护工作组成的系统。

一个简单网站可能只需要几个页面和一个联系表单。一个现代应用可能需要登录、支付、搜索、通知、文件上传、仪表盘、权限、分析、第三方集成、移动端布局、自动化测试、后台任务和安全控制。Web 和应用开发者的工作，就是让这一切变得可用、可靠、可维护，并且足够安全，使真实的人和组织能够依赖它。

### 这个领域是如何发展起来的

早期 Web 主要是一种发布文档的方式。HTML 描述页面结构，链接连接页面，浏览器显示信息。这已经很强大：任何人都可以发布一个从任何地方都能访问的东西。但 Web 很快变得不只是发布系统。企业需要表单、账户、购物车、搜索、支付、讨论区、客户门户和内部工具。浏览器变成了软件交付平台。

第一个重大变化是动态网页。服务器不再向每个访问者提供同一个静态文件，而是开始根据用户、数据库记录、会话和业务规则生成页面。购物网站可以向不同客户显示不同购物车。新闻网站可以从数据库加载最新报道。公司内部工具可以向不同员工显示不同权限。这让后端开发变得核心：服务器不再只是发送文件，而是在执行规则、存储数据和协调工作。

第二个变化是丰富客户端界面的兴起。JavaScript、Ajax，以及后来的前端框架，让网站感觉更像应用。每次操作不再需要重新加载整个页面，页面的某些部分可以立即更新。邮箱、地图、仪表盘、协作编辑器、设计工具和社交平台，都把浏览器推向完整应用环境。这让前端开发更具要求。仅仅把文字和图片放到页面上已经不够；开发者必须管理状态、响应式布局、无障碍、性能、复杂 UI 行为和交互设计。

第三个变化是云和 API 驱动的软件。应用越来越成为服务集合：前端与 API 通信，API 与数据库、队列、认证提供方、存储服务、支付提供方、分析工具和其他内部系统通信。许多产品现在同时服务人类和其他软件。Web 应用不只是一个页面；它常常是一个带有公开或私有 API、后台任务、管理面板、审计日志和集成点的平台。

第四个变化是 AI 辅助开发。AI 现在可以生成界面组件、API handler、测试、SQL 草稿、文档和 bug 修复建议。这会改变工作，但不会取消对开发者的需要。Stack Overflow 2025 年调查报告称，84% 的受访者正在使用或计划在开发中使用 AI 工具，51% 的专业开发者每天使用。该调查也显示出谨慎态度：许多开发者仍然不信任 AI 输出，专业开发者对 AI 工具处理复杂任务的信心有限。实际结果是，初稿更容易生成，但判断变得更重要：仍然需要有人决定代码是否正确、安全、可维护，并且适合产品。

### 这个行业如何运作

Web 和应用软件出现在许多组织中，工作方式取决于所在环境。

在大型科技公司中，团队通常是专门化的。前端团队可能关注面向用户的界面、设计系统、性能、无障碍和前端基础设施。后端团队可能负责 API、数据模型、业务逻辑、权限、可靠性和服务性能。平台团队可能构建内部工具、共享组件、部署系统、可观测性、认证或开发者体验工具。工作通常通过设计文档、工单、代码审查、测试、发布流程和生产监控来审查。

在创业公司和小公司中，边界更松。一个开发者可能构建数据库 schema、编写 API、实现界面、部署应用、修复 bug、与用户沟通，并根据反馈调整产品。这就是为什么“全栈开发者”在小团队中很常见。优势是速度和所有权。风险是仓促选择会变成技术债：薄弱的数据建模、缺失测试、糟糕安全、脆弱部署，以及产品增长后难以维护的代码。

在代理公司和外包公司中，工作通常是项目制。客户为网站、电商商店、内部工具、落地页、仪表盘或定制系统付费。这类工作训练交付纪律：理解需求、估算范围、按时交付、与非技术客户沟通，并发布可用产品。但如果只是重复相似网站，而缺少更深的系统设计、测试、安全或长期维护，一些代理工作也可能保持在较浅层次。

在企业 IT 部门中，重点通常是内部软件：HR 系统、财务仪表盘、审批工作流、库存工具、客户门户、报表系统，以及旧系统之间的集成。这类工作可能不如消费 App 光鲜，但在技术和组织上都可能很复杂。企业应用通常处理权限、审计轨迹、合规、数据一致性、旧数据库、供应商系统，以及那些即使产品设计很差也不能简单放弃它的用户。

SaaS 公司位于产品公司和基础设施公司之间。它们销售客户持续使用的软件，通常采用订阅制。这创造了不同压力：产品不能只是工作一次，而必须长期保持可靠、安全、更新，并持续有价值。SaaS 工作通常强调 onboarding、计费、权限、分析、客户反馈、正常运行时间、文档和渐进式改进。

### 不同角色分别贡献什么

**前端开发者**构建应用中用户能看到和触碰的部分。这包括布局、表单、导航、状态变化、错误信息、加载状态、无障碍、浏览器兼容性和性能。薄弱的前端开发者可以让页面在一个理想路径中看起来正确。强的前端开发者会考虑慢网络、移动屏幕、键盘导航、API 调用失败、令人困惑的表单、破损状态，以及产品增长后界面如何维护。

**后端开发者**构建让应用运转的服务端逻辑。这包括 API、认证、授权、数据库访问、业务规则、后台任务、集成、缓存、日志和错误处理。薄弱的后端开发者可以让一个 endpoint 返回一次预期数据。强的后端开发者会考虑数据完整性、安全、权限、并发、性能、故障恢复、迁移，以及其他团队将如何使用这个服务。

**全栈开发者**同时跨越前端和后端工作。这个角色的价值不在于一个人在所有方面都同样深入，而在于他能把一个功能从想法推进到可用产品。全栈开发者在创业公司、内部工具、原型、SaaS 产品和 AI 应用中特别有用，因为这些场景重视快速端到端交付。风险是表面化：“全栈”不应该意味着只知道许多工具的薄薄一层。

**Web 应用工程师**或**产品工程师**关注构建产品功能，而不只是技术部件。这个角色关心用户试图完成什么，界面如何支持他们，数据如何流经系统，以及功能发布后如何被衡量。产品工程师通常与设计师、产品经理、数据分析师和支持团队密切合作。

**API 工程师**设计系统之间的接口。API 可能服务 Web 前端、移动 App、合作伙伴、客户、内部工具或第三方开发者。好的 API 工作不只是“做一个 endpoint”。它涉及命名、版本控制、认证、权限、速率限制、文档、错误设计、向后兼容性、可观测性和安全。

**Web 性能工程师**关注速度和响应性。缓慢应用会流失用户、浪费基础设施并制造挫败感。这个角色可能优化 bundle 体积、缓存、渲染、数据库查询、API 延迟、图片交付、Core Web Vitals 和服务器响应时间。性能工作有价值，因为它要求看清从浏览器到网络、服务器、数据库再返回的完整路径。

**QA 工程师**或**测试自动化工程师**帮助防止破损软件到达用户手中。在现代团队中，测试不只是手动点击。它可能包括单元测试、集成测试、端到端测试、视觉回归测试、负载测试、无障碍检查和发布验证。最好的 QA 从业者同时理解用户行为和技术风险。

**安全导向应用工程师**寻找应用可能被误用的方式。Web 应用通常处理账户、支付、个人数据、内部权限、上传和业务记录。安全工作包括认证、授权、会话处理、输入验证、依赖风险、密钥管理、审计日志，以及防护常见 Web 漏洞。安全不能在最后才添加；它必须早早影响设计决策。

**UX/UI 设计师**不是软件工程师，但这个角色对 Web 应用工作至关重要。设计师塑造布局、导航、交互模式、视觉层级和用户流程。理解设计约束的开发者能更好地与设计师合作；理解技术约束的设计师则能产出更现实、更可维护的设计。

**产品经理**决定应该构建什么以及为什么构建。在 Web 软件中，这通常意味着平衡用户需求、业务目标、工程投入、指标和风险。开发者不需要成为产品经理，但强开发者会充分理解产品推理，从而避免构建技术上正确、却没有解决真实问题的功能。

### 从业者需要变得擅长什么

第一项能力是产品交付。Web 开发者应该能够把一个小需求变成一个可工作的功能：建模数据、构建界面、编写服务端逻辑、处理错误、测试行为、部署它，并修复坏掉的部分。教程通常停在“它在我的机器上能跑”。专业工作从其他人开始使用软件时才真正开始：他们会输入意料之外的数据，失去网络连接，需要支持，并在数月后回来，期待旧功能仍然能工作。

第二项能力是理解现有代码。大多数专业工作不是从零开始。开发者大量时间花在阅读、修改和调试别人写的系统上。强的 Web 开发者能够追踪界面上的一个按钮如何触发 API 调用，这个 API 调用如何到达某个服务，这个服务如何从数据库读取数据，以及结果如何返回给用户。这比记住框架语法更有价值。

第三项能力是设计可维护边界。一个增长中的应用需要在界面、业务规则、数据访问、认证、后台工作和外部集成之间建立清晰分离。糟糕边界会让每次修改都变得危险。好的边界让团队能够修改一部分，而不破坏其他部分。这正是软件设计发挥作用的地方：命名、模块结构、API 形态、数据库 schema 和测试策略，都会影响未来速度。

第四项能力是安全意识。Web 应用暴露给真实用户和真实攻击者。开发者应该了解认证、授权、跨站脚本、SQL 注入、CSRF、密码存储、会话安全、依赖风险和访问控制的基础。初学者不需要成为安全研究员，但必须停止把安全当成别人的问题。

第五项能力是数据库和数据建模判断。许多 Web 应用失败，是因为数据模型混乱。干净的界面无法弥补糟糕 schema、不清楚的数据所有权、缺失约束或规划不当的迁移。开发者应该理解关系建模、索引、事务、查询性能，以及什么时候不要把数据层过度复杂化。

第六项能力是沟通。Web 软件通常是为非开发者构建的。开发者必须澄清模糊需求，解释取舍，写有用的工单，记录决策，尊重地审查代码，并及早报告风险。孤立程序员的刻板印象在这里尤其误导。软件开发是协作工作。

第七项能力是判断 AI 生成代码。AI 可以产生有用草稿，但 Web 开发有许多隐藏边界情况：权限、安全、无障碍、状态管理、请求失败、数据库迁移、部署设置和测试覆盖。AI 在局部片段上的表现，通常好于在长期运行系统中的表现。开发者需要把 AI 当作助手，而不是权威。

### 就业前景与风险

这个领域岗位体量很大，但也很拥挤。在美国，美国劳工统计局预计，2024 至 2034 年，软件开发者、软件 QA 分析师和测试人员总体就业将增长 15%，平均每年约有 129,200 个职位空缺。同一来源报告称，2024 年这一宽泛类别有 1,895,500 个岗位。对于更窄的 Web 开发者和数字设计师类别，美国劳工统计局预计，2024 至 2034 年增长 7%，每年约有 14,500 个职位空缺。

这些数字需要谨慎阅读。它们说明软件和 Web 工作仍然是大型就业领域，但并不意味着入门招聘容易。市场是分化的。基础网站工作、简单 CRUD 应用、模板化页面和薄前端任务，面临激烈竞争和不断增加的自动化。更强机会往往涉及业务关键系统、复杂前端状态、后端可靠性、安全、数据建模、性能、内部平台、SaaS 产品，以及需要长期维护的产品。

纯前端入门工作尤其竞争激烈，因为可见学习路径很容易进入。许多初学者都能做出好看的演示。因此，雇主会寻找候选人能处理真实复杂性的证据：带验证的表单、认证、状态管理、API 失败、无障碍、响应式设计、测试、性能和可维护组件结构。

后端工作通常有更高的隐形门槛。它可能不那么视觉化，但通常对数据、权限、可靠性和业务规则承担更多责任。后端错误可能泄露数据、损坏记录、破坏支付，或让产品无法使用。理解数据库、HTTP、认证、授权、日志和部署的候选人，会比只知道如何创建路由的候选人更突出。

全栈工作在小团队、创业公司、SaaS 产品和 AI 应用公司中有强需求。但这个标题可能具有误导性。强的全栈开发者有足够深度，能跨层做出负责任选择。弱的全栈开发者只是把工具连接在一起，却不理解失败模式。AI 工具让这种区分更明显：它们让组装演示更容易，但不会让设计稳健产品更容易。

AI 会改变这个领域的低端部分。它可以生成组件、样板代码、测试、SQL 草稿、API handler 和文档。这会降低机械代码生产的价值。但它会提高那些能够理解需求、设计系统、审查生成代码、测试边界情况、保护应用、调试生产问题并长期维护系统的人的价值。未来不是 Web 开发者消失，而是浅层 Web 开发变得不那么具备防御性。

### 该领域的补充资源

| 资源                    | 最适合谁                  | 它能帮助什么                                   |
| --------------------- | --------------------- | ---------------------------------------- |
| You Don’t Know JS Yet | 想深入理解的 JavaScript 学习者 | 更认真地理解 JavaScript，而不是只使用框架模式。            |
| The A11Y Project      | 学习无障碍的 Web 开发者        | 实用无障碍基础、检查清单习惯、审计和包容性 UI 决策。             |
| Patterns.dev          | 前端和全栈开发者              | 用于 Web 应用架构的现代 JavaScript、React、渲染和性能模式。 |

