import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const LogoPlaceholder = styled.div`
  text-align: center;
  font-weight: 600;
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <LogoPlaceholder>
        <Logo />
        <h1>Back To You</h1>
      </LogoPlaceholder>
      <MainNav />
    </StyledSidebar>
  );
}

export default Sidebar;
