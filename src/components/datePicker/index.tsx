import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import "./DatePicker.css";
import { todayTimestamp } from "../../constants.js";
import {
    isCurrentDay,
    isSelectedDay,
    getDateStringFromTimestamp,
    getMonthDetails,
    getMonthStr,
    getDateFromDateString,
    isSameDate,
} from "../../utilities.js";
import { ArrowDoubleLeftIcon, CalendarIcon, ArrowLeftIcon, ArrowRightIcon, ArrowDoubleRightIcon } from "../Icon.jsx"

const today = new Date();

const Calendar = ({
    monthDetails,
    onSelected,
    selectedDate,
    minDateData,
    maxDateData,
    selectedYear,
    selectedMonth,
    disabledDate,
}) => {
    return (
        <div className="c-container">
            <div className="cc-head">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
                    <div key={i} className="cch-name">
                        {d}
                    </div>
                ))}
            </div>
            <div className="cc-body">
                {monthDetails.map((day, index) => {
                    return (
                        <div
                            className={
                                "c-day-container " +
                                (day.month !== 0 ||
                                    selectedYear < minDateData.year ||
                                    selectedYear > maxDateData.year ||
                                    (selectedYear === minDateData.year &&
                                        selectedMonth + 1 < minDateData.month) ||
                                    (selectedYear === maxDateData.year &&
                                        selectedMonth + 1 > maxDateData.month) ||
                                    (selectedYear === minDateData.year &&
                                        selectedMonth + 1 === minDateData.month &&
                                        day.date < minDateData.date) ||
                                    (selectedYear === maxDateData.year &&
                                        selectedMonth + 1 === maxDateData.month &&
                                        day.date > maxDateData.date) ||
                                    disabledDate.some((value) => isSameDate(value, day.dateObj))
                                    ? " disabled"
                                    : "") +
                                (isSelectedDay(day.timestamp, selectedDate) ? " highlight-selected" : isCurrentDay(day.timestamp) ? " highlight" : "")
                            }
                            key={index}
                        >
                            <div className="cdc-day">
                                <span onClick={() => onSelected(day.timestamp)}>{day.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const DatePicker = (props) => {
    const {
        onChange,
        minDate = new Date("0001-01-01"),
        maxDate = new Date("9999-12-31"),
        value,
        disabledDate = [],
        icon,
        footer,
        onClose,
        placeholder = "selecte date"
    } = props;

    const ref = useRef(null);
    const inputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState(todayTimestamp);
    const [monthDetail, setMonthDetail] = useState(getMonthDetails(year, month));

    const minDateData = useMemo(() => {
        return {
            year: parseInt(minDate.getFullYear(), 10),
            month: parseInt(minDate.getMonth() + 1, 10),
            date: parseInt(minDate.getDate(), 10)
        };
    }, [minDate]);

    const maxDateData = useMemo(() => {
        return {
            year: parseInt(maxDate.getFullYear(), 10),
            month: parseInt(maxDate.getMonth() + 1, 10),
            date: parseInt(maxDate.getDate(), 10)
        };
    }, [maxDate]);

    const addBackDrop = (e) => {
        if (isOpen && !ReactDOM.findDOMNode(ref.current).contains(e.target)) {
            closePicker();
        }
    };

    const openPicker = () => {
        setIsOpen(true);
    };

    const closePicker = () => {
        setIsOpen(false);
        if (onClose) {
            onClose()
        }
    };

    const onDateClick = (timestamp) => {
        setSelectedDay(timestamp);
        setDateToInput(timestamp);
        if (onChange) {
            onChange(timestamp);
        }
    };

    const setDateToInput = (timestamp) => {
        let dateString = getDateStringFromTimestamp(timestamp);
        inputRef.current.value = dateString;
    };

    const changeYear = (offset) => {
        let newYear = year + offset;
        let newMonth = month;
        setYear(newYear);
        setMonthDetail(getMonthDetails(newYear, newMonth));
    };

    const changeMonth = (offset) => {
        let newYear = year;
        let newMonth = month + offset;
        if (newMonth === -1) {
            newMonth = 11;
            newYear--;
        } else if (newMonth === 12) {
            newMonth = 0;
            newYear++;
        }
        setYear(newYear);
        setMonth(newMonth);
        setMonthDetail(getMonthDetails(newYear, newMonth));
    };

    const changeDate = (dateData) => {
        let newSelectedDay = new Date(
            dateData.year,
            dateData.month - 1,
            dateData.date
        ).getTime();
        setSelectedDay(newSelectedDay);
        if (onChange) {
            onChange(newSelectedDay);
        }
    };

    const updateDateFromInput = (dateValue) => {
        let dateData = getDateFromDateString(dateValue);
        if (dateData !== null) {
            changeDate(dateData);
            setYear(dateData.year);
            setMonth(dateData.month - 1);
            setMonthDetail(getMonthDetails(dateData.year, dateData.month - 1));
        }
    };

    const switchToDate = (timestamp) => {
        const dateObj = new Date(timestamp)
        const year = dateObj.getFullYear()
        const month = dateObj.getMonth()
        setYear(year)
        setMonth(month)
        setMonthDetail(getMonthDetails(year, month));
    }

    useEffect(() => {
        if (value) {
            const timestamp = value.getTime()
            switchToDate(timestamp)
            setSelectedDay(timestamp);
            setDateToInput(timestamp);
        }
    }, [value])

    useEffect(() => {
        window.addEventListener("click", addBackDrop);
        return () => {
            window.removeEventListener("click", addBackDrop);
        };
    }, [isOpen]);

    return (
        <div ref={ref} className="DatePicker">
            <div className="mdp-input" onClick={openPicker}>
                <input
                    type="text"
                    ref={inputRef}
                    onChange={(e) => updateDateFromInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            closePicker();
                        }
                    }}
                    placeholder={placeholder}
                />
                <div className="mdp-input-icon">
                    {icon || icon === null ? (
                        <>
                            {icon}
                        </>
                    ) : (
                        <CalendarIcon />
                    )}
                </div>
            </div>
            <div className={isOpen ? "mdp-container" : "mdp-container-hidden"}>
                <div className="mdpc-head">
                    <div className="mdpch-button">
                        <div
                            className={
                                "mdpchb-inner" +
                                (year - 1 < minDateData.year ? " button-disable" : "")
                            }
                            onClick={() => changeYear(-1)}
                        >
                            <span
                                className={(year - 1 < minDateData.year ? " arrow-disable" : "")}
                            >
                                <ArrowDoubleLeftIcon />
                            </span>
                        </div>
                    </div>
                    <div className="mdpch-button">
                        <div
                            className={
                                "mdpchb-inner" +
                                (year <= minDateData.year && month < minDateData.month
                                    ? " button-disable"
                                    : "")
                            }
                            onClick={() => changeMonth(-1)}
                        >
                            <span
                                className={(year <= minDateData.year && month < minDateData.month
                                    ? " arrow-disable"
                                    : "")}
                            >
                                <ArrowLeftIcon />
                            </span>
                        </div>
                    </div>
                    <div className="mdpch-container">
                        <div className="mdpchc-year">{year}</div>
                        <div className="mdpchc-month">{getMonthStr(month)}</div>
                    </div>
                    <div className="mdpch-button">
                        <div
                            className={
                                "mdpchb-inner" +
                                (year >= maxDateData.year && month + 1 >= maxDateData.month
                                    ? " button-disable"
                                    : "")
                            }
                            onClick={() => changeMonth(1)}
                        >
                            <span
                                className={(year >= maxDateData.year && month + 1 >= maxDateData.month
                                    ? " arrow-disable"
                                    : "")}
                            >
                                <ArrowRightIcon />
                            </span>
                        </div>
                    </div>
                    <div className="mdpch-button">
                        <div
                            className={
                                "mdpchb-inner" +
                                (year + 1 > maxDateData.year ? " button-disable" : "")
                            }
                            onClick={() => changeYear(1)}
                        >
                            <span
                                className={(year + 1 > maxDateData.year ? " arrow-disable" : "")}
                            >
                                <ArrowDoubleRightIcon />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mdpc-body">
                    <Calendar
                        monthDetails={monthDetail}
                        onSelected={onDateClick}
                        selectedDate={selectedDay}
                        minDateData={minDateData}
                        maxDateData={maxDateData}
                        selectedYear={year}
                        selectedMonth={month}
                        disabledDate={disabledDate}
                    />
                </div>
                {footer || footer === null ? (
                    <>{footer}</>
                ) : (
                    <div className="mdpc-footer" onClick={() => {
                        onDateClick(today.getTime())
                        switchToDate(today.getTime())
                    }}>
                        Today
                    </div>
                )}
            </div>
        </div>
    );
};