A date picker for your React app.

## ✨ Features
* Pick days, months, years, or even decades
* No moment.js/day,js needed

## 📦Install

```sh
npm react-alldate-picker
```

## 🔨Usage
```sh
import React, { useState } from "react";
import { DatePicker } from "react-alldate-picker";

const Test = () => {

    const [value, setValue] = useState(new Date())

    const handleOnChange = (timestamp) => {
        console.log("timestamp", timestamp)
    }

    return (
        <div>
            <DatePicker 
                onChange={handleOnChange}
                value={value}
            />
        </div>
    )
}

export default Test
```

## User guide

### DatePicker

### Props

| Prop name	 | Description | Default value | Example values |
| --- | --- | --- | --- |
| onChange | Function called when the user picks a valid date. | n/a | (timestamp) => console.log(timestamp) |
| minDate | Minimum date that the user can select. Periods partially overlapped by minDate will also be selectable. | new Date("0001-01-01") | Date: new Date() |
| maxDate | Maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable. | new Date("9999-12-31") | Date: new Date() |
| value | Input value.  | n/a | Date: new Date(2023, 12, 08) |
| icon | Content of the calendar button. Setting the value explicitly to null will hide the icon.  | (default icon) | React element: <CalendarIcon /> |
| footer | footer of the calendar. Setting the value explicitly to null will hide the footer.  | (default footer) | React element: <CalendarIcon /> |
| onClose | Function called when the user closed the picker.  | n/a | () => console.log("onClose") |
| placeholder | placeholder for the day input.  | "selecte date" | "select" |