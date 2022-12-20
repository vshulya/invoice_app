import React, { useState} from "react";
// import Calendar from 'react-calendar';
// // import 'react-calendar/dist/Calendar.css'
// import './DatePicker.css';

// export interface Props {
//   isOpen: boolean;
// }

// function DatePicker(props: PropsWithChildren<Props>) {

// 	return (
// 		<div className={`date-picker ${props.isOpen && "date-picker_opened"}`}>
// 			<Calendar />
// 		</div>
// 	)
// }

// export default DatePicker;

interface Props {
  // props go here
}

// const DatePicker: React.FC<Props> = (props) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [month, setMonth] = useState(selectedDate.getMonth());
//   const [day, setDay] = useState(selectedDate.getDate());
//   const [year, setYear] = useState(selectedDate.getFullYear());

//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   const days = [];
//   for (let i = 1; i <= 31; i++) {
//     days.push(i);
//   }
//   const years = [];
//   for (let i = 1900; i <= 2100; i++) {
//     years.push(i);
//   }

// 	const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		setMonth(parseInt(e.target.value, 10));
// 	};

//   const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setDay(parseInt(e.target.value, 10));
//   };

//   const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setYear(parseInt(e.target.value, 10));
//   };

//   const handleDateChange = () => {
//     const newDate = new Date(year, month, day);
//     setSelectedDate(newDate);
//   };

//   return (
//     <div>
//       <p>Current date: {selectedDate.toDateString()}</p>
//       <label>Month:</label>
//       <select value={month} onChange={handleMonthChange}>
//         {months.map((month, index) => (
//           <option key={month} value={index}>{month}</option>
//         ))}
//       </select>
//       <label>Day:</label>
//       <select value={day} onChange={handleDayChange}>
//         {days.map((day) => (
//           <option key={day} value={day}>{day}</option>
//         ))}
//       </select>
//       <label>Year:</label>
//       <select value={year} onChange={handleYearChange}>
//         {years.map((year) => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//       <button onClick={handleDateChange}>Update</button>
//     </div>
//   );
// };

// export default DatePicker;

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div>
      <label>Date:</label>
      <input type="date" value={selectedDate.toISOString().substr(0, 10)} onChange={handleDateChange} />
    </div>
  );
}

export default DatePicker;