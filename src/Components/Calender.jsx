import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Components/calendar.scss";

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotStatus, setSlotStatus] = useState({});

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newSlotStatus = generateSlotsForDate(selectedDate);

    setSlotStatus({
      ...slotStatus,
      [formattedDate]: newSlotStatus,
    });
  }, [selectedDate]);

  const generateRandomTime = () => {
    const startHour = 8;
    const endHour = 17;

    const hours =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;

    const minutesOptions = [0, 15, 30, 45];
    const minutes =
      minutesOptions[Math.floor(Math.random() * minutesOptions.length)];

    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;
  };

  const generateSlotsForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const slots = [];

    const numberOfSlots = Math.floor(Math.random() * 12) + 1;

    const sortedTimeSlots = Array.from({ length: numberOfSlots }, () =>
      generateRandomTime()
    )
      .filter((time) => isWithinTimeRange(time, "08:00", "17:00"))
      .sort();

    for (let i = 0; i < sortedTimeSlots.length; i++) {
      const randomTime = sortedTimeSlots[i];
      const isUnavailable = Math.random() < 0.2; 

      let slotDuration = 1; 

      if (isUnavailable) {
        slotDuration = 2;
      }

      slots.push({
        time: randomTime,
        status: isUnavailable ? "unavailable" : "available",
        duration: slotDuration,
      });
    }

    return {
      status: "default",
      slots,
    };
  };

  const isWithinTimeRange = (time, startTime, endTime) => {
    return time >= startTime && time <= endTime;
  };

  const renderSelectedDateSlots = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const dayInfo = slotStatus[formattedDate];

    if (dayInfo) {
      const unavailableSlots = dayInfo.slots.filter(
        (slot) => slot.status === "unavailable"
      );
      console.log("Unavailable Slots:", unavailableSlots);
      const availableSlots = dayInfo.slots.filter(
        (slot) => slot.status === "available"
      );
      console.log("available Slots:", availableSlots);
      const slotsElements = availableSlots.map((slot, index) => (
        <span
          key={index}
          className={`${slot.status === "unavailable" ? "available" : ""} ${
            slot.duration === 2 ? "two-hours" : ""
          }`}
        >
          {slot.time} {index < dayInfo.slots.length - 1}
        </span>
      ));

      return (
        <div className={`selected-date-info ${dayInfo.status}`}>
          {slotsElements.map((item, index) => (
            <p
              key={index}
              style={{
                border: "1px solid red",
                background: "green",
                padding: "10px",
              }}
            >
              {item}
            </p>
          ))}
          {unavailableSlots.map((ite) => (
            <p
              style={{
                border: "1px solid green",
                background: "red",
                padding: "10px",
              }}
            >
              {ite.time}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="calendar">
      <div className="calendar-left">
        <Calendar onChange={handleDateChange} value={selectedDate} />
      </div>
      <div className="calendar-right">{renderSelectedDateSlots()}</div>
    </div>
  );
};

export default MyCalendar;
