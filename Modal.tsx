import React, { useEffect } from 'react';
import { XIcon } from './components';

// FIX: Made the 'children' prop optional to fix TypeScript error where it was incorrectly reported as missing.
const Modal = ({ show, onClose, title, children }: { show: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (show) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 id="modal-title" className="modal-title">{title}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
                        <XIcon />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
