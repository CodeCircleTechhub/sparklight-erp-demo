import { useState } from 'react';
import { CalendarOff } from 'lucide-react';
import ApplyLeaveModal from './ApplyLeaveModal';

interface ApplyLeaveButtonProps {
  className?: string;
  label?: string;
  onSubmitted?: () => void;
}

export default function ApplyLeaveButton({
  className = 'inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors',
  label = 'Apply for Leave',
  onSubmitted,
}: ApplyLeaveButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <CalendarOff className="w-4 h-4" />
        {label}
      </button>
      <ApplyLeaveModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmitted={onSubmitted}
      />
    </>
  );
}
