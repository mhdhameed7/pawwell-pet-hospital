import { careCatalog } from '../data.js';

export const STORAGE_KEY = 'pawwell-demo-visits-v1';
export const TIME_ZONE = 'Asia/Colombo';

export function todayInColombo(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TIME_ZONE }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
}

export function addDays(value, amount) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function formatDate(value) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: TIME_ZONE }).format(date);
}

export function timesForDate(value) {
  const day = new Date(`${value}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6
    ? ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM']
    : ['09:00 AM', '10:30 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];
}

export function createDraft(petKey = 'dog', preferredService = '', now = new Date()) {
  const pet = careCatalog[petKey] ? petKey : 'dog';
  return {
    petKey: pet, petName: '',
    service: careCatalog[pet].find(item => item.service === preferredService)?.service || careCatalog[pet][0].service,
    date: addDays(todayInColombo(now), 1), time: '', note: '', ownerName: '', email: '', consent: false,
  };
}

export function validateBookingStep(step, draft, now = new Date()) {
  if (step === 1) {
    if (!draft.petName.trim()) return 'Please tell us your pet’s name.';
    if (draft.petName.trim().length > 60) return 'Please keep your pet’s name under 60 characters.';
    if (!careCatalog[draft.petKey]?.some(item => item.service === draft.service)) return 'Please choose a service for your pet.';
  }
  if (step === 2) {
    const today = todayInColombo(now);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || Number.isNaN(Date.parse(`${draft.date}T12:00:00Z`)) || new Date(`${draft.date}T12:00:00Z`).toISOString().slice(0, 10) !== draft.date || draft.date < addDays(today, 1) || draft.date > addDays(today, 90)) return 'Choose a date between tomorrow and 90 days from today.';
    if (!timesForDate(draft.date).includes(draft.time)) return 'Please choose an available sample time.';
  }
  if (step === 3) {
    if (!draft.ownerName.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) return 'Please enter a valid email address.';
    if (!draft.consent) return 'Please confirm that this is a demo visit.';
  }
  return '';
}

export function toStoredVisit(draft, id = crypto.randomUUID()) {
  return {
    id, petName: draft.petName.trim(),
    petType: draft.petKey === 'small' ? 'Small pet' : draft.petKey === 'cat' ? 'Cat' : 'Dog',
    service: draft.service, date: draft.date, time: draft.time,
  };
}

export function readVisits(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(visit => visit && ['id', 'petName', 'petType', 'service', 'date', 'time'].every(key => typeof visit[key] === 'string')).slice(0, 50);
  } catch { return []; }
}

export function persistVisits(storage, visits) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(visits.slice(0, 50))); return true; }
  catch { return false; }
}
