('');
import * as React from 'react';

interface ILoadingProps {
  duration: number;
}

const Loading: React.FunctionComponent<ILoadingProps> = ({ duration }) => {
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      //setInterval function runs a piece of code repeatedly at a set time interval.
      //In this case, the interval is determined by dividing the total duration by 100.
      setProgress((prog) => {
        //If the progress reaches or exceeds 100%, the interval is cleared using clearInterval.
        //This prevents further updates and ensures the progress stays at 100%.
        if (prog >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prog + 1;
        //setProgress function updates the progress state. The state is increased incrementally by 1% on each interval.
      });
    }, duration / 100);
    return () => clearInterval(interval); //a cleanup function (return () => clearInterval(interval))
  }, [duration]);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <p className="text-2xl mb-4">Loading...</p>
      <div className="w-3/4 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full"
          style={{
            width: `${progress}%`,
            transition: 'width 0.1s ease-in-out',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
