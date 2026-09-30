import styled from "styled-components";
import { useEffect } from "react";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(30, 27, 24, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Box = styled.div`
  background: #fff;
  border-radius: 2rem;
  padding: 2.5rem;
  max-width: 50rem;
  width: 100%;
  font-family: "Inter", sans-serif;
  text-align: center;
  box-shadow: 0 20px 60px rgba(43, 38, 32, 0.2);
  animation: slideUp 0.25s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Icon = styled.div`
  width: 4.2rem;
  height: 4.2rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #fff1eb;
  color: #ff0000d8;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 23px;
    height: 23px;
  }
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 1.7rem;
  font-weight: 600;
  color: #2b2620;
`;

const Message = styled.p`
  font-size: 1.3rem;
  color: #756d63;
  margin: 0 0 1.6rem;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 1.4rem;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  border: 1px solid #e5ddd2;
  background: #fff;
  color: #4a4238;

  &:hover {
    background: #f8f4ef;
    border-color: #d8cfc3;
  }
`;

const DeleteButton = styled(Button)`
  border: none;
  background: #c0392b;
  color: #fff;
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.2);

  &:hover {
    background: #a93226;
    box-shadow: 0 6px 16px rgba(192, 57, 43, 0.28);
  }
`;

function ConfirmModal({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key == "Escape") onCancel();
    };
    const handleKeyDownAccept = (e) => {
      if (e.key == "Enter") {
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDownAccept);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleKeyDownAccept);
    };
  }, [onCancel, onConfirm]);

  return (
    <Overlay onClick={onCancel}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.007v.008H12v-.008ZM10.29 3.86 2.82 17.25A1.75 1.75 0 0 0 4.34 20h15.32a1.75 1.75 0 0 0 1.52-2.75L13.71 3.86a1.97 1.97 0 0 0-3.42 0Z"
            />
          </svg>
        </Icon>

        <Title>Delete recipe?</Title>

        <Message>{message}</Message>

        <Actions>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
        </Actions>
      </Box>
    </Overlay>
  );
}

export default ConfirmModal;
