import { Box, Typography, Skeleton } from '@mui/material';
import { Circle, CircleCheck, CircleDot } from 'lucide-react';

const TIMELINE_ORDER = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const statusIconMap = {
  PENDING: CircleDot,
  CONFIRMED: Circle,
  SHIPPED: Circle,
  DELIVERED: CircleCheck,
  CANCELLED: Circle,
};

const statusLabelMap = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const TimelineEntry = ({ status, timestamp, note, performedBy, isActive, isLast, isCancelled }) => {
  const Icon = statusIconMap[status] || Circle;
  const label = statusLabelMap[status] || status;
  const activeColor = isCancelled ? '#ef4444' : '#10b981';

  return (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative', pb: isLast ? 0 : 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: isActive || isCancelled ? `${activeColor}15` : '#f1f5f9',
            color: isActive || isCancelled ? activeColor : '#94a3b8',
            zIndex: 1,
          }}
        >
          <Icon size={14} />
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2, flex: 1, minHeight: 24,
              bgcolor: isActive ? activeColor : '#e2e8f0',
            }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, pb: isLast ? 0 : 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: isActive || isCancelled ? undefined : '#64748b' }}>
          {label}
        </Typography>
        {timestamp && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {formatDate(timestamp)}
          </Typography>
        )}
        {note && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {note}
          </Typography>
        )}
        {performedBy && performedBy !== 'System' && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            by {performedBy}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const TimelineSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 2, pb: 3 }}>
    <Skeleton variant="circular" width={28} height={28} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="rounded" width={100} height={16} sx={{ mb: 0.5 }} />
      <Skeleton variant="rounded" width={140} height={14} />
    </Box>
  </Box>
);

const OrderTimeline = ({ events, loading, currentStatus }) => {
  if (loading) {
    return (
      <Box>
        <TimelineSkeleton />
        <TimelineSkeleton />
        <TimelineSkeleton />
        <TimelineSkeleton />
      </Box>
    );
  }

  if (!events || events.length === 0) {
    const isCancelled = currentStatus === 'CANCELLED';
    const currentIdx = TIMELINE_ORDER.indexOf(currentStatus);

    return (
      <Box>
        {TIMELINE_ORDER.map((s, i) => (
          <TimelineEntry
            key={s}
            status={s}
            isActive={i <= currentIdx && !isCancelled}
            isLast={i === TIMELINE_ORDER.length - 1}
            isCancelled={isCancelled && i === currentIdx}
          />
        ))}
        {isCancelled && currentIdx < 0 && (
          <TimelineEntry
            status="CANCELLED"
            isActive
            isLast
            isCancelled
          />
        )}
      </Box>
    );
  }

  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <Box>
      {events.map((entry, i) => {
        const isLastEvent = i === events.length - 1;
        const isActive = !isCancelled;

        if (entry.status === 'CANCELLED') {
          return (
            <TimelineEntry
              key={entry.id}
              status="CANCELLED"
              timestamp={entry.timestamp}
              note={entry.note}
              performedBy={entry.performedBy}
              isActive
              isLast={isLastEvent}
              isCancelled
            />
          );
        }

        return (
          <TimelineEntry
            key={entry.id}
            status={entry.status}
            timestamp={entry.timestamp}
            note={entry.note}
            performedBy={entry.performedBy}
            isActive={isActive}
            isLast={isLastEvent}
          />
        );
      })}
    </Box>
  );
};

export default OrderTimeline;
