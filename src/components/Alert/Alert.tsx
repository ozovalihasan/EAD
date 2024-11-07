import { clsx } from "clsx";
import { useStore } from "@/zustandStore";
import { useEffect, useState } from "react";
import { XMark } from "@/icons";

export const Alert = ({id, message, type}: {id: string, message: string, type: "success" | "error"}) => {
  const transitionTime = 1000;
  const showingTime = 5000;
  
  const deleteAlert = useStore(store => store.deleteAlert)
  const handleDeleteAlert = () => {
    setStatus("end");

    setTimeout(() => {
      deleteAlert(id)
    }, transitionTime);

  };

  const [status, setStatus] = useState<"start" | "shown" | "end">("start")

  
  useEffect(() => {
      const startTimer = setTimeout(() => {
        setStatus("shown")
      }, 0);

      const shownTimer = setTimeout(() => {
        setStatus("end")
      }, transitionTime + showingTime);
      
      const endTimer = setTimeout(() => {
        deleteAlert(id)
      }, transitionTime + showingTime + transitionTime);

      return () => {
        clearTimeout(startTimer); clearTimeout(shownTimer); clearTimeout(endTimer)
      };
  }, []);


  return (
    <div 
      className={
        clsx(`transition-all duration-${transitionTime} z-20 w-full flex  rounded-md p-4 border-l-8  border-solid`, 
          {
            "bg-error-500 border-error-700": type === "error", 
            "bg-success-500 border-success-700": type === "success",
            "translate-x-0": status === "shown",
            "translate-x-[110%]": status === "end" || status === "start",
          }
        )
      }
      
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="mr-2"
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 10.9794C11 10.4271 11.4477 9.97937 12 9.97937C12.5523 9.97937 13 10.4271 13 10.9794V16.9794C13 17.5317 12.5523 17.9794 12 17.9794C11.4477 17.9794 11 17.5317 11 16.9794V10.9794Z"
          fill="currentColor"
        />
        <path
          d="M12 6.05115C11.4477 6.05115 11 6.49886 11 7.05115C11 7.60343 11.4477 8.05115 12 8.05115C12.5523 8.05115 13 7.60343 13 7.05115C13 6.49886 12.5523 6.05115 12 6.05115Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
          fill="currentColor"
        />
      </svg>
      <div className="w-full font-bold">
        {message}      
      </div>

      <button onClick={handleDeleteAlert}>
        <div className="stroke-current stroke-[40] w-3 h-3">
          <XMark />
        </div>
      </button>
    </div>
  );
}