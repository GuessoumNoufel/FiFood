import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 0;
  font-family: "Inter", sans-serif;
`;

const Arrow = styled.button`
  background: none;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  color: #2b2620;
  cursor: pointer;

  &:disabled {
    color: #c4baaa;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #f5efe4;
  }
`;

const PageButton = styled.button`
  background: ${(props) => (props.$active ? "#C1592A" : "none")};
  color: ${(props) => (props.$active ? "#fff" : "#2B2620")};
  border: 1px solid ${(props) => (props.$active ? "#C1592A" : "#E8E0D4")};
  border-radius: 8px;
  width: 36px;
  height: 36px;
  font-size: 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? "#A64A22" : "#F5EFE4")};
  }
`;

const Ellipsis = styled.span`
  color: #a69c8c;
  padding: 0 4px;
`;

function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Bar>
      <Arrow
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </Arrow>

      {pageNumbers.map((page, i) => {
        const prevPage = pageNumbers[i - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <span key={page} style={{ display: "flex", alignItems: "center" }}>
            {showEllipsis && <Ellipsis>...</Ellipsis>}
            <PageButton
              $active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          </span>
        );
      })}

      <Arrow
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </Arrow>
    </Bar>
  );
}

export default Pagination;
