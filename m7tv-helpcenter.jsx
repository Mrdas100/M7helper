import { useState, useEffect, useCallback, useRef } from "react";

// ─── Firebase Config ───
const FIREBASE_CONFIG = {
  projectId: "m7tv-helpcenter",
  databaseURL: "https://m7tv-helpcenter-default-rtdb.europe-west1.firebasedatabase.app",
};

const DB = FIREBASE_CONFIG.databaseURL;

async function fbGet(path) {
  try {
    const r = await fetch(`${DB}/${path}.json`);
    return await r.json();
  } catch { return null; }
}
async function fbSet(path, data) {
  await fetch(`${DB}/${path}.json`, { method: "PUT", body: JSON.stringify(data) });
}
async function fbPush(path, data) {
  const r = await fetch(`${DB}/${path}.json`, { method: "POST", body: JSON.stringify(data) });
  return await r.json();
}
async function fbDelete(path) {
  await fetch(`${DB}/${path}.json`, { method: "DELETE" });
}

// ─── Icons (inline SVG) ───
const Icons = {
  android: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 7h12c0-2.12-1.1-3.98-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  tv: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
    </svg>
  ),
  pc: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  thumbUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
    </svg>
  ),
  thumbDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

// ─── Categories ───
const CATEGORIES = [
  { id: "android", label: "أجهزة Android", icon: Icons.android, color: "#3DDC84", desc: "شاشات، هواتف، TV Box" },
  { id: "apple", label: "أجهزة Apple", icon: Icons.apple, color: "#A2AAAD", desc: "iPhone, iPad, Apple TV" },
  { id: "smarttv", label: "الشاشات الذكية", icon: Icons.tv, color: "#00B4D8", desc: "Samsung, LG, وأكثر" },
  { id: "pc", label: "الكمبيوتر والروابط", icon: Icons.pc, color: "#FF6B35", desc: "روابط التحميل والتحديثات" },
];

const ARTICLE_TYPES = [
  { id: "activation", label: "شرح التفعيل" },
  { id: "renewal", label: "طريقة التجديد" },
  { id: "troubleshoot", label: "حلول المشاكل" },
  { id: "download", label: "تحميل تطبيق" },
  { id: "general", label: "عام" },
];

// ─── Demo Data ───
const DEMO_ARTICLES = {
  "-demo1": { title: "تفعيل تطبيق IPTV Smarters على أندرويد", category: "android", type: "activation", steps: "1. حمّل تطبيق IPTV Smarters Pro من رابط التحميل أدناه\n2. افتح التطبيق واختر \"Login with Xtream Codes API\"\n3. أدخل بيانات الاشتراك المرسلة لك\n4. اضغط \"Add User\" واستمتع بالمشاهدة", videoUrl: "", downloadUrl: "https://m7store.vip", downloadLabel: "تحميل التطبيق", published: true, order: 1, createdAt: Date.now() },
  "-demo2": { title: "تفعيل الاشتراك على iPhone و iPad", category: "apple", type: "activation", steps: "1. حمّل تطبيق IPTV Smarters من App Store\n2. افتح التطبيق وسجل الدخول\n3. أدخل بيانات السيرفر\n4. استمتع بالمشاهدة", videoUrl: "", downloadUrl: "", downloadLabel: "", published: true, order: 1, createdAt: Date.now() },
  "-demo3": { title: "إعداد IPTV على شاشات Samsung Smart TV", category: "smarttv", type: "activation", steps: "1. افتح Samsung App Store\n2. ابحث عن تطبيق Smart IPTV أو IPTV Smarters\n3. حمّل التطبيق وافتحه\n4. أدخل بيانات الاشتراك", videoUrl: "", downloadUrl: "", downloadLabel: "", published: true, order: 1, createdAt: Date.now() },
  "-demo4": { title: "مشاهدة عبر الكمبيوتر - VLC Player", category: "pc", type: "activation", steps: "1. حمّل برنامج VLC Media Player\n2. افتح البرنامج واختر Media > Open Network Stream\n3. الصق رابط M3U المرسل لك\n4. اضغط Play", videoUrl: "", downloadUrl: "https://www.videolan.org/vlc/", downloadLabel: "تحميل VLC", published: true, order: 1, createdAt: Date.now() },
  "-demo5": { title: "حل مشكلة التقطيع وبطء البث", category: "android", type: "troubleshoot", steps: "1. تأكد من سرعة الإنترنت (يجب أن تكون 10 ميجا على الأقل)\n2. غيّر المشغل الداخلي للتطبيق من الإعدادات\n3. جرّب الاتصال بشبكة مختلفة\n4. أعد تشغيل الراوتر\n5. تواصل معنا عبر الواتساب إذا استمرت المشكلة", videoUrl: "", downloadUrl: "", downloadLabel: "", published: true, order: 2, createdAt: Date.now() },
  "-demo6": { title: "طريقة تجديد الاشتراك", category: "android", type: "renewal", steps: "1. ادخل على متجر ليون ستور واختر باقة التجديد\n2. أكمل عملية الدفع\n3. ستصلك رسالة بالكود الجديد\n4. افتح التطبيق وحدّث بيانات الاشتراك", videoUrl: "", downloadUrl: "", downloadLabel: "", published: true, order: 3, createdAt: Date.now() },
};

const DEMO_SERVERS = {
  "-s1": { name: "السيرفر الرئيسي", status: "online", lastCheck: Date.now() },
  "-s2": { name: "سيرفر الاحتياط", status: "online", lastCheck: Date.now() },
};

const WHATSAPP_NUMBER = "966500000000";
const ADMIN_PIN = "9999";

// ─── Styles ───
const css = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

:root {
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: #1a2035;
  --bg-card-hover: #1f2847;
  --bg-glass: rgba(26, 32, 53, 0.85);
  --accent: #F5C200;
  --accent-glow: rgba(245, 194, 0, 0.25);
  --accent2: #00B4D8;
  --accent3: #3DDC84;
  --text-primary: #f0f0f0;
  --text-secondary: #8b95b0;
  --text-muted: #5a6380;
  --border: rgba(255,255,255,0.06);
  --border-accent: rgba(245, 194, 0, 0.2);
  --danger: #ef4444;
  --success: #22c55e;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 8px 32px rgba(0,0,0,0.4);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body, #root {
  font-family: 'Tajawal', 'IBM Plex Sans Arabic', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  direction: rtl;
  min-height: 100vh;
  overflow-x: hidden;
}

.app-wrapper {
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,194,0,0.06), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,180,216,0.04), transparent),
    var(--bg-primary);
}

/* Ambient floating orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  animation: orbFloat 20s ease-in-out infinite;
}
.orb-1 { width: 300px; height: 300px; background: rgba(245,194,0,0.12); top: -80px; right: -60px; }
.orb-2 { width: 250px; height: 250px; background: rgba(0,180,216,0.1); bottom: 10%; left: -80px; animation-delay: -7s; }
.orb-3 { width: 200px; height: 200px; background: rgba(61,220,132,0.08); top: 50%; right: 30%; animation-delay: -14s; }

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px) saturate(1.5);
  background: rgba(10, 14, 26, 0.8);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.5px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent), #e6a800);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #000;
  font-weight: 900;
  box-shadow: 0 4px 20px var(--accent-glow);
}

.logo span { color: var(--accent); }

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), #e6a800);
  color: #000;
  box-shadow: 0 4px 20px var(--accent-glow);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px var(--accent-glow); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

.btn-danger { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
.btn-danger:hover { background: rgba(239,68,68,0.25); }

.btn-sm { padding: 6px 14px; font-size: 0.82rem; border-radius: 8px; }
.btn-icon { padding: 8px; border-radius: 10px; }

/* Hero */
.hero {
  text-align: center;
  padding: 60px 24px 40px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1.3;
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--text-primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto 32px;
}

/* Search */
.search-box {
  max-width: 560px;
  margin: 0 auto;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 16px 24px 16px 50px;
  border-radius: 50px;
  border: 1px solid var(--border-accent);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}
.search-box input::placeholder { color: var(--text-muted); }
.search-box input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-glow); }

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 40px;
  position: relative;
  z-index: 1;
}

.cat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.cat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, var(--cat-color-alpha), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}
.cat-card:hover::before { opacity: 1; }
.cat-card:hover { transform: translateY(-4px); border-color: var(--cat-color); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

.cat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.cat-card h3 { font-size: 1.1rem; font-weight: 700; position: relative; z-index: 1; }
.cat-card p { color: var(--text-secondary); font-size: 0.88rem; position: relative; z-index: 1; }

.cat-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
  position: relative;
  z-index: 1;
}

/* Content area */
.content-area {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 60px;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  margin-bottom: 24px;
}
.breadcrumb button {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
}
.breadcrumb button:hover { text-decoration: underline; }

/* Article list */
.article-list { display: flex; flex-direction: column; gap: 12px; }

.article-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 16px;
}
.article-card:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.1); transform: translateX(-4px); }

.article-type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.article-card h4 { font-size: 1rem; font-weight: 600; flex: 1; }

.type-activation { background: rgba(61,220,132,0.12); color: #3DDC84; }
.type-renewal { background: rgba(0,180,216,0.12); color: #00B4D8; }
.type-troubleshoot { background: rgba(239,68,68,0.12); color: #ef4444; }
.type-download { background: rgba(245,194,0,0.12); color: #F5C200; }
.type-general { background: rgba(139,149,176,0.12); color: #8b95b0; }

/* Article detail */
.article-detail {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
}

.article-detail h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.step-list { display: flex; flex-direction: column; gap: 16px; }

.step-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-num {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #e6a800);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-text {
  padding-top: 6px;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.article-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  flex-wrap: wrap;
}

/* Feedback */
.feedback-box {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.feedback-box p {
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 600;
}

.feedback-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.fb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.2s;
}
.fb-btn:hover { background: rgba(255,255,255,0.05); }
.fb-btn.voted-yes { background: rgba(34,197,94,0.15); color: var(--success); border-color: rgba(34,197,94,0.3); }
.fb-btn.voted-no { background: rgba(239,68,68,0.15); color: var(--danger); border-color: rgba(239,68,68,0.3); }

/* Server Status */
.status-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.status-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-online { background: var(--success); box-shadow: 0 0 12px rgba(34,197,94,0.5); }
.status-offline { background: var(--danger); box-shadow: 0 0 12px rgba(239,68,68,0.5); }
.status-maintenance { background: var(--accent); box-shadow: 0 0 12px var(--accent-glow); }

.status-info { display: flex; align-items: center; gap: 12px; }
.status-label { font-weight: 600; }
.status-time { color: var(--text-muted); font-size: 0.8rem; }

/* Admin Panel */
.admin-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.admin-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 4px;
  overflow-x: auto;
}

.admin-tab {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
  transition: all 0.2s;
}
.admin-tab.active { background: var(--bg-card); color: var(--text-primary); }
.admin-tab:hover { color: var(--text-primary); }

/* Form */
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
  border-color: var(--accent);
}
.form-group textarea { min-height: 160px; resize: vertical; line-height: 1.7; }
.form-group select { cursor: pointer; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.toggle {
  width: 48px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}
.toggle.on { background: var(--success); }
.toggle.off { background: var(--text-muted); }
.toggle::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 3px;
  transition: right 0.2s, left 0.2s;
}
.toggle.on::after { left: 3px; right: auto; }
.toggle.off::after { right: 3px; left: auto; }

/* Admin table */
.admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.admin-table th {
  padding: 12px 16px;
  text-align: right;
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}
.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}
.admin-table tr:hover td { background: rgba(255,255,255,0.02); }

.admin-table .actions { display: flex; gap: 6px; }

/* PIN modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal h3 { font-size: 1.3rem; margin-bottom: 8px; }
.modal p { color: var(--text-secondary); margin-bottom: 24px; font-size: 0.92rem; }

.pin-input {
  letter-spacing: 16px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  padding: 14px !important;
}

.pin-error { color: var(--danger); font-size: 0.85rem; margin-top: 8px; }

/* WhatsApp FAB */
.whatsapp-fab {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25D366;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  z-index: 100;
  transition: all 0.3s;
  animation: fabPulse 3s ease-in-out infinite;
}
.whatsapp-fab:hover { transform: scale(1.1); }

@keyframes fabPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
  50% { box-shadow: 0 4px 30px rgba(37,211,102,0.6); }
}

/* Stats cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label { color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px; }

/* Footer */
.footer {
  text-align: center;
  padding: 32px 24px;
  color: var(--text-muted);
  font-size: 0.82rem;
  border-top: 1px solid var(--border);
  position: relative;
  z-index: 1;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: var(--text-muted);
}
.empty-state svg { opacity: 0.3; margin-bottom: 16px; }
.empty-state p { font-size: 1rem; }

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.5s ease-out forwards; }
.delay-1 { animation-delay: 0.1s; opacity: 0; }
.delay-2 { animation-delay: 0.2s; opacity: 0; }
.delay-3 { animation-delay: 0.3s; opacity: 0; }
.delay-4 { animation-delay: 0.4s; opacity: 0; }

/* Responsive */
@media (max-width: 640px) {
  .categories-grid { grid-template-columns: 1fr; }
  .header { padding: 0 16px; }
  .hero { padding: 40px 16px 28px; }
  .content-area { padding: 0 16px 40px; }
  .article-detail { padding: 24px 18px; }
  .admin-container { padding: 16px; }
  .form-row { grid-template-columns: 1fr; }
  .modal { padding: 28px 20px; }
}
`;

// ─── Main App ───
export default function App() {
  const [view, setView] = useState("home"); // home | category | article | status | admin
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState(DEMO_ARTICLES);
  const [servers, setServers] = useState(DEMO_SERVERS);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [adminTab, setAdminTab] = useState("articles");
  const [editArticle, setEditArticle] = useState(null);
  const [editServer, setEditServer] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load from Firebase on mount
  useEffect(() => {
    (async () => {
      const arts = await fbGet("articles");
      if (arts) setArticles(arts);
      else await fbSet("articles", DEMO_ARTICLES);

      const srvs = await fbGet("servers");
      if (srvs) setServers(srvs);
      else await fbSet("servers", DEMO_SERVERS);

      const fb = await fbGet("feedback");
      if (fb) setFeedback(fb);
    })();
  }, []);

  // Derived
  const publishedArticles = Object.entries(articles).filter(([, a]) => a.published);
  const filteredArticles = publishedArticles.filter(([, a]) => {
    const matchCat = selectedCat ? a.category === selectedCat : true;
    const matchSearch = search
      ? a.title.includes(search) || a.steps?.includes(search) || a.category?.includes(search)
      : true;
    return matchCat && matchSearch;
  });

  const getCatCount = (catId) => publishedArticles.filter(([, a]) => a.category === catId).length;

  const navigate = (v, cat = null, art = null) => {
    setView(v);
    setSelectedCat(cat);
    setSelectedArticle(art);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminAccess = () => {
    if (isAdmin) { navigate("admin"); return; }
    setShowPinModal(true);
    setPin("");
    setPinError("");
  };

  const verifyPin = () => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      navigate("admin");
    } else {
      setPinError("رمز الدخول غير صحيح");
    }
  };

  const handleFeedback = async (articleId, vote) => {
    const newFb = { ...feedback, [articleId]: vote };
    setFeedback(newFb);
    await fbSet(`feedback/${articleId}`, vote);
  };

  // ─── Article Form ───
  const ArticleForm = ({ article, onSave, onCancel }) => {
    const [form, setForm] = useState(article || {
      title: "", category: "android", type: "activation", steps: "",
      videoUrl: "", downloadUrl: "", downloadLabel: "", published: true, order: 1,
    });

    const handleSave = async () => {
      if (!form.title.trim()) return;
      const data = { ...form, createdAt: article?.createdAt || Date.now() };
      if (article?._id) {
        await fbSet(`articles/${article._id}`, data);
        setArticles((prev) => ({ ...prev, [article._id]: data }));
      } else {
        const res = await fbPush("articles", data);
        setArticles((prev) => ({ ...prev, [res.name]: data }));
      }
      onSave();
    };

    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 28 }}>
        <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{article ? "تعديل المقال" : "إضافة مقال جديد"}</h3>
        <div className="form-group">
          <label>عنوان المقال</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثل: تفعيل IPTV على أندرويد" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>القسم</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>نوع الشرح</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {ARTICLE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>الخطوات (سطر لكل خطوة، ابدأ بالرقم)</label>
          <textarea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} placeholder={"1. افتح التطبيق\n2. اضغط على الإعدادات\n3. أدخل البيانات"} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>رابط الفيديو (اختياري)</label>
            <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/..." />
          </div>
          <div className="form-group">
            <label>ترتيب العرض</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>رابط التحميل (اختياري)</label>
            <input value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>نص زر التحميل</label>
            <input value={form.downloadLabel} onChange={(e) => setForm({ ...form, downloadLabel: e.target.value })} placeholder="تحميل التطبيق" />
          </div>
        </div>
        <div className="toggle-row">
          <span style={{ fontWeight: 600 }}>منشور (ظاهر للعملاء)</span>
          <button className={`toggle ${form.published ? "on" : "off"}`} onClick={() => setForm({ ...form, published: !form.published })} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSave}>حفظ</button>
          <button className="btn btn-ghost" onClick={onCancel}>إلغاء</button>
        </div>
      </div>
    );
  };

  // ─── Server Form ───
  const ServerForm = ({ server, onSave, onCancel }) => {
    const [form, setForm] = useState(server || { name: "", status: "online", lastCheck: Date.now() });

    const handleSave = async () => {
      if (!form.name.trim()) return;
      const data = { ...form, lastCheck: Date.now() };
      if (server?._id) {
        await fbSet(`servers/${server._id}`, data);
        setServers((prev) => ({ ...prev, [server._id]: data }));
      } else {
        const res = await fbPush("servers", data);
        setServers((prev) => ({ ...prev, [res.name]: data }));
      }
      onSave();
    };

    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 28 }}>
        <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{server ? "تعديل السيرفر" : "إضافة سيرفر"}</h3>
        <div className="form-group">
          <label>اسم السيرفر</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>الحالة</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="online">يعمل</option>
            <option value="offline">متوقف</option>
            <option value="maintenance">صيانة</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSave}>حفظ</button>
          <button className="btn btn-ghost" onClick={onCancel}>إلغاء</button>
        </div>
      </div>
    );
  };

  const deleteArticle = async (id) => {
    await fbDelete(`articles/${id}`);
    setArticles((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const deleteServer = async (id) => {
    await fbDelete(`servers/${id}`);
    setServers((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  // Parse steps
  const parseSteps = (text) => {
    if (!text) return [];
    return text.split("\n").filter(l => l.trim()).map(l => l.replace(/^\d+[\.\-\)]\s*/, "").trim());
  };

  // Get YouTube embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-wrapper">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Header */}
        <header className="header">
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("home")}>
            <div className="logo-icon">M7</div>
            <span>مركز المساعدة</span>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("status")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {Icons.server}
              <span style={{ fontSize: "0.82rem" }}>حالة السيرفر</span>
            </button>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={handleAdminAccess} title="لوحة التحكم">
              {Icons.dashboard}
            </button>
          </div>
        </header>

        {/* ── Public Views ── */}
        {view === "home" && (
          <>
            <section className="hero fade-up">
              <h1>مركز مساعدة M7TV</h1>
              <p>كل ما تحتاجه لتفعيل وإعداد اشتراكك في مكان واحد</p>
              <div className="search-box">
                <span className="search-icon">{Icons.search}</span>
                <input
                  placeholder="ابحث عن جهازك أو مشكلتك..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && search) navigate("category"); }}
                />
              </div>
            </section>

            {search ? (
              <div className="content-area">
                <div className="section-header">
                  <h2>نتائج البحث</h2>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>({filteredArticles.length} نتيجة)</span>
                </div>
                <div className="article-list">
                  {filteredArticles.map(([id, art]) => (
                    <div key={id} className="article-card" onClick={() => navigate("article", art.category, { ...art, _id: id })}>
                      <span className={`article-type-badge type-${art.type}`}>
                        {ARTICLE_TYPES.find(t => t.id === art.type)?.label}
                      </span>
                      <h4>{art.title}</h4>
                    </div>
                  ))}
                  {filteredArticles.length === 0 && (
                    <div className="empty-state"><p>لم نجد نتائج، جرّب كلمات أخرى أو تواصل معنا</p></div>
                  )}
                </div>
              </div>
            ) : (
              <section className="categories-grid">
                {CATEGORIES.map((cat, i) => (
                  <div
                    key={cat.id}
                    className={`cat-card fade-up delay-${i + 1}`}
                    style={{ "--cat-color": cat.color, "--cat-color-alpha": cat.color + "15" }}
                    onClick={() => navigate("category", cat.id)}
                  >
                    <div className="cat-icon" style={{ background: cat.color + "18", color: cat.color }}>
                      {cat.icon}
                    </div>
                    <h3>{cat.label}</h3>
                    <p>{cat.desc}</p>
                    <div className="cat-count" style={{ background: cat.color + "12", color: cat.color }}>
                      {getCatCount(cat.id)} شرح متوفر
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Quick server status */}
            {!search && (
              <div className="content-area" style={{ marginTop: 20 }}>
                <div className="section-header">
                  <span style={{ color: "var(--text-secondary)" }}>{Icons.server}</span>
                  <h2 style={{ fontSize: "1.2rem" }}>حالة السيرفرات</h2>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {Object.entries(servers).map(([id, s]) => (
                    <div key={id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
                      background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 50,
                    }}>
                      <div className={`status-dot status-${s.status}`} />
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        {s.status === "online" ? "يعمل" : s.status === "offline" ? "متوقف" : "صيانة"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {view === "category" && (
          <div className="content-area" style={{ paddingTop: 32 }}>
            <div className="breadcrumb">
              <button onClick={() => navigate("home")}>{Icons.home} الرئيسية</button>
              <span>/</span>
              <span>{CATEGORIES.find(c => c.id === selectedCat)?.label || "نتائج البحث"}</span>
            </div>
            <div className="section-header">
              <h2>{CATEGORIES.find(c => c.id === selectedCat)?.label || "جميع الشروحات"}</h2>
            </div>
            <div className="article-list">
              {filteredArticles
                .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
                .map(([id, art]) => (
                  <div key={id} className="article-card fade-up" onClick={() => navigate("article", selectedCat, { ...art, _id: id })}>
                    <span className={`article-type-badge type-${art.type}`}>
                      {ARTICLE_TYPES.find(t => t.id === art.type)?.label}
                    </span>
                    <h4>{art.title}</h4>
                  </div>
                ))}
              {filteredArticles.length === 0 && (
                <div className="empty-state"><p>لا توجد شروحات في هذا القسم بعد</p></div>
              )}
            </div>
          </div>
        )}

        {view === "article" && selectedArticle && (
          <div className="content-area" style={{ paddingTop: 32 }}>
            <div className="breadcrumb">
              <button onClick={() => navigate("home")}>{Icons.home} الرئيسية</button>
              <span>/</span>
              <button onClick={() => navigate("category", selectedCat)}>{CATEGORIES.find(c => c.id === selectedCat)?.label}</button>
              <span>/</span>
              <span style={{ color: "var(--text-primary)" }}>{selectedArticle.title}</span>
            </div>

            <div className="article-detail fade-up">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span className={`article-type-badge type-${selectedArticle.type}`}>
                  {ARTICLE_TYPES.find(t => t.id === selectedArticle.type)?.label}
                </span>
              </div>
              <h2>{selectedArticle.title}</h2>

              {/* Video embed */}
              {getEmbedUrl(selectedArticle.videoUrl) && (
                <div style={{ margin: "0 0 28px", borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio: "16/9" }}>
                  <iframe
                    src={getEmbedUrl(selectedArticle.videoUrl)}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Steps */}
              <div className="step-list">
                {parseSteps(selectedArticle.steps).map((step, i) => (
                  <div key={i} className="step-item">
                    <div className="step-num">{i + 1}</div>
                    <div className="step-text">{step}</div>
                  </div>
                ))}
              </div>

              {/* Download button */}
              {selectedArticle.downloadUrl && (
                <div className="article-actions">
                  <a href={selectedArticle.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: "none" }}>
                    {Icons.download}
                    {selectedArticle.downloadLabel || "تحميل"}
                  </a>
                </div>
              )}

              {/* Feedback */}
              <div className="feedback-box">
                <p>هل كان هذا الشرح مفيداً؟</p>
                <div className="feedback-btns">
                  <button
                    className={`fb-btn ${feedback[selectedArticle._id] === "yes" ? "voted-yes" : ""}`}
                    onClick={() => handleFeedback(selectedArticle._id, "yes")}
                  >
                    {Icons.thumbUp} نعم
                  </button>
                  <button
                    className={`fb-btn ${feedback[selectedArticle._id] === "no" ? "voted-no" : ""}`}
                    onClick={() => handleFeedback(selectedArticle._id, "no")}
                  >
                    {Icons.thumbDown} لا
                  </button>
                </div>
                {feedback[selectedArticle._id] === "yes" && <p style={{ color: "var(--success)", marginTop: 8, fontSize: "0.88rem" }}>شكراً لتقييمك!</p>}
                {feedback[selectedArticle._id] === "no" && <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: "0.88rem" }}>نأسف لذلك، تواصل معنا عبر الواتساب</p>}
              </div>
            </div>
          </div>
        )}

        {view === "status" && (
          <div className="content-area" style={{ paddingTop: 32 }}>
            <div className="breadcrumb">
              <button onClick={() => navigate("home")}>{Icons.home} الرئيسية</button>
              <span>/</span>
              <span>حالة السيرفرات</span>
            </div>
            <div className="section-header">
              <span style={{ color: "var(--accent)" }}>{Icons.server}</span>
              <h2>حالة السيرفرات</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>تعرض هذه الصفحة حالة جميع سيرفراتنا بشكل لحظي</p>
            <div className="status-grid">
              {Object.entries(servers).map(([id, s]) => (
                <div key={id} className="status-card fade-up">
                  <div className="status-info">
                    <div className={`status-dot status-${s.status}`} />
                    <div>
                      <div className="status-label">{s.name}</div>
                      <div className="status-time">آخر فحص: {new Date(s.lastCheck).toLocaleString("ar-SA")}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: "0.82rem", fontWeight: 700,
                    background: s.status === "online" ? "rgba(34,197,94,0.12)" : s.status === "offline" ? "rgba(239,68,68,0.12)" : "rgba(245,194,0,0.12)",
                    color: s.status === "online" ? "var(--success)" : s.status === "offline" ? "var(--danger)" : "var(--accent)",
                  }}>
                    {s.status === "online" ? "يعمل ✓" : s.status === "offline" ? "متوقف ✗" : "صيانة ⚠"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Admin Panel ── */}
        {view === "admin" && isAdmin && (
          <div className="admin-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800 }}>لوحة التحكم</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("home")}>{Icons.home} العودة للموقع</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{Object.keys(articles).length}</div>
                <div className="stat-label">إجمالي المقالات</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{publishedArticles.length}</div>
                <div className="stat-label">مقالات منشورة</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{Object.values(feedback).filter(v => v === "yes").length}</div>
                <div className="stat-label">تقييمات إيجابية</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{Object.keys(servers).length}</div>
                <div className="stat-label">سيرفرات</div>
              </div>
            </div>

            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === "articles" ? "active" : ""}`} onClick={() => { setAdminTab("articles"); setEditArticle(null); }}>المقالات</button>
              <button className={`admin-tab ${adminTab === "servers" ? "active" : ""}`} onClick={() => { setAdminTab("servers"); setEditServer(null); }}>السيرفرات</button>
              <button className={`admin-tab ${adminTab === "feedback" ? "active" : ""}`} onClick={() => setAdminTab("feedback")}>التقييمات</button>
            </div>

            {/* Articles Tab */}
            {adminTab === "articles" && (
              <>
                {editArticle !== null ? (
                  <ArticleForm
                    article={editArticle || undefined}
                    onSave={() => setEditArticle(null)}
                    onCancel={() => setEditArticle(null)}
                  />
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setEditArticle({})}>
                        {Icons.plus} إضافة مقال
                      </button>
                    </div>
                    <div style={{ overflowX: "auto", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>العنوان</th>
                            <th>القسم</th>
                            <th>النوع</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(articles).map(([id, art]) => (
                            <tr key={id}>
                              <td style={{ fontWeight: 600, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</td>
                              <td style={{ color: "var(--text-secondary)" }}>{CATEGORIES.find(c => c.id === art.category)?.label}</td>
                              <td><span className={`article-type-badge type-${art.type}`}>{ARTICLE_TYPES.find(t => t.id === art.type)?.label}</span></td>
                              <td>
                                <span style={{
                                  padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700,
                                  background: art.published ? "rgba(34,197,94,0.12)" : "rgba(139,149,176,0.12)",
                                  color: art.published ? "var(--success)" : "var(--text-muted)",
                                }}>{art.published ? "منشور" : "مسودة"}</span>
                              </td>
                              <td>
                                <div className="actions">
                                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditArticle({ ...art, _id: id })}>{Icons.edit}</button>
                                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteArticle(id)}>{Icons.trash}</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Servers Tab */}
            {adminTab === "servers" && (
              <>
                {editServer !== null ? (
                  <ServerForm
                    server={editServer || undefined}
                    onSave={() => setEditServer(null)}
                    onCancel={() => setEditServer(null)}
                  />
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setEditServer({})}>
                        {Icons.plus} إضافة سيرفر
                      </button>
                    </div>
                    <div className="status-grid">
                      {Object.entries(servers).map(([id, s]) => (
                        <div key={id} className="status-card">
                          <div className="status-info">
                            <div className={`status-dot status-${s.status}`} />
                            <div>
                              <div className="status-label">{s.name}</div>
                              <div className="status-time">{new Date(s.lastCheck).toLocaleString("ar-SA")}</div>
                            </div>
                          </div>
                          <div className="actions">
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditServer({ ...s, _id: id })}>{Icons.edit}</button>
                            <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteServer(id)}>{Icons.trash}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Feedback Tab */}
            {adminTab === "feedback" && (
              <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>المقال</th>
                      <th>التقييم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(feedback).map(([artId, vote]) => {
                      const art = articles[artId];
                      return (
                        <tr key={artId}>
                          <td style={{ fontWeight: 600 }}>{art?.title || artId}</td>
                          <td>
                            <span style={{
                              padding: "3px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700,
                              background: vote === "yes" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                              color: vote === "yes" ? "var(--success)" : "var(--danger)",
                            }}>
                              {vote === "yes" ? "مفيد ✓" : "غير مفيد ✗"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {Object.keys(feedback).length === 0 && (
                      <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>لا توجد تقييمات بعد</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 M7TV — مركز المساعدة | جميع الحقوق محفوظة</p>
        </footer>

        {/* WhatsApp FAB */}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="whatsapp-fab" title="تواصل معنا عبر واتساب">
          {Icons.whatsapp}
        </a>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="modal-overlay" onClick={() => setShowPinModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>لوحة التحكم</h3>
              <p>أدخل رمز الدخول</p>
              <div className="form-group">
                <input
                  className="pin-input"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setPinError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") verifyPin(); }}
                  autoFocus
                  placeholder="••••"
                />
              </div>
              {pinError && <div className="pin-error">{pinError}</div>}
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={verifyPin}>دخول</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
