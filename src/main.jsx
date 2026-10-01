import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Activity, ArrowUpRight, BriefcaseBusiness, Check, ChevronLeft, ChevronRight,
  Code2, Database, Expand, Github, Globe2, Mail, Menu, MessageCircle, Moon, Send, Server, Sun,
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
    {
      id: 4,
      title: 'J & R Constructions',
      description: 'A website for J & R Constructions, showcasing the company and its construction services.',
      technologies: ['Website'],
      status: 'LIVE',
      featured: true,
      demo_url: 'https://jr-construction-lemon.vercel.app/',
      images: [{ src: 'https://image.thum.io/get/width/1200/crop/800/https://jr-construction-lemon.vercel.app/', caption: 'Live website preview' }],
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

function normalizeGallery(images) {
  if (!images) return null;
  let gallery = images;
  if (typeof gallery === 'string') {
    try {
      gallery = JSON.parse(gallery);
    } catch {
      gallery = [gallery];
    }
  }
  if (!Array.isArray(gallery)) return null;
  const normalized = gallery
    .map((image) => typeof image === 'string' ? { src: image, caption: '' } : image)
    .filter((image) => image && image.src);
  return normalized.length ? normalized : null;
}

const darkPortraits = {
  right: '/portraits/darkright.jpg',
  downRight: '/portraits/darkdownright.jpg',
  down: '/portraits/darkdown.jpg',
  downLeft: '/portraits/darkdownleft.jpg',
  left: '/portraits/darkleft.jpg',
  upLeft: '/portraits/darkleftup.jpg',
  up: '/portraits/darkup.jpg',
  upRight: '/portraits/darkupright.jpg',
};

const lightPortraits = {
  right: '/portraits/lightright.jpg',
  downRight: '/portraits/lightdownright.jpg',
  down: '/portraits/lightdown.jpg',
  downLeft: '/portraits/lightdownleft.jpg',
  left: '/portraits/lightleft.jpg',
  upLeft: '/portraits/lightupleft.jpg',
  up: '/portraits/lightup.jpg',
  upRight: '/portraits/lightupright.jpg',
};

/* ------------------------------------------------------------------ */
/*  App shell                                                          */
/* ------------------------------------------------------------------ */

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('marlon-theme') || 'dark');
  const [data, setData] = useState(demo);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lookDirection, setLookDirection] = useState(null);
  const [readyPortraitTheme, setReadyPortraitTheme] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [visitorCount, setVisitorCount] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { title, images, index }
  const progressRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('marlon-theme', theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    const images = Object.values({ ...darkPortraits, ...lightPortraits }).map((src) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
      return image.decode().catch(() => undefined);
    });
    Promise.all(images).then(() => {
      if (!cancelled) setReadyPortraitTheme('all');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
    }
    updateProgress();
    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(document.documentElement);
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]:not(#portfolio-chat-panel)');
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [data]);

  useEffect(() => {
    function trackPagePointer(event) {
      if (event.pointerType === 'touch') return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      if (Math.hypot(dx, dy) < Math.min(centerX, centerY) * 0.06) {
        setLookDirection(null);
        return;
      }

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      let direction;
      if (angle >= -22.5 && angle < 22.5) direction = 'right';
      else if (angle >= 22.5 && angle < 67.5) direction = 'downRight';
      else if (angle >= 67.5 && angle < 112.5) direction = 'down';
      else if (angle >= 112.5 && angle < 157.5) direction = 'downLeft';
      else if (angle >= 157.5 || angle < -157.5) direction = 'left';
      else if (angle >= -157.5 && angle < -112.5) direction = 'upLeft';
      else if (angle >= -112.5 && angle < -67.5) direction = 'up';
      else direction = 'upRight';
      setLookDirection(direction);
    }

    function resetPagePointer() {
      setLookDirection(null);
    }

    window.addEventListener('pointermove', trackPagePointer);
    window.addEventListener('pointerleave', resetPagePointer);
    return () => {
      window.removeEventListener('pointermove', trackPagePointer);
      window.removeEventListener('pointerleave', resetPagePointer);
    };
  }, []);

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
      const savedProjects = rs[1].data || [];
      const projects = [
        ...demo.projects.map((project) => {
          const saved = savedProjects.find((item) => item.title === project.title);
          return saved ? { ...project, ...saved, images: normalizeGallery(saved.images) || project.images } : project;
        }),
        ...savedProjects.filter((saved) => !demo.projects.some((project) => project.title === saved.title)),
      ];
      setData({
        profile: rs[0].data || demo.profile,
        projects,
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
      <div ref={progressRef} className="scrollProgress" aria-hidden="true" />
      <Sidebar open={open} close={() => setOpen(false)} theme={theme} toggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} connected={connected} activeSection={activeSection} onSelect={setActiveSection} />
      <main>
        <header className="mobile">
          <button onClick={() => setOpen(true)}><Menu /></button>
          <b>MARLON_DB</b>
          <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>{theme === 'dark' ? <Sun /> : <Moon />}</button>
        </header>
        <Home data={data} theme={theme} lookDirection={lookDirection} readyPortraitTheme={readyPortraitTheme} openLightbox={openLightbox} visitorCount={visitorCount} />
      </main>
      <Lightbox state={lightbox} onClose={closeLightbox} onNav={navLightbox} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({ open, close, theme, toggle, connected, activeSection, onSelect }) {
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
            <a href={h} onClick={() => { close(); onSelect(h.slice(1)); }} key={n} className={activeSection === h.slice(1) ? 'active' : ''} aria-current={activeSection === h.slice(1) ? 'location' : undefined}>
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

function Home({ data, theme, lookDirection, readyPortraitTheme, openLightbox, visitorCount }) {
  const p = data.profile;
  const portraitSet = theme === 'light' ? lightPortraits : darkPortraits;
  const neutralPortrait = theme === 'light' ? '/profile-light.png' : '/profile.png';

  return (
    <>
      <section id="home" className="section hero">
        <div className="eyebrow"><i /> SYSTEM.DEVELOPER <em>/</em> FULL-STACK</div>
        <div className="heroGrid">
          <div className="photo">
            <div className="dbMascot" aria-hidden="true">
              <span className="dbSpeech">HELLO!</span>
              <span className="dbWave"><i /><i /><i /><i /><b /></span>
              <span className="dbCylinder">
                <span className="dbEyes"><i /><i /></span>
                <span className="dbSmile" />
              </span>
            </div>
            <div className="photoFrame">
              <div className="scanlines" />
              <img src={neutralPortrait} alt="Marlon Armado" className="profileImage" decoding="async" />
              {readyPortraitTheme === 'all' && Object.entries(portraitSet).map(([direction, src]) => (
                <img
                  key={`${theme}-${direction}`}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className={`profileImage profileDirectionImage${lookDirection === direction ? ' visible' : ''}`}
                  decoding="async"
                />
              ))}
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
            <div className="heroActions">
              <a className="primaryAction" href="#projects">Explore my work <ArrowUpRight /></a>
              <a className="secondaryAction" href="#contact">Let’s talk <Mail /></a>
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
      <PortfolioChatbot portfolio={data} />
      <div className="foot">MARLON_DB / SYSTEM.DEVELOPER <span>BUILT WITH REACT + POSTGRESQL</span></div>
    </>
  );
}

function PortfolioChatbot({ portfolio }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can answer questions using the information in this portfolio. Ask me about projects, skills, services, experience, or contact details.' },
  ]);
  const messagesViewport = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    const viewport = messagesViewport.current;
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) return undefined;
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    input.current?.focus();
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  function sendQuestion(value = question) {
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text },
      { role: 'assistant', text: answerFromPortfolio(text, portfolio) },
    ]);
    setQuestion('');
  }

  return (
    <div className="portfolioChat">
      {open && (
        <section id="portfolio-chat-panel" className="chatPanel" role="dialog" aria-label="Portfolio chatbot">
          <header className="chatHeader">
            <div className="chatAvatar"><Database /></div>
            <div><b>Portfolio assistant</b><small><i /> Answers from this portfolio</small></div>
            <button className="chatClose" onClick={() => setOpen(false)} aria-label="Close chatbot"><X /></button>
          </header>
          <div className="chatMessages" ref={messagesViewport} role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div className={`chatMessage ${message.role}`} key={`${index}-${message.role}`}>
                {message.role === 'assistant' && <span className="chatMessageIcon"><Database /></span>}
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          {messages.length === 1 && (
            <div className="chatPrompts">
              <button onClick={() => sendQuestion('What projects has Marlon built?')}>Projects</button>
              <button onClick={() => sendQuestion('What skills does Marlon have?')}>Skills</button>
              <button onClick={() => sendQuestion('What services does Marlon offer?')}>Services</button>
            </div>
          )}
          <form className="chatForm" onSubmit={(event) => { event.preventDefault(); sendQuestion(); }}>
            <input ref={input} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about the portfolio..." aria-label="Ask a question about the portfolio" />
            <button type="submit" aria-label="Send question" disabled={!question.trim()}><Send /></button>
          </form>
          <div className="chatFootnote">LOCAL PORTFOLIO Q&amp;A</div>
        </section>
      )}
      <button className={`chatToggle${open ? ' active' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="portfolio-chat-panel" aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'}>
        {open ? <X /> : <MessageCircle />}
        {!open && <span>Ask me</span>}
      </button>
    </div>
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
        <div><span>04 —</span><h2>github</h2></div>
        <code>@MARLONARMADO03 <ArrowUpRight /></code>
      </div>
      <a className="githubGraph reveal" href="https://github.com/marlonarmado03" target="_blank" rel="noreferrer" aria-label="Open Marlon Armado's GitHub profile">
        <div className="githubCardHead">
          <div className="githubIdentity">
            <span className="githubMark"><Github /></span>
            <span><b>Marlon Armado</b><small>@marlonarmado03 · developer</small></span>
          </div>
          <span className="githubVisit">VISIT PROFILE <ArrowUpRight /></span>
        </div>
        <div className="githubStatLine"><b>Contribution graph</b><span>Activity preview</span><i>YEAR IN CODE</i></div>
        <div className="graphContent">
          <div className="graphMonths" aria-hidden="true"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span></div>
          <div className="graphBody">
            <div className="graphWeekdays" aria-hidden="true"><span>MON</span><span>WED</span><span>FRI</span></div>
            <div className="contributionGrid" aria-hidden="true">
              {cells.map((level, index) => <i key={index} data-level={level} />)}
            </div>
          </div>
        </div>
        <div className="githubGraphBottom">
          <span className="githubOpenSource"><i /> PUBLIC PROFILE</span>
          <div className="githubLegend"><span>LESS</span><i data-level="0" /><i data-level="1" /><i data-level="2" /><i data-level="3" /><i data-level="4" /><span>MORE</span></div>
        </div>
      </a>
    </section>
  );
}

function ProjectCard({ project: x, index: i, openLightbox }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = normalizeGallery(x.images) || (x.image_url ? [{ src: x.image_url, caption: '' }] : []);
  const cover = images[selectedImage];

  return (
    <article className="projectCard reveal">
      {cover ? (
        <div className="projectGallery">
          <button className="coverBtn" onClick={() => openLightbox(x.title, images, selectedImage)} aria-label={`View ${cover.caption || x.title} full size`}>
            <img src={cover.src} alt={cover.caption || x.title} loading="lazy" decoding="async" />
            <span className="expand"><Expand /> {images.length > 1 ? 'open gallery' : 'view full size'}</span>
          </button>
          {images.length > 1 && (
            <div className="galleryControls" aria-label={`${x.title} image navigation`}>
              <button onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} aria-label="Show previous image"><ChevronLeft /></button>
              <span>IMAGE {String(selectedImage + 1).padStart(2, '0')} <i>/</i> {String(images.length).padStart(2, '0')}</span>
              <button onClick={() => setSelectedImage((selectedImage + 1) % images.length)} aria-label="Show next image"><ChevronRight /></button>
            </div>
          )}
          {images.length > 1 && (
            <div className="thumbRow" aria-label={`Choose an image for ${x.title}`}>
              {images.map((img, idx) => (
                <button key={img.src} className={`thumbBtn${selectedImage === idx ? ' selected' : ''}`} onClick={() => setSelectedImage(idx)} aria-label={`Show image ${idx + 1}: ${img.caption || x.title}`} aria-pressed={selectedImage === idx}>
                  <img src={img.src} alt="" loading="lazy" decoding="async" />
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : x.demo_url ? (
        <a className="coverBtn projectPreview" href={x.demo_url} target="_blank" rel="noreferrer" aria-label={`Open ${x.title} website`}>
          <iframe src={x.demo_url} title={`${x.title} live preview`} loading="lazy" tabIndex={-1} />
          <span className="expand"><ArrowUpRight /> open live site</span>
        </a>
      ) : null}
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
        {x.demo_url && <a href={x.demo_url} target="_blank" rel="noreferrer" className="projectLink">Visit site <ArrowUpRight /></a>}
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

function answerFromPortfolio(rawQuestion, portfolio) {
  const question = rawQuestion.toLowerCase();
  const profile = portfolio.profile;
  const projects = portfolio.projects || [];
  const skills = portfolio.skills || [];
  const services = portfolio.services || [];
  const experience = portfolio.experience || [];

  if (/^(hi|hello|hey|kumusta|kamusta)\b/.test(question.trim())) {
    return `Hi! I can tell you about ${profile.name}'s projects, skills, services, experience, and how to get in touch.`;
  }

  const projectAliases = [
    ['human resources', 'hr system', 'hr management', 'hr'],
    ['car rental', 'rental system', 'transport system'],
    ['barangay', 'brgy'],
    ['j & r', 'j and r', 'construction website'],
  ];
  const matchedProject = projects.find((project, index) =>
    question.includes(project.title.toLowerCase()) ||
    (projectAliases[index] || []).some((alias) => question.includes(alias))
  );
  if (matchedProject && /project|proyekto|system|website|application|built|about|tell me|what is|describe|\bhr\b|rental|barangay|construction|tungkol/.test(question)) {
    const stack = (matchedProject.technologies || []).join(', ');
    return `${matchedProject.title}: ${matchedProject.description}${stack ? `\nTechnologies: ${stack}.` : ''}`;
  }

  if (/project|portfolio|work|built|systems|proyekto|ginawa/.test(question)) {
    return `Featured projects: ${projects.map((project) => project.title).join('; ')}. Ask me about a specific project to learn more.`;
  }

  const matchedSkill = skills.find((skill) => question.includes(skill.name.toLowerCase()));
  if (matchedSkill) {
    return `${profile.name}'s portfolio lists ${matchedSkill.name} under ${matchedSkill.category}${matchedSkill.level != null ? `, with a skill level of ${matchedSkill.level}%` : ''}.`;
  }
  if (/skill|technology|technologies|tech stack|programming|language|tools|kasanayan|kakayahan|teknolohiya/.test(question)) {
    return `Skills listed in the portfolio: ${skills.map((skill) => `${skill.name}${skill.level != null ? ` (${skill.level}%)` : ''}`).join(', ')}.`;
  }

  if (/contact|email|reach|message|hire|available|availability|freelance|kontak|kumuha/.test(question)) {
    return `${profile.availability}. You can contact ${profile.name} at ${profile.email} using the Contact section.`;
  }
  if (/service|offer|help with|what can .* do|serbisyo|matutulong/.test(question)) {
    return `Services listed in the portfolio: ${services.map((service) => service.title).join(', ')}.`;
  }
  if (/experience|career|years|how long|karanasan|ilang taon/.test(question)) {
    const roles = experience.map((item) => `${item.position} at ${item.company}${item.start_date ? ` (since ${date(item.start_date)})` : ''}`).join('; ');
    return `The portfolio lists 4+ years of experience.${roles ? ` Experience: ${roles}.` : ''}`;
  }
  if (/location|where.*from|where.*based|lokasyon|saan.*based/.test(question)) {
    return `${profile.name} is based in ${profile.location}.`;
  }
  if (/github/.test(question)) {
    return `You can find ${profile.name} on GitHub: ${profile.github_url}`;
  }
  if (/who|about|name|bio|background|introduc|developer|sino|tungkol|talambuhay/.test(question)) {
    return `${profile.name} is a ${profile.role} and ${profile.headline} based in ${profile.location}. ${profile.bio}`;
  }

  return `I can answer using the portfolio information about ${profile.name}'s projects, skills, services, experience, location, and contact details. Try asking about one of those.`;
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
        <div><span>07 —</span><h2>contact</h2></div>
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
