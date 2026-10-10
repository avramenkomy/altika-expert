import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import './Modal.scss';

function Modal(props) {
  const { open, onClose, title, children } = props;

  const dialogRef = useRef();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  } , [open]);

  const handleBackDropClick = event => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={handleBackDropClick}
    >
      <div className="modal__content">
        <button
          type="button"
          className="modal__close"
          aria-label="Закрыть окно"
          onClick={() => dialogRef.current?.close()}
        >
          <X />
        </button>

        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>

        {children}
      </div>
    </dialog>
  )
}

export default Modal;