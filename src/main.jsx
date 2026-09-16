import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Activity, ArrowUpRight, BriefcaseBusiness, Check, ChevronLeft, ChevronRight,
  Code2, Database, Expand, Github, Globe2, Mail, Menu, Moon, Server, Sun,
  Terminal, X, Zap
} from 'lucide-react';
import { supabase } from './lib/supabase';
import './styles.css';

/* ------------------------------------------------------------------ */
/*  Demo / fallback content (used until Supabase data is connected)    */
/* ------------------------------------------------------------------ */

const demo = {
  profile: {
    name: 'Marlon Armado',
    role: 'System Developer',
    headline: 'Full-Stack Developer',
    bio: 'I am a Web and Mobile Developer with experience building responsive websites and cross-platform mobile applications. I specialize in turning ideas into functional, user-friendly digital solutions. I enjoy solving problems, writing clean code, and continuously learning to improve performance and user experience.',
    location: 'Philippines',
    availability: 'Available for freelance and full-time work',
    email: 'your-email@example.com',
    github_url: 'https://github.com/marlonarmado03',
    linkedin_url: '#',
  },

  projects: [
    {
      id: 1,
      title: 'Human Resources Management System',
      description: 'A centralized web-based platform for employee records, attendance tracking, leave filing, payroll-ready reporting, and HR workflow management.',
      technologies: ['PHP', 'MySQL', 'JavaScript'],
      status: 'LIVE',
      featured: true,
      images: [
        { src: '/gallery/hr/hr2.jpg', caption: 'Dashboard — employee count, holidays, notices and to-do list' },
        { src: '/gallery/hr/hr1.jpg', caption: 'Employee list with roles and contact details' },
        { src: '/gallery/hr/hr4.jpg', caption: 'Sign-in screen for the CvSU Silang campus HR system' },
        { src: '/gallery/hr/hr3.jpg', caption: 'Secure sign-in with email OTP verification' },
      ],
    },
    {
      id: 2,
      title: 'Car Rental and Transport System',
      description: 'A booking and fleet management solution for vehicle reservations, trip scheduling, availability checks, customer records, and transport dispatch operations.',
      technologies: ['PHP', 'MySQL', 'JavaScript'],
      status: 'LIVE',
      featured: true,
      images: [
        { src: '/gallery/carrental/car3.jpg', caption: 'Public landing page showcasing the rental fleet' },
        { src: '/gallery/carrental/car2.jpg', caption: 'Admin dashboard — bookings and income/expense analytics' },
        { src: '/gallery/carrental/car5.jpg', caption: 'Live vehicle tracking and fleet map' },
        { src: '/gallery/carrental/car1.jpg', caption: 'Customer login screen' },
        { src: '/gallery/carrental/car4.jpg', caption: 'Customer registration and sign-up flow' },
      ],
    },
    {
      id: 3,
      title: 'Barangay Management System',
      description: 'A digital barangay operations platform for resident profiling, certificate and clearance requests, records management, reporting, and streamlined community service workflows.',
      technologies: ['PHP', 'MySQL', 'JavaScript'],
      status: 'LIVE',
      featured: true,
      images: [
        { src: '/gallery/brgy/pic7.jpg', caption: 'Dashboard with population breakdown and activity logs' },
        { src: '/gallery/brgy/pic6.jpg', caption: 'Searchable resident records table' },
        { src: '/gallery/brgy/pic1.jpg', caption: 'Resident record form with live photo capture' },
        { src: '/gallery/brgy/pic2.jpg', caption: 'Admin approval queue for new resident accounts' },
        { src: '/gallery/brgy/pic3.jpg', caption: 'Forgot-password approval workflow with notifications' },
        { src: '/gallery/brgy/pic5.jpg', caption: 'Sign-in page, City of Dasmariñas, Cavite' },
      ],
    },
  ],

  skills: [
    { category: 'FRONTEND', name: 'HTML', level: 88 },
    { category: 'FRONTEND', name: 'CSS', level: 84 },
    { category: 'FRONTEND', name: 'JavaScript', level: 85 },
    { category: 'BACKEND', name: 'PHP', level: 93 },
    { category: 'DATABASE', name: 'MySQL', level: 86 },
    { category: 'MOBILE', name: 'React Native', level: 91 },
  ],

  experience: [
    {
      company: 'Professional Development',
      position: 'Web and Mobile Developer',
      start_date: '2022-01-01',
      description: 'Building responsive websites and cross-platform mobile applications, with a focus on functional, user-friendly and maintainable digital solutions.',
    },
  ],

  services: [
    { title: 'Custom Web Development', description: 'Design and development of responsive, high-performance websites tailored to your business goals and user needs.' },
    { title: 'UI/UX Design', description: 'Creation of clean, user-focused interfaces that improve usability, strengthen brand presence, and enhance customer experience.' },
    { title: 'Performance Optimization', description: 'Technical improvements for speed, SEO readiness, and overall site performance to support better visibility and engagement.' },
    { title: 'Mobile App Development', description: 'Cross-platform mobile application development focused on reliable functionality, smooth interaction, and maintainable code.' },
    { title: 'API Integration', description: 'Integration of third-party and custom APIs to connect systems, automate workflows, and enable scalable digital solutions.' },
    { title: 'Maintenance & Support', description: 'Ongoing updates, bug fixes, and technical support to keep your web and mobile products secure, stable, and up to date.' },
  ],
};

/* ------------------------------------------------------------------ */
/*  App shell                                                          */
/* ------------------------------------------------------------------ */

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('marlon-theme') || 'dark');
  const [data, setData] = useState(demo);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { title, images, index }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('marlon-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const rs = await Promise.all([
        supabase.from('profiles').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('services').select('*').order('sort_order'),
      ]);
      if (rs.every((r) => !r.error)) setConnected(true);
      setData({
        profile: rs[0].data || demo.profile,
        projects: rs[1].data?.length ? rs[1].data : demo.projects,
        skills: rs[2].data?.length ? rs[2].data : demo.skills,
        experience: rs[3].data?.length ? rs[3].data : demo.experience,
        services: rs[4].data?.length ? rs[4].data : demo.services,
      });
    }
    load();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.rpc('record_site_visit').then(({ data, error }) => {
      if (error) {
        console.error('Visitor counter error:', error);
        return;
      }
      if (data !== null) {
        setVisitorCount(data);
      }
    });
  }, []);

  // Reveal-on-scroll for anything tagged with the `.reveal` class
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const openLightbox = useCallback((title, images, index = 0) => {
    setLightbox({ title, images, index });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const navLightbox = useCallback((dir) => {
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length } : lb));
  }, []);

  return (
    <div className="app">
      <Sidebar open={open} close={() => setOpen(false)} theme={theme} toggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} connected={connected} />
      <main>
        <header className="mobile">
          <button onClick={() => setOpen(true)}><Menu /></button>
          <b>MARLON_DB</b>
          <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>{theme === 'dark' ? <Sun /> : <Moon />}</button>
        </header>
        <Home data={data} openLightbox={openLightbox} visitorCount={visitorCount} />
      </main>
      <Lightbox state={lightbox} onClose={closeLightbox} onNav={navLightbox} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({ open, close, theme, toggle, connected }) {
  const nav = [
    ['Home', '#home', Terminal],
    ['About', '#about', Code2],
    ['Projects', '#projects', Database],
    ['Skills', '#skills', Activity],
    ['GitHub', '#github', Github],
    ['Experience', '#experience', BriefcaseBusiness],
    ['Services', '#services', Server],
    ['Contact', '#contact', Mail],
  ];
  return (
    <>
      <aside className={open ? 'open' : ''}>
        <div className="brand">
          <div className="mark"><Database /></div>
          <div><b>MARLON_DB</b><small>portfolio.system</small></div>
          <button className="x" onClick={close}><X /></button>
        </div>
        <label>DATABASE</label>
        <nav>
          {nav.map(([n, h, I]) => (
            <a href={h} onClick={close} key={n}>
              <I /><span>{n}</span><ChevronRight className="arrow" />
            </a>
          ))}
        </nav>
        <div className="grow" />
        <div className="conn">
          <i />
          <div><b>{connected ? 'DATABASE CONNECTED' : 'LOCAL PREVIEW'}</b><small>postgresql://portfolio</small></div>
        </div>
        <button className="theme" onClick={toggle}>
          {theme === 'dark' ? <Moon /> : <Sun />}
          <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
        </button>
        <footer>v1.1.0 <span>© 2026</span></footer>
      </aside>
      {open && <div className="overlay" onClick={close} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page content                                                  */
/* ------------------------------------------------------------------ */

function Home({ data, openLightbox, visitorCount }) {
  const p = data.profile;
  return (
    <>
      <section id="home" className="section hero">
        <div className="eyebrow"><i /> SYSTEM.DEVELOPER <em>/</em> FULL-STACK</div>
        <div className="heroGrid">
          <div className="photo">
            <div>
              <div className="scanlines" />
              <img src="/profile.png" alt="Marlon Armado" className="profileImage" />
            </div>
          </div>
          <div>
            <div className="record"><span>record.name</span><b>{p.name}</b></div>
            <h1>{p.name}</h1>
            <h2>{p.role}<span> / {p.headline}</span></h2>
            <p>{p.bio}</p>
            <div className="links">
              <a href={p.github_url}><Github /> github ↗</a>
              <a href={p.linkedin_url}><Globe2 /> linkedin ↗</a>
              <a href="#contact"><Mail /> contact ↗</a>
            </div>
            <div className="heroMeta">
              <div><span>LOCATION</span><b>{p.location}</b></div>
              <div><span>STATUS</span><b className="available"><i /> {p.availability}</b></div>
              <div><span>FOCUS</span><b>WEB + MOBILE</b></div>
            </div>
          </div>
        </div>
        <div className="stats">
          <Stat v={String(data.projects.length).padStart(2, '0')} l="PROJECTS" />
          <Stat v="4+" l="YEARS EXPERIENCE" />
          <Stat v="WEB + MOBILE" l="DEVELOPMENT" />
          <Stat v={visitorCount === null ? '—' : visitorCount.toLocaleString()} l="TOTAL VISITS" />
        </div>
        <div className="systemStrip">
          <div><span>STACK.INDEX</span><b>HTML · CSS · JavaScript · PHP · MySQL · React Native</b></div>
          <div><span>WORKFLOW</span><b>PLAN → BUILD → TEST → DEPLOY</b></div>
          <div><span>MODE</span><b><i /> BUILDING SYSTEMS</b></div>
        </div>
      </section>

      <Section id="about" n="01" title="about" cmd="SELECT * FROM profile;">
        <div className="two">
          <div className="card reveal">
            <header>profile.record <span>JSON</span></header>
            <pre>{JSON.stringify({ name: p.name, role: p.role, specialty: p.headline, location: p.location, status: p.availability }, null, 2)}</pre>
          </div>
          <div className="reveal">
            <p className="big">I build <u>useful systems</u> that turn ideas, workflows and data into products people can actually use.</p>
            <p>My approach is simple: understand the problem, model the data, build the interface, then make the whole system reliable and easy to maintain.</p>
            <div className="tags"><span>RELIABLE</span><span>SCALABLE</span><span>DATA-DRIVEN</span></div>
            <div className="focusGrid">
              <div><small>01</small><b>WEB SYSTEMS</b><span>Business workflows &amp; dashboards</span></div>
              <div><small>02</small><b>MOBILE APPS</b><span>Cross-platform applications</span></div>
              <div><small>03</small><b>DATABASES</b><span>Structured data &amp; CRUD systems</span></div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="projects" n="02" title="projects" cmd="SELECT * FROM projects ORDER BY created_at DESC;">
        <div className="projectsGrid">
          {data.projects.map((x, i) => (
            <ProjectCard key={x.id} project={x} index={i} openLightbox={openLightbox} />
          ))}
        </div>
      </Section>

      <Section id="skills" n="03" title="skills" cmd="SELECT skill, level FROM skills;">
        <div className="skills">
          {data.skills.map((x) => (
            <div className="skill reveal" key={x.id || x.name}>
              <div><span>{x.category}</span><b>{x.name}</b><small>{x.level}%</small></div>
              <i><em style={{ width: x.level + '%' }} /></i>
            </div>
          ))}
        </div>
      </Section>

      <GithubActivity />

      <Section id="experience" n="05" title="experience" cmd="SELECT * FROM experience;">
        <div className="timeline">
          {data.experience.map((x, i) => (
            <article key={x.id || i} className="reveal">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <small>{date(x.start_date)} — {x.end_date ? date(x.end_date) : 'PRESENT'}</small>
                <h3>{x.position}</h3>
                <b>{x.company}</b>
                <p>{x.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="services" n="06" title="services" cmd="SELECT * FROM services;">
        <div className="services">
          {data.services.map((x, i) => (
            <article key={x.id || x.title} className="reveal">
              <small>0{i + 1}</small>
              <Zap />
              <h3>{x.title}</h3>
              <p>{x.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Contact email={p.email} />
      <div className="foot">MARLON_DB / SYSTEM.DEVELOPER <span>BUILT WITH REACT + POSTGRESQL</span></div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card with click-to-enlarge image gallery                   */
/* ------------------------------------------------------------------ */

function GithubActivity() {
  // A fixed pattern keeps the portfolio preview consistent while evoking the GitHub activity graph.
  const cells = Array.from({ length: 53 * 7 }, (_, i) => {
    const week = Math.floor(i / 7);
    const day = i % 7;
    const active = (week * 11 + day * 7 + (week % 5) * 3) % 17;
    const level = active < 3 ? 4 : active < 6 ? 3 : active < 9 ? 2 : active < 12 ? 1 : 0;
    return level;
  });

  return (
    <section id="github" className="section githubSection">
      <div className="title">
        <div><span>07 —</span><h2>github</h2></div>
        <code>@MARLONARMADO03 <ArrowUpRight /></code>
      </div>
      <a className="githubGraph reveal" href="https://github.com/marlonarmado03" target="_blank" rel="noreferrer" aria-label="Open Marlon Armado's GitHub profile">
        <div className="graphContent">
          <div className="graphBody">
            <div className="contributionGrid" aria-hidden="true">
              {cells.map((level, index) => <i key={index} data-level={level} />)}
            </div>
          </div>
        </div>
        <div className="githubGraphBottom">
          <span>1,599 CONTRIBUTIONS IN THE LAST YEAR</span>
          <div><Github /> VIEW PROFILE <ArrowUpRight /></div>
        </div>
      </a>
    </section>
  );
}

function ProjectCard({ project: x, index: i, openLightbox }) {
  const images = x.images && x.images.length ? x.images : (x.image_url ? [{ src: x.image_url, caption: '' }] : []);
  const cover = images[0];
  const extraThumbs = images.slice(1, 4);
  const remaining = images.length - 1 - extraThumbs.length;

  return (
    <article className="projectCard reveal">
      {cover && (
        <button className="coverBtn" onClick={() => openLightbox(x.title, images, 0)} aria-label={`View screenshots for ${x.title}`}>
          <img src={cover.src} alt={cover.caption || x.title} />
          <span className="expand"><Expand /> {images.length > 1 ? `${images.length} screenshots` : 'view full size'}</span>
        </button>
      )}
      <div className="projectBody">
        <div className="rowTop">
          <span className="idTag">{String(i + 1).padStart(3, '0')}</span>
          <span className="status"><i /> {x.status || 'LIVE'}</span>
        </div>
        <h3>{x.title}</h3>
        <p>{x.description}</p>
        <div className="stack">
          {(x.technologies || []).map((t) => <small key={t}>{t}</small>)}
        </div>
        {images.length > 1 && (
          <div className="thumbRow">
            {extraThumbs.map((img, idx) => (
              <button key={img.src} className="thumbBtn" onClick={() => openLightbox(x.title, images, idx + 1)} aria-label={`Screenshot ${idx + 2} of ${x.title}`}>
                <img src={img.src} alt="" />
              </button>
            ))}
            {remaining > 0 && (
              <button className="thumbBtn thumbMore" onClick={() => openLightbox(x.title, images, 4)} aria-label="View more screenshots">
                +{remaining}
              </button>
            )}
            <button className="thumbBtn thumbMore" onClick={() => openLightbox(x.title, images, 0)} aria-label="Open gallery">
              <ArrowUpRight />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox — click-to-view image viewer with prev/next navigation    */
/* ------------------------------------------------------------------ */

function Lightbox({ state, onClose, onNav }) {
  useEffect(() => {
    if (!state) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [state, onClose, onNav]);

  if (!state) return null;
  const { title, images, index } = state;
  const item = images[index];
  const multi = images.length > 1;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${title} screenshots`}>
      <button className="lbClose" onClick={onClose} aria-label="Close"><X /></button>
      {multi && <button className="lbNav lbPrev" onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous image"><ChevronLeft /></button>}
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.caption || title} />
        <figcaption>
          <b>{title}</b>
          {item.caption && <span>{item.caption}</span>}
          {multi && <small>{index + 1} / {images.length}</small>}
        </figcaption>
      </figure>
      {multi && <button className="lbNav lbNext" onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next image"><ChevronRight /></button>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                       */
/* ------------------------------------------------------------------ */

function Section({ id, n, title, cmd, children }) {
  return (
    <section id={id} className="section">
      <div className="title">
        <div><span>{n} —</span><h2>{title}</h2></div>
        <code>{cmd}</code>
      </div>
      {children}
    </section>
  );
}

function Stat({ v, l }) {
  return <div><b>{v}</b><small>{l}</small></div>;
}

function date(v) {
  if (!v) return '';
  return new Date(v).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

function Contact({ email }) {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    if (supabase) await supabase.from('inquiries').insert(f);
    setF({ name: '', email: '', subject: '', message: '' });
    setSent(true);
    setBusy(false);
  }

  return (
    <section id="contact" className="section">
      <div className="title">
        <div><span>06 —</span><h2>contact</h2></div>
        <code>INSERT INTO inquiries;</code>
      </div>
      <div className="contact">
        <div className="reveal">
          <p className="big">Have a system, website or idea in mind?</p>
          <p>Send a query. I'll get back to you as soon as possible.</p>
          <a className="email" href={'mailto:' + email}>{email} ↗</a>
        </div>
        <form onSubmit={submit} className="reveal">
          {['name', 'email', 'subject'].map((k) => (
            <label key={k}>
              {k}
              <input
                required={k !== 'subject'}
                type={k === 'email' ? 'email' : 'text'}
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
                placeholder={k === 'email' ? 'you@example.com' : k === 'name' ? 'Your name' : 'Project inquiry'}
              />
            </label>
          ))}
          <label>
            message
            <textarea required rows="5" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Tell me about your project..." />
          </label>
          <button disabled={busy}>
            {sent ? <><Check /> QUERY SENT</> : <><Terminal /> {busy ? 'EXECUTING...' : 'SEND QUERY'}</>}
          </button>
          {sent && <small className="success">✓ Inquiry recorded successfully.</small>}
        </form>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
