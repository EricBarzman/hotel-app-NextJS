import { FC, useEffect, useState } from "react"

type Props = {
    endValue: number;
    duration: number;
}

const CountUpNumber: FC<Props> = ({ endValue, duration }) => {

  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    
    function udpdateCount(timestamp: number) {
        if (!startTime)
            startTime = timestamp;
        
        const progress = timestamp - startTime;

        if (progress < duration) {
            setCount(Math.min(endValue, (progress/duration) * endValue));
            animationFrameId = requestAnimationFrame(udpdateCount);
        } else
            setCount(endValue);
    };

    animationFrameId = requestAnimationFrame(udpdateCount);
    return () => cancelAnimationFrame(animationFrameId);

  }, [endValue, duration])

  return (
    <p className="md:font-bold font-medium text-lg xl:text-5xl">
        {Math.round(count)}
    </p>
  )
}

export default CountUpNumber