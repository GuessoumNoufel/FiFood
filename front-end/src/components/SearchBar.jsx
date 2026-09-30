import styled from "styled-components";

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 10px;
  padding: 4px 4px 4px 16px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-family: "Inter", sans-serif;
  font-size: 15px;
  padding: 10px 0;
  color: #2b2620;

  &::placeholder {
    color: #a69c8c;
  }
`;

const SearchButton = styled.button`
  background: #ff6f00;
  border: none;
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e8590c;
  }
`;

function SearchBar({ className, query, setQuery, handleSearch }) {
  return (
    <SearchForm className={className} onSubmit={handleSearch}>
      <SearchInput
        type="text"
        placeholder="Search for recipes, ingredients, or cuisines..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchButton type="submit">
        <svg
          className="h-8.5 w-8.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </SearchButton>
    </SearchForm>
  );
}

export default SearchBar;
