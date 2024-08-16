import { HTMLProps } from "react";
import { CircularProgress } from "@mui/material";

interface Props extends HTMLProps<HTMLButtonElement> {
  secondary?: boolean;
  loading?: boolean;
}

const Button = (props: Props) => {
  const { children, type, className, secondary, color, loading, ...other } =
    props;

  return (
    <button
      className={`rounded bg-wf-violet hover:bg-fuchsia-950 active:bg-wf-violet/80 px-4 py-2 text-white disabled:opacity-50 flex items-center justify-center relative ${
        secondary ? `!bg-transparent ${color || "!text-wf-violet"}` : ""
      } ${className}`}
      {...other}
      disabled={loading || other.disabled}
    >
      <div className={loading ? "opacity-0" : ""}>{children}</div>
      {loading && (
        <div className="absolute w-full h-full flex items-center justify-center">
          <CircularProgress style={{ color: "white", width: 20, height: 20 }} />
        </div>
      )}
    </button>
  );
};

export default Button;
