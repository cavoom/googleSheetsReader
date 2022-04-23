let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
console.log(nz_date_string);
//
// Date object initialized from the above datetime string
let date_nz = new Date(nz_date_string);

// year as (YYYY) format
let year = date_nz.getFullYear();

// month as (MM) format
let month = ("0" + (date_nz.getMonth() + 1)).slice(-2);

// date as (DD) format
let date = ("0" + date_nz.getDate()).slice(-2);

// hours as (HH) format
let hours = ("0" + date_nz.getHours()).slice(-2);

// minutes as (mm) format
let minutes = ("0" + date_nz.getMinutes()).slice(-2);

// seconds as (ss) format
let seconds = ("0" + date_nz.getSeconds()).slice(-2);

// date as YYYY-MM-DD format
let date_yyyy_mm_dd = year + "-" + month + "-" + date;
console.log("Date in YYYY-MM-DD format: " + date_yyyy_mm_dd);

// time as hh:mm:ss format
let time_hh_mm_ss = hours + ":" + minutes + ":" + seconds;
console.log("Time in hh:mm:ss format: " + time_hh_mm_ss);

// date and time as YYYY-MM-DD hh:mm:ss format
let date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
console.log("Date and Time in YYYY-MM-DD hh:mm:ss format: " + date_time);