import UserRow from "./UserRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import { useUserBalance } from "./useUserBalance";
import Form from "../../ui/Form";
import FormRow from "./../../ui/FormRow";
import Input from "./../../ui/Input";
import Button from "./../../ui/Button";
import { useAdjustFunds } from "./useAdjustFunds";
import { useState } from "react";
import Heading from "./../../ui/Heading";
import { useAssignRole } from "../authentication/useAssignRole";
import { ADMIN_ROLE, CUSTOMER_ROLE } from "../../utils/constants";

function UserTable() {
  const { isLoading, balance } = useUserBalance();
  const { isUpdating, adjustFunds } = useAdjustFunds();
  const { isLoading: isLoading2, assignRole } = useAssignRole();

  const [amount, setAmount] = useState("");

  const isActionLoading = isUpdating || isLoading2;

  if (isLoading)
    return (
      <>
        <Spinner />
        <Heading style={{ textAlign: "center" }} as="h3">
          Vui lòng nhập email tài khoản cần tìm!
        </Heading>
      </>
    );
  if (!balance.length) return <Empty resourceName="user" />;

  const { user } = balance[0];

  function handleAssignRole() {
    if (user.role === ADMIN_ROLE) {
      assignRole({ email: user.email, role: CUSTOMER_ROLE });
    } else {
      assignRole({ email: user.email, role: ADMIN_ROLE });
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (amount === "") return;

    adjustFunds({
      userId: balance[0].user.id,
      balance: parseFloat(amount),
    });

    setAmount("");
  }

  return (
    <Menus>
      <Table columns="2.4fr 1.6fr 1.4fr 1fr 1fr 1fr 3.2rem">
        <Table.Header>
          <div>User</div>
          <div>Phone</div>
          <div>Date Of Birth</div>
          <div>Sex</div>
          <div>Role</div>
          <div>Balance</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={balance}
          render={(item) => <UserRow key={item.user.id} data={item} />}
        />

        <Table.Footer>
          <Form onSubmit={onSubmit}>
            <FormRow label="">
              <>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isActionLoading}
                />
                <Button disabled={isActionLoading}>Add funds</Button>
                <Button onClick={handleAssignRole} disabled={isActionLoading}>
                  Assign to{" "}
                  {user.role === ADMIN_ROLE ? CUSTOMER_ROLE : ADMIN_ROLE}
                </Button>
              </>
            </FormRow>
          </Form>
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default UserTable;
