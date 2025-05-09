import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ServerErrorContext = createContext();

function ServerErrorProvider({ children, initialErrors = {} }) {
  const [serverErrors, setServerErrors] = useState({});

  // Khi initialErrors thay đổi (do response mới), cập nhật lại state
  useEffect(() => {
    if (initialErrors && Object.keys(initialErrors).length > 0) {
      setServerErrors(initialErrors);
    }
  }, [initialErrors]);

  const setErrors = (errors) => {
    setServerErrors(errors);
  };

  const value = useMemo(() => {
    return {
      serverErrors,
      setErrors,
    };
  }, [serverErrors]);

  return (
    <ServerErrorContext.Provider value={value}>
      {children}
    </ServerErrorContext.Provider>
  );
}

function useServerErrors() {
  const context = useContext(ServerErrorContext);
  if (context === undefined) {
    throw new Error("useServerErrors must be used within a ServerErrorProvider");
  }
  return context;
}

export { ServerErrorProvider, useServerErrors };
