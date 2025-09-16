import moment from 'moment';

export const formToCron = (formData = {}) => {
  let cron;
  const {
    type,
    timePoint,
    dayPoint = [],
    dayTimePoint,
    datePoint = [],
    dateTimePoint,
  } = formData;
  switch (type) {
    case 0: {
      const time = timePoint
        ? moment(timePoint).format('HH:mm:ss').split(':').map(Number)
        : undefined;
      cron = time ? `${time[2]} ${time[1]} ${time[0]} * * ?` : '* * * * * ?';
      break;
    }
    case 1: {
      const time = dayTimePoint
        ? moment(dayTimePoint).format('HH:mm:ss').split(':').map(Number)
        : undefined;
      cron = time
        ? `${time[2]} ${time[1]} ${time[0]} ? * ${dayPoint.join(',')}`
        : `* * * ? * ${dayPoint.join(',') || '*'}`;
      break;
    }
    case 2: {
      const time = dateTimePoint
        ? moment(dateTimePoint).format('HH:mm:ss').split(':').map(Number)
        : undefined;
      cron = time
        ? `${time[2]} ${time[1]} ${time[0]} ${datePoint.join(',')} * ?`
        : `* * * ${datePoint.join(',') || '*'} * ?`;
      break;
    }
    default:
      break;
  }
  return cron;
};

// 快捷选择正则表达式匹配
const dayReg = /^(([0-9]|[1-5][0-9])\s){2}((1?[0-9]|2[0-3])\s)(\*\s){2}\?$/;
const weekReg = /^(([0-9]|[1-5][0-9])\s){2}((1?[0-9]|2[0-3])\s)\?\s\*\s([1-7](,[1-7])*)$/;
const monthReg = /^(([0-9]|[1-5][0-9])\s){2}((1?[0-9]|2[0-3])\s)(3[0-1]|[1-2]?[0-9])(,(3[0-1]|[1-2]?[0-9]))*\s\*\s\?$/;
export const cormToForm = (cron = '') => {
  const type = dayReg.test(cron)
    ? 0
    : weekReg.test(cron)
    ? 1
    : monthReg.test(cron)
    ? 2
    : undefined;
  if (type === undefined) return;
  const formData = { type };
  const [time2, time1, time0, day, month, week] = cron.split(' ');
  const time = moment(
    `${time0.padStart(2, '0')}${time1.padStart(2, '0')}${time2.padStart(
      2,
      '0',
    )}`,
    'HHmmss',
  );
  switch (type) {
    case 0:
      formData.timePoint = time;
      break;
    case 1:
      formData.dayTimePoint = time;
      formData.dayPoint = week.split(',').map((str) => parseInt(str, 10));
      break;
    case 2:
      formData.dateTimePoint = time;
      formData.datePoint = day.split(',').map((str) => parseInt(str, 10));
      break;
    default:
      break;
  }
  return formData;
};
