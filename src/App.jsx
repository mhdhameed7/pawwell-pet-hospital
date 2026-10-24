import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Icon, Icons } from './components/Icons.jsx';
import { Button, Eyebrow, Reveal, TitleReveal, ease } from './components/Motion.jsx';
import Modal from './components/Modal.jsx';
import Booking from './components/Booking.jsx';
import { careCatalog, petTypes } from './data.js';
import { formatDate, persistVisits, readVisits, STORAGE_KEY } from './lib/booking.js';

const navigation = [['care', 'Our care'], ['approach', 'Our approach'], ['visit', 'Your first visit'], ['faqs', 'FAQs']];

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#home" aria-label="Pawwell home"><span className="brand-icon"><Icon name="paw" /></span><span>pawwell<span className="brand-dot">.</span><small>VETERINARY CARE</small></span></a>;
}

function Header({ onBook, onVisits, visitCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  const reduce = useReducedMotion();
  useMotionValueEvent(scrollY, 'change', value => setScrolled(value > 24));
  useEffect(() => {
    if (!menuOpen) return;
    const escape = event => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const resize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => { document.removeEventListener('keydown', escape); window.removeEventListener('resize', resize); };
  }, [menuOpen]);
  return <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
    <motion.div className="reading-progress" style={{ scaleX: reduce ? scrollYProgress : progress }} aria-hidden="true" />
    <div className="container nav"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav><div className="nav-actions"><button className="my-visits-link" onClick={onVisits} aria-label={`My demo visits${visitCount ? `, ${visitCount} saved` : ''}`}><Icon name="calendar" />{visitCount > 0 && <span>{visitCount}</span>}</button><Button className="nav-book" onClick={() => { setMenuOpen(false); onBook(); }}>Book a visit</Button><button ref={menuButton} className="icon-button menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div></div>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }}><div>{navigation.map(([id, label], index) => <motion.a key={id} href={`#${id}`} initial={reduce ? false : { x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: reduce ? 0 : index * 0.06 }} onClick={() => setMenuOpen(false)}>{label}<Icon name="arrow-up" /></motion.a>)}<button className="mobile-visits" onClick={() => { setMenuOpen(false); onVisits(); }}>My demo visits <Icon name="calendar" /></button></div></motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onBook }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" ref={ref} className="hero container">
    <div className="hero-copy"><Reveal delay={0.03}><Eyebrow>THEIR WELLBEING. OUR WHOLE WORLD.</Eyebrow></Reveal><TitleReveal as="h1" hero lines={['Extraordinary', 'companions.', { text: 'Exceptional care.', accent: true }]} /><Reveal delay={0.45}><p className="hero-description">For the ones who make your life a little fuller.<br className="desktop-break" /> Thoughtful veterinary care, meaningful connections,<br className="desktop-break" /> and a healthier life together.</p></Reveal><Reveal className="hero-actions" delay={0.58}><Button magnetic onClick={onBook}>Book their first visit</Button><a className="text-link" href="#care">Discover our care <Icon name="arrow" /></a></Reveal><Reveal className="hero-assurance" delay={0.72}><div className="assurance-icon"><Icon name="heart" /></div><div><strong>Compassion at every step.</strong><span>For your companion. And for you.</span></div><span className="assurance-line" /></Reveal></div>
    <div className="hero-visual"><motion.div className="hero-orbit orbit-one" aria-hidden="true" initial={reduce ? false : { rotate: -18, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 1.8, ease }} /><div className="hero-orbit orbit-two" aria-hidden="true" /><motion.div className="hero-image-reveal" initial={reduce ? false : { clipPath: 'inset(10% 6% 10% 6% round 150px 150px 30px 30px)', opacity: 0, y: 24 }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 150px 150px 30px 30px)', opacity: 1, y: 0 }} transition={{ duration: 1.25, delay: 0.12, ease }}><motion.img src="/assets/pet-portrait.webp" alt="A golden retriever and fluffy ginger cat sitting together" width="1120" height="1400" fetchPriority="high" style={reduce ? undefined : { y: imageY }} /></motion.div><motion.div className="hero-top-tag" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7, ease }}><span className="live-dot" /> A calmer kind of care.</motion.div><motion.div className="hero-care-card" style={reduce ? undefined : { y: cardY }} initial={reduce ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8, ease }}><span className="hero-care-icon"><Icon name="shield" /></span><div><strong>Care for their whole story.</strong><span>From first steps to golden years.</span></div><svg className="care-pulse" viewBox="0 0 70 34" aria-hidden="true"><motion.path d="M1 18h14l6-12 10 23 8-17 5 6h25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={reduce ? { duration: 0 } : { duration: 1.8, delay: 1.1, repeat: Infinity, repeatDelay: 3 }} /></svg></motion.div><motion.div className="hero-seal" aria-hidden="true" animate={reduce ? {} : { rotate: [0, 7, 0], y: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><Icon name="paw" /><span>PET FIRST.<br />ALWAYS.</span></motion.div><div className="image-caption"><span>GOOD MEDICINE. GENUINE CONNECTION.</span><span>01 — PAWWELL</span></div></div>
  </section>;
}

function CarePrinciples() {
  const items = [['heart', 'A gentler experience', 'Thoughtful care, at their pace.'], ['shield', 'A clearer care plan', 'Understand every next step.'], ['paw', 'A lifelong connection', 'Every companion. Every chapter.']];
  return <section className="principles" aria-label="Our care principles"><div className="container principles-inner">{items.map(([name, title, description], index) => <Reveal key={name} delay={index * 0.1} className="principle"><Icon name={name} /><div><strong>{title}</strong><span>{description}</span></div></Reveal>)}</div></section>;
}

function Care({ pet, onPetChange, onService }) {
  const reduce = useReducedMotion();
  const tabRefs = useRef({});
  const onKey = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = petTypes.findIndex(item => item.key === pet);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
    onPetChange(petTypes[next].key); tabRefs.current[petTypes[next].key]?.focus();
  };
  return <section id="care" className="care-section section"><div className="container"><div className="section-heading"><div><Reveal><Eyebrow>CONSIDERED CARE. INDIVIDUAL NEEDS.</Eyebrow></Reveal><TitleReveal lines={['Care that follows', { text: 'their story.', accent: true }]} /></div><Reveal className="section-heading-side" delay={0.15}><p>Every personality is different.<br />Their care should be, too.</p><div role="tablist" aria-label="Explore care by pet" className="pet-tabs" onKeyDown={onKey}>{petTypes.map(item => <button key={item.key} ref={element => { tabRefs.current[item.key] = element; }} type="button" role="tab" id={`tab-${item.key}`} aria-selected={pet === item.key} aria-controls="care-panel" tabIndex={pet === item.key ? 0 : -1} onClick={() => onPetChange(item.key)}>{pet === item.key && <motion.span className="tab-highlight" layoutId="active-pet" transition={{ type: 'spring', stiffness: 360, damping: 32 }} />}<Icon name={item.icon} /><span>{item.label}</span></button>)}</div></Reveal></div>
      <div id="care-panel" role="tabpanel" aria-labelledby={`tab-${pet}`}><AnimatePresence mode="wait" initial={false}><motion.div key={pet} className="service-grid" initial="hidden" whileInView="visible" exit={{ opacity: 0, y: reduce ? 0 : -8 }} viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.09 } } }} transition={{ duration: reduce ? 0 : 0.18 }}>{careCatalog[pet].map((service, index) => <motion.button key={service.id} className="service-card" onClick={() => onService(service)} aria-label={`Explore ${service.title.toLowerCase()} for ${petTypes.find(item => item.key === pet).label.toLowerCase()}`} variants={{ hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 26 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }} whileHover={reduce ? undefined : { y: -9 }} whileTap={reduce ? undefined : { scale: 0.99 }}><div className="service-card-head"><span className="service-icon"><Icon name={service.icon} /></span><span className="service-number">0{index + 1}</span></div><h3>{service.title}</h3><p>{service.description}</p><span className="service-bottom">Explore this care <span><Icon name="arrow-up" /></span></span></motion.button>)}</motion.div></AnimatePresence></div><Reveal className="care-note"><Icon name="heart" /><span>From everyday wellbeing to the moments you need a little more support.</span></Reveal>
    </div></section>;
}

function Approach() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const values = [['01', 'We see the individual.', 'Their habits, their history, their favourite spot for a scratch. The little things help us understand the whole picture.'], ['02', 'We make room for trust.', 'A gentle introduction. Time to settle in. Care that feels less overwhelming for both of you.'], ['03', 'We keep you connected.', 'Clear conversations, thoughtful guidance, and a care plan you can feel comfortable with.']];
  return <section id="approach" ref={ref} className="approach-section container section"><Reveal className="approach-visual" direction="left"><div className="approach-image"><motion.img src="/assets/gentle-care.webp" alt="A veterinarian gently greeting a relaxed ginger cat" width="1120" height="1400" loading="lazy" style={reduce ? undefined : { y: imageY }} /></div><div className="approach-image-label"><Icon name="heart" /><span>Understanding makes<br /><strong>all the difference.</strong></span></div><span className="image-side-label">THE PAWWELL APPROACH</span></Reveal><div className="approach-copy"><Reveal><Eyebrow>MORE THAN A VISIT. A CONNECTION.</Eyebrow></Reveal><TitleReveal lines={['Thoughtful by design.', { text: 'Personal by nature.', accent: true }]} /><Reveal delay={0.12}><p className="section-description">They’re a part of your family. That’s where our approach begins. We believe care works best when we listen, understand, and take the next step together.</p></Reveal><div className="values">{values.map(([number, title, description], index) => <Reveal key={number} delay={index * 0.12} className="value"><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></Reveal>)}</div><Reveal delay={0.3}><a className="text-link underline-link" href="#visit">Get to know your first visit <Icon name="arrow-up" /></a></Reveal></div></section>;
}

function FirstVisit({ onBook, onChecklist }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const steps = [['calendar', '01', 'Make a little time.', 'Choose the care you need and a moment that works for you. A better experience starts here.', 'Choose a visit', onBook], ['heart', '02', 'Feel a little at home.', 'Bring their records, a familiar comfort, and all your questions. We’ll make space for the rest.', 'Your first-visit checklist', onChecklist], ['flower', '03', 'See a clearer path.', 'Leave with practical next steps and the confidence that comes from understanding their care.', 'A few helpful answers', null]];
  return <section id="visit" className="visit-section" ref={ref}><div className="container"><div className="section-heading"><div><Reveal><Eyebrow light>A REASSURING START</Eyebrow></Reveal><TitleReveal lines={['Your first visit.', { text: 'The start of something good.', accent: true }]} /></div><Reveal className="visit-intro"><p>A little less uncertainty.<br />A lot more understanding.</p><span className="visit-intro-icon"><Icon name="paw" /></span></Reveal></div><div className="journey-line" aria-hidden="true"><motion.span style={{ scaleX: reduce ? 1 : lineProgress }} /></div><div className="visit-grid">{steps.map(([name, number, title, description, label, action], index) => <Reveal className="visit-card" key={number} delay={index * 0.15}><div className="visit-step-top"><span className="visit-number">{number}</span><Icon name={name} /></div><h3>{title}</h3><p>{description}</p>{action ? <button className="text-link" onClick={action}>{label}<Icon name="arrow-up" /></button> : <a className="text-link" href="#faqs">{label}<Icon name="arrow-up" /></a>}</Reveal>)}</div></div><span className="visit-watermark" aria-hidden="true">pawwell.</span></section>;
}

const questions = [
  ['What happens at my pet’s first visit?', 'It starts with a conversation. We get to know your pet, listen to your concerns, review their health history, and talk through a care plan together. There’s time for your questions, too.'],
  ['What should I bring with me?', 'Bring vaccination or medical records, a list of current medications, and any questions. A favourite blanket or toy can help your pet feel more at home. Use a secure carrier or leash for the journey.'],
  ['Do you care for small pets, too?', 'This concept includes care journeys for dogs, cats, and small companions. Choose “Small pets” in our care explorer to see the example services. A real clinic would confirm care availability for your pet’s species before booking.'],
  ['My pet feels nervous. Can you help?', 'Tell the team about your pet’s worries beforehand. Gentle introductions and familiar comforts can help. Add anything you would like the team to know in the appointment notes.'],
  ['Can I make a real appointment here?', 'Pawwell is a pet hospital website concept. You can explore the booking experience and save a sample visit on this device. No appointment is sent to a clinic, no email is sent, and no payment is taken.'],
];

function FAQs() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  return <section id="faqs" className="faq-section container section"><div className="faq-intro"><Reveal><Eyebrow>A LITTLE CLARITY GOES A LONG WAY</Eyebrow></Reveal><TitleReveal lines={['Good questions.', { text: 'Thoughtful answers.', accent: true }]} /><Reveal delay={0.1}><p>Because feeling informed is<br />part of feeling cared for.</p><div className="faq-note"><Icon name="heart" /><span>Here for your companion.<br /><strong>Here for your questions.</strong></span></div></Reveal></div><div className="faq-list">{questions.map(([question, answer], index) => <Reveal key={question} delay={index * 0.07}><div className={`faq-item ${open === index ? 'is-open' : ''}`}><h3><button id={`question-${index}`} aria-expanded={open === index} aria-controls={`answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{question}</span><span className="faq-toggle"><motion.span animate={{ rotate: open === index ? 90 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }}><Icon name={open === index ? 'close' : 'cross'} /></motion.span></span></button></h3><AnimatePresence initial={false}>{open === index && <motion.div id={`answer-${index}`} className="faq-answer" role="region" aria-labelledby={`question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: reduce ? 0 : 0.35, ease }, opacity: { duration: reduce ? 0 : 0.25 } }}><p>{answer}</p></motion.div>}</AnimatePresence></div></Reveal>)}</div></section>;
}

function Closing({ onBook }) {
  const reduce = useReducedMotion();
  return <section className="closing-section container"><Reveal><div className="closing-card"><div className="closing-content"><Eyebrow>EVERY GREAT CONNECTION STARTS SOMEWHERE.</Eyebrow><TitleReveal lines={['A healthier tomorrow.', { text: 'Starts with hello.', accent: true }]} /><p>Let’s take the next step, together.</p><Button magnetic onClick={onBook}>Make their first visit</Button></div><div className="closing-art" aria-hidden="true"><motion.div className="closing-ring ring-a" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 60, ease: 'linear', repeat: Infinity }} /><div className="closing-ring ring-b" /><motion.div className="closing-paw" animate={reduce ? {} : { y: [0, -12, 0], rotate: [-7, 2, -7] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><Icon name="paw" /></motion.div><span className="closing-art-label">A LIFETIME OF BETTER MOMENTS.</span></div></div></Reveal></section>;
}

function Footer({ onVisits, onPrivacy, visitCount }) {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><Brand /><p>Exceptional care. Everyday connection.</p></div><nav aria-label="Footer navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}<button onClick={onVisits}>My demo visits{visitCount > 0 ? ` (${visitCount})` : ''}</button></nav><a className="back-top" href="#home" aria-label="Back to top"><Icon name="arrow-up" /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Pawwell. A pet-first perspective.</span><span className="concept-label"><span /> PET HOSPITAL CONCEPT · INTERACTIVE DEMO</span><button onClick={onPrivacy}>Privacy</button></div></div></footer>;
}

function Checklist({ onBook }) {
  const [checked, setChecked] = useState([]);
  const items = ['Medical history and vaccination records', 'A list of current medications', 'A secure carrier or comfortable leash', 'A familiar blanket or favourite toy', 'Your questions and any recent changes'];
  return <><div className="modal-brand"><Icon name="heart" /></div><Eyebrow>A LITTLE PREPARATION. MORE PEACE OF MIND.</Eyebrow><h2 id="modal-title">Their first-visit checklist.</h2><p className="modal-description">A few little things for a more comfortable first hello.</p><div className="checklist">{items.map((item, index) => <label key={item} className={checked.includes(index) ? 'checked' : ''}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked(previous => previous.includes(index) ? previous.filter(value => value !== index) : [...previous, index])} /><span>{item}</span></label>)}</div><div className="checklist-progress"><span>{checked.length} of {items.length} ready</span><div><motion.span animate={{ scaleX: checked.length / items.length }} /></div></div><Button onClick={onBook}>Plan their visit</Button></>;
}

export default function App() {
  const [pet, setPet] = useState('dog');
  const [modal, setModal] = useState(null);
  const [visits, setVisits] = useState(() => { try { return readVisits(window.localStorage); } catch { return []; } });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState('');
  const closeModal = useCallback(() => setModal(null), []);
  const openBooking = useCallback((service = '') => setModal({ type: 'booking', service: typeof service === 'string' ? service : '' }), []);
  useEffect(() => {
    const sync = event => { if (event.key === STORAGE_KEY) { try { setVisits(readVisits(window.localStorage)); } catch { /* Keep session visits. */ } } };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timer); }, [notice]);
  function saveVisit(visit) {
    const next = [visit, ...visits].slice(0, 50);
    setVisits(next);
    let saved = false;
    try { saved = persistVisits(window.localStorage, next); } catch { /* Session fallback. */ }
    setStorageAvailable(saved);
    return saved;
  }
  function removeVisit(id) {
    const next = visits.filter(visit => visit.id !== id);
    setVisits(next);
    let saved = false;
    try { saved = persistVisits(window.localStorage, next); } catch { /* Session fallback. */ }
    setStorageAvailable(saved);
    setNotice(saved ? 'Demo visit removed.' : 'Removed for this session. Browser storage is unavailable.');
  }
  return <><Icons /><a className="skip-link" href="#main">Skip to content</a><Header onBook={openBooking} onVisits={() => setModal({ type: 'visits' })} visitCount={visits.length} /><main id="main"><Hero onBook={openBooking} /><CarePrinciples /><Care pet={pet} onPetChange={setPet} onService={service => setModal({ type: 'service', service })} /><Approach /><FirstVisit onBook={openBooking} onChecklist={() => setModal({ type: 'checklist' })} /><FAQs /><Closing onBook={openBooking} /></main><Footer onVisits={() => setModal({ type: 'visits' })} onPrivacy={() => setModal({ type: 'privacy' })} visitCount={visits.length} />
    <AnimatePresence mode="wait">{modal && <Modal key={modal.type} onClose={closeModal} className={modal.type === 'booking' ? 'booking-modal' : ''}>
      {modal.type === 'booking' && <Booking petKey={pet} service={modal.service} onSave={saveVisit} onClose={closeModal} />}
      {modal.type === 'service' && <><div className="modal-brand"><Icon name={modal.service.icon} /></div><Eyebrow>{modal.service.category}</Eyebrow><h2 id="modal-title">{modal.service.title}</h2><p className="modal-description">{modal.service.detail}</p><ul className="detail-list">{modal.service.includes.map(item => <li key={item}><Icon name="check" /><span>{item}</span></li>)}</ul><Button onClick={() => openBooking(modal.service.service)}>Plan a visit</Button><p className="modal-footnote">Illustrative care information for this website concept.</p></>}
      {modal.type === 'checklist' && <Checklist onBook={() => openBooking()} />}
      {modal.type === 'visits' && <><div className="modal-brand"><Icon name="calendar" /></div><Eyebrow>A LITTLE PLACE FOR YOUR PLANS</Eyebrow><h2 id="modal-title">My demo visits.</h2><p className="modal-description">Sample visits saved in this browser. These are not real appointments.</p>{visits.length ? <div className="saved-visits">{visits.map(visit => <motion.article layout className="saved-visit" key={visit.id}><div><h3>{visit.petName} <span>· {visit.petType}</span></h3><span className="demo-badge">DEMO ONLY</span></div><p>{visit.service}<br />{formatDate(visit.date)} at {visit.time} · Sri Lanka time</p><button className="remove-visit" onClick={() => removeVisit(visit.id)} aria-label={`Remove demo visit for ${visit.petName}`}>Remove this demo visit</button></motion.article>)}</div> : <div className="empty-state"><Icon name="calendar" /><h3>A new chapter awaits.</h3><p>Try planning your first demo visit.</p></div>}{!storageAvailable && <p className="modal-footnote">Browser storage is unavailable. Changes are saved for this session only.</p>}<Button onClick={() => openBooking()}>Plan a demo visit</Button></>}
      {modal.type === 'privacy' && <><div className="modal-brand"><Icon name="shield" /></div><Eyebrow>SIMPLE. CLEAR. ON YOUR DEVICE.</Eyebrow><h2 id="modal-title">Your demo, your data.</h2><p className="modal-description">Pawwell is a fictional pet hospital concept. The booking experience is a frontend demonstration.</p><ul className="detail-list">{['No booking information is sent to a clinic or booking service.', 'Only the pet’s name, type, service, date, and time are saved in this browser. Contact details and notes are not stored.', 'Remove individual samples from My demo visits, or clear your browser’s site data to remove them all.', 'The pet and veterinary photographs are AI-generated assets for this design concept.'].map(item => <li key={item}><Icon name="check" /><span>{item}</span></li>)}</ul><p className="modal-footnote">This describes the demo’s behaviour, not a real hospital’s privacy policy.</p></>}
    </Modal>}</AnimatePresence><AnimatePresence>{notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>{notice}</motion.div>}</AnimatePresence>
  </>;
}
