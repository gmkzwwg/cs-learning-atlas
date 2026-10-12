---
title: "Computer Vision and Perception"
subclass: "Occupation Introduction"
layout: post-split
---

# English

Computer vision is the work of making software understand images and video. A computer vision system may detect whether a factory part is defective, read text from a scanned receipt, recognize a face, count people in a room, identify a tumor in a medical image, follow lane markings on a road, estimate the pose of a human body, or help a robot understand where objects are.

The word “vision” can make the field sound narrower than it is. In practice, many systems combine cameras with other signals: depth sensors, LiDAR, radar, infrared, GPS, IMU, audio, text, and user behavior. This is why “multimodal perception” has become important. A self-driving system does not only look at an image. It may combine camera frames, radar, LiDAR point clouds, maps, speed, and temporal history. A modern AI assistant may combine a screenshot, a document, a user question, and previous actions.

The main job of this field is not simply to classify pictures. It is to turn messy visual input into information that another system or human can act on.

### How the field developed

Computer vision began with a difficult promise: if humans can look at the world and understand it, perhaps computers can do the same. Early work used hand-designed rules and image-processing methods. Engineers tried to detect edges, corners, shapes, colors, textures, and motion. These methods could work in controlled environments, but they were fragile. A change in lighting, camera angle, background, or object shape could break the system.

Industrial machine vision became one of the early practical uses. In factories, cameras inspect products, read codes, measure dimensions, guide robots, and reject defective parts. This works best when the environment can be controlled: fixed lighting, fixed camera position, known object types, and clear pass/fail criteria. Machine vision is still important because many companies need visual inspection that is faster, more consistent, or safer than manual inspection. Machine vision systems are commonly used for automatic inspection, process control, and robot guidance in industrial settings.

The deep learning era changed the field. Instead of hand-designing every feature, engineers trained models on large labeled datasets. Convolutional neural networks improved image classification, object detection, segmentation, OCR, face recognition, medical imaging, and visual search. Later, transformer-based models and vision-language models connected images with text. A model could not only detect objects, but also answer questions about an image, describe a scene, or connect visual information to language.

Autonomous vehicles and robotics pushed the field toward real-time perception. These systems need to detect lanes, vehicles, pedestrians, traffic signs, obstacles, motion, distance, and uncertainty under changing weather, lighting, and road conditions. A survey of computer vision in autonomous vehicles describes perception as a fundamental component, using sensors such as cameras, LiDAR, radar, and ultrasonic sensors to extract information needed for safe driving.

Medical imaging pushed the field in a different direction. Here, the issue is not only accuracy but safety, regulation, workflow, and human oversight. AI tools may help detect abnormalities, prioritize urgent cases, or extract measurements from scans, but mistakes can be serious. Reuters reported in 2026 that AI-enabled medical devices had raised safety and regulatory concerns, including adverse-event reports involving misidentified body parts and software or algorithm problems. This does not mean medical AI is useless. It means visual AI in high-stakes environments must be validated, monitored, and used carefully.

The current stage is multimodal AI. Models can connect images, text, video, audio, and actions. This expands the field beyond classic computer vision. A model may inspect a screenshot and explain what a user should click. It may read a chart and answer questions. It may look at a video and summarize events. It may combine an image and a medical note. The challenge is that multimodal fluency can hide errors. A model can describe an image confidently while missing the critical detail.

### How the industry works

Computer vision work appears in several different industries.

In manufacturing and industrial automation, vision systems inspect products, read labels, measure parts, detect defects, guide robot arms, and monitor production lines. The environment may be more controlled than consumer images, but the business constraints are strict. A false positive may reject good products and waste money. A false negative may let defective products reach customers. Engineers must understand cameras, lighting, lenses, calibration, production speed, integration with machines, and maintenance.

In consumer technology, computer vision appears in camera apps, photo search, augmented reality, face unlock, filters, shopping search, accessibility tools, content moderation, and visual recommendations. These systems must work across many devices, users, lighting conditions, skin tones, environments, and privacy expectations. The technical problem is large-scale variation. The product problem is user trust.

In healthcare, vision systems are used in radiology, pathology, ophthalmology, dermatology, ultrasound, endoscopy, surgery, and hospital workflow tools. The work is highly regulated and usually involves clinical experts. A model cannot be judged only by benchmark performance. It must fit into a medical workflow, support human review, handle rare cases, and avoid misleading clinicians. In 2025, reporting on radiology AI noted that AI had not replaced radiologists but was changing their work, with many FDA-cleared tools focused on detection and prioritization rather than full replacement of human judgment.

In autonomous driving and robotics, vision is part of a larger perception and control stack. The system may need object detection, tracking, segmentation, depth estimation, sensor fusion, mapping, prediction, planning, and safety validation. This work is closer to systems engineering than image classification. A model that performs well on a dataset may still fail under rain, glare, construction zones, unusual vehicles, sensor noise, or rare pedestrian behavior.

In security and surveillance, vision systems may be used for face recognition, person re-identification, anomaly detection, access control, and public-safety monitoring. This area is technically powerful and socially sensitive. Misidentification, demographic bias, privacy loss, and misuse are serious risks. The UK Home Office acknowledged in 2025 that some facial-recognition settings were more likely to incorrectly include Black and Asian subjects in search results, according to National Physical Laboratory testing. This is a reminder that vision systems do not become fair or safe simply because they are automated.

In AI platform and model companies, vision and multimodal engineers build foundation models, image-generation systems, video models, visual embedding models, OCR systems, document understanding systems, and multimodal assistants. These teams often need deep learning, data engineering, distributed training, evaluation, and product judgment. The work may be closer to LLM engineering, but with image and video data as central inputs.

### What different roles contribute

A **computer vision engineer** builds systems that process images or video. This may involve object detection, segmentation, OCR, tracking, classification, feature extraction, pose estimation, camera calibration, or model deployment. A weak vision engineer only trains a model on a dataset. A strong one understands data collection, labeling, lighting, failure cases, metrics, deployment constraints, and how the output will be used.

A **machine vision engineer** works closer to industrial automation. This role may select cameras, lenses, lighting, triggers, image-processing methods, deep learning models, and factory integration. The goal is often practical: detect defects, measure dimensions, read codes, or guide a robot. This role requires understanding physical setup, not only algorithms.

A **perception engineer** usually works in robotics, autonomous vehicles, drones, AR devices, or embodied AI. The role may involve cameras, LiDAR, radar, depth sensors, tracking, sensor fusion, localization, mapping, and real-time constraints. Perception engineers must understand that visual output feeds into downstream decisions. A detection error may affect planning, motion, or safety.

A **medical imaging AI engineer** builds systems for radiology, pathology, ultrasound, ophthalmology, or other clinical images. This role needs collaboration with clinicians and regulatory teams. It requires careful evaluation because data may differ across hospitals, scanners, patient populations, and imaging protocols. Accuracy on one dataset may not transfer to another.

An **OCR and document AI engineer** works on reading text and structure from images or documents. This may include receipts, invoices, IDs, forms, contracts, PDFs, tables, handwriting, or scanned records. The value is not only recognizing characters; it is extracting structured information reliably from messy documents.

A **multimodal AI engineer** builds systems that combine images, text, audio, video, or tool use. This role may work on visual question answering, screenshot understanding, chart interpretation, image-grounded assistants, video summarization, or multimodal retrieval. A strong multimodal engineer understands both model behavior and product failure: the system may sound fluent while missing what matters visually.

A **computer vision data engineer** prepares datasets for training and evaluation. This role handles image collection, video sampling, annotation pipelines, label quality, dataset balance, privacy, metadata, synthetic data, and versioning. In vision work, data is often the bottleneck. A model cannot learn defects that were never labeled or rare cases that were never collected.

A **vision model researcher** works on new architectures, training methods, representation learning, segmentation methods, generative models, 3D understanding, video models, or multimodal systems. This role usually requires stronger mathematical and research background than applied engineering roles.

A **computer vision deployment engineer** focuses on making models run in real products. This may involve mobile deployment, edge devices, GPUs, cameras, embedded systems, model compression, quantization, latency, memory, power use, and monitoring. In many applications, a model that is accurate but too slow or too expensive is not useful.

A **visual QA and annotation operations specialist** supports testing and labeling. This role may manage labeling guidelines, inspect annotation quality, create edge-case datasets, organize human review, and test model outputs. It is especially important in high-stakes or data-hungry settings.

### What practitioners need to become good at

The first ability is understanding visual data. Images and videos are not neutral. They depend on lighting, camera position, lens distortion, resolution, compression, motion blur, occlusion, background, weather, skin tone, sensor noise, and labeling rules. A vision engineer must ask how the image was produced, not only what model to train.

The second ability is data labeling and dataset judgment. Many vision systems fail because labels are inconsistent, rare cases are missing, or the dataset does not match production. A defect detector trained on clean factory images may fail when the camera is dirty. A pedestrian detector may fail on unusual clothing, night scenes, or construction zones. Dataset design is engineering work, not clerical work.

The third ability is evaluation. Accuracy is often too simple. Object detection may use precision, recall, IoU, mAP, false positives, false negatives, and per-class performance. Medical imaging may require sensitivity, specificity, ROC curves, reader studies, and clinical workflow evaluation. Industrial inspection may care more about missed defects than false alarms. Good evaluation depends on the cost of mistakes.

The fourth ability is understanding the deployment environment. A model may run on a cloud GPU, a phone, a factory computer, a robot, a vehicle, a browser, or an embedded chip. Each environment has limits: latency, memory, heat, power, network access, camera quality, and update process. Vision engineering often fails when training ignores deployment.

The fifth ability is classical image-processing literacy. Deep learning is dominant, but traditional methods still matter: filtering, thresholding, morphology, edges, keypoints, calibration, homography, optical flow, stereo geometry, and color spaces. In controlled environments, a simple method may be faster, cheaper, and more reliable than a neural network.

The sixth ability is working with hardware and physical constraints. Cameras need lighting. Lenses distort. Sensors drift. Mounts vibrate. Factories get dusty. Robots move. Vehicles face glare and rain. Medical scanners differ. A strong vision engineer does not treat images as files detached from the world.

The seventh ability is privacy and fairness awareness. Vision systems can identify people, infer sensitive information, and make errors unevenly across groups. Face recognition, surveillance, hiring tools, healthcare, policing, and education require special caution. Technical performance must be considered alongside consent, access, bias, and misuse.

The eighth ability is multimodal reasoning. Modern systems often combine vision with language, audio, or sensor data. Practitioners need to know how visual evidence is represented, how it is retrieved or summarized, how it is connected to text, and where the model may invent details. Multimodal models make demos easier, but evaluation harder.

The ninth ability is communication with domain experts. In healthcare, the expert may be a radiologist. In manufacturing, it may be a quality engineer. In robotics, it may be a mechanical engineer. In retail, it may be a merchandising team. Vision systems solve real-world visual problems, and domain experts often know which errors matter most.

### Employment outlook and risks

Computer vision has strong long-term relevance because cameras and visual sensors are everywhere: phones, vehicles, factories, hospitals, warehouses, drones, stores, farms, robots, and security systems. But the job market is not uniform. Some roles are research-heavy and require advanced training. Some are applied engineering roles in product teams. Some are systems roles that combine cameras, hardware, software, and deployment.

There is no official labor category that perfectly matches “computer vision engineer.” The closest categories are software developers, data scientists, and sometimes computer and information research scientists. BLS projects software developers, QA analysts, and testers to grow 15% from 2024 to 2034, and specifically cites AI, IoT, robotics, and automation as drivers of strong demand. BLS also projects data scientist employment to grow 34% over the same period, with work that includes creating, validating, testing, and updating algorithms and models. These categories support a positive outlook for AI and vision-related work, but they do not guarantee easy entry into vision roles.

Entry-level computer vision is competitive. Many candidates can train an image classifier or object detector on public datasets. Fewer can collect good data, clean labels, analyze false positives, calibrate cameras, deploy on edge devices, handle lighting changes, or explain why the model fails. A strong portfolio should include failure analysis, dataset design, evaluation metrics, and deployment constraints, not only a model result.

The field is also split by domain. Industrial vision rewards practical reliability and hardware integration. Medical vision rewards validation, regulation, and clinical collaboration. Autonomous perception rewards real-time systems, sensor fusion, and safety thinking. Multimodal AI rewards model literacy, evaluation, retrieval, and product judgment. A general “computer vision” identity is less useful than a clear direction.

AI tools will reduce some routine work. Pretrained models, foundation models, labeling tools, synthetic data, and no-code vision platforms make simple prototypes easier. But production work remains difficult. A model that works in a demo may fail under real lighting, real users, real cameras, or rare cases. The defensible practitioner understands the full system: data, sensors, model, evaluation, deployment, monitoring, and domain risk.

There are also ethical and regulatory risks. Face recognition, surveillance, medical AI, hiring tools, and safety-critical systems can affect people directly. Errors may not be evenly distributed. Bias, privacy, consent, and accountability are part of the work, not external commentary. In high-stakes settings, “the model performs well on average” is not enough.

The strongest long-term positions are likely to be in applied domains where vision is tied to real operations: medical imaging, industrial inspection, robotics, autonomous systems, AR/VR, document automation, multimodal AI products, and edge AI. The weakest positions are those based only on training generic models without domain, deployment, or evaluation depth.

### Additional Resources for This Field


| Resource                                                     | Best for                                              | What it helps with                                                                                               |
| ------------------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Deep Learning for Computer Vision by Michigan / EECS 498-007 | Learners wanting project-based vision depth           | Modern visual recognition, detection, segmentation, generative models, and implementation practice.              |
| OpenCV Documentation                                         | Applied vision engineers                              | Classical image processing, camera calibration, geometry, video processing, and practical computer vision tools. |
| PyTorch Vision / Torchvision Documentation                   | Deep learning practitioners                           | Datasets, pretrained models, transforms, detection models, and training workflows.                               |
| Hugging Face Vision Tasks Documentation                      | Multimodal and applied AI developers                  | Image classification, object detection, segmentation, image-text models, and model deployment.                   |
| Papers with Code: Computer Vision                            | Learners tracking current methods                     | Finding models, benchmarks, papers, and implementations by task.                                                 |
| Roboflow Learn / Roboflow Universe                           | Applied CV beginners                                  | Dataset preparation, labeling, object detection workflows, and practical deployment examples.                    |
| Label Studio                                                 | Data and annotation teams                             | Managing labeling workflows for images, video, OCR, and multimodal datasets.                                     |
| FiftyOne                                                     | Vision dataset and evaluation learners                | Dataset inspection, error analysis, embeddings, model evaluation, and visual debugging.                          |
| NVIDIA TensorRT / ONNX Runtime Documentation                 | Deployment-focused engineers                          | Model optimization, inference acceleration, quantization, and edge or GPU deployment.                            |
| Edge Impulse                                                 | Embedded and edge AI learners                         | Building and deploying vision models on edge devices and microcontrollers.                                       |
| MONAI                                                        | Medical imaging AI learners                           | Deep learning workflows for medical imaging, segmentation, radiology, and clinical research tooling.             |
| KITTI / COCO / ImageNet / Cityscapes / nuScenes datasets     | Learners building serious projects                    | Standard datasets for classification, detection, segmentation, autonomous driving, and benchmarking.             |
| OWASP AI security resources | Safety-aware practitioners                            | Risk management, evaluation discipline, governance, and responsible AI deployment.                               |

# 中文

计算机视觉，是让软件理解图像和视频的工作。一个计算机视觉系统可能会检测工厂零件是否有缺陷，读取扫描收据上的文字，识别人脸，统计房间里的人数，识别医学图像中的肿瘤，跟随道路上的车道线，估计人体姿态，或帮助机器人理解物体在哪里。

“视觉”这个词可能会让这个领域听起来比实际更窄。在实践中，许多系统会把相机与其他信号结合起来：深度传感器、LiDAR、雷达、红外、GPS、IMU、音频、文本和用户行为。这就是为什么“多模态感知”变得重要。自动驾驶系统不只是看一张图像。它可能会结合相机帧、雷达、LiDAR 点云、地图、速度和时间历史。现代 AI 助手也可能会结合屏幕截图、文档、用户问题和之前的操作。

这个领域的主要任务并不是简单地给图片分类，而是把混乱的视觉输入转化为另一个系统或人可以据此行动的信息。

### 这个领域是如何发展起来的

计算机视觉一开始带着一个艰难的承诺：如果人类能够看见世界并理解它，也许计算机也能做到。早期工作使用人工设计的规则和图像处理方法。工程师试图检测边缘、角点、形状、颜色、纹理和运动。这些方法在受控环境中可以工作，但很脆弱。光照、相机角度、背景或物体形状一变化，系统就可能失效。

工业机器视觉是早期实际应用之一。在工厂中，相机会检查产品、读取编码、测量尺寸、引导机器人，并剔除有缺陷的零件。当环境可以被控制时，这类系统效果最好：固定光照、固定相机位置、已知物体类型和清晰的通过 / 不通过标准。机器视觉现在仍然重要，因为许多公司需要比人工检查更快、更一致或更安全的视觉检测。机器视觉系统常用于工业环境中的自动检测、过程控制和机器人引导。

深度学习时代改变了这个领域。工程师不再为每个特征手工设计规则，而是在大量标注数据上训练模型。卷积神经网络改进了图像分类、目标检测、分割、OCR、人脸识别、医学影像和视觉搜索。后来，基于 Transformer 的模型和视觉-语言模型把图像与文本连接起来。模型不仅能检测物体，还能回答关于图像的问题，描述场景，或把视觉信息与语言联系起来。

自动驾驶和机器人技术把这个领域推向了实时感知。这些系统需要在不断变化的天气、光照和道路条件下，检测车道、车辆、行人、交通标志、障碍物、运动、距离和不确定性。一篇关于自动驾驶中计算机视觉的综述把感知描述为基础组件，它使用相机、LiDAR、雷达和超声波传感器等传感器，提取安全驾驶所需的信息。

医学影像把这个领域推向另一个方向。这里的问题不仅是准确率，还有安全、监管、工作流和人的监督。AI 工具可能帮助检测异常、优先处理紧急病例，或从扫描图像中提取测量值，但错误可能很严重。路透社 2026 年报道称，AI 医疗设备已经引发安全和监管担忧，包括把身体部位识别错误，以及软件或算法问题导致的不良事件报告。这并不意味着医学 AI 没有用，而是说明高风险环境中的视觉 AI 必须经过验证、监控，并被谨慎使用。

当前阶段是多模态 AI。模型可以连接图像、文本、视频、音频和动作。这让该领域超越了传统计算机视觉。模型可以检查一张屏幕截图，并解释用户应该点击哪里。它可以读懂图表并回答问题。它可以观看视频并总结事件。它也可以结合一张图像和一份医学记录。挑战在于，多模态流畅性可能掩盖错误。一个模型可能自信地描述一张图像，却漏掉最关键的细节。

### 这个行业如何运作

计算机视觉工作出现在几个不同产业中。

在制造业和工业自动化中，视觉系统会检查产品、读取标签、测量零件、检测缺陷、引导机械臂，并监控生产线。这个环境可能比消费级图像更受控，但商业约束很严格。误报可能会拒绝合格产品，造成浪费。漏报可能会让有缺陷的产品到达客户手中。工程师必须理解相机、光照、镜头、校准、生产速度、与机器集成以及维护。

在消费科技中，计算机视觉出现在相机应用、照片搜索、增强现实、人脸解锁、滤镜、购物搜索、无障碍工具、内容审核和视觉推荐中。这些系统必须跨许多设备、用户、光照条件、肤色、环境和隐私预期工作。技术问题是大规模差异。产品问题是用户信任。

在医疗健康中，视觉系统被用于放射科、病理学、眼科、皮肤科、超声、内窥镜、外科手术和医院工作流工具。这类工作高度受监管，通常涉及临床专家。不能只用基准测试表现来评价模型。它必须适合医疗工作流，支持人工审查，处理罕见情况，并避免误导临床医生。2025 年关于放射科 AI 的报道指出，AI 并没有取代放射科医生，而是在改变他们的工作；许多获得 FDA 许可的工具，重点是检测和优先级排序，而不是完全替代人的判断。

在自动驾驶和机器人中，视觉是更大感知与控制栈的一部分。系统可能需要目标检测、跟踪、分割、深度估计、传感器融合、建图、预测、规划和安全验证。这项工作更接近系统工程，而不是图像分类。一个在数据集上表现良好的模型，仍然可能在雨天、眩光、施工区域、异常车辆、传感器噪声或罕见行人行为中失败。

在安全和监控中，视觉系统可能用于人脸识别、行人重识别、异常检测、访问控制和公共安全监控。这个领域技术能力很强，但社会敏感度也很高。误识别、人口群体偏差、隐私损失和滥用都是严重风险。英国 Home Office 在 2025 年承认，根据 National Physical Laboratory 测试，某些人脸识别设置更有可能把黑人和亚洲人错误地纳入搜索结果。这提醒我们，视觉系统不会因为自动化就自然变得公平或安全。

在 AI 平台和模型公司中，视觉与多模态工程师构建基础模型、图像生成系统、视频模型、视觉嵌入模型、OCR 系统、文档理解系统和多模态助手。这些团队通常需要深度学习、数据工程、分布式训练、评估和产品判断。工作可能更接近 LLM 工程，但图像和视频数据是核心输入。

### 不同角色分别贡献什么

**计算机视觉工程师**构建处理图像或视频的系统。这可能涉及目标检测、分割、OCR、跟踪、分类、特征提取、姿态估计、相机校准或模型部署。薄弱的视觉工程师只是拿数据集训练模型。强的视觉工程师理解数据收集、标注、光照、失败案例、指标、部署约束，以及输出将如何被使用。

**机器视觉工程师**更接近工业自动化。这个角色可能会选择相机、镜头、光源、触发器、图像处理方法、深度学习模型和工厂集成方案。目标通常很实际：检测缺陷、测量尺寸、读取编码，或引导机器人。这个角色需要理解物理设置，而不只是算法。

**感知工程师**通常工作在机器人、自动驾驶车辆、无人机、AR 设备或具身 AI 中。这个角色可能涉及相机、LiDAR、雷达、深度传感器、跟踪、传感器融合、定位、建图和实时约束。感知工程师必须理解，视觉输出会进入下游决策。一次检测错误可能影响规划、运动或安全。

**医学影像 AI 工程师**构建用于放射科、病理学、超声、眼科或其他临床图像的系统。这个角色需要与临床医生和监管团队合作。它需要谨慎评估，因为不同医院、扫描仪、患者群体和成像协议之间的数据可能不同。一个数据集上的准确率，未必能迁移到另一个环境。

**OCR 与文档 AI 工程师**处理从图像或文档中读取文字和结构。这可能包括收据、发票、身份证件、表单、合同、PDF、表格、手写体或扫描记录。价值不只是识别字符，而是从混乱文档中可靠地提取结构化信息。

**多模态 AI 工程师**构建结合图像、文本、音频、视频或工具使用的系统。这个角色可能处理视觉问答、屏幕截图理解、图表解读、基于图像的助手、视频摘要或多模态检索。强的多模态工程师既理解模型行为，也理解产品失败：系统可能说得很流畅，却漏掉视觉上真正重要的内容。

**计算机视觉数据工程师**为训练和评估准备数据集。这个角色处理图像收集、视频采样、标注流水线、标签质量、数据集平衡、隐私、元数据、合成数据和版本管理。在视觉工作中，数据常常是瓶颈。模型不可能学会从未标注过的缺陷，或从未收集过的罕见情况。

**视觉模型研究员**研究新的架构、训练方法、表征学习、分割方法、生成模型、3D 理解、视频模型或多模态系统。这个角色通常比应用工程角色需要更强的数学和研究背景。

**计算机视觉部署工程师**专注于让模型在真实产品中运行。这可能涉及移动端部署、边缘设备、GPU、相机、嵌入式系统、模型压缩、量化、延迟、内存、功耗和监控。在许多应用中，准确但太慢或太贵的模型并没有用。

**视觉 QA 与标注运营专员**支持测试和标注。这个角色可能管理标注指南，检查标注质量，创建边界案例数据集，组织人工审查，并测试模型输出。在高风险或高度依赖数据的场景中，这个角色尤其重要。

### 从业者需要变得擅长什么

第一项能力是理解视觉数据。图像和视频不是中性的。它们取决于光照、相机位置、镜头畸变、分辨率、压缩、运动模糊、遮挡、背景、天气、肤色、传感器噪声和标注规则。视觉工程师必须询问图像是如何产生的，而不只是问该训练什么模型。

第二项能力是数据标注和数据集判断。许多视觉系统失败，是因为标签不一致、缺少罕见情况，或数据集与生产环境不匹配。一个在干净工厂图像上训练的缺陷检测器，可能会在相机变脏时失败。一个行人检测器，可能会在异常衣着、夜间场景或施工区域中失败。数据集设计是工程工作，不是文书工作。

第三项能力是评估。准确率往往过于简单。目标检测可能使用精确率、召回率、IoU、mAP、误报、漏报和按类别划分的表现。医学影像可能需要敏感性、特异性、ROC 曲线、读片者研究和临床工作流评估。工业检测可能更在意漏检缺陷，而不是误报。好的评估取决于错误的代价。

第四项能力是理解部署环境。模型可能运行在云端 GPU、手机、工厂计算机、机器人、车辆、浏览器或嵌入式芯片上。每种环境都有约束：延迟、内存、热量、功耗、网络访问、相机质量和更新流程。视觉工程常常在训练阶段忽视部署环境时失败。

第五项能力是经典图像处理素养。深度学习占主导地位，但传统方法仍然重要：滤波、阈值、形态学、边缘、关键点、校准、单应性、光流、立体几何和颜色空间。在受控环境中，一个简单方法可能比神经网络更快、更便宜，也更可靠。

第六项能力是处理硬件和物理约束。相机需要光照。镜头会畸变。传感器会漂移。支架会振动。工厂会积灰。机器人会移动。车辆会遇到眩光和雨。医学扫描仪彼此不同。强的视觉工程师不会把图像当成脱离世界的文件。

第七项能力是隐私和公平意识。视觉系统可以识别人，推断敏感信息，并在不同群体中产生不均衡错误。人脸识别、监控、招聘工具、医疗、警务和教育都需要特殊谨慎。技术表现必须与同意、访问权限、偏差和滥用一起考虑。

第八项能力是多模态推理。现代系统常常把视觉与语言、音频或传感器数据结合起来。从业者需要知道视觉证据如何被表示、如何被检索或总结、如何与文本连接，以及模型可能在哪里编造细节。多模态模型让演示更容易，但让评估更困难。

第九项能力是与领域专家沟通。在医疗中，专家可能是放射科医生。在制造业中，专家可能是质量工程师。在机器人中，专家可能是机械工程师。在零售中，专家可能是商品团队。视觉系统解决的是真实世界中的视觉问题，而领域专家往往最清楚哪些错误最重要。

### 就业前景与风险

计算机视觉有很强的长期相关性，因为相机和视觉传感器无处不在：手机、车辆、工厂、医院、仓库、无人机、商店、农场、机器人和安全系统。但就业市场并不统一。有些角色偏研究，需要高级训练。有些是产品团队中的应用工程角色。有些是结合相机、硬件、软件和部署的系统角色。

没有一个官方职业类别能完美对应“计算机视觉工程师”。最接近的类别是软件开发者、数据科学家，有时还包括计算机和信息研究科学家。美国劳工统计局预计，2024 至 2034 年，软件开发者、QA 分析师和测试人员就业将增长 15%，并特别提到 AI、IoT、机器人和自动化是强劲需求的驱动因素。美国劳工统计局还预计，同期数据科学家就业将增长 34%，其工作包括创建、验证、测试和更新算法与模型。这些类别支撑了 AI 和视觉相关工作的积极前景，但并不保证视觉岗位容易进入。

入门级计算机视觉竞争激烈。许多候选人可以在公开数据集上训练一个图像分类器或目标检测器。更少的人能够收集好数据、清洗标签、分析误报、校准相机、部署到边缘设备、处理光照变化，或解释模型为什么失败。强作品集应该包括失败分析、数据集设计、评估指标和部署约束，而不只是一个模型结果。

这个领域也按应用场景分裂。工业视觉奖励实际可靠性和硬件集成。医学视觉奖励验证、监管和临床协作。自动驾驶感知奖励实时系统、传感器融合和安全思维。多模态 AI 奖励模型素养、评估、检索和产品判断。泛泛地说自己是“计算机视觉”从业者，不如明确一个方向有用。

AI 工具会减少一些常规工作。预训练模型、基础模型、标注工具、合成数据和无代码视觉平台，让简单原型更容易。但生产工作仍然困难。一个在演示中可行的模型，可能会在真实光照、真实用户、真实相机或罕见情况中失败。具备防御性的从业者理解完整系统：数据、传感器、模型、评估、部署、监控和领域风险。

这里也有伦理和监管风险。人脸识别、监控、医学 AI、招聘工具和安全关键系统，都可能直接影响人。错误未必会在不同群体中均匀分布。偏差、隐私、同意和问责，是工作的一部分，不是外部评论。在高风险场景中，“模型平均表现良好”是不够的。

最强的长期职位，可能会出现在视觉与真实运营绑定的应用领域：医学影像、工业检测、机器人、自动驾驶系统、AR/VR、文档自动化、多模态 AI 产品和边缘 AI。最弱的职位，是那些只训练通用模型，却缺少领域、部署或评估深度的岗位。

### 该领域的补充资源

| 资源                                                           | 最适合谁           | 它能帮助什么                         |
| ------------------------------------------------------------ | -------------- | ------------------------------ |
| Deep Learning for Computer Vision by Michigan / EECS 498-007 | 想获得项目型视觉深度的学习者 | 现代视觉识别、检测、分割、生成模型和实现练习。        |
| OpenCV Documentation                                         | 应用型视觉工程师       | 经典图像处理、相机校准、几何、视频处理和实用计算机视觉工具。 |
| PyTorch Vision / Torchvision Documentation                   | 深度学习从业者        | 数据集、预训练模型、变换、检测模型和训练工作流。       |
| Hugging Face Vision Tasks Documentation                      | 多模态和应用 AI 开发者  | 图像分类、目标检测、分割、图像-文本模型和模型部署。     |
| Papers with Code: Computer Vision                            | 跟踪当前方法的学习者     | 按任务查找模型、基准、论文和实现。              |
| Roboflow Learn / Roboflow Universe                           | 应用型 CV 初学者     | 数据集准备、标注、目标检测工作流和实用部署示例。       |
| Label Studio                                                 | 数据和标注团队        | 管理图像、视频、OCR 和多模态数据集的标注工作流。     |
| FiftyOne                                                     | 视觉数据集和评估学习者    | 数据集检查、错误分析、嵌入、模型评估和视觉调试。       |
| NVIDIA TensorRT / ONNX Runtime Documentation                 | 关注部署的工程师       | 模型优化、推理加速、量化，以及边缘或 GPU 部署。     |
| Edge Impulse                                                 | 嵌入式和边缘 AI 学习者  | 在边缘设备和微控制器上构建并部署视觉模型。          |
| MONAI                                                        | 医学影像 AI 学习者    | 医学影像、分割、放射学和临床研究工具的深度学习工作流。    |
| KITTI / COCO / ImageNet / Cityscapes / nuScenes datasets     | 构建严肃项目的学习者     | 分类、检测、分割、自动驾驶和基准测试的标准数据集。      |
| OWASP AI security resources                                  | 具备安全意识的从业者     | 风险管理、评估纪律、治理和负责任的 AI 部署。       |

