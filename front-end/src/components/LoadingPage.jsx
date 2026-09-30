import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 48vh;
  display: grid;
  place-items: center;
  padding: 3.2rem;
`;

const Spinner = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border: 0.5rem solid #f0dfcb;
  border-top-color: #c85c16;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

function LoadingPage({ message = "Loading" }) {
  return (
    <Container role="status" aria-live="polite">
      <Spinner aria-label={message} />
      <span className="sr-only">{message}</span>
    </Container>
  );
}

export default LoadingPage;
