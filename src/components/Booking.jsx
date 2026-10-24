import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { careCatalog, petTypes } from '../data.js';
import { addDays, createDraft, formatDate, timesForDate, todayInColombo, toStoredVisit, validateBookingStep } from '../lib/booking.js';
import { Icon } from './Icons.jsx';
import { Button, Eyebrow } from './Motion.jsx';

export default function Booking({ petKey, service, onSave, onClose }) {
  const [draft, setDraft] = useState(() => createDraft(petKey, service));
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [direction, setDirection] = useState(1);
  const contentRef = useRef(null);
  const reduce = useReducedMotion();
  const today = todayInColombo();
  const update = (key, value) => { setDraft(previous => ({ ...previous, [key]: value })); setError(''); };

  useEffect(() => {
    if (step === 1) return;
    const frame = requestAnimationFrame(() => contentRef.current?.querySelector('input,select')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [step]);

  function submit(event) {
    event.preventDefault();
    const message = validateBookingStep(step, draft);
    if (message) { setError(message); return; }
    if (step < 3) { setDirection(1); setStep(step + 1); setError(''); }
    else {
      for (const earlierStep of [1, 2]) {
        const previousError = validateBookingStep(earlierStep, draft);
        if (previousError) { setDirection(-1); setStep(earlierStep); setError(previousError); return; }
      }
      const visit = toStoredVisit(draft);
      const persisted = onSave(visit);
      setSuccess({ visit, persisted });
    }
  }

  if (success) return <motion.div className="booking-success" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
    <motion.div className="success-mark" initial={reduce ? false : { scale: 0.65 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 17 }}><Icon name="check" /></motion.div>
    <Eyebrow>A LITTLE HELLO, ALL PLANNED</Eyebrow>
    <h2 id="modal-title">Their next chapter<br />starts here.</h2>
    <p>{success.visit.petName}’s sample visit is {success.persisted ? 'saved on this device' : 'available for this session'}.</p>
    <div className="booking-summary"><SummaryRow label="Companion" value={`${success.visit.petName} · ${success.visit.petType}`} /><SummaryRow label="Care" value={success.visit.service} /><SummaryRow label="Date" value={formatDate(success.visit.date)} /><SummaryRow label="Time" value={`${success.visit.time} · Sri Lanka`} /></div>
    <p className="demo-notice"><Icon name="shield" />This is a demo. No appointment was sent to a clinic and no email was sent.{!success.persisted && ' Browser storage is unavailable; this sample will disappear when you close the page.'}</p>
    <Button onClick={onClose}>Back to Pawwell</Button>
  </motion.div>;

  return <div className="booking-content">
    <div className="modal-brand"><Icon name="paw" /></div>
    <Eyebrow>LET’S MEET YOUR COMPANION</Eyebrow>
    <h2 id="modal-title">A better kind of <em>hello.</em></h2>
    <p className="modal-description">Explore the booking experience. This is a demo, not a real appointment.</p>
    <ol className="booking-progress" aria-label="Booking progress">{['Your companion', 'Your visit', 'Your details'].map((label, index) => <li key={label} className={step >= index + 1 ? 'active' : ''} aria-current={step === index + 1 ? 'step' : undefined}><span>{step > index + 1 ? <Icon name="check" /> : index + 1}</span><span>{label}</span></li>)}</ol>
    <form noValidate onSubmit={submit}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div ref={contentRef} key={step} custom={direction} initial={reduce ? false : 'initial'} animate="visible" exit="exit" variants={{ initial: direction => ({ opacity: 0, x: direction * 20 }), visible: { opacity: 1, x: 0 }, exit: direction => ({ opacity: 0, x: direction * -14 }) }} transition={{ duration: reduce ? 0 : 0.2 }}>
          {step === 1 && <>
            <fieldset className="pet-field"><legend>Who are we meeting?</legend><div className="pet-choices">{petTypes.map(pet => <label key={pet.key}><input type="radio" name="petType" value={pet.key} checked={draft.petKey === pet.key} onChange={() => { setDraft(previous => ({ ...previous, petKey: pet.key, service: careCatalog[pet.key].some(item => item.service === previous.service) ? previous.service : careCatalog[pet.key][0].service })); setError(''); }} /><span><Icon name={pet.icon} />{pet.singular}</span></label>)}</div></fieldset>
            <label className="form-label">Their name<input name="petName" placeholder="e.g. Milo" value={draft.petName} onChange={event => update('petName', event.target.value)} maxLength={60} required /></label>
            <label className="form-label">What brings you in?<select name="service" value={draft.service} onChange={event => update('service', event.target.value)}>{careCatalog[draft.petKey].map(item => <option key={item.id} value={item.service}>{item.service}</option>)}</select></label>
          </>}
          {step === 2 && <>
            <label className="form-label">Pick a day<input type="date" name="date" value={draft.date} min={addDays(today, 1)} max={addDays(today, 90)} onChange={event => { setDraft(previous => ({ ...previous, date: event.target.value, time: '' })); setError(''); }} required /></label>
            <fieldset className="time-field"><legend>Choose a time <small>Sample availability</small></legend><div className="time-options">{timesForDate(draft.date).map(time => <label key={time}><input type="radio" name="time" checked={draft.time === time} value={time} onChange={() => update('time', time)} required /><span>{time}</span></label>)}</div></fieldset>
            <p className="time-zone">All times are in Sri Lanka time (Asia/Colombo).</p>
            <label className="form-label">Anything we should know? <small>Optional</small><textarea name="note" rows={2} maxLength={500} placeholder="A nervous traveller? A favourite treat?" value={draft.note} onChange={event => update('note', event.target.value)} /></label>
          </>}
          {step === 3 && <>
            <div className="form-row"><label className="form-label">Your name<input name="ownerName" autoComplete="name" placeholder="Your full name" value={draft.ownerName} onChange={event => update('ownerName', event.target.value)} maxLength={100} required /></label><label className="form-label">Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={draft.email} onChange={event => update('email', event.target.value)} maxLength={150} required /></label></div>
            <div className="booking-summary"><SummaryRow label="Companion" value={`${draft.petName} · ${petTypes.find(item => item.key === draft.petKey).singular}`} /><SummaryRow label="Care" value={draft.service} /><SummaryRow label="Date" value={formatDate(draft.date)} /><SummaryRow label="Time" value={`${draft.time} · Sri Lanka`} /></div>
            <label className="consent"><input type="checkbox" name="consent" checked={draft.consent} onChange={event => update('consent', event.target.checked)} required /><span>I understand this saves a demo visit in this browser only. No real appointment or email will be sent.</span></label>
          </>}
        </motion.div>
      </AnimatePresence>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="booking-navigation">{step > 1 && <button type="button" className="text-link" onClick={() => { setDirection(-1); setStep(step - 1); setError(''); }}><span aria-hidden="true">←</span> Back</button>}<Button type="submit" arrow={step === 3 ? 'check' : 'arrow'}>{step === 3 ? 'Save demo visit' : 'Continue'}</Button></div>
    </form>
  </div>;
}

function SummaryRow({ label, value }) { return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div>; }
