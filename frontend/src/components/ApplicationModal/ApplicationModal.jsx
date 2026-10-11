import ApplicationForm from '../ApplicationForm/ApplicationForm';
import Modal from '../Modal/Modal';

function ApplicationModal(props) {
  const {
    isOpen, onClose, applicationType, subject
  } = props;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Оставить заявку"
    >
      <ApplicationForm
        applicationType={applicationType}
        subject={subject}
      />
    </Modal>
  )
}

export default ApplicationModal;