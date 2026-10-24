import { JSDOM } from 'jsdom';
import { test, afterEach, after } from 'node:test';
import assert from 'node:assert/strict';

// Component-level DOM tests. This is not a real browser or visual-layout test.
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://pawwell.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'HTMLDialogElement', 'Element', 'SVGElement', 'Node', 'MutationObserver', 'getComputedStyle']) {
  globalThis[key] = key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[key];
}
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.requestAnimationFrame = callback => setTimeout(() => callback(performance.now()), 16);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
class IntersectionObserverStub { observe() {} unobserve() {} disconnect() {} }
class ResizeObserverStub { observe() {} unobserve() {} disconnect() {} }
globalThis.IntersectionObserver = window.IntersectionObserver = IntersectionObserverStub;
globalThis.ResizeObserver = window.ResizeObserver = ResizeObserverStub;
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };

const React = (await import('react')).default;
const { render, screen, within, cleanup, fireEvent, waitFor } = await import('@testing-library/react');
const userEvent = (await import('@testing-library/user-event')).default;
const { MotionConfig } = await import('motion/react');
const { default: Booking } = await import('../src/components/Booking.jsx');
const { default: App } = await import('../src/App.jsx');
const { addDays, createDraft, persistVisits, readVisits, STORAGE_KEY, timesForDate, todayInColombo, toStoredVisit, validateBookingStep } = await import('../src/lib/booking.js');

const renderUI = element => render(<MotionConfig reducedMotion="always" transition={{ duration: 0 }}>{element}</MotionConfig>);
afterEach(() => { cleanup(); window.localStorage.clear(); });
after(() => { dom.window.close(); });

test('dates use Colombo time and reject past, impossible, and out-of-range visits', () => {
  const now = new Date('2026-10-24T20:00:00Z');
  assert.equal(todayInColombo(now), '2026-10-25');
  const draft = createDraft('dog', 'Wellness check', now);
  assert.equal(draft.date, '2026-10-26');
  assert.match(validateBookingStep(2, { ...draft, date: '2026-10-25' }, now), /between tomorrow/);
  assert.match(validateBookingStep(2, { ...draft, date: '2026-02-30' }, now), /between tomorrow/);
  assert.match(validateBookingStep(2, { ...draft, date: addDays('2026-10-25', 91) }, now), /between tomorrow/);
  assert.match(validateBookingStep(2, { ...draft, time: '' }, now), /sample time/);
  assert.equal(validateBookingStep(2, { ...draft, time: timesForDate(draft.date)[0] }, now), '');
  assert.match(validateBookingStep(1, { ...draft, petName: ' ' }), /pet’s name/);
  assert.match(validateBookingStep(1, { ...draft, petName: 'Milo', petKey: 'small', service: 'Vaccinations' }), /choose a service/);
});

test('saved visits exclude contact details and preserve the previous app’s storage format', () => {
  const draft = { ...createDraft('cat', 'Dental care'), petName: ' Milo ', ownerName: 'Demo Tester', email: 'demo@example.com', note: 'Private note', time: '09:00 AM' };
  const visit = toStoredVisit(draft, 'demo-1');
  assert.deepEqual(Object.keys(visit).sort(), ['date', 'id', 'petName', 'petType', 'service', 'time']);
  assert.equal(visit.petName, 'Milo');
  assert.equal(visit.petType, 'Cat');
  assert.equal(persistVisits(window.localStorage, [visit]), true);
  assert.deepEqual(readVisits(window.localStorage), [visit]);
  assert.equal(window.localStorage.getItem(STORAGE_KEY).includes('demo@example.com'), false);
  window.localStorage.setItem(STORAGE_KEY, '{broken');
  assert.deepEqual(readVisits(window.localStorage), []);
  assert.equal(persistVisits({ setItem() { throw new Error('unavailable'); } }, [visit]), false);
});

test('booking validation, back navigation, and the complete three-step flow work', async () => {
  const user = userEvent.setup({ document });
  let saved;
  renderUI(<Booking petKey="cat" service="Dental care" onSave={visit => { saved = visit; return true; }} onClose={() => {}} />);
  assert.equal(screen.getByLabelText('What brings you in?').value, 'Dental care');
  assert.equal(screen.getByRole('radio', { name: 'Cat', exact: true }).checked, true);
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  assert.match(screen.getByRole('alert').textContent, /pet’s name/);
  await user.type(screen.getByLabelText('Their name'), 'Milo');
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  await screen.findByLabelText('Pick a day');
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  assert.match(screen.getByRole('alert').textContent, /sample time/);
  const date = screen.getByLabelText('Pick a day').value;
  await user.click(screen.getByRole('radio', { name: timesForDate(date)[0], exact: true }));
  await user.click(screen.getByRole('button', { name: 'Back', exact: true }));
  assert.equal((await screen.findByLabelText('Their name')).value, 'Milo');
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  await screen.findByLabelText('Pick a day');
  assert.equal(screen.getByRole('radio', { name: timesForDate(date)[0], exact: true }).checked, true);
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  await user.type(await screen.findByLabelText('Your name'), 'Demo Tester');
  await user.type(screen.getByLabelText('Email address'), 'invalid');
  await user.click(screen.getByRole('button', { name: 'Save demo visit' }));
  assert.match(screen.getByRole('alert').textContent, /valid email/);
  await user.clear(screen.getByLabelText('Email address'));
  await user.type(screen.getByLabelText('Email address'), 'demo@example.com');
  await user.click(screen.getByRole('button', { name: 'Save demo visit' }));
  assert.match(screen.getByRole('alert').textContent, /confirm/);
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Save demo visit' }));
  assert.match(screen.getByText(/sample visit is saved/).textContent, /Milo/);
  assert.equal(saved.service, 'Dental care');
  assert.equal(saved.email, undefined);
  assert.equal(saved.note, undefined);
});

test('changing the companion updates services and the date resets time selection', async () => {
  const user = userEvent.setup({ document });
  renderUI(<Booking petKey="dog" service="Vaccinations" onSave={() => true} onClose={() => {}} />);
  await user.click(screen.getByRole('radio', { name: 'Small pet', exact: true }));
  assert.equal(screen.getByLabelText('What brings you in?').value, 'Small-pet wellness');
  assert.equal(screen.queryByRole('option', { name: 'Vaccinations' }), null);
  await user.type(screen.getByLabelText('Their name'), 'Clover');
  await user.click(screen.getByRole('button', { name: 'Continue', exact: true }));
  const input = await screen.findByLabelText('Pick a day');
  await user.click(screen.getByRole('radio', { name: timesForDate(input.value)[0], exact: true }));
  fireEvent.change(input, { target: { value: addDays(input.value, 1) } });
  assert.equal(screen.getAllByRole('radio').some(radio => radio.checked), false);
});

test('service tabs support keyboard navigation and selected care carries into booking', async () => {
  const user = userEvent.setup({ document });
  renderUI(<App />);
  const dogTab = screen.getByRole('tab', { name: 'Dogs' });
  dogTab.focus();
  await user.keyboard('{ArrowRight}');
  assert.equal(screen.getByRole('tab', { name: 'Cats' }).getAttribute('aria-selected'), 'true');
  await user.click(await screen.findByRole('button', { name: 'Explore dental care for cats' }));
  const details = await screen.findByRole('dialog');
  assert.match(within(details).getByRole('heading').textContent, /Dental care/);
  await user.click(within(details).getByRole('button', { name: 'Plan a visit' }));
  const serviceSelect = await screen.findByLabelText('What brings you in?');
  assert.equal(serviceSelect.value, 'Dental care');
  assert.equal(screen.getByRole('radio', { name: 'Cat', exact: true }).checked, true);
  fireEvent(screen.getByRole('dialog'), new window.Event('cancel', { bubbles: false, cancelable: true }));
  await waitFor(() => assert.equal(Boolean(screen.queryByRole('dialog')), false));
});

test('previously saved visits can be viewed and removed in React', async () => {
  const visit = { id: 'legacy-demo', petName: 'Milo', petType: 'Cat', service: 'Dental care', date: '2026-11-01', time: '09:00 AM' };
  persistVisits(window.localStorage, [visit]);
  const user = userEvent.setup({ document });
  renderUI(<App />);
  await user.click(screen.getByRole('button', { name: 'My demo visits, 1 saved' }));
  const dialog = await screen.findByRole('dialog');
  assert.match(within(dialog).getByRole('heading', { level: 3 }).textContent, /Milo/);
  await user.click(within(dialog).getByRole('button', { name: 'Remove demo visit for Milo' }));
  assert.match(within(dialog).getByRole('heading', { level: 3 }).textContent, /new chapter/);
  assert.deepEqual(readVisits(window.localStorage), []);
});

test('FAQ answers and the first-visit checklist remain interactive', async () => {
  const user = userEvent.setup({ document });
  renderUI(<App />);
  await user.click(screen.getByRole('button', { name: 'Can I make a real appointment here?' }));
  assert.equal(screen.getByRole('button', { name: 'Can I make a real appointment here?' }).getAttribute('aria-expanded'), 'true');
  assert.equal(screen.getByRole('button', { name: 'What happens at my pet’s first visit?' }).getAttribute('aria-expanded'), 'false');
  await user.click(screen.getByRole('button', { name: 'Your first-visit checklist' }));
  const dialog = await screen.findByRole('dialog');
  await user.click(within(dialog).getByRole('checkbox', { name: 'A familiar blanket or favourite toy' }));
  assert.equal(within(dialog).getByText('1 of 5 ready').textContent, '1 of 5 ready');
});
