import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Camera, Check, ChevronRight,
  CircleDot, ClipboardCheck, Download, Eye, FileText, Gauge, History, Home,
  LogIn, Microscope, MonitorDot, RefreshCcw, Search, Send, Settings,
  Stethoscope, Upload, UserRound, Wifi
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import './styles.css';

type Page = 'landing' | 'login' | 'dashboard' | 'new' | 'patients' | 'history' | 'report' | 'review' | 'monitoring' | 'settings';
type Grade = 'No DR' | 'Mild DR' | 'Moderate DR' | 'Severe DR' | 'Proliferative DR';
type FundusMode = 'main' | 'overlay' | 'lesions';

type Patient = {
  id: string;
  name: string;
  age: string;
  sex: string;
  diabetesDuration: string;
  center: string;
  previousDr: string;
  lastExam: string;
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:8010';
const gradeClass: Record<Grade, string> = { 'No DR': 'ok', 'Mild DR': 'mild', 'Moderate DR': 'mod', 'Severe DR': 'sev', 'Proliferative DR': 'pro' };
const workflow = ['Patient', 'Capture', 'Quality', 'Preprocess', 'AI Analysis', 'Explainability', 'Result'];
const activity = [
  { day: 'Sep 02', screenings: 18, referral: 17, rejected: 5 },
  { day: 'Sep 03', screenings: 24, referral: 21, rejected: 6 },
  { day: 'Sep 04', screenings: 21, referral: 19, rejected: 4 },
  { day: 'Sep 05', screenings: 27, referral: 24, rejected: 8 },
  { day: 'Sep 06', screenings: 16, referral: 13, rejected: 5 },
  { day: 'Sep 07', screenings: 31, referral: 26, rejected: 7 },
  { day: 'Sep 08', screenings: 14, referral: 29, rejected: 6 },
];
const probabilities = [
  { name: 'No DR', value: 1, color: '#15803d' },
  { name: 'Mild', value: 4, color: '#ca8a04' },
  { name: 'Moderate', value: 91, color: '#ea580c' },
  { name: 'Severe', value: 3, color: '#dc2626' },
  { name: 'Prolif.', value: 1, color: '#7f1d1d' },
];
const lesions = [
  { name: 'Microaneurysms', confidence: 87, box: [26, 34, 18, 15] },
  { name: 'Hemorrhages', confidence: 72, box: [57, 28, 17, 20] },
  { name: 'Hard Exudates', confidence: 81, box: [47, 58, 21, 14] },
];
const screenings = [
  ['S-2190', 'P-1001', 52, 'Right', 'No DR', 96, 94, 'Routine monitoring', 'Complete', 'Sep 08, 2026'],
  ['S-2189', 'P-1002', 61, 'Left', 'Mild DR', 88, 90, 'Routine ophthalmic follow-up', 'Reviewed', 'Sep 08, 2026'],
  ['S-2188', 'P-10482', 57, 'Right', 'Moderate DR', 91, 91, 'Ophthalmologist review recommended', 'Pending review', 'Sep 08, 2026'],
  ['S-2187', 'P-1004', 64, 'Left', 'Severe DR', 93, 89, 'Priority ophthalmology referral', 'Sent', 'Sep 07, 2026'],
  ['S-2186', 'P-1005', 59, 'Right', 'Proliferative DR', 89, 87, 'Urgent ophthalmology referral', 'Sent', 'Sep 07, 2026'],
] as const;

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [step, setStep] = useState(1);
  const [apiState, setApiState] = useState('Ready');
  const [patient, setPatient] = useState<Patient>({
    id: 'P-10482',
    name: 'Asha Kumari',
    age: '57',
    sex: 'Female',
    diabetesDuration: '12 years',
    center: 'RHC Jaipur Block 2',
    previousDr: 'No documented DR treatment',
    lastExam: '18 months ago',
  });

  async function callApi(path: string) {
    setApiState('Calling ML service');
    try {
      await fetch(`${API}${path}`, { method: 'POST' });
      setApiState('Connected to local ML API');
    } catch {
      setApiState('Demo UI mode; FastAPI unavailable');
    }
  }

  if (page === 'landing') return <Landing onRoute={setPage} />;
  if (page === 'login') return <Login onRoute={setPage} />;

  return (
    <div className="app">
      <Sidebar page={page} onRoute={setPage} />
      <main className="workspace">
        <Topbar apiState={apiState} />
        {page === 'dashboard' && <Dashboard onRoute={setPage} />}
        {page === 'new' && <NewScreening patient={patient} setPatient={setPatient} step={step} setStep={setStep} callApi={callApi} onRoute={setPage} />}
        {page === 'patients' && <Patients />}
        {page === 'history' && <HistoryPage />}
        {page === 'report' && <Report />}
        {page === 'review' && <Review />}
        {page === 'monitoring' && <Monitoring />}
        {page === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

function Sidebar({ page, onRoute }: { page: Page; onRoute: (page: Page) => void }) {
  const nav = [
    ['dashboard', Home, 'Dashboard'], ['new', Camera, 'New Screening'], ['patients', UserRound, 'Patients'],
    ['history', History, 'History'], ['report', FileText, 'Reports'], ['review', Stethoscope, 'Review'],
    ['monitoring', MonitorDot, 'Model Monitoring'], ['settings', Settings, 'Settings']
  ] as const;
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onRoute('dashboard')} aria-label="Go to dashboard">
        <span className="brandMark"><Eye size={22} /></span><span><b>RETINA-AI</b><small>Explainable DR Screening</small></span>
      </button>
      <nav className="navList">{nav.map(([target, Icon, label]) => <button key={target} className={page === target ? 'active' : ''} onClick={() => onRoute(target)}><Icon size={18} />{label}</button>)}</nav>
      <div className="edgeStatus"><div><Wifi size={17} /><b>ONLINE</b></div><p>Offline-ready queue: 0 pending uploads</p><p>Last model sync: Sep 08, 2026 · 09:30 IST</p></div>
      <p className="disclaimer">AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional.</p>
    </aside>
  );
}

function Topbar({ apiState }: { apiState: string }) {
  return <header className="topbar"><div><p className="eyebrow">Rural Health Center Screening Console</p><h1>Explainable diabetic retinopathy screening</h1></div><div className="topbarRight"><Pill tone="neutral">DEMO MODEL</Pill><Pill tone="success">{apiState}</Pill><div className="clinician"><span className="avatar">KS</span><span>Kavita Sharma<small>RHC Jaipur Block 2</small></span></div></div></header>;
}

function Landing({ onRoute }: { onRoute: (page: Page) => void }) {
  return (
    <section className="landing">
      <nav className="landingNav"><button className="brand compact" onClick={() => onRoute('dashboard')}><span className="brandMark"><Eye size={21} /></span><b>RETINA-AI</b></button><button className="secondaryButton" onClick={() => onRoute('login')}><LogIn size={16} /> Login</button></nav>
      <div className="hero">
        <div className="heroCopy"><Pill tone="neutral">AI-assisted screening · Human review ready</Pill><h1>RETINA-AI</h1><p>Making diabetic retinopathy screening explainable and accessible for resource-constrained healthcare environments.</p><div className="heroActions"><button onClick={() => onRoute('dashboard')}>Start Screening <ArrowRight size={18} /></button><button className="secondaryButton" onClick={() => onRoute('new')}>View Demo</button></div></div>
        <div className="heroVisual"><Fundus mode="overlay" /><div className="floatingResult"><span>AI SCREENING RESULT</span><b>Moderate DR</b><small>91% confidence · review recommended</small></div></div>
      </div>
      <div className="featureRow"><Feature icon={<Microscope />} title="Explainable AI" text="Shows Grad-CAM attention and suspected lesion regions." /><Feature icon={<Gauge />} title="Quality-Aware Screening" text="Rejects unreliable retinal images before prediction." /><Feature icon={<Stethoscope />} title="Human-in-the-Loop" text="Routes cases to ophthalmologist review with notes." /></div>
    </section>
  );
}

function Login({ onRoute }: { onRoute: (page: Page) => void }) {
  return <section className="login"><div className="loginPanel"><span className="brandMark"><Eye size={24} /></span><h1>RETINA-AI</h1><p>Explainable Diabetic Retinopathy Screening</p><label>Health worker ID<input defaultValue="HW-204" /></label><label>Password<input type="password" defaultValue="demo" /></label><button onClick={() => onRoute('dashboard')}>Sign in</button></div></section>;
}

function Dashboard({ onRoute }: { onRoute: (page: Page) => void }) {
  const kpis = [['Screenings Today', '14', '+18%', Activity], ['Total Screenings', '1,284', 'Demo cohort', Eye], ['Refer for Ophthalmology', '29%', 'Moderate+', Stethoscope], ['Image Quality Failures', '6%', 'Recapture required', AlertTriangle], ['Average AI Confidence', '91%', 'High certainty', BadgeCheck]] as const;
  return (
    <div className="pageStack">
      <div className="dashboardHeader"><div><h2>Dashboard</h2><p>Operational overview for today&apos;s retinal screening activity.</p></div><button onClick={() => onRoute('new')}><Camera size={17} /> New Screening</button></div>
      <div className="kpis">{kpis.map(([label, value, note, Icon]) => <article key={label} className="kpiCard"><Icon size={18} /><span>{label}</span><b>{value}</b><small>{note}</small></article>)}</div>
      <section className="panel"><PanelTitle title="Today's Screening Activity" action={<Pill tone="success">ONLINE</Pill>} /><ResponsiveContainer height={282}><AreaChart data={activity}><CartesianGrid strokeDasharray="3 3" stroke="#e4e9ee" /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Legend /><Area dataKey="screenings" stroke="#0f766e" fill="#ccfbf1" strokeWidth={2} /><Line dataKey="referral" stroke="#ea580c" strokeWidth={2} /><Line dataKey="rejected" stroke="#dc2626" strokeWidth={2} /></AreaChart></ResponsiveContainer></section>
      <RecentScreenings />
    </div>
  );
}

function NewScreening({ patient, setPatient, step, setStep, callApi, onRoute }: { patient: Patient; setPatient: (patient: Patient) => void; step: number; setStep: (step: number) => void; callApi: (path: string) => Promise<void>; onRoute: (page: Page) => void }) {
  return (
    <div className="pageStack">
      <PanelTitle title="New Screening" action={<Pill tone="neutral">Screening ID S-2191</Pill>} />
      <div className="workflow">{workflow.map((label, index) => <button key={label} className={step >= index + 1 ? 'done' : ''} onClick={() => setStep(index + 1)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>)}</div>
      {step === 1 && <PatientForm patient={patient} setPatient={setPatient} onNext={() => setStep(2)} />}
      {step === 2 && <Capture onNext={() => setStep(3)} />}
      {step === 3 && <QualityPanel onNext={async () => { await callApi('/api/v1/screenings/1/quality'); setStep(4); }} />}
      {step === 4 && <Preprocess onNext={() => setStep(5)} />}
      {step === 5 && <AnalysisPanel onNext={async () => { await callApi('/api/v1/screenings/1/predict'); setStep(6); }} />}
      {step === 6 && <ExplainabilityPanel onNext={() => setStep(7)} />}
      {step === 7 && <ResultPanel onRoute={onRoute} />}
    </div>
  );
}

function PatientForm({ patient, setPatient, onNext }: { patient: Patient; setPatient: (patient: Patient) => void; onNext: () => void }) {
  const fields: Array<[keyof Patient, string]> = [['id', 'Patient ID'], ['name', 'Name'], ['age', 'Age'], ['sex', 'Sex'], ['diabetesDuration', 'Diabetes duration'], ['previousDr', 'Previous DR history'], ['lastExam', 'Last eye examination'], ['center', 'Location / health center']];
  return <section className="panel formPanel"><div><h2>Patient Registration</h2><p>Minimal screening demographics. Personal details remain limited for privacy.</p></div><div className="formGrid">{fields.map(([key, label]) => <label key={key}>{label}<input value={patient[key]} onChange={(event) => setPatient({ ...patient, [key]: event.target.value })} /></label>)}</div><button onClick={onNext}>Start Screening <ChevronRight size={17} /></button></section>;
}

function Capture({ onNext }: { onNext: () => void }) {
  return <section className="split"><div className="panel imagePanel"><PanelTitle title="Fundus Image Capture" action={<Pill tone="success">JPG · PNG supported</Pill>} /><Fundus /><div className="toolbar"><button><Camera size={16} /> Capture</button><button><Upload size={16} /> Upload</button><button className="secondaryButton"><RefreshCcw size={16} /> Retake</button></div><div className="metadata"><span>2048 x 1536</span><span>2.4 MB</span><span>Right eye</span><span>Sep 08, 2026 · 17:58</span></div></div><div className="panel"><PanelTitle title="Capture Instructions" />{['Keep eye centered', 'Ensure sufficient illumination', 'Avoid blur', 'Ensure optic disc is visible', 'Avoid excessive reflections'].map((item) => <p key={item} className="check"><Check size={17} /> {item}</p>)}<button onClick={onNext}>Assess Image Quality</button></div></section>;
}

function QualityPanel({ onNext }: { onNext?: () => void }) {
  const metrics = [['Sharpness', 88], ['Illumination', 94], ['Contrast', 90], ['Retinal field', 92], ['Low artifacts', 89]] as const;
  return <section className="panel"><PanelTitle title="Image Quality Analysis" action={<Pill tone="success">Acceptable for AI screening</Pill>} /><div className="qualityLayout"><div className="scoreBlock"><span>IMAGE QUALITY</span><b>91</b><small>/ 100</small></div><div className="metricGrid">{metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}</div></div><div className="decisionBox success"><Check size={18} /> Image passed quality checks. DR model can be run for screening support.</div>{onNext && <button onClick={onNext}>View Preprocessing <ChevronRight size={17} /></button>}</section>;
}

function Preprocess({ onNext }: { onNext: () => void }) {
  return <section className="panel"><PanelTitle title="Image Preprocessing" action={<Pill tone="neutral">OpenCV pipeline placeholder</Pill>} /><div className="triple"><ImageStage title="Original" mode="main" /><ImageStage title="Enhanced" mode="overlay" /><ImageStage title="Cropped" mode="lesions" /></div><div className="processList">{['Resize', 'Retinal crop', 'Illumination correction', 'CLAHE', 'Artifact reduction', 'Normalization'].map((label) => <span key={label}><CircleDot size={13} /> {label}</span>)}</div><button onClick={onNext}>Run AI Analysis <ChevronRight size={17} /></button></section>;
}

function AnalysisPanel({ onNext }: { onNext?: () => void }) {
  return <section className="split"><div className="panel resultCard"><PanelTitle title="AI Screening Result" action={<Pill tone="neutral">DEMO MODEL</Pill>} /><span className="badge mod">Moderate Diabetic Retinopathy</span><div className="scoreText">91% confidence</div><p>Model attention was concentrated around regions containing suspected retinal abnormalities. This is screening support, not a definitive diagnosis.</p><TrustPanel compact />{onNext && <button onClick={onNext}>Generate Explainability <ChevronRight size={17} /></button>}</div><div className="panel"><PanelTitle title="5-Class Probability Distribution" /><ResponsiveContainer height={285}><BarChart data={probabilities}><CartesianGrid strokeDasharray="3 3" stroke="#e4e9ee" /><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="value" radius={[5, 5, 0, 0]}>{probabilities.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div></section>;
}

function ExplainabilityPanel({ onNext }: { onNext?: () => void }) {
  return <section className="panel"><PanelTitle title="Explainability" action={<Pill tone="warning">Model attention, not proof of lesion</Pill>} /><div className="triple"><ImageStage title="Original Fundus" mode="main" /><ImageStage title="Grad-CAM" mode="overlay" /><ImageStage title="Suspected Lesion Regions" mode="lesions" /></div><div className="decisionBox warning"><AlertTriangle size={18} /> Red regions show contribution to model prediction. They do not confirm lesion presence.</div><div className="lesions">{lesions.map((lesion) => <article key={lesion.name}><Microscope size={18} /><b>{lesion.name}</b><span>Confidence: {lesion.confidence}% · demo model output</span></article>)}</div>{onNext && <button onClick={onNext}>View Screening Result <ChevronRight size={17} /></button>}</section>;
}

function ResultPanel({ onRoute }: { onRoute: (page: Page) => void }) {
  return <div className="pageStack"><section className="panel resultSummary"><div><p className="eyebrow">SCREENING RESULT</p><h2>P-10482 · Right Eye</h2><span className="badge mod">Moderate DR · 91% confidence</span></div><Fundus mode="overlay" /></section><TrustPanel /><section className="panel actionFooter"><div><h2>Recommendation</h2><p>Ophthalmologist review recommended. Screening recommendation only; not a diagnosis.</p></div><button onClick={() => onRoute('report')}><FileText size={16} /> Generate Report</button><button onClick={() => onRoute('review')}><Send size={16} /> Send for Review</button><button className="secondaryButton" onClick={() => onRoute('new')}>New Screening</button></section></div>;
}

function TrustPanel({ compact = false }: { compact?: boolean }) {
  return <section className={compact ? 'trustPanel compactTrust' : 'panel trustPanel'}>{!compact && <PanelTitle title="AI Trust Panel" />}<div className="trustStats"><Metric label="Prediction confidence" value={91} /><Metric label="Image quality" value={91} /><div className="certainty"><span>Model certainty</span><b>High</b><small>Uncertainty: Low</small></div></div><div className="trustReasons">{['Image passed quality check', 'Model confidence above threshold', 'Attention concentrated within retinal region'].map((reason) => <span key={reason}><Check size={15} /> {reason}</span>)}</div></section>;
}

function Patients() {
  return <div className="pageStack"><PanelTitle title="Patients" action={<div className="searchBox"><Search size={16} /><input placeholder="Search patient ID" /></div>} /><RecentScreenings /></div>;
}

function HistoryPage() {
  return <div className="pageStack"><PanelTitle title="Screening History" action={<Pill tone="neutral">1,284 records</Pill>} /><RecentScreenings /></div>;
}

function Report() {
  return <section className="panel report"><PanelTitle title="Clinical Screening Report" action={<button onClick={() => window.print()}><Download size={16} /> Download PDF</button>} /><div className="reportBody"><Fundus mode="overlay" /><div><h2>Patient P-10482</h2><dl><dt>Eye</dt><dd>Right</dd><dt>Quality score</dt><dd>91 / 100</dd><dt>AI prediction</dt><dd>Moderate DR</dd><dt>Confidence</dt><dd>91%</dd><dt>Recommendation</dt><dd>Ophthalmologist review recommended</dd><dt>Timestamp</dt><dd>Sep 08, 2026 · 17:58 IST</dd></dl><p className="reportDisclaimer">AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional.</p></div></div></section>;
}

function Review() {
  return <section className="split"><div className="panel imagePanel"><PanelTitle title="Ophthalmologist Review" action={<Pill tone="warning">Pending final assessment</Pill>} /><Fundus mode="overlay" /><div className="reviewFacts"><span>AI prediction: Moderate DR</span><span>Confidence: 91%</span><span>Image quality: 91/100</span></div></div><div className="panel formPanel"><label>Review decision<select defaultValue="Agree"><option>Agree</option><option>Modify Result</option><option>Reject AI Result</option><option>Request New Image</option></select></label><label>Clinical notes<textarea placeholder="Add review notes" /></label><label>Final assessment<input placeholder="Final assessment" /></label><button><ClipboardCheck size={16} /> Store Review</button></div></section>;
}

function Monitoring() {
  const metrics = [['Accuracy', '92%'], ['Sensitivity', '90%'], ['Specificity', '94%'], ['F1 Score', '0.91'], ['AUROC', '0.96']];
  const classRows = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'].map((grade, index) => ({ grade, value: 86 + index * 2 }));
  return <div className="pageStack"><PanelTitle title="System / Model Monitoring" action={<Pill tone="neutral">DEMO METRICS</Pill>} /><div className="kpis">{metrics.map(([label, value]) => <article key={label} className="kpiCard"><Gauge size={18} /><span>{label}</span><b>{value}</b><small>Validation dashboard</small></article>)}</div><section className="split"><div className="panel"><PanelTitle title="Class-wise Performance" /><ResponsiveContainer height={270}><BarChart data={classRows}><CartesianGrid strokeDasharray="3 3" stroke="#e4e9ee" /><XAxis dataKey="grade" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="value" fill="#0f766e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="panel"><PanelTitle title="Explainability Quality" /><Fundus mode="overlay" /><p className="check"><Check size={17} /> Correct attention within retinal region</p><p className="check caution"><AlertTriangle size={17} /> Potentially misleading attention flagged for review</p></div></section></div>;
}

function SettingsPage() {
  return <section className="panel settingsPanel"><PanelTitle title="Operational Settings" action={<Pill tone="success">Edge-ready architecture</Pill>} />{['Offline screening enabled', 'Store results locally before sync', 'Minimal patient data display', 'Role-based review workflow'].map((setting) => <label key={setting} className="toggleRow"><input type="checkbox" defaultChecked /> {setting}</label>)}</section>;
}

function RecentScreenings() {
  return <section className="panel tablePanel"><PanelTitle title="Recent Screenings" /><div className="tableScroll"><table><thead><tr><th>Patient ID</th><th>Age</th><th>Eye</th><th>DR Grade</th><th>Confidence</th><th>Quality</th><th>Recommendation</th><th>Status</th><th>Date</th></tr></thead><tbody>{screenings.map(([id, patientId, age, eye, grade, confidence, quality, recommendation, status, date]) => <tr key={id}><td><b>{patientId}</b></td><td>{age}</td><td>{eye}</td><td><span className={`badge ${gradeClass[grade as Grade]}`}>{grade}</span></td><td>{confidence}%</td><td>{quality}/100</td><td>{recommendation}</td><td>{status}</td><td>{date}</td></tr>)}</tbody></table></div></section>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>;
}

function PanelTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="panelTitle"><h2>{title}</h2>{action}</div>;
}

function Pill({ children, tone }: { children: React.ReactNode; tone: 'success' | 'warning' | 'neutral' }) {
  return <span className={`statusPill ${tone}`}>{children}</span>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="metric"><div><span>{label}</span><b>{value}%</b></div><progress value={value} max={100} /></div>;
}

function ImageStage({ title, mode }: { title: string; mode: FundusMode }) {
  return <div className="imageStage"><Fundus mode={mode} /><b>{title}</b></div>;
}

function Fundus({ mode = 'main' }: { mode?: FundusMode }) {
  return (
    <div className="fundus" aria-label="Demo retinal fundus visualization">
      <div className="disc" /><div className="macula" /><div className="vessel v1" /><div className="vessel v2" /><div className="vessel v3" /><div className="vessel v4" />
      {mode === 'overlay' && <div className="heat" />}
      {mode === 'lesions' && lesions.map((lesion) => <span key={lesion.name} className="box" style={{ left: `${lesion.box[0]}%`, top: `${lesion.box[1]}%`, width: `${lesion.box[2]}%`, height: `${lesion.box[3]}%` }} />)}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
