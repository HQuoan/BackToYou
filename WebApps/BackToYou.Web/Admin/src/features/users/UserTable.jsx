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
import { useAdjustFunds } from "./useadjustFunds";
import { useState } from "react";
import Heading from "./../../ui/Heading";

function UserTable() {
  const { isLoading, balance } = useUserBalance();
  const { isUpdating, adjustFunds } = useAdjustFunds();

  const [amount, setAmount] = useState("");

  if (isLoading)
    return (
      <>
        <Spinner />
        <Heading style={{textAlign: "center"}} as="h3">Vui lòng nhập email tài khoản cần tìm!</Heading>
      </>
    );
  if (!balance.length) return <Empty resourceName="user" />;

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
                  disabled={isUpdating}
                />
                <Button disabled={isUpdating}>Add funds</Button>
              </>
            </FormRow>
          </Form>
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default UserTable;
