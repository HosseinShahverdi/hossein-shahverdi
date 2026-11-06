import {
  engineeringProjects, researchProjects, engineeringTimeline, researchTimeline, experiments,
  type Project, type TimelineItem, type Experiment,
} from "@/lib/data";
import type { Locale } from "./config";

type ProjectDe = Pick<Project, "tagline" | "description" | "highlights" | "category">;

const PROJECTS_DE: Record<string, ProjectDe> = {
  "recon-console": {
    category: "Web + Sicherheit",
    tagline: "Angriffsflächen-Recon, das zeigt, was sich geändert hat.",
    description: "Ein Dashboard, das Ergebnisse von subfinder, amass und httpx bündelt, pro Scope speichert und bei jedem neuen Scan neue Subdomains automatisch markiert. Auf Änderungen filtern und in das nächste Werkzeug exportieren.",
    highlights: ["Passive und aktive Subdomain-Enumeration in einer Ansicht", "Vergleicht jeden Re-Scan mit gespeicherten Assets und markiert neue Hosts", "Live-Status, Port-, CDN- und Technologie-Fingerprinting", "Mit is:new auf das Neue filtern"],
  },
  phantomscope: {
    category: "Web + Sicherheit",
    tagline: "Angriffsflächen-Recon, den man wirklich lesen kann.",
    description: "Eine selbst gehostete Recon-Konsole mit Nmap und Service-Fingerprinting. Sie bildet erreichbare Hosts in einem Live-Graphen ab und gleicht Versionen mit öffentlichen CVE-Feeds ab, sodass aus einem Scan eine priorisierte To-do-Liste statt einer Textwand wird.",
    highlights: ["Asynchrone Scan-Worker hinter einer FastAPI-Job-Queue", "Live-Graph aus Hosts und Ports in Three.js", "CVE-Abgleich mit nach Schweregrad sortierten Funden", "Scope-Sperre nur für autorisierte Ziele, standardmäßig aktiv"],
  },
  vaultline: {
    category: "Web + Sicherheit",
    tagline: "Geheimnisse, die nach dem Lesen verbrennen.",
    description: "Zero-Knowledge-Austausch von Geheimnissen. Inhalte werden im Browser mit AES-GCM verschlüsselt, der Schlüssel verlässt nie das URL-Fragment, und der Geheimtext wird nach einmaligem Lesen oder per Timer zerstört. Der Server sieht nie Klartext.",
    highlights: ["Clientseitige Verschlüsselung mit der Web Crypto API", "Einmal-Links mit Ablauf und Abruflimit", "Rate Limiting und manipulationssicheres Audit-Log", "Laravel-API mit Next.js-Frontend"],
  },
  promptshield: {
    category: "KI + Sicherheit",
    tagline: "Eine Firewall für LLM-Prompts.",
    description: "Ein Drop-in-Proxy vor jeder LLM-API. Jede Anfrage wird auf Prompt-Injection, Jailbreak-Muster und Datenabfluss bewertet, bevor sie das Modell erreicht, und ein Dashboard zeigt, was blockiert wurde und warum.",
    highlights: ["OpenAI-kompatibler Reverse-Proxy in FastAPI", "Feinabgestimmter Transformer-Klassifikator plus Regelschicht", "Verständliche Begründung für jede Blockierung", "Richtlinien und Allow-Lists pro Schlüssel"],
  },
  kinetica: {
    category: "KI + Mobil",
    tagline: "Mein Thesis-Modell als mobiles SDK.",
    description: "Ein Flutter-Plugin, das einen parametereffizienten Transformer auf dem IMU-Datenstrom des Telefons ausführt und Aktivitätsereignisse in Echtzeit liefert. Kein Server, und keine Sensordaten verlassen das Gerät.",
    highlights: ["TFLite-Export mit int8-Quantisierung", "Streaming-Fenster für niedrige Latenz", "Platform Channels für Android und iOS", "Datenschutz zuerst: Inferenz vollständig auf dem Gerät"],
  },
  honeycomb: {
    category: "Sicherheit",
    tagline: "Beobachten, wie das Internet an die Tür klopft.",
    description: "Eine Flotte containerisierter Low-Interaction-Honeypots (SSH, HTTP), die jeden Anmeldeversuch und jede Payload auf einen 3D-Globus streamen und so Hintergrundrauschen in sichtbare Bedrohungsinformationen verwandeln.",
    highlights: ["Ein-Befehl-Docker-Deployment pro Sensor", "WebSocket-Eventstream zum Dashboard", "GeoIP- und ASN-Anreicherung", "Funde als STIX-Bundles exportieren"],
  },
  forgeline: {
    category: "Web + Infrastruktur",
    tagline: "Verteiltes Training aus einem Dashboard.",
    description: "Eine Steuerungsebene für PyTorch-DDP-Jobs auf Kubernetes: Multi-GPU-Läufe per Web-UI starten, Logs und Metriken live verfolgen und automatisch von Checkpoints fortsetzen, wenn ein Knoten ausfällt.",
    highlights: ["Kubernetes Jobs steuern torchrun", "Live-Loss- und GPU-Metriken über WebSockets", "Checkpoint-bewusste Neustarts", "Next.js-Dashboard mit rollenbasiertem Zugriff"],
  },
  "lite-transformer": {
    category: "Abschlussarbeit",
    tagline: "Aktivitätserkennung, die auf ein Handy passt.",
    description: "Ein parametereffizienter Transformer für Inferenz auf dem Gerät mit gestreamten Smartphone-IMU-Daten, verglichen mit CNN- und LSTM-Baselines auf öffentlichen und selbst erhobenen Datensätzen. Masterarbeit mit 20/20, vorgestellt auf der IHIET-FS 2025 in London.",
    highlights: ["Für Streaming-Inferenz auf dem Gerät entworfen", "Gegen CNN- und LSTM-Baselines getestet", "Auf öffentlichen und eigenen Datensätzen evaluiert"],
  },
  "csi-har": {
    category: "Signalverarbeitung",
    tagline: "Kantenerkennung auf WLAN-Kanalinformationen.",
    description: "Vorverarbeitung, die WLAN-CSI als Bild behandelt und Canny-Kantenmerkmale extrahiert, um Aktivitätsgrenzen vor der CNN-Klassifikation zu schärfen. Veröffentlicht in Information (MDPI) und auf der ABC 2022.",
    highlights: ["Gerätefreie Sensorik: keine Wearables nötig", "Canny-Kantenmerkmale verbessern die CNN-Genauigkeit", "Zwei Zeitschriftenartikel und ein Konferenzbeitrag"],
  },
  "dual-cyclegan": {
    category: "Medizinische Bildgebung",
    tagline: "MRT-Kontraste synthetisieren, die nie aufgenommen wurden.",
    description: "Mitentwicklung eines 3D-Dual-CycleGAN für die MRT-Synthese über Kontraste hinweg, trainiert mit Multi-GPU-PyTorch. Veröffentlicht im Egyptian Journal of Radiology and Nuclear Medicine.",
    highlights: ["Volumetrische (3D) Bild-zu-Bild-Übersetzung", "Zyklenkonsistenz in beide Richtungen", "Multi-GPU-Trainingspipeline"],
  },
  uphair: {
    category: "Erklärbare KI",
    tagline: "KI-Erklärungen, die Ärztinnen und Ärzte lesen können.",
    description: "Eine hybride Post-hoc-Erklärpipeline, die Radiomics mit LLM-generierten klinischen Berichten für die Vorhersage der IDH-Mutation bei Gliomen koppelt. Co-Autor; Preprint auf medRxiv.",
    highlights: ["Radiomics-Merkmale als Rückgrat der Erklärung", "Ein LLM macht aus Attributionen verständliche Berichte", "Für die Entscheidungsunterstützung in der Neuroonkologie gebaut"],
  },
};

type TimeDe = Pick<TimelineItem, "title" | "org" | "text"> & { period?: string };

const ENG_TIMELINE_DE: TimeDe[] = [
  { period: "Jetzt", title: "Open-Source-Werkzeuge für KI und Sicherheit", org: "Selbstständig", text: "PhantomScope, VaultLine und Forgeline entstehen öffentlich, während ich mich in Docker, Kubernetes und die Kali-Toolchain vertiefe." },
  { period: "2023 – 2024", title: "Forschungspraktikum", org: "Labor für biomedizinische und neurowissenschaftliche Forschung", text: "Wartung und Kalibrierung von CT- und MRT-Geräten sowie Aufbau von EEG-Erfassungs- und Analysepipelines zur Alzheimer-Diagnostik." },
  { period: "2020 – 2023", title: "Wissenschaftlicher Mitarbeiter", org: "NAIRG Lab, Shahid-Beheshti-Universität", text: "Entwurf eines leichtgewichtigen Transformers zur Aktivitätserkennung auf dem Gerät und Aufbau von WLAN-CSI-Vorverarbeitung. Daraus entstanden vier Veröffentlichungen." },
  { period: "2020 – heute", title: "Sprachlehrer für Englisch und Deutsch", org: "Privatunterricht", text: "Sechs Jahre lang schwierige Dinge klar erklärt, Schüler für Schüler." },
  { period: "2018 – 2022", title: "Tutor und Lehrassistent", org: "Sahand-Technische-Universität, Shahid-Beheshti-Universität", text: "Digitale Signalverarbeitung, Telekommunikationsnetze, Rechnernetze und konvexe Optimierung." },
];

const RES_TIMELINE_DE: TimeDe[] = [
  { title: "UPhAIR-Preprint und Bewerbung auf Promotionsstellen", org: "medRxiv", text: "Erklärbare KI für die Vorhersage der IDH-Mutation bei Gliomen. Jetzt Bewerbungen auf Promotionsprogramme in effizienter und vertrauenswürdiger KI." },
  { title: "Masterarbeit in London vorgestellt", org: "IHIET-FS 2025, University of East London", text: "Der leichtgewichtige HAR-Transformer, vorgestellt auf einer internationalen Konferenz." },
  { title: "3D Dual-CycleGAN veröffentlicht", org: "Egyptian J. Radiology and Nuclear Medicine", text: "MRT-Synthese über Kontraste hinweg mit volumetrischen, zyklenkonsistenten GANs." },
  { title: "Master abgeschlossen, Arbeit mit 20/20 bewertet", org: "Shahid-Beheshti-Universität", text: "Zwei Zeitschriftenartikel zu WLAN-CSI-Sensorik, ein JNM-Abstract zur PET/CT-Übersetzung und ein Forschungspraktikum mit EEG." },
  { title: "Platz 312 von über 50.000 landesweit", org: "Iranische Master-Aufnahmeprüfung", text: "Start im Master Telekommunikationstechnik und im NAIRG Lab; später Platz 3 im Notenschnitt des Jahrgangs." },
  { period: "2014 – 2019", title: "B.Sc. Elektrotechnik", org: "Sahand-Technische-Universität", text: "Top 4 % von über 500.000 in der Aufnahmeprüfung. Abschlussarbeit zur Objektverfolgung mit Partikelfiltern; Tutor für DSP und Netze." },
];

const EXPERIMENTS_DE: Record<string, Pick<Experiment, "question" | "approach">> = {
  packetlens: { question: "Kann ein Zeitreihen-Transformer Angriffe in rohen Netzwerkflüssen erkennen?", approach: "Flüsse als multivariate Sequenzen behandeln, den leichtgewichtigen HAR-Transformer wiederverwenden und auf CIC-IDS2017 und UNSW-NB15 gegen baumbasierte Baselines testen." },
  mirage: { question: "Wie leicht lassen sich sensorbasierte Aktivitätsmodelle täuschen, und wie verteidigt man sie?", approach: "Physikalisch plausible adversariale Störungen auf IMU-Strömen erzeugen (FGSM, PGD), dann adversariales Training und Eingabebereinigung testen." },
  featherweight: { question: "Wie klein darf ein HAR-Transformer werden, bevor die Genauigkeit einbricht?", approach: "Destillation, strukturiertes Pruning und int8-Quantisierung, gemessen als Genauigkeit gegen reale Latenz auf dem Telefon." },
  wavesense: { question: "Raumpräsenz-Erkennung mit einem Fünf-Dollar-WLAN-Chip?", approach: "ESP32-CSI-Erfassung, Kantenerkennungs-Merkmale und ein winziges CNN, gestreamt an ein Live-Dashboard im Browser." },
};

const TAGS_DE: Record<string, string> = { Security: "Sicherheit", "Time series": "Zeitreihen", "Signal processing": "Signalverarbeitung", Transformers: "Transformer", "Wi-Fi CSI": "WLAN-CSI" };

const mapProject = (p: Project, locale: Locale): Project => {
  if (locale === "en") return p;
  const d = PROJECTS_DE[p.id];
  return d ? { ...p, ...d, tags: p.tags.map((t) => TAGS_DE[t] ?? t) } : p;
};
const mapTimeline = (items: TimelineItem[], de: TimeDe[], locale: Locale): TimelineItem[] =>
  locale === "en" ? items : items.map((it, i) => ({ ...it, ...de[i], period: de[i]?.period ?? it.period, tags: it.tags?.map((t) => TAGS_DE[t] ?? t) }));

export function getContent(locale: Locale) {
  return {
    engineeringProjects: engineeringProjects.map((p) => mapProject(p, locale)),
    researchProjects: researchProjects.map((p) => mapProject(p, locale)),
    engineeringTimeline: mapTimeline(engineeringTimeline, ENG_TIMELINE_DE, locale),
    researchTimeline: mapTimeline(researchTimeline, RES_TIMELINE_DE, locale),
    experiments: experiments.map((e) => (locale === "en" ? e : { ...e, ...EXPERIMENTS_DE[e.id] })),
  };
}
