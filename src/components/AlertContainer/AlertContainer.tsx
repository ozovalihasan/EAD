import { useStore } from '@/zustandStore';
import { Alert } from '@/components';

export const AlertContainer = () => {
  const alertMessages = useStore(state => state.alertMessages);

  return (
    <div className="fixed z-20 max-w-1/3 left-2/3 transform right-0 bottom-3 flex flex-col gap-5 pr-8">
      {Object.keys(alertMessages)
        .reverse()
        .map(id => {
          const alert = alertMessages[id];

          return (
            <Alert key={id} id={id} type={alert.type} message={alert.message} />
          );
        })}
    </div>
  );
};
