// ──────────────────────────────────────────────────────────
// src/components/booking/BookingModal.jsx
// Multi-step booking flow: slot → details → confirm
// ──────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Clock, Droplets, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal, Spinner, ErrorBanner } from '../ui';
import { subscribeToSlots } from '../../services/firestoreService';
import { useBookings } from '../../context/BookingsContext';

const STEPS = ['Choose Date & Slot', 'Booking Details', 'Confirm'];

// Today + next 2 days as selectable dates
function getNextDates(n = 3) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function BookingModal({ provider, open, onClose }) {
  const { book, actionLoading, error, clearError } = useBookings();

  const [step,      setStep]      = useState(0);
  const [date,      setDate]      = useState(getNextDates()[0]);
  const [slots,     setSlots]     = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [fuelType,  setFuelType]  = useState(provider?.fuelTypes?.[0] ?? 'Petrol');
  const [quantity,  setQuantity]  = useState(fuelType === 'LPG' ? 1 : 5);
  const [notes,     setNotes]     = useState('');
  const [success,   setSuccess]   = useState(false);

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0); setSelectedSlot(null); setSuccess(false);
        setNotes(''); clearError();
      }, 300);
    }
  }, [open, clearError]);

  // Sync quantity default when fuelType changes
  useEffect(() => {
    setQuantity(fuelType === 'LPG' ? 1 : 5);
  }, [fuelType]);

  // Subscribe to real-time slots for chosen provider + date
  useEffect(() => {
    if (!provider || !open) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    const unsub = subscribeToSlots(provider.id, date, (data) => {
      setSlots(data.sort((a, b) => a.time.localeCompare(b.time)));
      setSlotsLoading(false);
    });
    return unsub;
  }, [provider, date, open]);

  const handleBook = useCallback(async () => {
    if (!selectedSlot) return;
    try {
      await book({
        providerId:   provider.id,
        providerName: provider.name,
        slotId:       selectedSlot.id,
        date:         selectedSlot.date,
        time:         selectedSlot.time,
        fuelType,
        quantity:     Number(quantity),
        notes,
        type:         fuelType === 'LPG' ? 'lpg' : 'fuel',
      });
      setSuccess(true);
    } catch {
      // error surfaced via context
    }
  }, [book, provider, selectedSlot, fuelType, quantity, notes]);

  if (!provider) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? 'Booking Confirmed!' : `Book at ${provider.name}`}
    >
      {/* ── Success state ── */}
      {success ? (
        <div className="flex flex-col items-center gap-5 py-6 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-slate-100">You're booked!</p>
            <p className="text-slate-400 text-sm mt-1">
              {fuelType} on {formatDate(selectedSlot?.date ?? date)} at {selectedSlot?.time}
            </p>
          </div>
          <button onClick={onClose} className="btn-primary w-full">
            Done
          </button>
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  i < step  ? 'bg-fuel-500 text-white' :
                  i === step ? 'bg-fuel-500/20 border border-fuel-500 text-fuel-400' :
                               'bg-slate-800 text-slate-600'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-fuel-500' : 'bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>

          <ErrorBanner message={error} onDismiss={clearError} />

          {/* ── Step 0: Date & Slot ── */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label flex items-center gap-1.5">
                  <CalendarDays size={14} /> Select Date
                </label>
                <div className="flex gap-2">
                  {getNextDates().map((d) => (
                    <button
                      key={d}
                      onClick={() => setDate(d)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        date === d
                          ? 'bg-fuel-500 border-fuel-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {formatDate(d)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5">
                  <Clock size={14} /> Available Time Slots
                </label>
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    No slots available for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          !slot.available
                            ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed line-through'
                            : selectedSlot?.id === slot.id
                              ? 'bg-fuel-500 border-fuel-500 text-white shadow-lg shadow-fuel-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-fuel-500/50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="btn-primary w-full mt-2"
                disabled={!selectedSlot}
                onClick={() => setStep(1)}
              >
                Continue <ChevronRight size={16} className="inline" />
              </button>
            </div>
          )}

          {/* ── Step 1: Booking details ── */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label flex items-center gap-1.5">
                  <Droplets size={14} /> Fuel Type
                </label>
                <div className="flex gap-2">
                  {provider.fuelTypes?.map((ft) => (
                    <button
                      key={ft}
                      onClick={() => setFuelType(ft)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        fuelType === ft
                          ? 'bg-fuel-500 border-fuel-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">
                  {fuelType === 'LPG' ? 'Number of Cylinders' : 'Quantity (Litres)'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-display text-2xl font-bold text-slate-100">
                    {quantity}
                    <span className="text-sm font-normal text-slate-500 ml-1">
                      {fuelType === 'LPG' ? 'cyl' : 'L'}
                    </span>
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(fuelType === 'LPG' ? 3 : 50, q + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions…"
                  rows={2}
                  className="input resize-none"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button className="btn-secondary flex-1" onClick={() => setStep(0)}>
                  <ChevronLeft size={16} className="inline" /> Back
                </button>
                <button className="btn-primary flex-1" onClick={() => setStep(2)}>
                  Review <ChevronRight size={16} className="inline" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Confirm ── */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="card border-slate-700 p-4 space-y-3">
                {[
                  ['Provider',   provider.name],
                  ['Date',       formatDate(selectedSlot?.date ?? date)],
                  ['Time Slot',  selectedSlot?.time],
                  ['Fuel Type',  fuelType],
                  ['Quantity',   `${quantity} ${fuelType === 'LPG' ? 'cylinder(s)' : 'litres'}`],
                  ['Est. Cost',  fuelType === 'LPG'
                    ? `₹${(provider.lpgPricePerCylinder * quantity).toLocaleString()}`
                    : `₹${((provider.pricePerLitre?.[fuelType] ?? 0) * quantity).toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-200 font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 text-center">
                By confirming, you agree to collect fuel within the booked time window.
              </p>

              <div className="flex gap-2">
                <button className="btn-secondary flex-1" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} className="inline" /> Edit
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={handleBook}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Spinner size={16} className="inline mr-2" /> : null}
                  {actionLoading ? 'Booking…' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
