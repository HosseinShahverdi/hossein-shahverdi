/* ------------------------------------------------------------------
   All site content lives here. Edit this file to update the portfolio.
   Items marked status "Building" / "Concept" / "Planned" are project
   ideas — swap links from "#" to real URLs once they ship.
------------------------------------------------------------------- */

export type Status =
  | "Shipped"
  | "Building"
  | "Concept"
  | "Published"
  | "Preprint"
  | "Planned";
export type ArtVariant = "radar" | "hex" | "nodes" | "orbit" | "wave" | "grid";

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  tags: string[];
  category: string;
  status: Status;
  year: string;
  art: ArtVariant;
  featured?: boolean;
  demo?: string;
  github?: string;
  paper?: string;
};

export const profile = {
  name: "Hossein Shahverdi",
  first: "Hossein",
  last: "Shahverdi",
  roles: ["AI engineer", "Cybersecurity specialist", "Full-stack developer"],
  location: "Tabriz, Iran",
  timezone: "Asia/Tehran",
  email: "h.shahverdi1997@gmail.com",
  links: {
    github: "https://github.com/your-handle", // TODO: real handle
    linkedin: "https://www.linkedin.com/in/your-handle", // TODO
    scholar: "#", // TODO: Google Scholar
    lab: "#", // TODO: NAIRG lab page
  },
};

/* ============================ ENGINEERING ============================ */

export const engineeringIntro =
  "I build fast, secure software and the models that run inside it — from Transformers on streaming sensor data to hardened web apps shipped end to end.";

export const engineeringStats = [
  { value: "8", label: "Publications in AI & signal processing" },
  { value: "20/20", label: "M.Sc. thesis grade" },
  { value: "Top 0.6%", label: "National M.Sc. entrance exam, 50k+ candidates" },
  { value: "4", label: "Languages spoken" },
];

export type Tier = "core" | "strong" | "learning";
export type Skill = { name: string; short: string; tier: Tier; group: string };

export const engineeringSkills: Skill[] = [
  { name: "Next.js", short: "Nx", tier: "strong", group: "Frontend" },
  { name: "React", short: "Re", tier: "strong", group: "Frontend" },
  { name: "TypeScript", short: "Ts", tier: "strong", group: "Frontend" },
  { name: "Tailwind CSS", short: "Tw", tier: "core", group: "Frontend" },
  { name: "Three.js", short: "3D", tier: "strong", group: "Frontend" },
  { name: "Flutter", short: "Fl", tier: "strong", group: "Frontend" },
  { name: "Python", short: "Py", tier: "core", group: "Backend" },
  { name: "FastAPI", short: "Fa", tier: "core", group: "Backend" },
  { name: "Flask", short: "Fk", tier: "strong", group: "Backend" },
  { name: "Django", short: "Dj", tier: "strong", group: "Backend" },
  { name: "PHP / Laravel", short: "Lv", tier: "strong", group: "Backend" },
  { name: "Node / Express", short: "No", tier: "strong", group: "Backend" },
  { name: "Go", short: "Go", tier: "learning", group: "Backend" },
  { name: "MySQL", short: "Sq", tier: "strong", group: "Data & infra" },
  { name: "MongoDB", short: "Mg", tier: "strong", group: "Data & infra" },
  { name: "Linux", short: "Lx", tier: "core", group: "Data & infra" },
  { name: "Git", short: "Gt", tier: "core", group: "Data & infra" },
  { name: "Docker", short: "Dk", tier: "learning", group: "Data & infra" },
  { name: "Kubernetes", short: "K8", tier: "learning", group: "Data & infra" },
  {
    name: "Kali toolchain",
    short: "Ka",
    tier: "learning",
    group: "Data & infra",
  },
];

export const engineeringProjects: Project[] = [
  {
    id: "phantomscope",
    title: "PhantomScope",
    tagline: "Attack-surface recon you can actually read.",
    description:
      "A self-hosted recon console that runs Nmap and service fingerprinting, maps exposed hosts into a live graph, and matches versions against public CVE feeds — so a scan becomes a ranked to-do list instead of a wall of text.",
    highlights: [
      "Async scan workers behind a FastAPI job queue",
      "Live host and port graph rendered in Three.js",
      "CVE matching with severity-ranked findings",
      "Authorised-targets-only scope lock, on by default",
    ],
    tags: ["Next.js", "TypeScript", "FastAPI", "Nmap", "Three.js", "Docker"],
    category: "Web + Security",
    status: "Building",
    year: "2026",
    art: "radar",
    featured: true,
    demo: "#",
    github: "#",
  },
  {
    id: "vaultline",
    title: "VaultLine",
    tagline: "Secrets that burn after reading.",
    description:
      "Zero-knowledge secret sharing. Payloads are encrypted in the browser with AES-GCM, the key never leaves the URL fragment, and the ciphertext is destroyed after one read or a timer. The server never sees plaintext.",
    highlights: [
      "Client-side encryption with the Web Crypto API",
      "One-time links with expiry and view limits",
      "Rate limiting and a tamper-evident audit log",
      "Laravel API with a Next.js front end",
    ],
    tags: ["Next.js", "Web Crypto", "Laravel", "MySQL", "Tailwind"],
    category: "Web + Security",
    status: "Building",
    year: "2026",
    art: "hex",
    demo: "#",
    github: "#",
  },
  {
    id: "promptshield",
    title: "PromptShield",
    tagline: "A firewall for LLM prompts.",
    description:
      "A drop-in proxy in front of any LLM API. Every request is scored for prompt injection, jailbreak patterns and data exfiltration before it reaches the model, and a dashboard shows what was blocked and why.",
    highlights: [
      "OpenAI-compatible reverse proxy in FastAPI",
      "Fine-tuned Transformer classifier plus a rule layer",
      "Human-readable reasons for every block",
      "Per-key policies and allow-lists",
    ],
    tags: ["Python", "FastAPI", "PyTorch", "Transformers", "React"],
    category: "AI + Security",
    status: "Concept",
    year: "2026",
    art: "nodes",
    github: "#",
  },
  {
    id: "kinetica",
    title: "Kinetica",
    tagline: "My thesis model, shipped as a mobile SDK.",
    description:
      "A Flutter plugin that runs a parameter-efficient Transformer on the phone's IMU stream and emits activity events in real time. No server, and no sensor data leaves the device.",
    highlights: [
      "TFLite export with int8 quantisation",
      "Streaming windowing tuned for low latency",
      "Platform channels for Android and iOS",
      "Privacy-first: fully on-device inference",
    ],
    tags: ["Flutter", "Dart", "TensorFlow Lite", "PyTorch"],
    category: "AI + Mobile",
    status: "Building",
    year: "2026",
    art: "wave",
    featured: true,
    github: "#",
  },
  {
    id: "honeycomb",
    title: "Honeycomb",
    tagline: "Watch the internet knock on your door.",
    description:
      "A fleet of containerised low-interaction honeypots (SSH, HTTP) that stream every login attempt and payload to a live 3D globe, turning background noise into threat intelligence you can see.",
    highlights: [
      "One-command Docker deploy per sensor",
      "WebSocket event stream to the dashboard",
      "GeoIP and ASN enrichment",
      "Export findings as STIX bundles",
    ],
    tags: ["Go", "Docker", "WebSockets", "Three.js", "MongoDB"],
    category: "Security",
    status: "Concept",
    year: "2026",
    art: "orbit",
    github: "#",
  },
  {
    id: "forgeline",
    title: "Forgeline",
    tagline: "Distributed training from one dashboard.",
    description:
      "A control plane for PyTorch DDP jobs on Kubernetes: launch multi-GPU runs from a web UI, stream logs and metrics live, and resume from checkpoints automatically when a node disappears.",
    highlights: [
      "Kubernetes Jobs driving torchrun",
      "Live loss and GPU metrics over WebSockets",
      "Checkpoint-aware restarts",
      "Next.js dashboard with role-based access",
    ],
    tags: ["Kubernetes", "Docker", "PyTorch", "Next.js"],
    category: "Web + Infra",
    status: "Building",
    year: "2026",
    art: "grid",
    featured: true,
    github: "#",
  },
];

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  text: string;
  tags?: string[];
};

export const engineeringTimeline: TimelineItem[] = [
  {
    period: "Now",
    title: "Building open-source AI and security tools",
    org: "Independent",
    text: "Shipping PhantomScope, VaultLine and Forgeline in public while going deep on Docker, Kubernetes and the Kali toolchain.",
    tags: ["Docker", "Kubernetes", "Nmap", "Burp Suite"],
  },
  {
    period: "2023 – 2024",
    title: "Research intern",
    org: "Biomedical and Neuroscience Research Laboratory",
    text: "Maintained and calibrated CT and MRI equipment, and built EEG collection and analysis pipelines for Alzheimer's diagnosis.",
    tags: ["EEG", "Signal processing", "Python"],
  },
  {
    period: "2020 – 2023",
    title: "Graduate researcher",
    org: "NAIRG Lab, Shahid Beheshti University",
    text: "Designed a lightweight Transformer for on-device activity recognition and built Wi-Fi CSI preprocessing pipelines. Four papers came out of this work.",
    tags: ["PyTorch", "Transformers", "Wi-Fi CSI"],
  },
  {
    period: "2020 – now",
    title: "Language instructor, English and German",
    org: "Private tuition",
    text: "Six years of explaining hard things clearly, one student at a time.",
  },
  {
    period: "2018 – 2022",
    title: "Teaching assistant",
    org: "Sahand University of Technology, Shahid Beheshti University",
    text: "Digital signal processing, telecommunication networks, computer networks and convex optimisation.",
  },
];

/* ============================== RESEARCH ============================== */

export const researchInterests = [
  "Efficient deep learning",
  "Transformers for time series",
  "Explainable AI",
  "Distributed training",
  "Signal processing",
  "Medical imaging",
];

export const researchProjects: Project[] = [
  {
    id: "lite-transformer",
    title: "Lightweight Transformer for HAR",
    tagline: "Activity recognition that fits on a phone.",
    description:
      "A parameter-efficient Transformer for on-device inference on streaming smartphone IMU data, benchmarked against CNN and LSTM baselines on public and self-collected datasets. M.Sc. thesis, graded 20/20, presented at IHIET-FS 2025 in London.",
    highlights: [
      "Designed for on-device, streaming inference",
      "Benchmarked against CNN and LSTM baselines",
      "Evaluated on public and self-collected datasets",
    ],
    tags: ["PyTorch", "Transformers", "Time series", "Edge AI"],
    category: "Thesis",
    status: "Published",
    year: "2023 – 2025",
    art: "wave",
    featured: true,
    paper: "#",
  },
  {
    id: "csi-har",
    title: "Seeing motion in Wi-Fi",
    tagline: "Edge detection on channel state information.",
    description:
      "Preprocessing pipelines that treat Wi-Fi CSI as an image and extract Canny edge features, sharpening activity boundaries before CNN classification. Published in Information (MDPI) and at ABC 2022.",
    highlights: [
      "Device-free sensing: no wearables required",
      "Canny edge features improve CNN accuracy",
      "Two journal papers and one conference paper",
    ],
    tags: ["Wi-Fi CSI", "CNN", "OpenCV", "Signal processing"],
    category: "Signal processing",
    status: "Published",
    year: "2020 – 2023",
    art: "radar",
    paper: "https://doi.org/10.3390/info14070404",
  },
  {
    id: "dual-cyclegan",
    title: "3D Dual-CycleGAN",
    tagline: "Synthesising MRI contrasts that were never acquired.",
    description:
      "Co-developed a 3D Dual-CycleGAN for cross-contrast MRI synthesis, trained on multi-GPU PyTorch. Published in the Egyptian Journal of Radiology and Nuclear Medicine.",
    highlights: [
      "Volumetric (3D) image-to-image translation",
      "Cycle consistency in both directions",
      "Multi-GPU training pipeline",
    ],
    tags: ["GANs", "3D CNN", "PyTorch", "MRI"],
    category: "Medical imaging",
    status: "Published",
    year: "2023 – 2024",
    art: "orbit",
    paper: "#",
  },
  {
    id: "uphair",
    title: "UPhAIR",
    tagline: "AI explanations a clinician can read.",
    description:
      "A hybrid post-hoc explanation pipeline that couples radiomics with LLM-generated clinical reports for glioma IDH-mutation prediction. Co-author; preprint on medRxiv.",
    highlights: [
      "Radiomics features as the explanation backbone",
      "LLM turns attributions into plain-language reports",
      "Built for neuro-oncology decision support",
    ],
    tags: ["XAI", "Radiomics", "LLMs", "Neuro-oncology"],
    category: "Explainable AI",
    status: "Preprint",
    year: "2025 – 2026",
    art: "nodes",
    featured: true,
    paper: "#",
  },
];

export type Experiment = {
  id: string;
  name: string;
  question: string;
  approach: string;
  stack: string[];
  status: Status;
};

export const experiments: Experiment[] = [
  {
    id: "packetlens",
    name: "PacketLens",
    question:
      "Can a time-series Transformer spot intrusions in raw network flows?",
    approach:
      "Treat flows as multivariate sequences, reuse the lightweight HAR Transformer, and benchmark on CIC-IDS2017 and UNSW-NB15 against tree-based baselines.",
    stack: ["PyTorch", "Scapy", "Wireshark"],
    status: "Planned",
  },
  {
    id: "mirage",
    name: "Mirage",
    question:
      "How easily can sensor-based activity models be fooled, and defended?",
    approach:
      "Craft physically plausible adversarial perturbations on IMU streams (FGSM, PGD), then test adversarial training and input purification.",
    stack: ["PyTorch", "Adversarial ML"],
    status: "Planned",
  },
  {
    id: "featherweight",
    name: "Featherweight",
    question: "How small can a HAR Transformer get before accuracy breaks?",
    approach:
      "Distillation, structured pruning and int8 quantisation, measured as accuracy against real on-phone latency.",
    stack: ["PyTorch", "TFLite", "ONNX"],
    status: "Building",
  },
  {
    id: "wavesense",
    name: "WaveSense",
    question: "Room-level presence sensing with a five-dollar Wi-Fi chip?",
    approach:
      "ESP32 CSI capture, edge-detection features and a tiny CNN, streamed to a live browser dashboard.",
    stack: ["ESP32", "CNN", "WebSockets"],
    status: "Concept",
  },
];

export type Publication = {
  year: number;
  title: string;
  authors: string;
  venue: string;
  type: "Journal" | "Conference" | "Preprint" | "Abstract";
  url?: string;
};

export const publications: Publication[] = [
  {
    year: 2026,
    title:
      "UPhAIR: A hybrid pipeline for generating understandable post-hoc AI reports in glioma IDH mutation status prediction",
    authors:
      "Gorji, A., Shahverdi, H., Saberi, A., Gheiji, B., Farahani, S., Azemi, G., & Di Ieva, A.",
    venue: "medRxiv",
    type: "Preprint",
  },
  {
    year: 2025,
    title:
      "Lightweight Transformer for robust human activity recognition using smartphone IMU data",
    authors: "Shahverdi, H. & Ghorashi, S. A.",
    venue: "IHIET-FS 2025, University of East London",
    type: "Conference",
  },
  {
    year: 2024,
    title:
      "Assessing the efficacy of 3D Dual-CycleGAN for multi-contrast MRI synthesis",
    authors:
      "Mahboubisarighieh, A., Shahverdi, H., Jafarpoor Nesheli, S., Alipoor Kermani, M., Niknam, M., Torkashvand, M., & Rezaeijo, S. M.",
    venue: "Egyptian Journal of Radiology and Nuclear Medicine, 55(1)",
    type: "Journal",
  },
  {
    year: 2024,
    title: "A CSI-based human activity recognition using Canny edge detector",
    authors:
      "Shahverdi, H., Fard Moshiri, P., Nabati, M., Asvadi, R., & Ghorashi, S. A.",
    venue: "ABC 2022, CRC Press / Taylor & Francis",
    type: "Conference",
  },
  {
    year: 2023,
    title:
      "Enhancing CSI-based human activity recognition by edge-detection techniques",
    authors:
      "Shahverdi, H., Nabati, M., Fard Moshiri, P., Asvadi, R., & Ghorashi, S. A.",
    venue: "Information, 14(7)",
    type: "Journal",
    url: "https://doi.org/10.3390/info14070404",
  },
  {
    year: 2023,
    title:
      "Convolutional neural networks for CSI-based human activity recognition",
    authors:
      "Shahverdi, H., Shahbazian, R., Fard Moshiri, P., Asvadi, R., & Ghorashi, S. A.",
    venue: "Int. Journal of Information & Communication Technology Research",
    type: "Journal",
    url: "https://ijict.itrc.ac.ir/article-1-513",
  },
  {
    year: 2023,
    title:
      "Use of deep image-to-image translations to assess complementary value of imaging modalities: PET and CT in head and neck cancer",
    authors:
      "Rezaeijo, S. M., Mahboubisarighieh, A., Jafarpoor Nesheli, S., Shahverdi, H., Hosseinzadeh, M., Hacihaliloglu, I., Rahmim, A., & Salmanpour, M. R.",
    venue: "Journal of Nuclear Medicine, 64(S1)",
    type: "Abstract",
  },
  {
    year: 2023,
    title:
      "Enhancing multi-contrast MRI synthesis: a novel 3D Dual-CycleGAN approach",
    authors:
      "Mahboubisarighieh, A., Shahverdi, H., Jafarpoor Nesheli, S., Niknam, M., Torkashvand, M., & Rezaeijo, S. M.",
    venue: "Research Square",
    type: "Preprint",
    url: "https://doi.org/10.21203/rs.3.rs-3290544/v1",
  },
];

export const aiSkills: {
  group: string;
  items: { name: string; tier: Tier }[];
}[] = [
  {
    group: "Machine learning",
    items: [
      { name: "PyTorch", tier: "core" },
      { name: "TensorFlow", tier: "core" },
      { name: "Transformers", tier: "core" },
      { name: "Time-series modelling", tier: "core" },
      { name: "GANs", tier: "strong" },
      { name: "Explainable AI", tier: "strong" },
      { name: "scikit-learn", tier: "strong" },
      { name: "OpenCV", tier: "strong" },
    ],
  },
  {
    group: "Signals",
    items: [
      { name: "IMU and sensor streams", tier: "core" },
      { name: "Wi-Fi CSI", tier: "core" },
      { name: "EEG", tier: "strong" },
      { name: "MATLAB", tier: "strong" },
      { name: "Particle filters", tier: "strong" },
    ],
  },
  {
    group: "Security and systems",
    items: [
      { name: "Network protocols", tier: "core" },
      { name: "Linux", tier: "core" },
      { name: "Nmap and Wireshark", tier: "learning" },
      { name: "Burp Suite", tier: "learning" },
      { name: "Metasploit", tier: "learning" },
      { name: "Docker and Kubernetes", tier: "learning" },
    ],
  },
];

export const researchTimeline: TimelineItem[] = [
  {
    period: "2026",
    title: "UPhAIR preprint, and PhD applications",
    org: "medRxiv",
    text: "Explainable AI for glioma IDH prediction. Now applying to PhD programmes in efficient and trustworthy AI.",
  },
  {
    period: "2025",
    title: "Thesis presented in London",
    org: "IHIET-FS 2025, University of East London",
    text: "The lightweight HAR Transformer, presented at an international conference.",
  },
  {
    period: "2024",
    title: "3D Dual-CycleGAN published",
    org: "Egyptian J. Radiology and Nuclear Medicine",
    text: "Cross-contrast MRI synthesis with volumetric cycle-consistent GANs.",
  },
  {
    period: "2023",
    title: "M.Sc. completed, thesis graded 20/20",
    org: "Shahid Beheshti University",
    text: "Two journal papers on Wi-Fi CSI sensing, a JNM abstract on PET/CT translation, and a research internship working with EEG.",
  },
  {
    period: "2020",
    title: "Ranked 312 of 50,000+ nationwide",
    org: "Iranian M.Sc. entrance exam",
    text: "Joined the M.Sc. in Telecommunications Engineering and the NAIRG lab; later ranked 3rd in GPA in the cohort.",
  },
  {
    period: "2014 – 2019",
    title: "B.Sc. in Electrical Engineering",
    org: "Sahand University of Technology",
    text: "Top 4% of 500,000+ in the entrance exam. Capstone on object tracking with particle filters; TA for DSP and networks.",
  },
];

export const references = [
  {
    name: "Prof. Seyed Ali Ghorashi",
    role: "M.Sc. thesis advisor",
    org: "University of East London",
  },
  {
    name: "Dr. Reza Shahbazian",
    role: "Research collaborator",
    org: "University of Calabria",
  },
  {
    name: "Dr. Arman Gorji",
    role: "Supervisor and Collaborator",
    org: "Hamadan University of Medical Sciences and Health Services",
  },
];
