// Toast.jsx
import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 2500);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-root">
      <div className="toast-box">{message}</div>
    </div>
  );
}
