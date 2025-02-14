// components/OtpModal.js
import { useEffect } from 'react';
import Modal from 'react-modal';

const OtpModal = ({ isOpen, onRequestClose, onOtpSubmit, otp, setOtp }) => {
  useEffect(() => {
    Modal.setAppElement('#__next'); // กำหนดให้ #__next เป็น appElement
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={true}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>กรุณากรอก OTP เพื่อยืนยันตัวตน</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="กรอก OTP"
        required
        className="input-otp"
      />
      <button onClick={onOtpSubmit}>ยืนยัน OTP</button>
    </Modal>
  );
};

export default OtpModal;
