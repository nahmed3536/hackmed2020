import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import firebase from "../firebase";

function useTimes() {
    const [times, setTimes] = useState([]);
    useEffect(() => {
        const unsubscribe = firebase
            .firestore()
            .collection("times")
            .orderBy("timeslot", "asc")
            .onSnapshot((snapshot) => {
                const newTimes = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTimes(newTimes);
            });
        return () => unsubscribe();
    }, []);
    return times;
}

function unixToDateWindow(timestamp_start) {
    // visiting period
    var time_window_minutes = 20;
    // calculating end date time in unix

    // converts to AM/PM time
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
    }

    // extracts date/time
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp_start * 1000);
    // get the month
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    var month = months[date.getMonth()];
    // get the day
    var day = date.getDate();
    // get the day of the week
    var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    var dayOfWeek = daysOfWeek[date.getDay()];
    var formattedTime_start = formatAMPM(date);

    var date_end = date;
    date_end.setMinutes(date_end.getMinutes() + time_window_minutes);
    var formattedTime_end = formatAMPM(date_end);

    var dateTime =
        dayOfWeek +
        " " +
        month +
        ", " +
        day +
        " : " +
        formattedTime_start +
        " - " +
        formattedTime_end;
    return dateTime;
}
function Timeslot() {
    const times = useTimes();
    const timeslots = times.map((time) => (
        <div key={time.id}>{unixToDateWindow(time.timeslot)}</div>
    ));

    return (
        <div className="centered">
            <h2>{timeslots}</h2>
        </div>
    );
}

export default Timeslot;

const Wrapper = Styled.section`
.centered {
  height: 100vh; /* Magic here */
  display: flex;
  justify-content: center;
  align-items: center;
}
`;
