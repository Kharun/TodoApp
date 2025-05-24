import styles from "./Modal.module.css";

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, onSubmit }) => {
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${styles.modal} ${isOpen && styles.active}`} onClick={handleModalClick}>
      <div className={styles.modal_content}>
        <h2 className={styles.modal_title}>{title}</h2>
        <div className={styles.modal_main}>{children}</div>
        <div className={styles.modal_btns}>
          <button className={styles.modal_btn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.modal_btn} onClick={onSubmit}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
