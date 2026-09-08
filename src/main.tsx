import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, AlertTriangle, BarChart3, Camera, Check, ChevronRight, ClipboardCheck, Download, Eye, FileText, Gauge, HeartPulse, History, Home, LogIn, Microscope, MonitorDot, RefreshCcw, Send, Settings, ShieldCheck, Stethoscope, Upload, UserRound } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './styles.css';

type Page = 'landing'|'login'|'dashboard'|'new'|'patient'|'quality'|'analysis'|'explain'|'history'|'report'|'review'|'monitoring';
type Grade = 'No DR'|'Mild DR'|'Moderate DR'|'Severe DR'|'Proliferative DR';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const grades: Grade[] = ['No DR','Mild DR','Moderate DR','Severe DR','Proliferative DR'];
const gradeClass: Record<Grade,string> = {'No DR':'ok','Mild DR':'mild','Moderate DR':'mod','Severe DR':'sev','Proliferative DR':'pro'};
const recent = [
  {id:'P-1001', age:52, eye:'Right', grade:'No DR' as Grade, confidence:96, rec:'Routine monitoring', status:'Complete', date:'2026-09-08'},
  {id:'P-1002', age:61, eye:'Left', grade:'Mild DR' as Grade, confidence:88, rec:'Follow-up', status:'Reviewed', date:'2026-09-08'},
  {id:'P-1003', age:57, eye:'Right', grade:'Moderate DR' as Grade, confidence:91, rec:'Review recommended', status:'Pending review', date:'2026-09-08'},
  {id:'P-1004', age:64, eye:'Left', grade:'Severe DR' as Grade, confidence:93, rec:'Priority referral', status:'Sent', date:'2026-09-07'},
  {id:'P-1005', age:59, eye:'Right', grade:'Proliferative DR' as Grade, confidence:89, rec:'Urgent referral', status:'Sent', date:'2026-09-07'}
];
const activity = [
  {day:'Sep 2', screenings:18, referral:17, rejected:5},
  {day:'Sep 3', screenings:24, referral:21, rejected:6},
  {day:'Sep 4', screenings:21, referral:19, rejected:4},
  {day:'Sep 5', screenings:27, referral:24, rejected:8},
  {day:'Sep 6', screenings:16, referral:13, rejected:5},
  {day:'Sep 7', screenings:31, referral:26, rejected:7},
  {day:'Sep 8', screenings:14, referral:29, rejected:6}
];
const probs = [
  {name:'No DR', value:1}, {name:'Mild', value:4}, {name:'Moderate', value:91}, {name:'Severe', value:3}, {name:'Prolif.', value:1}
];
const lesions = [
  {name:'Microaneurysms', confidence:87, box:[26,34,18,15]},
  {name:'Hemorrhages', confidence:72, box:[57,28,17,20]},
  {name:'Hard Exudates', confidence:81, box:[47,58,21,14]}
];

function fundus(id='main') {
  return <div className="fundus" aria-label="demo retinal fundus image">
    <div className="disc" /><div className="macula" /><div className="vessel v1" /><div className="vessel v2" /><div className="vessel v3" />
    {id==='overlay' && <div className="heat" />}
    {id==='lesions' && lesions.map(l => <span key={l.name} className="box" style={{left:`${l.box[0]}%`,top:`${l.box[1]}%`,width:`${l.box[2]}%`,height:`${l.box[3]}%`}} />)}
  </div>
}

function App() {
  const [page,setPage] = useState<Page>('landing');
  const [step,setStep] = useState(1);
  const [patient,setPatient] = useState({id:'P-10482', name:'Asha Kumari', age:'57', sex:'Female', years:'12', center:'RHC Jaipur Block 2'});
  const [apiState,setApiState] = useState('Ready');
  const prediction = useMemo(()=>({grade:'Moderate DR' as Grade, confidence:91, quality:91}),[]);
  async function call(path:string) {
    setApiState('Calling API...');
    try { await fetch(`${API}${path}`, {method:'POST'}); setApiState('Connected to local ML API'); }
    catch { setApiState('Demo UI mode; start FastAPI for live API'); }
  }
  const nav = [
    ['dashboard', Home, 'Dashboard'], ['new', Camera, 'New Screening'], ['patient', UserRound, 'Patients'], ['history', History, 'History'], ['report', FileText, 'Reports'], ['monitoring', MonitorDot, 'Model Monitoring'], ['login', Settings, 'Settings']
  ] as const;
  if (page==='landing') return <Landing go={setPage}/>;
  if (page==='login') return <Login go={setPage}/>;
  return <div className="app"><aside><div className="brand"><Eye/><div><b>RETINA-AI</b><span>Explainable DR Screening</span></div></div>{nav.map(([p,I,l])=><button className={page===p?'active':''} onClick={()=>setPage(p as Page)} key={p}><I size={18}/>{l}</button>)}<p className="disclaimer">AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional.</p></aside><main><Header apiState={apiState}/>{page==='dashboard'&&<Dashboard go={setPage}/>} {page==='new'&&<NewScreening step={step} setStep={setStep} patient={patient} setPatient={setPatient} call={call} go={setPage}/>} {page==='patient'&&<Patient/>} {page==='quality'&&<Quality/>} {page==='analysis'&&<Analysis/>} {page==='explain'&&<Explain/>} {page==='history'&&<HistoryPage/>} {page==='report'&&<Report/>} {page==='review'&&<Review/>} {page==='monitoring'&&<Monitoring/>}</main></div>
}

function Header({apiState}:{apiState:string}){return <header><div><h1>Rural Health Center Screening Console</h1><p>{apiState} · DEMO MODEL · Online screening enabled</p></div><div className="user"><span className="online"/> Kavita Sharma · RHC Jaipur</div></header>}
function Landing({go}:{go:(p:Page)=>void}){return <section className="landing"><nav><b>RETINA-AI</b><button onClick={()=>go('login')}><LogIn size={16}/> Login</button></nav><div className="hero"><div><h1>Making Diabetic Retinopathy Screening Explainable and Accessible</h1><p>AI-assisted retinal screening designed for resource-constrained healthcare environments.</p><button onClick={()=>go('dashboard')}>Start Screening <ChevronRight size={18}/></button><button className="ghost" onClick={()=>go('new')}>View Demo</button></div>{fundus('overlay')}</div><div className="featureRow">{[['Explainable AI','See where the model is looking.'],['Quality-Aware Screening','Reject unreliable retinal images before prediction.'],['Human-in-the-Loop','Connect AI screening with ophthalmologist review.']].map(x=><article key={x[0]}><ShieldCheck/><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></section>}
function Login({go}:{go:(p:Page)=>void}){return <section className="login"><div><h1>RETINA-AI</h1><p>Explainable Diabetic Retinopathy Screening</p><input placeholder="Health worker ID" defaultValue="HW-204"/><input placeholder="Password" type="password" defaultValue="demo"/><button onClick={()=>go('dashboard')}>Sign in</button></div></section>}
function Dashboard({go}:{go:(p:Page)=>void}){return <><div className="kpis">{[['Screenings Today','14'],['Total Screenings','1,284'],['Refer for Ophthalmology','29%'],['Image Quality Failures','6%'],['Average AI Confidence','91%']].map(([a,b])=><article key={a}><span>{a}</span><b>{b}</b></article>)}</div><section className="panel"><div className="title"><h2>Today&apos;s Screening Activity</h2><button onClick={()=>go('new')}><Camera size={16}/> New Screening</button></div><ResponsiveContainer height={260}><AreaChart data={activity}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Legend/><Area dataKey="screenings" stroke="#0f766e" fill="#ccfbf1"/><Line dataKey="referral" stroke="#f97316"/><Line dataKey="rejected" stroke="#dc2626"/></AreaChart></ResponsiveContainer></section><Recent/></>}
function Recent(){return <section className="panel"><h2>Recent Screenings</h2><table><tbody><tr><th>Patient ID</th><th>Age</th><th>Eye</th><th>DR Grade</th><th>Confidence</th><th>Recommendation</th><th>Status</th><th>Date</th></tr>{recent.map(r=><tr key={`${r.id}-${r.eye}-${r.date}`}><td>{r.id}</td><td>{r.age}</td><td>{r.eye}</td><td><span className={`badge ${gradeClass[r.grade]}`}>{r.grade}</span></td><td>{r.confidence}%</td><td>{r.rec}</td><td>{r.status}</td><td>{r.date}</td></tr>)}</tbody></table></section>}
function NewScreening({step,setStep,patient,setPatient,call,go}:any){let labels=['Patient','Capture','Quality','AI Analysis','Explainability','Result'];return <><div className="steps">{labels.map((l,i)=><button key={l} className={step>=i+1?'done':''} onClick={()=>setStep(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{l}</button>)}</div>{step===1&&<section className="panel form"><h2>Patient Registration</h2>{Object.keys(patient).map(k=><label key={k}>{k}<input value={patient[k]} onChange={e=>setPatient({...patient,[k]:e.target.value})}/></label>)}<button onClick={()=>setStep(2)}>Start Screening</button></section>}{step===2&&<Capture next={()=>setStep(3)}/>} {step===3&&<Quality action={()=>{call('/api/v1/screenings/1/quality');setStep(4)}}/>} {step===4&&<Analysis action={()=>{call('/api/v1/screenings/1/predict');setStep(5)}}/>} {step===5&&<Explain action={()=>setStep(6)}/>} {step===6&&<Result go={go}/>}</>}
function Capture({next}:any){return <section className="split"><div className="panel">{fundus()}<div className="actions"><button><Camera size={16}/> Capture Image</button><button><Upload size={16}/> Upload Image</button><button className="ghost"><RefreshCcw size={16}/> Retake</button></div><p>Resolution 2048x1536 · 2.4 MB · Right eye · 2026-09-08 17:58</p></div><div className="panel"><h2>Capture Instructions</h2>{['Keep eye centered','Ensure sufficient illumination','Avoid blur','Ensure optic disc is visible','Avoid excessive reflections'].map(x=><p key={x} className="check"><Check/> {x}</p>)}<button onClick={next}>Assess Image Quality</button></div></section>}
function Quality({action}:{action?:()=>void}){return <section className="panel"><h2>Image Quality</h2><div className="score">91 / 100</div><div className="metrics">{['Sharpness 88%','Illumination 94%','Contrast 90%','Retinal field 92%','Low artifacts 89%'].map(x=><p key={x}><Check/> {x}</p>)}</div><details><summary>View preprocessing</summary><div className="triple">{fundus()}{fundus('overlay')}{fundus('lesions')}</div></details>{action&&<button onClick={action}>Run DR Analysis</button>}</section>}
function Analysis({action}:{action?:()=>void}){return <section className="split"><div className="panel"><h2>AI Screening Result</h2><span className="badge mod">Moderate Diabetic Retinopathy</span><div className="score">91% confidence</div><p>Model attention was concentrated around regions containing suspected retinal abnormalities. This is a screening recommendation, not a diagnosis.</p>{action&&<button onClick={action}>Generate Explainability</button>}</div><div className="panel"><ResponsiveContainer height={260}><BarChart data={probs}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value">{probs.map((p,i)=><Cell key={p.name} fill={['#16a34a','#eab308','#f97316','#dc2626','#7f1d1d'][i]}/>)}</Bar></BarChart></ResponsiveContainer></div></section>}
function Explain({action}:{action?:()=>void}){return <section className="panel"><h2>Explainability</h2><div className="triple"><div>{fundus()}<b>Original Fundus</b></div><div>{fundus('overlay')}<b>Grad-CAM</b></div><div>{fundus('lesions')}<b>Suspected lesion regions</b></div></div><p>Areas highlighted in red represent model attention. They do not prove lesion presence.</p><div className="lesions">{lesions.map(l=><article key={l.name}><Microscope/><b>{l.name}</b><span>Confidence: {l.confidence}% · demo model output</span></article>)}</div>{action&&<button onClick={action}>View Result</button>}</section>}
function Result({go}:any){return <section className="panel"><h2>Screening Result</h2><div className="summary"><b>P-10482 · Right Eye</b><span className="badge mod">Moderate DR · 91% confidence</span></div><Quality/><Analysis/><Explain/><h2>Recommendation</h2><p className="warn">Ophthalmologist review recommended.</p><button onClick={()=>go('report')}><FileText size={16}/> Generate Report</button><button onClick={()=>go('review')}><Send size={16}/> Send for Review</button><button onClick={()=>go('new')} className="ghost">New Screening</button></section>}
function Patient(){return <section className="panel"><h2>Patient Profile</h2><Recent/></section>}
function HistoryPage(){return <Recent/>}
function Report(){return <section className="panel report"><h2>Clinical Screening Report</h2>{fundus('overlay')}<p>Patient P-10482 · Female · 57 · Right eye · Quality 91/100 · AI result Moderate DR · Confidence 91% · Recommendation: Ophthalmologist review recommended.</p><button onClick={()=>window.print()}><Download size={16}/> Download PDF</button></section>}
function Review(){return <section className="split"><div className="panel"><h2>Ophthalmologist Review</h2>{fundus('overlay')}<p>AI prediction: Moderate DR · Confidence 91%</p></div><div className="panel form"><select><option>Agree</option><option>Modify Result</option><option>Reject AI Result</option><option>Request New Image</option></select><textarea placeholder="Clinical notes"/><input placeholder="Final assessment"/><button><ClipboardCheck size={16}/> Store Review</button></div></section>}
function Monitoring(){return <><section className="panel"><h2>Model Performance</h2><div className="kpis">{[['Accuracy','92%'],['Sensitivity','90%'],['Specificity','94%'],['F1 Score','0.91'],['AUROC','0.96']].map(([a,b])=><article key={a}><span>{a}</span><b>{b}</b></article>)}</div></section><section className="split"><div className="panel"><h2>Class-wise Performance</h2><ResponsiveContainer height={250}><BarChart data={grades.map((g,i)=>({g,v:86+i*2}))}><XAxis dataKey="g"/><YAxis/><Tooltip/><Bar dataKey="v" fill="#0f766e"/></BarChart></ResponsiveContainer></div><div className="panel"><h2>Explainability Quality</h2>{fundus('overlay')}<p><Check/> Correct attention within retinal region</p><p><AlertTriangle/> Potentially misleading attention flagged for review</p></div></section></>}
createRoot(document.getElementById('root')!).render(<App />);
