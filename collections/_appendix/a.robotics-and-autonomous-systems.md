---
title: "Robotics and Autonomous Systems"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Robotics is the work of building machines that can sense the world, make decisions, and act physically. A robot may be an industrial arm welding car parts, a warehouse robot moving shelves, a drone inspecting power lines, a surgical robot assisting a doctor, a delivery robot navigating sidewalks, a self-driving vehicle moving through traffic, or a humanoid prototype trying to handle household tasks.

This field is not just “AI with a body.” A chatbot can produce a wrong answer and be corrected. A robot can drop an object, damage equipment, block a workflow, injure a person, or fail in a place where humans cannot easily intervene. The physical world makes everything harder. Sensors are noisy, motors wear down, batteries run out, floors are uneven, lighting changes, objects deform, weather interferes, and people behave unpredictably.

Robotics sits between software, hardware, mechanical engineering, electrical engineering, control theory, computer vision, embedded systems, AI, manufacturing, safety engineering, and operations. This makes the field attractive, but also difficult to enter casually. A robotics engineer must understand not only code, but also motion, sensing, machines, timing, safety, testing, and field failure.

### How the field developed

Robotics first became commercially important in controlled environments. Industrial robots were useful because factories could structure the environment around them. If a robot arm repeats the same welding, painting, assembly, inspection, packaging, or palletizing motion thousands of times, the work can be faster, more consistent, and safer than manual labor. The robot does not need to understand the whole world. It only needs to perform a well-defined task inside a designed workspace.

This is why industrial robotics matured earlier than general-purpose robotics. A factory can control lighting, fixtures, parts, safety cages, tooling, process timing, and maintenance procedures. A home, hospital, street, farm, restaurant, or construction site is much less predictable. The more open the environment, the more difficult robotics becomes.

Industrial robotics is already a large installed reality, not just a future concept. The International Federation of Robotics reported 542,076 industrial robot installations in 2024 and an operational stock of 4,663,698 industrial robots worldwide. The same report states that installations remained above 500,000 units for the fourth consecutive year, with electronics, automotive, and metal/machinery among the largest customer industries.

The next stage was mobile and service robotics. Robots began moving through warehouses, hospitals, offices, stores, farms, and public spaces. This required perception, mapping, localization, obstacle avoidance, path planning, fleet management, and human-robot interaction. A stationary arm repeats a task. A mobile robot must know where it is, where it can move, what is blocking it, and how to avoid creating trouble for people around it.

Autonomous driving pushed these problems into one of the hardest public environments: roads. A self-driving system must detect lanes, vehicles, pedestrians, cyclists, traffic lights, construction zones, emergency vehicles, weather effects, unusual objects, and human behavior. It must then predict motion, plan safe behavior, control the vehicle, and handle rare edge cases. This is not one model. It is a large stack of sensors, maps, perception models, planning systems, control systems, simulation, validation, monitoring, remote assistance, and regulatory approval.

The current stage is shaped by embodied intelligence. Foundation models, vision-language models, and vision-language-action models are being connected to robots so they can interpret instructions, understand scenes, plan actions, and adapt across tasks. A 2025 systematic review of embodied AI for mobile service robots describes open challenges including multimodal sensor fusion, real-time decision-making under uncertainty, task generalization, and human-robot interaction.

The important correction is that embodied AI does not eliminate robotics engineering. A model may help a robot reason about a task, but the robot still needs perception, calibration, control, actuation, power, safety, testing, maintenance, and recovery. The physical world does not become easy because the language interface becomes fluent.

### How the industry works

Robotics companies work closer to hardware reality than ordinary software companies. A web application can often be patched quickly after deployment. A robot installed in a warehouse, hospital, factory, vehicle, or public environment may require physical maintenance, field debugging, spare parts, safety checks, operator training, and service procedures. Deployment is not just uploading new code.

In industrial automation, robotics work is often integration-heavy. A manufacturer may need robots for welding, painting, assembly, inspection, packaging, palletizing, or material handling. The robot itself is only one part of the system. Engineers must also design grippers, fixtures, sensors, safety zones, conveyors, PLC integration, machine vision, operator interfaces, and maintenance workflows. IFR’s 2025 report explicitly notes that adoption often depends on a developed ecosystem of system integrators, and that the wide range of required engineering capabilities in areas such as vision and process design can become a bottleneck, especially for smaller manufacturers.

In warehouse and logistics robotics, the business problem is movement at scale. Robots may move goods, sort packages, scan inventory, transport shelves, or assist workers. The technical work includes fleet management, navigation, charging, routing, obstacle avoidance, warehouse layout, human safety, and integration with inventory systems. The value is not one clever robot. The value is a fleet that improves throughput without disrupting operations.

In autonomous driving, the product is not only a vehicle that can drive once. It is a continuously monitored transportation service. Robotaxi systems require mapping, operations centers, maintenance depots, remote assistance, fleet scheduling, safety reporting, incident review, and city-by-city regulatory work. Recent reporting shows both expansion and friction: Waymo has continued public robotaxi expansion in U.S. cities, while U.S. regulators have also been updating vehicle rules and examining how purpose-built driverless vehicles should be approved and tested.

In drones and autonomous inspection, the robot may operate in infrastructure, agriculture, energy, logistics, mapping, public safety, or defense. The challenges include flight control, localization, battery limits, weather, regulations, payload constraints, communications, and safe operation near people or critical assets.

In medical and surgical robotics, the environment is highly regulated and high-stakes. A robot may assist surgery, rehabilitation, imaging, medication delivery, hospital logistics, or patient monitoring. These systems must be validated carefully because failure affects patients. Engineers work with clinicians, regulatory teams, hardware specialists, and safety experts.

In consumer and home robotics, the challenge is cost and unpredictability. Homes are cluttered, layouts vary, users are not trained operators, and price sensitivity is high. A home robot must be safe, quiet, robust, easy to use, and cheap enough to buy. This is why home robotics has been slower than science fiction suggests.

In humanoid robotics, public attention is high, but deployment remains difficult. Humanoid form is appealing because human environments are designed for human bodies, but reliable manipulation, balance, safety, cost, endurance, and autonomy remain hard. Recent reporting on humanoid systems has emphasized that many impressive prototypes still depend heavily on tele-operation or constrained demonstrations rather than fully independent long-term home operation.

In research labs, robotics work may focus on manipulation, locomotion, planning, reinforcement learning, sim-to-real transfer, SLAM, multi-agent coordination, robot learning, human-robot interaction, or embodied AI. Research can be impressive, but deployment requires another level of engineering. A method that works in a lab may not survive dust, vibration, cost limits, battery limits, safety requirements, maintenance needs, or untrained users.

### What different roles contribute

A **robotics software engineer** writes the software that makes a robot sense, decide, and act. This may include perception, planning, control, communication, data logging, simulation, diagnostics, and integration with robot middleware. A weak robotics software engineer makes a demo move once. A strong one makes the system recover from errors, explain its state, and behave predictably under real conditions.

An **autonomous driving engineer** works on the software stack for self-driving vehicles. Depending on the role, this may involve perception, prediction, planning, mapping, localization, simulation, sensor fusion, control, data pipelines, or safety validation. Autonomous driving work is demanding because road environments are open, dynamic, legally sensitive, and safety-critical.

A **perception engineer** builds systems that let robots understand their surroundings. This may involve cameras, LiDAR, radar, depth sensors, IMUs, object detection, segmentation, tracking, calibration, and sensor fusion. Perception is difficult because sensors do not see the world perfectly. They produce noisy, incomplete signals that must be interpreted under time pressure.

A **SLAM and localization engineer** helps robots know where they are. SLAM means simultaneous localization and mapping. A robot may need to build a map while moving through an environment, or localize itself within an existing map. This role is important for mobile robots, drones, AR systems, autonomous vehicles, and warehouse robots.

A **motion planning engineer** designs how robots choose safe and efficient movements. For a robot arm, this may mean moving around obstacles to grasp an object. For a mobile robot, it may mean planning a path through a warehouse. For an autonomous vehicle, it may mean choosing a safe lane change, stop, yield, or merge. Planning must consider geometry, dynamics, safety, and uncertainty.

A **controls engineer** designs how a robot moves physically. This role deals with feedback loops, stability, motors, actuators, trajectories, force, torque, latency, and precision. Control is central because a robot does not simply “decide” to move. It must command physical components that have inertia, friction, backlash, limits, and delays.

A **manipulation engineer** focuses on grasping and handling objects. This is harder than it looks. Objects have different shapes, weights, textures, friction, deformability, and positions. Humans handle this naturally. Robots need sensors, grippers, perception, control strategies, and repeated testing.

An **embodied AI or robot learning engineer** connects learning systems to physical action. This may involve imitation learning, reinforcement learning, vision-language-action models, policy learning, simulation data, tele-operation data, task planning, or generalization across robot bodies. The role is not only model training. It also requires understanding physical constraints, evaluation, safety, and sim-to-real gaps.

A **simulation engineer** builds virtual environments where robots can be trained and tested before deployment. Simulation helps evaluate edge cases, generate data, test planning systems, and reduce risk. But simulation is not reality. A good simulation engineer understands the gap between simulated physics and real hardware.

A **robotics hardware engineer** designs the physical machine: frames, joints, actuators, sensors, wiring, batteries, thermal systems, enclosures, and mechanical structure. This role often overlaps with mechanical and electrical engineering. A robot’s software cannot compensate for every poor hardware decision.

An **embedded systems engineer** builds the low-level software that runs on microcontrollers, motor controllers, sensors, and real-time systems. This work involves timing, interrupts, communication buses, firmware, power limits, and reliability. Many robot behaviors depend on embedded code that ordinary users never see.

A **robotics QA, validation, or field test engineer** tests robots in realistic conditions. This role may involve running robots for hours, recording failures, checking safety stops, testing battery behavior, measuring navigation errors, reproducing field incidents, and verifying recovery behavior. Field testing is where many hidden problems appear.

A **robotics systems engineer** connects all parts of the machine: hardware, software, sensors, control, safety, cloud services, maintenance, and user workflow. This role is valuable because robotics failures often occur at the boundaries between subsystems.

A **robotics product manager** defines what the robot is actually supposed to do for users. This role must understand the customer’s workflow, deployment environment, safety constraints, cost limits, maintenance burden, and support model. A robotics product that looks advanced but does not fit operations will fail.

### What practitioners need to become good at

The first ability is understanding the physical world. Software engineers are used to clean abstractions. Robotics does not allow that comfort. Wheels slip. Sensors drift. Cameras blur. Motors overheat. Objects move. People step into the path. A practitioner must think about the robot as a physical system, not just as code.

The second ability is debugging across layers. A robot may fail because of bad code, weak calibration, loose wiring, unstable power, poor lighting, network delay, mechanical wear, or an incorrect assumption about the environment. Debugging requires moving between logs, sensors, hardware, field observation, and software state.

The third ability is control and motion basics. Robotics practitioners should understand feedback control, PID, trajectories, kinematics, dynamics, coordinate frames, transforms, velocity, acceleration, and constraints. Not every role requires advanced control theory, but everyone should know that motion is not animation.

The fourth ability is sensor literacy. Robots rely on cameras, depth sensors, LiDAR, radar, IMUs, encoders, force sensors, GPS, microphones, and tactile sensors. Each sensor has failure modes. A camera struggles in glare or darkness. LiDAR has range and reflectivity issues. IMUs drift. GPS fails indoors. Encoders measure motion but not necessarily truth. Good robotics engineers know what their sensors can and cannot tell them.

The fifth ability is autonomy-stack thinking. A serious robot is not one model. It is a stack: sensing, calibration, perception, localization, prediction, planning, control, actuation, monitoring, safety fallback, data collection, and update systems. A practitioner who understands only one layer may build impressive demos but miss system-level failure.

The sixth ability is real-time and reliability thinking. Some robot decisions must happen within strict time limits. A delayed control command may make motion unstable. A slow perception pipeline may miss an obstacle. A blocked process may freeze behavior. Practitioners need to understand timing, scheduling, watchdogs, fail-safe behavior, and graceful degradation.

The seventh ability is safety awareness. Robots share space with people, equipment, vehicles, and infrastructure. Safety cannot be an afterthought. Practitioners must think about emergency stops, speed limits, force limits, collision avoidance, redundancy, human zones, risk assessment, and what the robot should do when uncertain.

The eighth ability is simulation and testing discipline. Robotics is expensive to test only in the real world, but dangerous to trust only in simulation. Strong teams use both: simulation for scale and repeatability, real-world testing for truth. Practitioners need to design tests that expose failure, not only confirm success.

The ninth ability is data and evaluation discipline. Modern robots often use machine learning. That means collecting real-world data, labeling it, managing edge cases, and evaluating behavior. Robotics data is expensive because it often requires physical operation. A strong practitioner respects data as an operational asset.

The tenth ability is restraint about autonomy. Full autonomy is attractive, but not always necessary. Many useful robots are semi-autonomous, supervised, teleoperated, or constrained to structured environments. A mature robotics engineer asks what level of autonomy is needed for the job, not what level sounds impressive.

### Employment outlook and risks

Robotics does not map neatly onto one official job category. Some robotics workers are software developers, some are mechanical engineers, some are electrical engineers, some are computer vision engineers, some are control engineers, some are embedded engineers, and some are technicians or field engineers.

The software side is supported by a large labor market. BLS projects software developers, QA analysts, and testers to grow 15% from 2024 to 2034, with about 129,200 openings per year. It also describes software developers as building both applications and underlying systems that run devices or control networks.
The mechanical and electrical sides also matter. BLS projects mechanical engineers to grow 9% from 2024 to 2034 and specifically links demand to automation, innovation, and complex automation machinery that must be integrated into existing systems. BLS projects electrical and electronics engineers to grow 7% over the same period, with demand tied to electrical and electronic devices, systems, infrastructure, semiconductors, and communications technologies.
The industrial robotics market is real, but not evenly distributed. IFR reported that 80% of global industrial robot installations in 2024 occurred in five markets: China, Japan, the United States, South Korea, and Germany. China alone accounted for 54% of total installations. This means geography and industry matter. Robotics opportunities cluster around manufacturing, logistics, automotive, electronics, healthcare, defense, research, and automation ecosystems.

Autonomous driving is moving from research toward deployment, but it remains constrained by safety, regulation, public acceptance, cost, and operations. Recent U.S. reporting shows both expansion of robotaxi services and regulatory changes aimed at vehicles without traditional human controls. This is a useful signal: autonomous driving is not dead, but neither is it a simple software rollout.

Entry-level robotics is difficult because the field expects breadth. A pure software beginner may not understand hardware. A mechanical beginner may not understand perception or software architecture. An AI beginner may underestimate controls, safety, and deployment. A strong beginner portfolio should show a real or simulated robot project with clear explanation: sensors used, motion planned, control loop, failure cases, test procedure, and what was learned from real-world constraints.

Humanoid robotics and embodied AI are receiving major attention, but hype should be treated carefully. Recent research surveys describe foundation models as promising for perception, reasoning, language-conditioned control, and adaptive task execution, while still emphasizing open challenges in real-time operation, grounding, resilience, safety, computational constraints, and generalization across bodies and environments.

AI will improve robotics, especially in perception, planning, language interaction, data generation, simulation, and learning from demonstration. But AI does not remove the need for mechanical design, control, safety, field testing, power management, maintenance, and operations. A robot is not useful because it talks fluently. It is useful when it performs a task safely, repeatedly, economically, and with acceptable maintenance.

The most defensible robotics careers combine software with physical-system understanding. Strong areas include industrial automation, warehouse robotics, autonomous driving, drones, surgical and medical robotics, embedded robotics, perception, controls, SLAM, simulation, robot fleet management, and field reliability. The weakest path is building only impressive demos without understanding deployment, safety, cost, and maintenance.

### Additional Resources for This Field


| Resource                                           | Best for                                      | What it helps with                                                                                                          |
| -------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| *Introduction to Robotics: Mechanics and Control*  | Learners needing classic robotics foundations | Coordinate frames, transformations, manipulators, Jacobians, dynamics, and control.                                         |
| Nav2 Documentation                                 | Mobile robot developers                       | Navigation, path planning, localization, obstacle avoidance, and autonomous mobile robot behavior in ROS 2.                 |
| MoveIt Documentation                               | Manipulation and robot-arm learners           | Motion planning, inverse kinematics, collision checking, and robot-arm control.                                             |
| Gazebo / MuJoCo / Isaac Sim Documentation          | Simulation learners                           | Robot simulation, physics environments, reinforcement learning, synthetic data, and test environments.                      |
| Autoware Documentation                             | Autonomous-driving learners                   | Open-source autonomous driving stack concepts, perception, planning, control, localization, and system integration.         |
| IEEE ICRA / IROS / Robotics and Automation Letters | Advanced learners and researchers             | Current research in robotics, manipulation, perception, planning, control, autonomous systems, and human-robot interaction. |

# 中文

机器人学，是构建能够感知世界、做出决策并进行物理行动的机器的工作。机器人可以是焊接汽车零件的工业机械臂，可以是移动货架的仓库机器人，可以是检查电力线路的无人机，可以是辅助医生的手术机器人，可以是在 sidewalk 上导航的配送机器人，可以是在交通中行驶的自动驾驶车辆，也可以是试图处理家务任务的人形原型机。

这个领域不只是“有身体的 AI”。聊天机器人可以给出错误答案，然后被纠正。机器人可能掉落物体、损坏设备、阻塞工作流、伤害人员，或在人员难以介入的地方失败。物理世界让一切变得更难。传感器有噪声，电机会磨损，电池会耗尽，地面不平，光照会变化，物体会变形，天气会干扰，人也会不可预测地行动。

机器人学位于软件、硬件、机械工程、电气工程、控制理论、计算机视觉、嵌入式系统、AI、制造、安全工程和运营之间。这让这个领域很有吸引力，但也很难随便进入。机器人工程师不仅要理解代码，还要理解运动、感知、机器、时序、安全、测试和现场故障。

### 这个领域是如何发展起来的

机器人学首先在受控环境中变得具有商业重要性。工业机器人有用，是因为工厂可以围绕它们来构造环境。如果一个机械臂重复同样的焊接、喷涂、装配、检查、包装或码垛动作成千上万次，这项工作就可以比人工更快、更一致，也更安全。机器人不需要理解整个世界。它只需要在设计好的工作空间中执行一个定义清楚的任务。

这就是为什么工业机器人比通用机器人更早成熟。工厂可以控制照明、夹具、零件、安全围栏、工具、工艺时序和维护流程。家庭、医院、街道、农场、餐馆或建筑工地则不可预测得多。环境越开放，机器人学就越困难。

工业机器人已经是大规模安装的现实，而不只是未来概念。国际机器人联合会报告称，2024 年全球工业机器人安装量为 542,076 台，全球运行存量为 4,663,698 台工业机器人。该报告还表示，安装量连续第四年保持在 500,000 台以上，电子、汽车和金属 / 机械是最大的客户行业之一。

下一阶段是移动机器人和服务机器人。机器人开始穿行于仓库、医院、办公室、商店、农场和公共空间。这需要感知、建图、定位、避障、路径规划、设备群管理和人机交互。固定机械臂重复一项任务。移动机器人则必须知道自己在哪里、哪里可以移动、什么挡住了它，以及如何避免给周围人制造麻烦。

自动驾驶把这些问题推入最困难的公共环境之一：道路。自动驾驶系统必须检测车道、车辆、行人、骑行者、交通信号灯、施工区域、应急车辆、天气影响、异常物体和人类行为。然后，它必须预测运动，规划安全行为，控制车辆，并处理罕见边界情况。这不是一个模型，而是一整套由传感器、地图、感知模型、规划系统、控制系统、仿真、验证、监控、远程协助和监管批准组成的大型栈。

当前阶段受到具身智能塑造。基础模型、视觉语言模型和视觉语言动作模型正在被连接到机器人上，使它们能够解释指令、理解场景、规划动作，并跨任务适应。2025 年一篇关于移动服务机器人具身 AI 的系统综述描述了若干开放挑战，包括多模态传感器融合、不确定性下的实时决策、任务泛化和人机交互。

重要的修正是，具身 AI 并不会消除机器人工程。模型可能帮助机器人推理任务，但机器人仍然需要感知、校准、控制、执行、供电、安全、测试、维护和恢复。语言界面变得流畅，并不会让物理世界变得简单。

### 这个行业如何运作

机器人公司比普通软件公司更接近硬件现实。Web 应用在部署后通常可以快速打补丁。安装在仓库、医院、工厂、车辆或公共环境中的机器人，可能需要物理维护、现场调试、备件、安全检查、操作员培训和服务流程。部署不只是上传新代码。

在工业自动化中，机器人工作通常高度依赖集成。制造商可能需要机器人来焊接、喷涂、装配、检查、包装、码垛或搬运材料。机器人本身只是系统的一部分。工程师还必须设计夹爪、夹具、传感器、安全区域、传送带、PLC 集成、机器视觉、操作员界面和维护工作流。IFR 2025 年报告明确指出，采用机器人往往依赖成熟的系统集成商生态，而视觉和流程设计等领域所需的广泛工程能力可能成为瓶颈，尤其是对较小制造商而言。

在仓储和物流机器人中，业务问题是大规模移动。机器人可能移动货物、分拣包裹、扫描库存、运输货架或协助工人。技术工作包括设备群管理、导航、充电、路线规划、避障、仓库布局、人员安全，以及与库存系统集成。价值不在于一个聪明机器人，而在于一支能够改善吞吐量且不打断运营的机器人队伍。

在自动驾驶中，产品不只是能开一次的车辆，而是一项被持续监控的交通服务。Robotaxi 系统需要地图、运营中心、维护站、远程协助、车队调度、安全报告、事件审查，以及按城市推进的监管工作。近期报道显示了扩张与摩擦并存：Waymo 持续在美国城市中扩展公共 robotaxi 服务，而美国监管机构也在更新车辆规则，并审查无传统人类控制装置的专用无人驾驶车辆应该如何获得批准和测试。

在无人机和自主巡检中，机器人可能运行在基础设施、农业、能源、物流、测绘、公共安全或国防场景中。挑战包括飞行控制、定位、电池限制、天气、法规、载荷约束、通信，以及在人员或关键资产附近安全运行。

在医疗和手术机器人中，环境高度受监管且高风险。机器人可能辅助手术、康复、成像、药物配送、医院物流或患者监测。这些系统必须被谨慎验证，因为失败会影响患者。工程师需要与临床医生、监管团队、硬件专家和安全专家合作。

在消费和家庭机器人中，挑战是成本和不可预测性。家庭环境杂乱，布局各异，用户不是受过训练的操作员，价格敏感度也很高。家用机器人必须安全、安静、稳健、易用，并且便宜到足以购买。这就是为什么家庭机器人比科幻作品暗示的要慢得多。

在人形机器人中，公众关注度很高，但部署仍然困难。人形形态很有吸引力，因为人类环境是为人类身体设计的，但可靠操作、平衡、安全、成本、续航和自主性仍然很难。近期关于人形系统的报道强调，许多令人印象深刻的原型仍然高度依赖远程操作或受限演示，而不是完全独立的长期家庭运行。

在研究实验室中，机器人工作可能关注操作、运动、规划、强化学习、仿真到现实迁移、SLAM、多智能体协作、机器人学习、人机交互或具身 AI。研究可能很惊艳，但部署需要另一个层级的工程。一种在实验室中有效的方法，未必能经受灰尘、振动、成本限制、电池限制、安全要求、维护需求或未经训练的用户。

### 不同角色分别贡献什么

**机器人软件工程师**编写让机器人感知、决策和行动的软件。这可能包括感知、规划、控制、通信、数据记录、仿真、诊断，以及与机器人中间件集成。薄弱的机器人软件工程师让演示动起来一次。强的工程师让系统能够从错误中恢复，解释自身状态，并在真实条件下可预测地行动。

**自动驾驶工程师**处理自动驾驶车辆的软件栈。根据角色不同，这可能涉及感知、预测、规划、地图、定位、仿真、传感器融合、控制、数据流水线或安全验证。自动驾驶工作要求很高，因为道路环境开放、动态、法律敏感，并且安全关键。

**感知工程师**构建让机器人理解周围环境的系统。这可能涉及摄像头、LiDAR、雷达、深度传感器、IMU、目标检测、分割、跟踪、校准和传感器融合。感知很困难，因为传感器并不能完美地看见世界。它们产生的是有噪声、不完整的信号，而这些信号必须在时间压力下被解释。

**SLAM 和定位工程师**帮助机器人知道自己在哪里。SLAM 指同时定位与建图。机器人可能需要一边穿过环境一边构建地图，或在已有地图中定位自身。这个角色对移动机器人、无人机、AR 系统、自动驾驶车辆和仓库机器人很重要。

**运动规划工程师**设计机器人如何选择安全且高效的运动。对于机械臂，这可能意味着绕开障碍去抓取物体。对于移动机器人，这可能意味着在仓库中规划路径。对于自动驾驶车辆，这可能意味着选择安全变道、停车、让行或汇入。规划必须考虑几何、动力学、安全和不确定性。

**控制工程师**设计机器人如何进行物理运动。这个角色处理反馈回路、稳定性、电机、执行器、轨迹、力、扭矩、延迟和精度。控制是核心，因为机器人并不是简单地“决定”移动。它必须命令具有惯性、摩擦、回差、限制和延迟的物理组件。

**操作工程师**专注于抓取和处理物体。这比看起来更难。物体具有不同形状、重量、纹理、摩擦、可变形性和位置。人类能自然处理这些问题。机器人则需要传感器、夹爪、感知、控制策略和反复测试。

**具身 AI 或机器人学习工程师**把学习系统连接到物理行动。这可能涉及模仿学习、强化学习、视觉语言动作模型、策略学习、仿真数据、远程操作数据、任务规划，或跨机器人本体的泛化。这个角色不只是模型训练。它还需要理解物理约束、评估、安全和仿真到现实的差距。

**仿真工程师**构建虚拟环境，使机器人能在部署前被训练和测试。仿真帮助评估边界情况、生成数据、测试规划系统并降低风险。但仿真不是现实。好的仿真工程师理解模拟物理和真实硬件之间的差距。

**机器人硬件工程师**设计物理机器：框架、关节、执行器、传感器、线缆、电池、热系统、外壳和机械结构。这个角色常与机械和电气工程重叠。机器人的软件不能补偿每一个糟糕的硬件决策。

**嵌入式系统工程师**构建运行在微控制器、电机控制器、传感器和实时系统上的低层软件。这项工作涉及时序、中断、通信总线、固件、功耗限制和可靠性。许多机器人行为依赖普通用户永远看不见的嵌入式代码。

**机器人 QA、验证或现场测试工程师**在真实条件下测试机器人。这个角色可能让机器人运行数小时，记录故障，检查安全停止，测试电池行为，测量导航误差，复现现场事件，并验证恢复行为。现场测试是许多隐藏问题出现的地方。

**机器人系统工程师**连接机器的所有部分：硬件、软件、传感器、控制、安全、云服务、维护和用户工作流。这个角色有价值，因为机器人失败经常发生在子系统边界处。

**机器人产品经理**定义机器人实际上应该为用户做什么。这个角色必须理解客户工作流、部署环境、安全约束、成本限制、维护负担和支持模式。一个看起来先进但不适合运营的机器人产品会失败。

### 从业者需要变得擅长什么

第一项能力是理解物理世界。软件工程师习惯于干净抽象。机器人学不允许这种舒适。轮子会打滑。传感器会漂移。摄像头会模糊。电机会过热。物体会移动。人会走进路径。从业者必须把机器人看成一个物理系统，而不只是代码。

第二项能力是跨层调试。机器人可能因为坏代码、校准薄弱、线缆松动、电源不稳、照明差、网络延迟、机械磨损，或对环境的错误假设而失败。调试需要在日志、传感器、硬件、现场观察和软件状态之间移动。

第三项能力是控制和运动基础。机器人从业者应该理解反馈控制、PID、轨迹、运动学、动力学、坐标系、变换、速度、加速度和约束。不是每个角色都需要高级控制理论，但每个人都应该知道，运动不是动画。

第四项能力是传感器素养。机器人依赖摄像头、深度传感器、LiDAR、雷达、IMU、编码器、力传感器、GPS、麦克风和触觉传感器。每种传感器都有失败模式。摄像头在强光或黑暗中会吃力。LiDAR 有量程和反射率问题。IMU 会漂移。GPS 在室内失效。编码器测量运动，但不一定测量真实情况。好的机器人工程师知道传感器能告诉他们什么，也知道不能告诉他们什么。

第五项能力是自主栈思维。严肃机器人不是一个模型，而是一个栈：感知、校准、感知模型、定位、预测、规划、控制、执行、监控、安全回退、数据收集和更新系统。只理解一层的从业者可能构建出令人印象深刻的演示，却错过系统级失败。

第六项能力是实时和可靠性思维。有些机器人决策必须在严格时间限制内发生。延迟的控制命令可能让运动不稳定。缓慢的感知流水线可能错过障碍物。被阻塞的进程可能冻结行为。从业者需要理解时序、调度、看门狗、失效安全行为和优雅降级。

第七项能力是安全意识。机器人与人、设备、车辆和基础设施共享空间。安全不能事后补充。从业者必须考虑紧急停止、速度限制、力限制、碰撞避免、冗余、人类区域、风险评估，以及当机器人不确定时应该做什么。

第八项能力是仿真和测试纪律。只在现实世界中测试机器人很昂贵，但只相信仿真也很危险。强团队两者都用：用仿真获得规模和可重复性，用真实世界测试获得真相。从业者需要设计能够暴露失败的测试，而不只是确认成功的测试。

第九项能力是数据和评估纪律。现代机器人经常使用机器学习。这意味着收集真实世界数据、标注数据、管理边界情况，并评估行为。机器人数据很昂贵，因为它常常需要物理运行。强的从业者会把数据视为运营资产。

第十项能力是对自主性的克制。完全自主很有吸引力，但并不总是必要。许多有用机器人是半自主、有人监督、远程操作，或被限制在结构化环境中的。成熟的机器人工程师会问工作需要什么程度的自主性，而不是问什么程度听起来更惊艳。

### 就业前景与风险

机器人学不能整齐对应到一个官方职业类别。一些机器人从业者是软件开发者，一些是机械工程师，一些是电气工程师，一些是计算机视觉工程师，一些是控制工程师，一些是嵌入式工程师，还有一些是技术员或现场工程师。

软件侧受到大型劳动力市场支撑。美国劳工统计局预计，2024 至 2034 年，软件开发者、QA 分析师和测试人员就业将增长 15%，每年约有 129,200 个职位空缺。它也把软件开发者描述为既构建应用，也构建运行设备或控制网络的底层系统的人。

机械和电气侧也很重要。美国劳工统计局预计，2024 至 2034 年，机械工程师就业将增长 9%，并明确把需求与自动化、创新，以及必须集成到现有系统中的复杂自动化机械联系起来。美国劳工统计局预计，同期电气与电子工程师就业将增长 7%，需求与电气和电子设备、系统、基础设施、半导体和通信技术有关。

工业机器人市场是真实的，但分布并不均匀。IFR 报告称，2024 年全球工业机器人安装量的 80% 出现在五个市场：中国、日本、美国、韩国和德国。仅中国就占总安装量的 54%。这意味着地理位置和行业很重要。机器人机会集中在制造、物流、汽车、电子、医疗、国防、研究和自动化生态中。

自动驾驶正从研究走向部署，但仍受到安全、监管、公众接受度、成本和运营约束。近期美国报道显示，robotaxi 服务既在扩张，监管也在针对没有传统人类控制装置的车辆进行规则调整。这是一个有用信号：自动驾驶没有死亡，但它也不是简单的软件发布。

入门级机器人岗位很难，因为这个领域期待广度。纯软件初学者可能不理解硬件。机械背景初学者可能不理解感知或软件架构。AI 初学者可能低估控制、安全和部署。强的初学者作品集应该展示一个真实或仿真的机器人项目，并清楚解释：使用了哪些传感器，如何规划运动，控制回路是什么，失败案例是什么，测试流程是什么，以及从真实世界约束中学到了什么。

人形机器人和具身 AI 正受到大量关注，但应谨慎对待炒作。近期研究综述把基础模型描述为在感知、推理、语言条件控制和自适应任务执行方面具有潜力，同时仍然强调实时运行、落地性、韧性、安全、计算约束，以及跨本体和环境泛化方面的开放挑战。

AI 会改善机器人学，尤其是在感知、规划、语言交互、数据生成、仿真和从演示中学习方面。但 AI 不会消除机械设计、控制、安全、现场测试、功耗管理、维护和运营的需要。机器人不是因为会流利说话才有用。它有用，是因为它能安全、重复、经济地执行任务，并且维护负担可以接受。

最具防御性的机器人职业，会把软件与物理系统理解结合起来。强领域包括工业自动化、仓库机器人、自动驾驶、无人机、手术和医疗机器人、嵌入式机器人、感知、控制、SLAM、仿真、机器人车队管理和现场可靠性。最弱的路径，是只构建令人印象深刻的演示，却不理解部署、安全、成本和维护。

### 该领域的补充资源

| 资源                                                 | 最适合谁           | 它能帮助什么                             |
| -------------------------------------------------- | -------------- | ---------------------------------- |
| *Introduction to Robotics: Mechanics and Control*  | 需要经典机器人学基础的学习者 | 坐标系、变换、机械臂、雅可比矩阵、动力学和控制。           |
| Nav2 Documentation                                 | 移动机器人开发者       | ROS 2 中的导航、路径规划、定位、避障和自主移动机器人行为。   |
| MoveIt Documentation                               | 操作和机械臂学习者      | 运动规划、逆运动学、碰撞检查和机械臂控制。              |
| Gazebo / MuJoCo / Isaac Sim Documentation          | 仿真学习者          | 机器人仿真、物理环境、强化学习、合成数据和测试环境。         |
| Autoware Documentation                             | 自动驾驶学习者        | 开源自动驾驶栈概念、感知、规划、控制、定位和系统集成。        |
| IEEE ICRA / IROS / Robotics and Automation Letters | 高阶学习者和研究者      | 机器人学、操作、感知、规划、控制、自主系统和人机交互方面的当前研究。 |

