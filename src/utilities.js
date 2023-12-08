import { daysMap, todayTimestamp, monthMap } from "./constants";

export const getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
};

export const getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }
    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    let _date =
        (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let dateObj = new Date(args.year, args.month + month, _date);
    let timestamp = dateObj.getTime();
    return {
        date: _date,
        day,
        month,
        timestamp,
        dayString: daysMap[day],
        dateObj,
    };
};

export const getMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            currentDay = getDayDetails({
                index,
                numberOfDays,
                firstDay,
                year,
                month,
            });
            monthArray.push(currentDay);
            index++;
        }
    }
    return monthArray;
};
export const isCurrentDay = (day) => {
    const current = new Date(day).setHours(0, 0, 0, 0);
    const today = new Date(todayTimestamp).setHours(0, 0, 0, 0);
    return current === today;
};
export const isSelectedDay = (day, targetDay) => {
    const newDay = new Date(day).setHours(0, 0, 0, 0);
    const newTargetDay = new Date(targetDay).setHours(0, 0, 0, 0);
    return newDay === newTargetDay;
};

export const getDateStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return (
        dateObject.getFullYear() +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date)
    );
};

export const getMonthStr = (month) => {
    return monthMap[Math.max(Math.min(11, month), 0)] || "Month";
};

export const getDateFromDateString = (dateValue) => {
    let dateData = dateValue.split("-").map((d) => parseInt(d, 10));
    if (dateData.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date };
};

export const isSameDate = (day, targetDay) => {
    const date_1 = getDateStringFromTimestamp(day.getTime());
    const date_2 = getDateStringFromTimestamp(targetDay.getTime());
    return date_1 === date_2;
};
