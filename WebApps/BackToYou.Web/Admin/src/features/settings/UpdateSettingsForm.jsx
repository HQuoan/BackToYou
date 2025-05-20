import toast from "react-hot-toast";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const { isLoading, settings } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();
  if (isLoading) return <Spinner />;

  function handleUpdate(e, postSettingId) {
    const valueValidate = Number(e.target.value);

    if (isNaN(valueValidate) || valueValidate < 10000) {
      toast.error("Giá trị phải lớn hơn 10000");
      return;
    }

    const { value } = e.target;
    // if (!value) return;
    updateSetting({ postSettingId, value });
  }

  return (
    <Form>
      {settings.map((setting) => (
        <FormRow key={setting.postSettingId} label={setting.name}>
          <Input
            type="number"
            id={setting.postSettingId}
            defaultValue={setting.value}
            disabled={isUpdating}
            onBlur={(e) => handleUpdate(e, setting.postSettingId)}
          />
        </FormRow>
      ))}
    </Form>
  );
}

export default UpdateSettingsForm;
