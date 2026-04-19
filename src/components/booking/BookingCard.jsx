// ──────────────────────────────────────────────────────────
// src/components/booking/BookingCard.jsx
// Displays a single booking with cancel action
// ──────────────────────────────────────────────────────────
import { useState, memo } from 'react';
import { MapPin, Clock, Droplets, Hash, AlertTriangle } from 'lucide-react';
import { StatusBadge, Modal, Spinner } from '../ui';
import { useBookings } from '../../context/BookingsContext';

function BookingCard({ booking }) {
  const { cancel, actionLoading } = useBookings();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancel(booking.id);
      setConfirmOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  // Format Firestore timestamp or ISO string
  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <>
      <div className="card p-5 space-y-4 animate-fade-in hover:border-slate-700 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display font-bold text-slate-100 text-base">
              {booking.providerName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              #{booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { Icon: Clock,    label: 'Date & Time', value: `${booking.date} · ${booking.time}` },
            { Icon: Droplets, label: 'Fuel Type',   value: booking.fuelType },
            { Icon: Hash,     label: 'Quantity',    value: `${booking.quantity} ${booking.fuelType === 'LPG' ? 'cyl' : 'L'}` },
            { Icon: MapPin,   label: 'Booked on',   value: formatDate(booking.createdAt) },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="bg-slate-800/40 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1">
                <Icon size={10} />
                <span>{label}</span>
              </div>
              <p className="text-slate-200 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {booking.notes && (
          <p className="text-slate-500 text-xs italic bg-slate-800/40 px-3 py-2 rounded-xl">
            "{booking.notes}"
          </p>
        )}

        {/* Cancel CTA */}
        {canCancel && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="btn-danger w-full text-sm"
          >
            Cancel Booking
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Cancel Booking?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-amber-200 text-sm">
              This will free up the slot and restore stock. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary flex-1"
              onClick={() => setConfirmOpen(false)}
              disabled={cancelling}
            >
              Keep Booking
            </button>
            <button
              className="btn-danger flex-1"
              onClick={handleCancel}
              disabled={cancelling || actionLoading}
            >
              {cancelling ? <Spinner size={16} className="inline mr-1" /> : null}
              {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default memo(BookingCard);
