'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type SiteSettings = Record<string, string>;
type Module = { key:string; label:string; enabled:boolean; sort_order:number };
type ModuleContent = { module_key:string; lang:string; content: Record<string,unknown> };

const THEMES = [
  { id:'midnight', color:'#0A84FF' },
  { id:'silver',   color:'#0071e3' },
  { id:'space-gray',color:'#636366' },
  { id:'matrix',   color:'#00ff41' },
  { id:'sunset',   color:'#ff6b35' },
  { id:'aurora',   color:'#64d2ff' },
];

const LANGS = [
  { id:'zh', label:'中文' },
  { id:'en', label:'EN' },
  { id:'ja', label:'日本語' },
  { id:'ko', label:'한국어' },
];

function getContent(contents: ModuleContent[], moduleKey: string, lang: string): Record<string,unknown> {
  return contents.find(c => c.module_key === moduleKey && c.lang === lang)?.content || {};
}

function StatCard({ num, suffix, label, started }: { num:number; suffix:string; label:string; started:boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const total = 60;
    const step = num / total;
    let cur = 0;
    let frame = 0;
    const animate = () => {
      cur = Math.min(cur + step, num);
      setCount(Math.floor(cur));
      frame++;
      if (frame < total) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [num, started]);
  return (
    <div style={{ background:'var(--surface,rgba(28,28,32,0.6))', border:'1px solid var(--border,rgba(255,255,255,0.08))', borderRadius:'16px', backdropFilter:'blur(20px)', padding:'32px', textAlign:'center' }}>
      <div style={{ fontSize:'48px', fontWeight:800, color:'var(--accent,#0A84FF)', lineHeight:1 }}>{count}{suffix}</div>
      <div style={{ color:'var(--text-muted,#86868B)', marginTop:'8px', fontSize:'14px' }}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState('midnight');
  const [lang, setLang] = useState('zh');
  const [settings, setSettings] = useState<SiteSettings>({});
  const [modules, setModules] = useState<Module[]>([]);
  const [contents, setContents] = useState<ModuleContent[]>([]);
  const [activeSection, setActiveSection] = useState('hero');
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', subject:'', body:'' });
  const supabase = createClient();

  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') || 'midnight';
    const savedLang = localStorage.getItem('site-lang') || 'zh';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);

    Promise.all([
      supabase.from('site_settings').select('key,value'),
      supabase.from('modules').select('*').eq('enabled', true).order('sort_order'),
      supabase.from('module_contents').select('*'),
    ]).then(([settingsRes, modulesRes, contentsRes]) => {
      if (settingsRes.data) {
        const s: SiteSettings = {};
        settingsRes.data.forEach(row => {
          s[row.key] = typeof row.value === 'string' ? row.value.replace(/^"|"$/g,'') : String(row.value).replace(/^"|"$/g,'');
        });
        setSettings(s);
        if (!localStorage.getItem('site-theme') && s.theme) {
          setTheme(s.theme);
          document.documentElement.setAttribute('data-theme', s.theme);
        }
        if (!localStorage.getItem('site-lang') && s.default_lang) {
          setLang(s.default_lang);
        }
      }
      if (modulesRes.data) setModules(modulesRes.data);
      if (contentsRes.data) setContents(contentsRes.data as ModuleContent[]);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function changeTheme(id: string) {
    setTheme(id);
    localStorage.setItem('site-theme', id);
    document.documentElement.setAttribute('data-theme', id);
  }

  function changeLang(id: string) {
    setLang(id);
    localStorage.setItem('site-lang', id);
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('messages').insert({ name:form.name, email:form.email, subject:form.subject, body:form.body });
    setSubmitting(false);
    setSubmitDone(true);
    setForm({ name:'', email:'', subject:'', body:'' });
    setTimeout(() => setSubmitDone(false), 4000);
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold:0.3 });
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [modules]);

  const statsRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold:0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [modules]);

  const c = (key: string) => getContent(contents, key, lang);
  const isEnabled = (key: string) => modules.find(m => m.key === key)?.enabled !== false;
  const siteName = settings.site_name || 'BRAND';
  const siteDesc = settings.seo_description || '';

  const navLinks = [
    { href:'#services', label: lang==='zh'?'服务': lang==='en'?'Services': lang==='ja'?'サービス':'서비스' },
    { href:'#about',    label: lang==='zh'?'关于': lang==='en'?'About':    lang==='ja'?'について':'소개' },
    { href:'#partners', label: lang==='zh'?'合作': lang==='en'?'Partners': lang==='ja'?'パートナー':'파트너' },
    { href:'#contact',  label: lang==='zh'?'联系': lang==='en'?'Contact':  lang==='ja'?'連絡':'연락' },
  ];

  const statsContent = c('stats') as { items?: { num:number; suffix:string; label:string }[] };
  const statsItems = statsContent.items || [];
  const heroContent = c('hero') as { pill?:string; title?:string; subtitle?:string; cta_primary?:string; cta_secondary?:string };
  const servicesContent = c('services') as { title?:string; items?: { icon:string; title:string; desc:string }[] };
  const aboutContent = c('about') as { title?:string; subtitle?:string; desc?:string; features?:string[] };
  const partnersContent = c('partners') as { title?:string; items?: { name:string }[] };
  const contactContent = c('contact') as { title?:string; subtitle?:string; email?:string; phone?:string; address?:string; form_name?:string; form_email?:string; form_subject?:string; form_body?:string; form_submit?:string };
  const linksContent = c('links') as { title?:string; items?: { icon:string; name:string; url:string }[] };
  const downloadsContent = c('downloads') as { title?:string; items?: { icon:string; name:string; desc:string; size:string; url:string }[] };
  const footerContent = c('footer') as { brand?:string; tagline?:string; cols?: { title:string; links: { label:string; href:string }[] }[]; copyright?:string };

  const styles = {
    section: { padding:'80px 20px', maxWidth:'1100px', margin:'0 auto' } as React.CSSProperties,
    pill: { display:'inline-block', padding:'6px 16px', borderRadius:'100px', border:'1px solid var(--accent,#0A84FF)', color:'var(--accent,#0A84FF)', fontSize:'12px', fontWeight:700, marginBottom:'20px', background:'rgba(10,132,255,0.08)' } as React.CSSProperties,
    h2: { fontSize:'clamp(28px,5vw,48px)', fontWeight:800, marginBottom:'16px', color:'var(--text,#F5F5F7)' } as React.CSSProperties,
    muted: { color:'var(--text-muted,#86868B)', fontSize:'16px', lineHeight:1.6 } as React.CSSProperties,
    card: { background:'var(--surface,rgba(28,28,32,0.6))', border:'1px solid var(--border,rgba(255,255,255,0.08))', borderRadius:'16px', backdropFilter:'blur(20px)' } as React.CSSProperties,
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg,#000)', color:'var(--text,#F5F5F7)', fontFamily:'-apple-system,BlinkMacSystemFont,"Inter",sans-serif' }}>

      {/* Theme Switcher (fixed right) */}
      <div style={{ position:'fixed', right:'20px', top:'50%', transform:'translateY(-50%)', zIndex:1000, display:'flex', flexDirection:'column', gap:'8px' }}>
        {THEMES.map(t => (
          <button key={t.id} onClick={() => changeTheme(t.id)} title={t.id} style={{ width:'24px', height:'24px', borderRadius:'50%', background:t.color, border:`2px solid ${theme===t.id?'#fff':'transparent'}`, cursor:'pointer', outline:'none', padding:0, boxShadow: theme===t.id?`0 0 10px ${t.color}80`:undefined, transition:'all 0.2s' }} />
        ))}
      </div>

      {/* Navbar */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'16px 20px', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border,rgba(255,255,255,0.06))', display:'flex', alignItems:'center', gap:'16px' }}>
        <div style={{ fontWeight:800, fontSize:'18px', color:'var(--text,#F5F5F7)' }}>{siteName}</div>
        <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
          <div style={{ display:'flex', gap:'4px', padding:'4px', borderRadius:'100px', background:'var(--surface,rgba(28,28,32,0.6))', border:'1px solid var(--border,rgba(255,255,255,0.08))' }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ padding:'6px 16px', borderRadius:'100px', fontSize:'13px', fontWeight:600, textDecoration:'none', color: activeSection===l.href.slice(1) ? '#fff' : 'var(--text-muted,#86868B)', background: activeSection===l.href.slice(1) ? 'var(--accent,#0A84FF)' : 'transparent', transition:'all 0.2s' }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => changeLang(l.id)} style={{ padding:'4px 10px', borderRadius:'100px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background: lang===l.id ? 'var(--accent,#0A84FF)' : 'transparent', color: lang===l.id ? '#fff' : 'var(--text-muted,#86868B)', transition:'all 0.2s' }}>
              {l.label}
            </button>
          ))}
          <a href="#contact" className="btn-primary" style={{ padding:'8px 18px', fontSize:'13px', textDecoration:'none' }}>
            {lang==='zh'?'联系我们': lang==='en'?'Contact': lang==='ja'?'連絡':'연락'}
          </a>
        </div>
      </nav>

      {/* Hero */}
      {isEnabled('hero') && (
        <section id="hero" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 20px 80px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 20% 40%,rgba(10,132,255,0.15),transparent 50%),radial-gradient(ellipse at 80% 60%,rgba(94,92,230,0.15),transparent 50%)' }} />
          <div style={{ position:'relative', maxWidth:'800px' }}>
            <div style={styles.pill}>{heroContent.pill || 'Next-gen Brand Management'}</div>
            <h1 style={{ fontSize:'clamp(36px,8vw,80px)', fontWeight:800, lineHeight:1.1, marginBottom:'24px', background:'var(--grad,linear-gradient(135deg,#0A84FF,#5E5CE6))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {(heroContent.title || siteName).split('<br>').map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p style={{ ...styles.muted, maxWidth:'600px', margin:'0 auto 40px' }}>{heroContent.subtitle || siteDesc}</p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <a href="#contact" className="btn-primary" style={{ padding:'14px 32px', fontSize:'15px', textDecoration:'none' }}>{heroContent.cta_primary || 'Get Started'}</a>
              <a href="#services" style={{ padding:'14px 32px', fontSize:'15px', fontWeight:600, textDecoration:'none', color:'var(--text,#F5F5F7)', border:'1px solid var(--border,rgba(255,255,255,0.08))', borderRadius:'100px', background:'var(--surface,rgba(28,28,32,0.6))', backdropFilter:'blur(10px)' }}>{heroContent.cta_secondary || 'Learn More'}</a>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {isEnabled('services') && (
        <section id="services">
          <div style={styles.section}>
            <div style={{ textAlign:'center', marginBottom:'60px' }}>
              <h2 style={styles.h2}>{servicesContent.title || 'Services'}</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
              {(servicesContent.items||[]).map((item, i) => (
                <div key={i} style={{ ...styles.card, padding:'28px', transition:'transform 0.2s' }}>
                  <div style={{ fontSize:'36px', marginBottom:'16px' }}>{item.icon}</div>
                  <h3 style={{ fontSize:'18px', fontWeight:700, color:'var(--text,#F5F5F7)', marginBottom:'8px' }}>{item.title}</h3>
                  <p style={styles.muted}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {isEnabled('about') && (
        <section id="about" style={{ background:'var(--bg-secondary,#0a0a0f)' }}>
          <div style={{ ...styles.section, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center' }}>
            <div>
              <h2 style={styles.h2}>{aboutContent.title || 'About'}</h2>
              <p style={{ ...styles.muted, marginBottom:'12px', fontWeight:600, fontSize:'18px', color:'var(--text,#F5F5F7)' }}>{aboutContent.subtitle}</p>
              <p style={{ ...styles.muted, marginBottom:'32px' }}>{aboutContent.desc}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {(aboutContent.features||[]).map((f,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent,#0A84FF)', flexShrink:0 }} />
                    <span style={{ fontSize:'15px', color:'var(--text,#F5F5F7)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...styles.card, padding:'40px', textAlign:'center' }}>
              <div style={{ fontSize:'80px', margin:'0 auto 20px' }}>🏢</div>
              <div style={{ fontSize:'14px', color:'var(--text-muted,#86868B)', lineHeight:1.6 }}>{aboutContent.desc}</div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {isEnabled('stats') && (
        <section id="stats" ref={statsRef}>
          <div style={styles.section}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'20px' }}>
              {statsItems.map((item, i) => (
                <StatCard key={i} num={item.num} suffix={item.suffix} label={item.label} started={statsVisible} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {isEnabled('partners') && (
        <section id="partners" style={{ background:'var(--bg-secondary,#0a0a0f)' }}>
          <div style={styles.section}>
            <h2 style={{ ...styles.h2, textAlign:'center', marginBottom:'48px' }}>{partnersContent.title || 'Partners'}</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'16px' }}>
              {(partnersContent.items||[]).map((p,i) => (
                <div key={i} style={{ ...styles.card, padding:'24px', textAlign:'center', fontSize:'14px', fontWeight:600, color:'var(--text-muted,#86868B)' }}>{p.name}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {isEnabled('contact') && (
        <section id="contact">
          <div style={{ ...styles.section, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px' }}>
            <div>
              <h2 style={styles.h2}>{contactContent.title || 'Contact'}</h2>
              <p style={{ ...styles.muted, marginBottom:'32px' }}>{contactContent.subtitle}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {contactContent.email && <div style={{ display:'flex', gap:'12px', alignItems:'center' }}><span style={{ fontSize:'20px' }}>📧</span><span style={{ color:'var(--text-muted,#86868B)' }}>{contactContent.email}</span></div>}
                {contactContent.phone && <div style={{ display:'flex', gap:'12px', alignItems:'center' }}><span style={{ fontSize:'20px' }}>📞</span><span style={{ color:'var(--text-muted,#86868B)' }}>{contactContent.phone}</span></div>}
                {contactContent.address && <div style={{ display:'flex', gap:'12px', alignItems:'center' }}><span style={{ fontSize:'20px' }}>📍</span><span style={{ color:'var(--text-muted,#86868B)' }}>{contactContent.address}</span></div>}
              </div>
            </div>
            <div style={{ ...styles.card, padding:'32px' }}>
              {submitDone ? (
                <div style={{ textAlign:'center', padding:'40px' }}>
                  <div style={{ fontSize:'48px', marginBottom:'16px' }}>✅</div>
                  <p style={{ color:'var(--text,#F5F5F7)', fontWeight:600 }}>{lang==='zh'?'留言已发送！':'Message sent!'}</p>
                </div>
              ) : (
                <form onSubmit={submitContact}>
                  {[
                    { k:'name', label:contactContent.form_name||'Name', type:'text' },
                    { k:'email', label:contactContent.form_email||'Email', type:'email' },
                    { k:'subject', label:contactContent.form_subject||'Subject', type:'text' },
                  ].map(f => (
                    <div key={f.k} style={{ marginBottom:'14px' }}>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'var(--text-muted,#86868B)', marginBottom:'6px' }}>{f.label}</label>
                      <input required={f.k!=='subject'} type={f.type} value={form[f.k as keyof typeof form]} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))} style={{ width:'100%', padding:'10px 14px', background:'var(--surface,rgba(28,28,32,0.6))', border:'1px solid var(--border,rgba(255,255,255,0.08))', borderRadius:'10px', color:'var(--text,#F5F5F7)', fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:'20px' }}>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'var(--text-muted,#86868B)', marginBottom:'6px' }}>{contactContent.form_body||'Message'}</label>
                    <textarea required rows={4} value={form.body} onChange={e=>setForm(prev=>({...prev,body:e.target.value}))} style={{ width:'100%', padding:'10px 14px', background:'var(--surface,rgba(28,28,32,0.6))', border:'1px solid var(--border,rgba(255,255,255,0.08))', borderRadius:'10px', color:'var(--text,#F5F5F7)', fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ width:'100%', padding:'12px', fontSize:'14px' }}>{submitting?'...':(contactContent.form_submit||'Send')}</button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Links */}
      {isEnabled('links') && (
        <section id="links" style={{ background:'var(--bg-secondary,#0a0a0f)' }}>
          <div style={styles.section}>
            <h2 style={{ ...styles.h2, textAlign:'center', marginBottom:'48px' }}>{linksContent.title || 'Links'}</h2>
            <div style={{ display:'flex', gap:'20px', justifyContent:'center', flexWrap:'wrap' }}>
              {(linksContent.items||[]).map((l,i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ ...styles.card, padding:'24px 32px', display:'flex', alignItems:'center', gap:'12px', textDecoration:'none', color:'var(--text,#F5F5F7)', fontSize:'15px', fontWeight:600, transition:'transform 0.2s' }}>
                  <span style={{ fontSize:'24px' }}>{l.icon}</span>{l.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Downloads */}
      {isEnabled('downloads') && (
        <section id="downloads">
          <div style={styles.section}>
            <h2 style={{ ...styles.h2, textAlign:'center', marginBottom:'48px' }}>{downloadsContent.title || 'Downloads'}</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' }}>
              {(downloadsContent.items||[]).map((d,i) => (
                <div key={i} style={{ ...styles.card, padding:'28px', display:'flex', gap:'16px', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'32px' }}>{d.icon}</span>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontSize:'16px', fontWeight:700, color:'var(--text,#F5F5F7)', marginBottom:'6px' }}>{d.name}</h3>
                    <p style={{ ...styles.muted, fontSize:'13px', marginBottom:'12px' }}>{d.desc}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ fontSize:'11px', color:'var(--text-muted,#86868B)' }}>{d.size}</span>
                      <a href={d.url} className="btn-primary" style={{ padding:'6px 14px', fontSize:'12px', textDecoration:'none' }}>{lang==='zh'?'下载': lang==='en'?'Download': lang==='ja'?'ダウンロード':'다운로드'}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {isEnabled('footer') && (
        <footer style={{ background:'var(--bg-secondary,#0a0a0f)', borderTop:'1px solid var(--border,rgba(255,255,255,0.08))', padding:'60px 20px 30px' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr repeat(3,1fr)', gap:'40px', marginBottom:'40px' }}>
              <div>
                <div style={{ fontSize:'20px', fontWeight:800, color:'var(--text,#F5F5F7)', marginBottom:'12px' }}>{footerContent.brand || siteName}</div>
                <p style={{ ...styles.muted, fontSize:'14px' }}>{footerContent.tagline}</p>
              </div>
              {(footerContent.cols||[]).map((col, i) => (
                <div key={i}>
                  <h4 style={{ fontSize:'13px', fontWeight:700, color:'var(--text,#F5F5F7)', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{col.title}</h4>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {col.links.map((l,j) => <a key={j} href={l.href} style={{ fontSize:'13px', color:'var(--text-muted,#86868B)', textDecoration:'none' }}>{l.label}</a>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid var(--border,rgba(255,255,255,0.08))', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
              <span style={{ fontSize:'13px', color:'var(--text-muted,#86868B)' }}>{footerContent.copyright}</span>
              {settings.icp && <span style={{ fontSize:'12px', color:'var(--text-muted,#86868B)' }}>{settings.icp}</span>}
            </div>
          </div>
        </footer>
      )}

      {/* Floating Contact FAB */}
      <a href="#contact" style={{ position:'fixed', bottom:'30px', right:'70px', width:'52px', height:'52px', borderRadius:'50%', background:'var(--grad,linear-gradient(135deg,#0A84FF,#5E5CE6))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', textDecoration:'none', boxShadow:'0 4px 20px rgba(10,132,255,0.4)', zIndex:999, transition:'transform 0.2s' }}>
        💬
      </a>
    </div>
  );
}
