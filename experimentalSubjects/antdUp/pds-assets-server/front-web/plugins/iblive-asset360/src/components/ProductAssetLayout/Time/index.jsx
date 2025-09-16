import { useEffect, useState, memo } from 'react';
import moment from 'moment';

const Time = () => {
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  useEffect(() => {
    let timeInterval;
    const createInterVal = () => {
      timeInterval = setInterval(() => {
        setTime(moment().format('YYYY-MM-DD HH:mm:ss'));
      }, 1000);
    };
    createInterVal();
    return () => {
      clearInterval(timeInterval);
    };
  }, []);
  return (
    <div>
      <span>{time}</span>
    </div>
  );
};

export default memo(Time);
