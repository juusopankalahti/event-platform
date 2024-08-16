import { ChangeEvent, useContext, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { EventContext } from "@/context/EventContext";

interface Props {
  onLogin: (code: string) => void;
}

const Login = (props: Props) => {
  const context = useContext(EventContext);
  const { onLogin } = props;

  const [code, setCode] = useState("");

  return (
    <main className="flex min-h-screen h-screen flex-col justify-stretch bg-wf-dark-violet p-4 lg:p-16">
      <div className="px-8 py-16 lg:p-24 flex flex-1 flex-col items-center w-full z-10 bg-white rounded text-center h-full overflow-y-auto">
        <img
          src={context.event?.logo}
          className="w-32 mt-2 lg:w-40 h-auto mb-16 lg:mt-8 rounded"
        />
        <h1 className="text-xl font-bold">Welcome to {context.event?.name}</h1>
        <p className="text-gray-600 mt-2 mb-2 text-sm">
          Please write your personal login code to the field below. The code is
          found in the e-mail you received.
        </p>
        <Input
          placeholder="Enter code here..."
          className="mt-4 mb-6 text-center max-w-sm"
          value={code}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value.toUpperCase())
          }
        />
        <Button onClick={() => onLogin(code)} disabled={!code}>
          Log in
        </Button>
      </div>
    </main>
  );
};

export default Login;
