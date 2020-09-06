import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import firebase from "./firebase";

function Welcome() {
    return (
        <div>
            <h1>Schedule a COVID19 Test!</h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "25px",
                }}
            >
                <Button className="btn btn-light">
                    <Link to="/schedule">Click to login </Link>
                </Button>
            </div>
        </div>
    );
}

function NavBar() {
    return (
        <div className="header">
            <Navbar>
                <Navbar.Brand>Sched-Med</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: <strong>Mary Ben</strong>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
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

function Schedule() {
    const times = useTimes();

    function onClick(e) {
        console.log(e);
    }

    function color(freeslot) {
        if (freeslot < 3) {
            return "btn btn-danger";
        } else if (freeslot < 5) {
            return "btn btn-warning";
        } else {
            return "btn btn-primary";
        }
    }

    const timeslots = times.map((time) =>
        time.freeslot > 0 ? (
            <div
                key={time.id}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "25px",
                }}
            >
                <Button
                    className={color(time.freeslot)}
                    onClick={() => onClick(time.id)}
                >
                    <div>{unixToDateWindow(time.timeslot)}</div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        Location: {time.location}
                    </div>
                </Button>
            </div>
        ) : (
            <div></div>
        )
    );

    return (
        <div>
            <h2>{timeslots}</h2>
        </div>
    );
}

function App() {
    return (
        <div>
            <NavBar />
            <div className="centered">
                <Router>
                    <Route path="/" exact>
                        <Welcome />
                    </Route>
                    <Route path="/schedule" exact>
                        <Schedule />
                    </Route>
                </Router>
            </div>
        </div>
    );
}

export default App;
