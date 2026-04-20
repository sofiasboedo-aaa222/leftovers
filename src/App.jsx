import { useState, useEffect } from “react”;

// ─── Next Thursday helper ─────────────────────────────────────────────────────
function getNextThursday() {
const now = new Date();
const day = now.getDay(); // 0=Sun … 4=Thu … 6=Sat
const daysUntil = (4 - day + 7) % 7 || 7; // always next Thu, never today
const next = new Date(now);
next.setDate(now.getDate() + daysUntil);
return next.toLocaleDateString(“en-US”, { weekday: “long”, month: “long”, day: “numeric” });
}

const NEXT_DINNER = {
date: getNextThursday(),
time: “8:00 PM”,
};

const QUESTIONS = [
{
id: “age”,
label: “How old are you?”,
type: “select”,
options: [“18–24”, “25–30”, “31–38”, “39–50”, “50+”],
},
{
id: “job”,
label: “What do you do?”,
type: “select”,
options: [
“Tech / Engineering”,
“Creative / Design / Art”,
“Business / Finance”,
“Healthcare / Science”,
“Education”,
“Entrepreneur”,
“Other”,
],
},
{
id: “interests”,
label: “Pick up to 3 passions”,
type: “multi”,
max: 3,
options: [
“Travel”,
“Music”,
“Film”,
“Food & Wine”,
“Sports”,
“Books”,
“Gaming”,
“Nature”,
“Politics”,
“Philosophy”,
“Art”,
“Fitness”,
],
},
{
id: “vibe”,
label: “Your ideal dinner conversation?”,
type: “select”,
options: [
“Deep & philosophical”,
“Fun & lighthearted”,
“Entrepreneurial & ambitious”,
“Cultural & worldly”,
“Random & chaotic (surprise me)”,
],
},
{
id: “diet”,
label: “Any dietary needs?”,
type: “select”,
options: [
“None — I eat everything”,
“Vegetarian”,
“Vegan”,
“Gluten-free”,
“Halal / Kosher”,
],
},
];

// ─── Simulated registered users for admin view ─────────────────────────────
const FAKE_USERS = [
{ name: “Sofia M.”, age: “25–30”, job: “Creative / Design / Art”, interests: [“Travel”, “Film”, “Art”], vibe: “Cultural & worldly”, dinnerId: 1 },
{ name: “James R.”, age: “25–30”, job: “Tech / Engineering”, interests: [“Travel”, “Gaming”, “Fitness”], vibe: “Fun & lighthearted”, dinnerId: 1 },
{ name: “Aiko T.”, age: “31–38”, job: “Business / Finance”, interests: [“Food & Wine”, “Travel”, “Books”], vibe: “Deep & philosophical”, dinnerId: 1 },
{ name: “Marco L.”, age: “25–30”, job: “Entrepreneur”, interests: [“Travel”, “Sports”, “Music”], vibe: “Entrepreneurial & ambitious”, dinnerId: 1 },
{ name: “Priya N.”, age: “25–30”, job: “Healthcare / Science”, interests: [“Books”, “Nature”, “Philosophy”], vibe: “Deep & philosophical”, dinnerId: 1 },
{ name: “Leo B.”, age: “18–24”, job: “Education”, interests: [“Music”, “Film”, “Art”], vibe: “Cultural & worldly”, dinnerId: 1 },
];

// ─── Color tokens ─────────────────────────────────────────────────────────────
const styles = `
@import url(‘https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap’);

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
–cream: #FAF6EF;
–warm: #F2E8D9;
–rust: #C05C2C;
–rust-dark: #9C4220;
–fig: #3D2314;
–sage: #7A8C6E;
–gold: #D4A853;
–text: #2A1A0E;
–muted: #8B7355;
–white: #FFFFFF;
–card: #FFFDF9;
–border: #E8DDD0;
}

body {
font-family: ‘DM Sans’, sans-serif;
background: var(–cream);
color: var(–text);
min-height: 100vh;
}

.app { min-height: 100vh; }

/* ── NAV ── */
.nav {
display: flex; align-items: center; justify-content: space-between;
padding: 20px 40px;
border-bottom: 1px solid var(–border);
background: var(–cream);
position: sticky; top: 0; z-index: 100;
}
.nav-logo {
font-family: ‘Playfair Display’, serif;
font-size: 22px; font-style: italic;
color: var(–rust);
letter-spacing: -0.5px;
}
.nav-logo span { color: var(–fig); font-style: normal; }
.nav-actions { display: flex; gap: 12px; align-items: center; }
.btn-ghost {
background: none; border: none; cursor: pointer;
font-family: ‘DM Sans’, sans-serif;
font-size: 14px; color: var(–muted); padding: 8px 16px;
border-radius: 8px; transition: color 0.2s;
}
.btn-ghost:hover { color: var(–rust); }
.btn-primary {
background: var(–rust); color: white;
border: none; cursor: pointer;
font-family: ‘DM Sans’, sans-serif;
font-size: 14px; font-weight: 500;
padding: 10px 22px; border-radius: 100px;
transition: background 0.2s, transform 0.1s;
}
.btn-primary:hover { background: var(–rust-dark); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

/* ── HERO ── */
.hero {
display: flex; flex-direction: column; align-items: center;
text-align: center;
padding: 80px 24px 60px;
position: relative; overflow: hidden;
}
.hero-badge {
display: inline-flex; align-items: center; gap: 6px;
background: var(–warm); border: 1px solid var(–border);
padding: 6px 14px; border-radius: 100px;
font-size: 12px; color: var(–muted); letter-spacing: 0.5px;
text-transform: uppercase; margin-bottom: 28px;
}
.hero-badge-dot { width: 6px; height: 6px; background: var(–rust); border-radius: 50%; }
.hero h1 {
font-family: ‘Playfair Display’, serif;
font-size: clamp(42px, 8vw, 80px);
line-height: 1.05; color: var(–fig);
max-width: 720px; margin-bottom: 20px;
}
.hero h1 em { color: var(–rust); font-style: italic; }
.hero p {
font-size: 18px; color: var(–muted); line-height: 1.6;
max-width: 480px; margin-bottom: 40px; font-weight: 300;
}
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.btn-large {
font-size: 16px !important; padding: 16px 36px !important;
border-radius: 100px !important;
}
.btn-outline {
background: none; border: 1.5px solid var(–border);
color: var(–fig); cursor: pointer;
font-family: ‘DM Sans’, sans-serif;
font-size: 16px; padding: 16px 36px;
border-radius: 100px; transition: border-color 0.2s, color 0.2s;
}
.btn-outline:hover { border-color: var(–rust); color: var(–rust); }

/* floating food emoji decorations */
.hero-decor {
position: absolute; font-size: 40px; opacity: 0.12;
animation: float 6s ease-in-out infinite;
pointer-events: none;
}
@keyframes float {
0%,100% { transform: translateY(0) rotate(0deg); }
50% { transform: translateY(-16px) rotate(8deg); }
}

/* ── HOW IT WORKS ── */
.section { padding: 60px 24px; max-width: 900px; margin: 0 auto; }
.section-title {
font-family: ‘Playfair Display’, serif;
font-size: 32px; color: var(–fig);
margin-bottom: 40px; text-align: center;
}
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
.step {
background: var(–card); border: 1px solid var(–border);
border-radius: 16px; padding: 28px 24px;
text-align: center;
transition: transform 0.2s, box-shadow 0.2s;
}
.step:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(60,35,20,0.08); }
.step-icon { font-size: 36px; margin-bottom: 14px; }
.step h3 { font-size: 16px; font-weight: 500; color: var(–fig); margin-bottom: 8px; }
.step p { font-size: 14px; color: var(–muted); line-height: 1.5; }

/* ── MODAL OVERLAY ── */
.overlay {
position: fixed; inset: 0;
background: rgba(42, 26, 14, 0.5);
backdrop-filter: blur(4px);
z-index: 200; display: flex; align-items: center; justify-content: center;
padding: 20px;
animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
background: var(–white); border-radius: 24px;
width: 100%; max-width: 480px;
max-height: 90vh; overflow-y: auto;
padding: 40px 36px;
animation: slideUp 0.25s ease;
position: relative;
}
@keyframes slideUp {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}
.modal-close {
position: absolute; top: 16px; right: 20px;
background: none; border: none; cursor: pointer;
font-size: 22px; color: var(–muted);
width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
border-radius: 8px;
}
.modal-close:hover { background: var(–warm); }

/* ── AUTH FORM ── */
.auth-title {
font-family: ‘Playfair Display’, serif;
font-size: 28px; color: var(–fig);
margin-bottom: 6px;
}
.auth-sub { font-size: 14px; color: var(–muted); margin-bottom: 28px; }
.form-group { margin-bottom: 18px; }
.form-label { display: block; font-size: 13px; font-weight: 500; color: var(–fig); margin-bottom: 6px; }
.form-input {
width: 100%; padding: 12px 16px;
border: 1.5px solid var(–border);
border-radius: 12px; font-family: ‘DM Sans’, sans-serif;
font-size: 15px; color: var(–text);
background: var(–cream); outline: none;
transition: border-color 0.2s;
}
.form-input:focus { border-color: var(–rust); }
.form-input::placeholder { color: var(–muted); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-footer { text-align: center; margin-top: 18px; font-size: 13px; color: var(–muted); }
.link { color: var(–rust); cursor: pointer; text-decoration: underline; }

/* ── ONBOARDING ── */
.onboard-step {
min-height: 100vh; display: flex; align-items: center; justify-content: center;
padding: 40px 20px;
}
.onboard-card {
background: var(–white); border-radius: 28px;
padding: 48px 44px; max-width: 540px; width: 100%;
box-shadow: 0 24px 80px rgba(60,35,20,0.1);
}
.progress-bar {
height: 3px; background: var(–border);
border-radius: 100px; margin-bottom: 36px; overflow: hidden;
}
.progress-fill {
height: 100%; background: var(–rust);
border-radius: 100px; transition: width 0.4s ease;
}
.q-label {
font-family: ‘Playfair Display’, serif;
font-size: 26px; color: var(–fig);
margin-bottom: 8px; line-height: 1.2;
}
.q-sub { font-size: 14px; color: var(–muted); margin-bottom: 28px; }
.option-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.option-btn {
padding: 14px 18px; border-radius: 12px;
border: 1.5px solid var(–border); background: var(–cream);
font-family: ‘DM Sans’, sans-serif;
font-size: 15px; color: var(–text);
cursor: pointer; text-align: left;
transition: all 0.15s;
}
.option-btn:hover { border-color: var(–rust); background: var(–warm); }
.option-btn.selected { border-color: var(–rust); background: #FDF0E8; color: var(–rust-dark); font-weight: 500; }
.chip-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.chip {
padding: 10px 16px; border-radius: 100px;
border: 1.5px solid var(–border); background: var(–cream);
font-family: ‘DM Sans’, sans-serif; font-size: 14px;
cursor: pointer; transition: all 0.15s;
}
.chip:hover { border-color: var(–rust); }
.chip.selected { border-color: var(–rust); background: var(–rust); color: white; }
.q-nav { display: flex; justify-content: space-between; align-items: center; }
.btn-back {
background: none; border: none; cursor: pointer;
font-family: ‘DM Sans’, sans-serif;
font-size: 14px; color: var(–muted);
padding: 10px 0;
}
.btn-back:hover { color: var(–fig); }

/* ── DINNER PICKER ── */
.picker-page {
min-height: 100vh; padding: 40px 24px;
max-width: 860px; margin: 0 auto;
}
.picker-header { margin-bottom: 40px; }
.picker-header h2 {
font-family: ‘Playfair Display’, serif;
font-size: 36px; color: var(–fig); margin-bottom: 8px;
}
.picker-header p { color: var(–muted); font-size: 16px; }
.dinner-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px; }
.dinner-card {
background: var(–card); border: 1.5px solid var(–border);
border-radius: 20px; padding: 28px 24px; cursor: pointer;
transition: all 0.2s; position: relative; overflow: hidden;
}
.dinner-card::before {
content: ‘’; position: absolute;
top: 0; left: 0; right: 0; height: 3px;
background: var(–rust); opacity: 0;
transition: opacity 0.2s;
}
.dinner-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(60,35,20,0.1); }
.dinner-card:hover::before { opacity: 1; }
.dinner-card.selected { border-color: var(–rust); box-shadow: 0 0 0 3px rgba(192,92,44,0.15); }
.dinner-card.selected::before { opacity: 1; }
.dinner-emoji { font-size: 44px; margin-bottom: 16px; }
.dinner-vibe { font-family: ‘Playfair Display’, serif; font-size: 18px; color: var(–fig); margin-bottom: 6px; }
.dinner-date { font-size: 13px; color: var(–muted); margin-bottom: 14px; }
.dinner-fill {
display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
}
.fill-bar { flex: 1; height: 4px; background: var(–border); border-radius: 100px; overflow: hidden; }
.fill-inner { height: 100%; background: var(–gold); border-radius: 100px; }
.fill-text { font-size: 12px; color: var(–muted); white-space: nowrap; }

/* ── CONFIRMATION ── */
.confirm-page {
min-height: 100vh; display: flex; flex-direction: column;
align-items: center; justify-content: center;
padding: 40px 24px; text-align: center;
}
.confirm-icon { font-size: 72px; margin-bottom: 24px; }
.confirm-page h2 {
font-family: ‘Playfair Display’, serif;
font-size: 36px; color: var(–fig); margin-bottom: 12px;
}
.confirm-page p { font-size: 16px; color: var(–muted); max-width: 380px; line-height: 1.6; margin-bottom: 32px; }
.confirm-details {
background: var(–card); border: 1px solid var(–border);
border-radius: 16px; padding: 24px 28px;
max-width: 380px; width: 100%;
text-align: left; margin-bottom: 28px;
}
.detail-row {
display: flex; justify-content: space-between; align-items: center;
padding: 10px 0; border-bottom: 1px solid var(–border);
font-size: 14px;
}
.detail-row:last-child { border-bottom: none; }
.detail-label { color: var(–muted); }
.detail-value { color: var(–fig); font-weight: 500; }

/* ── ADMIN VIEW ── */
.admin-page { padding: 40px 24px; max-width: 960px; margin: 0 auto; }
.admin-header { margin-bottom: 32px; }
.admin-header h2 {
font-family: ‘Playfair Display’, serif;
font-size: 32px; color: var(–fig);
}
.admin-tag {
display: inline-block; background: var(–rust);
color: white; font-size: 11px; letter-spacing: 0.5px;
text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
margin-left: 10px; vertical-align: middle;
}
.group-card {
background: var(–card); border: 1px solid var(–border);
border-radius: 20px; padding: 28px;
margin-bottom: 24px;
}
.group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.group-title { font-family: ‘Playfair Display’, serif; font-size: 20px; color: var(–fig); }
.group-meta { font-size: 13px; color: var(–muted); }
.user-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.user-chip {
background: var(–warm); border-radius: 12px;
padding: 12px 14px;
}
.user-name { font-size: 14px; font-weight: 500; color: var(–fig); margin-bottom: 4px; }
.user-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
font-size: 11px; padding: 3px 8px; border-radius: 100px;
background: var(–border); color: var(–muted);
}
.send-btn {
margin-top: 20px; background: var(–sage);
color: white; border: none; cursor: pointer;
font-family: ‘DM Sans’, sans-serif;
font-size: 14px; padding: 10px 22px; border-radius: 100px;
transition: opacity 0.2s;
}
.send-btn:hover { opacity: 0.85; }
.sent-badge {
margin-top: 12px; font-size: 13px;
color: var(–sage); display: flex; align-items: center; gap: 6px;
}

/* ── TOAST ── */
.toast {
position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
background: var(–fig); color: white;
padding: 14px 24px; border-radius: 100px;
font-size: 14px; z-index: 999;
animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
white-space: nowrap;
}
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
@keyframes toastOut { to { opacity: 0; transform: translateX(-50%) translateY(10px); } }

@media (max-width: 520px) {
.modal { padding: 32px 24px; }
.onboard-card { padding: 36px 24px; }
.nav { padding: 16px 20px; }
.form-row { grid-template-columns: 1fr; }
}
`;

// ─── Components ───────────────────────────────────────────────────────────────

function Toast({ msg }) {
return <div className="toast">{msg}</div>;
}

function AuthModal({ mode, onClose, onSuccess, onSwitch }) {
const [form, setForm] = useState({ first: “”, last: “”, email: “”, password: “” });
const set = (k) => (e) => setForm({ …form, [k]: e.target.value });

const submit = () => {
if (!form.email || !form.password) return;
onSuccess({ name: form.first || “Friend”, email: form.email });
};

return (
<div className="overlay" onClick={onClose}>
<div className=“modal” onClick={(e) => e.stopPropagation()}>
<button className="modal-close" onClick={onClose}>✕</button>
<div className="auth-title">{mode === “signup” ? “Join Leftovers” : “Welcome back”}</div>
<div className="auth-sub">
{mode === “signup” ? “Find your table. Meet your people.” : “Good to see you again.”}
</div>

```
    {mode === "signup" && (
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First name</label>
          <input className="form-input" placeholder="Sofia" value={form.first} onChange={set("first")} />
        </div>
        <div className="form-group">
          <label className="form-label">Last name</label>
          <input className="form-input" placeholder="M." value={form.last} onChange={set("last")} />
        </div>
      </div>
    )}

    <div className="form-group">
      <label className="form-label">Email</label>
      <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
    </div>
    <div className="form-group">
      <label className="form-label">Password</label>
      <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
    </div>

    <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }} onClick={submit}>
      {mode === "signup" ? "Create account →" : "Sign in →"}
    </button>

    <div className="form-footer">
      {mode === "signup" ? (
        <>Already have an account? <span className="link" onClick={onSwitch}>Sign in</span></>
      ) : (
        <>New here? <span className="link" onClick={onSwitch}>Create account</span></>
      )}
    </div>
  </div>
</div>
```

);
}

function Onboarding({ user, onComplete }) {
const [step, setStep] = useState(0);
const [answers, setAnswers] = useState({});

const q = QUESTIONS[step];
const progress = ((step + 1) / QUESTIONS.length) * 100;

const selectSingle = (val) => setAnswers({ …answers, [q.id]: val });
const toggleMulti = (val) => {
const cur = answers[q.id] || [];
if (cur.includes(val)) setAnswers({ …answers, [q.id]: cur.filter((x) => x !== val) });
else if (cur.length < q.max) setAnswers({ …answers, [q.id]: […cur, val] });
};

const canNext = q.type === “multi”
? (answers[q.id] || []).length > 0
: !!answers[q.id];

const next = () => {
if (step < QUESTIONS.length - 1) setStep(step + 1);
else onComplete(answers);
};

return (
<div className="onboard-step">
<div className="onboard-card">
<div className="progress-bar">
<div className=“progress-fill” style={{ width: `${progress}%` }} />
</div>

```
    <div className="q-label">{q.label}</div>
    <div className="q-sub">
      {q.type === "multi" ? `Choose up to ${q.max}` : "Pick one"}
    </div>

    {q.type === "select" && (
      <div className="option-list">
        {q.options.map((o) => (
          <button
            key={o}
            className={`option-btn ${answers[q.id] === o ? "selected" : ""}`}
            onClick={() => selectSingle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    )}

    {q.type === "multi" && (
      <div className="chip-list">
        {q.options.map((o) => (
          <button
            key={o}
            className={`chip ${(answers[q.id] || []).includes(o) ? "selected" : ""}`}
            onClick={() => toggleMulti(o)}
          >
            {o}
          </button>
        ))}
      </div>
    )}

    <div className="q-nav">
      <button className="btn-back" onClick={() => step > 0 && setStep(step - 1)}>
        {step > 0 ? "← Back" : ""}
      </button>
      <button
        className="btn-primary"
        onClick={next}
        disabled={!canNext}
        style={{ opacity: canNext ? 1 : 0.4 }}
      >
        {step < QUESTIONS.length - 1 ? "Next →" : "See available dinners →"}
      </button>
    </div>
  </div>
</div>
```

);
}

function SeatClaim({ user, onBook }) {
return (
<div className="seat-page">
<div className="seat-card">
<div className="seat-icon">🕯️</div>
<div className="seat-eyebrow">Next Leftovers dinner</div>
<h2 className="seat-title">{NEXT_DINNER.date}</h2>
<div className="seat-time">{NEXT_DINNER.time} · Somewhere delicious in your city</div>

```
    <div className="seat-mystery">
      <div className="mystery-icon">🗺️</div>
      <div>
        <div className="mystery-title">The venue is a surprise</div>
        <div className="mystery-sub">We'll email you the location 48 hours before. Trust us — it'll be worth it.</div>
      </div>
    </div>

    <div className="seat-perks">
      {[
        { icon: "👥", text: "6 people, matched by interests" },
        { icon: "🍽️", text: "Every Thursday at 8 PM" },
        { icon: "📍", text: "Venue revealed 48h before" },
      ].map((p) => (
        <div className="perk-row" key={p.text}>
          <span className="perk-icon">{p.icon}</span>
          <span>{p.text}</span>
        </div>
      ))}
    </div>

    <button className="btn-primary btn-large" style={{ width: "100%" }} onClick={() => onBook(NEXT_DINNER)}>
      Claim my seat →
    </button>
    <div className="seat-note">Free to join · No credit card required</div>
  </div>
</div>
```

);
}

function Confirmation({ user, dinner }) {
return (
<div className="confirm-page">
<div className="confirm-icon">🎉</div>
<h2>You’re on the list!</h2>
<p>
We’ll match you with 5 like-minded strangers and email you the secret venue 48 hours before dinner.
</p>
<div className="confirm-details">
<div className="detail-row">
<span className="detail-label">Date</span>
<span className="detail-value">{dinner.date}</span>
</div>
<div className="detail-row">
<span className="detail-label">Time</span>
<span className="detail-value">{dinner.time}</span>
</div>
<div className="detail-row">
<span className="detail-label">Venue</span>
<span className="detail-value">TBA — check your email 📬</span>
</div>
<div className="detail-row">
<span className="detail-label">Email</span>
<span className="detail-value">{user.email}</span>
</div>
</div>
<p style={{ fontSize: 13, color: “var(–muted)” }}>
Confirmation sent to <strong>{user.email}</strong>
</p>
</div>
);
}

function AdminView({ onClose }) {
const [sent, setSent] = useState(false);

const group = FAKE_USERS.filter((u) => u.dinnerId === 1);

return (
<div className="admin-page">
<button className=“btn-ghost” onClick={onClose} style={{ marginBottom: 12, paddingLeft: 0 }}>
← Back
</button>
<div className="admin-header">
<h2>
Admin Dashboard
<span className="admin-tag">Organizer</span>
</h2>
<p style={{ color: “var(–muted)”, marginTop: 8, fontSize: 15 }}>
Matched groups for <strong>{NEXT_DINNER.date} · 8:00 PM</strong>
</p>
</div>

```
  <div className="group-card">
    <div className="group-header">
      <div>
        <div className="group-title">Group A · 6 people matched</div>
        <div className="group-meta">Shared vibe: Travel · Cultural conversations</div>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>
        🍝 Trattoria Romana, 47 Mulberry St · 7:30 PM
      </div>
    </div>

    <div className="user-list">
      {group.map((u, i) => (
        <div className="user-chip" key={i}>
          <div className="user-name">{u.name}</div>
          <div className="user-tags">
            {u.interests.slice(0, 2).map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>

    {!sent ? (
      <button className="send-btn" onClick={() => setSent(true)}>
        📧 Send venue email to group
      </button>
    ) : (
      <div className="sent-badge">
        ✅ Venue email sent to all 6 guests!
      </div>
    )}
  </div>

  <div className="group-card" style={{ opacity: 0.5 }}>
    <div className="group-header">
      <div>
        <div className="group-title">Group B · waiting for 2 more signups</div>
        <div className="group-meta">4 / 6 matched so far</div>
      </div>
    </div>
    <p style={{ fontSize: 14, color: "var(--muted)" }}>This group will be finalized once 2 more guests sign up for this date.</p>
  </div>
</div>
```

);
}

function LandingPage({ onOpenAuth }) {
return (
<>
<div className="hero">
<div className=“hero-decor” style={{ top: “10%”, left: “8%”, animationDelay: “0s” }}>🍷</div>
<div className=“hero-decor” style={{ top: “15%”, right: “10%”, animationDelay: “1.5s” }}>🫒</div>
<div className=“hero-decor” style={{ bottom: “12%”, left: “14%”, animationDelay: “3s” }}>🧄</div>
<div className=“hero-decor” style={{ bottom: “20%”, right: “8%”, animationDelay: “0.8s” }}>🫙</div>

```
    <div className="hero-badge">
      <span className="hero-badge-dot" />
      Every Thursday at 8 PM
    </div>
    <h1>Dinner for <em>strangers</em><br />who become friends</h1>
    <p>
      Answer a few questions, claim your seat. We'll match you with 5 fascinating people and reveal the venue 48 hours before.
    </p>
    <div className="hero-cta">
      <button className="btn-primary btn-large" onClick={() => onOpenAuth("signup")}>
        Find my table →
      </button>
      <button className="btn-outline" onClick={() => onOpenAuth("login")}>
        Sign in
      </button>
    </div>
  </div>

  <div className="section">
    <div className="section-title">How it works</div>
    <div className="steps">
      {[
        { icon: "✍️", title: "Tell us about you", desc: "A quick 5-question profile so we can match you well." },
        { icon: "🪑", title: "Claim your seat", desc: "One click and you're in for next Thursday at 8 PM." },
        { icon: "🤝", title: "We do the matching", desc: "Our algorithm groups 6 people with real chemistry." },
        { icon: "📬", title: "Get the venue", desc: "48 hours before, we email you the secret restaurant." },
      ].map((s) => (
        <div className="step" key={s.title}>
          <div className="step-icon">{s.icon}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  </div>
</>
```

);
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen] = useState(“landing”); // landing | onboard | seat | confirm | admin
const [authMode, setAuthMode] = useState(null); // null | signup | login
const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
const [bookedDinner, setBookedDinner] = useState(null);
const [toast, setToast] = useState(null);

const showToast = (msg) => {
setToast(msg);
setTimeout(() => setToast(null), 3000);
};

const handleAuthSuccess = (u) => {
setUser(u);
setAuthMode(null);
setScreen(“onboard”);
showToast(`Welcome, ${u.name}! Let's set up your profile.`);
};

const handleOnboardComplete = (answers) => {
setProfile(answers);
setScreen(“seat”);
};

const handleBook = (dinner) => {
setBookedDinner(dinner);
setScreen(“confirm”);
showToast(“You’re in! Check your email for confirmation.”);
};

return (
<>
<style>{styles}</style>
<div className="app">
{screen !== “admin” && (
<nav className="nav">
<div className=“nav-logo” onClick={() => setScreen(“landing”)} style={{ cursor: “pointer” }}>
left<span>overs</span>
</div>
<div className="nav-actions">
{!user ? (
<>
<button className=“btn-ghost” onClick={() => setAuthMode(“login”)}>Sign in</button>
<button className=“btn-primary” onClick={() => setAuthMode(“signup”)}>Join now</button>
</>
) : (
<>
<button className=“btn-ghost” onClick={() => setScreen(“admin”)}>Admin view</button>
<button className=“btn-ghost” onClick={() => { setUser(null); setScreen(“landing”); }}>
Sign out
</button>
</>
)}
</div>
</nav>
)}

```
    {screen === "landing" && <LandingPage onOpenAuth={setAuthMode} />}
    {screen === "onboard" && <Onboarding user={user} onComplete={handleOnboardComplete} />}
    {screen === "seat" && <SeatClaim user={user} onBook={handleBook} />}
    {screen === "confirm" && <Confirmation user={user} dinner={bookedDinner} />}
    {screen === "admin" && <AdminView onClose={() => setScreen("landing")} />}

    {authMode && (
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSuccess={handleAuthSuccess}
        onSwitch={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
      />
    )}

    {toast && <Toast msg={toast} />}
  </div>
</>
```

);
}
