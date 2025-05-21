import styled from "styled-components";
import Table from "../../ui/Table";

import { formatVndCurrency } from "../../utils/helpers";
import { format } from "date-fns";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const InfoCell = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-700);
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function UserRow({ data }) {
  const { user, wallet } = data;

  return (
    <Table.Row>
      <Stacked>
        <span>{user.fullName}</span>
        <span>{user.email}</span>
      </Stacked>

      <InfoCell>{user.phoneNumber} </InfoCell>
      <InfoCell>{format(new Date(user.dateOfBirth), "MMM dd yyyy")}</InfoCell>
      <InfoCell>{user.sex}</InfoCell>
      <InfoCell>{user.role}</InfoCell>

      <Amount>{formatVndCurrency(wallet.balance)}</Amount>
    </Table.Row>
  );
}

export default UserRow;
