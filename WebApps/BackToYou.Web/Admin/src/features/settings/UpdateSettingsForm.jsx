// import Form from "../../ui/Form";
// import FormRow from "../../ui/FormRow";
// import Input from "../../ui/Input";
// import Spinner from "../../ui/Spinner";
// import { useSettings } from "./useSettings";
// import { useUpdateSetting } from "./useUpdateSetting";

// function UpdateSettingsForm() {
//   const { isLoading, settings } = useSettings();

//   const { isUpdating, updateSetting } = useUpdateSetting();
//   if (isLoading) return <Spinner />;

//   function handleUpdate(e, postSettingId) {
//     const { value } = e.target;
//     updateSetting({ postSettingId, value });
//   }

//   return (
//     <Form>
//       {settings.map((setting) => (
//         <FormRow key={setting.postSettingId} label={setting.name}>
//           <Input
//             type="number"
//             id={setting.postSettingId}
//             defaultValue={setting.value}
//             disabled={isUpdating}
//             onBlur={(e) => handleUpdate(e, setting.postSettingId)}
//           />
//         </FormRow>
//       ))}
//     </Form>
//   );
// }

// export default UpdateSettingsForm;

import { useState, useRef } from "react";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const { isLoading, settings } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  // Store initial values in a ref to avoid re-renders
  const initialValuesRef = useRef({});
  const [inputValues, setInputValues] = useState({});

  // Initialize input values and store initial settings
  if (!Object.keys(initialValuesRef.current).length && settings) {
    const initial = settings.reduce((acc, setting) => {
      acc[setting.postSettingId] = setting.value;
      return acc;
    }, {});
    initialValuesRef.current = initial;
    setInputValues(initial);
  }

  if (isLoading) return <Spinner />;

  function handleUpdate(e, postSettingId) {
    const { value } = e.target;

    // Nếu không thay đổi thì không update
    if (value === initialValuesRef.current[postSettingId]) return;

    // Update the input value in state
    setInputValues((prev) => ({ ...prev, [postSettingId]: value }));

    // Perform the update
    updateSetting(
      { postSettingId, value },
      {
        onError: () => {
          // Reset to initial value on error
          setInputValues((prev) => ({
            ...prev,
            [postSettingId]: initialValuesRef.current[postSettingId],
          }));
        },
      }
    );
  }

  return (
    <Form>
      {settings.map((setting) => (
        <FormRow key={setting.postSettingId} label={setting.name}>
          <Input
            type="number"
            id={setting.postSettingId}
            value={inputValues[setting.postSettingId] ?? setting.value}
            disabled={isUpdating}
            onChange={(e) =>
              setInputValues((prev) => ({
                ...prev,
                [setting.postSettingId]: e.target.value,
              }))
            }
            onBlur={(e) => handleUpdate(e, setting.postSettingId)}
          />
        </FormRow>
      ))}
    </Form>
  );
}

export default UpdateSettingsForm;
