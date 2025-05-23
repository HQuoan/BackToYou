import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const StyledSearch = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  border: none;
  background: transparent;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.44rem 0.8rem;
  border-radius: var(--border-radius-sm);
  width: 100%;
  outline: none;

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

function SearchInput({ searchField = "search", placeholder = "Search..." }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(searchField) || "";
  const [value, setValue] = useState(initialValue);

  const prevValueRef = useRef(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const prevValue = prevValueRef.current;

      const hasValueChanged = prevValue !== value;

      if (value) {
        searchParams.set(searchField, value);
      } else {
        searchParams.delete(searchField);
      }

      if (hasValueChanged && searchParams.get("page")) {
        searchParams.set("page", 1);
      }

      prevValueRef.current = value;
      setSearchParams(searchParams);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, searchParams, searchField, setSearchParams]);

  return (
    <StyledSearch>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </StyledSearch>
  );
}

export default SearchInput;
