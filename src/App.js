import React from 'react';

const getMondaySunday = (date) => {
  const newDate = new Date(date)
  const weekDay = newDate.getDay();
  const daysSinceMonday = weekDay === 0 ? 6 : weekDay - 1;

  const mondayMs = newDate.setDate(newDate.getDate() - daysSinceMonday);
  const sundayMs = newDate.setDate(newDate.getDate() + 6);

  return {
    monday: new Date(mondayMs).toLocaleDateString(),
    sunday: new Date(sundayMs).toLocaleDateString(),
  }
}

class DateRange extends React.Component {
  state = {
    date: '',
    updateTime: '',
    focused: false,
  }

  componentDidMount() {
    this.refs.input.focus()
  }

  syncTime = () => {
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", "https://yandex.com/time/sync.json?geo=213");
    // xhr.send();
    // return JSON.parse(xmlHttp.responseText).time
    return Date.now();
  }

  onChange = (value) => {
    const { date } = this.state;
    const inputDate = new Date(value).getTime();
    const newDate = date !== inputDate ? inputDate : date;

    this.setState({
      date: newDate,
      updateTime: this.syncTime(),
    })
  }

  renderItems = (items) => {
    return (
      <div>
        {items.map((value, index) => <div key={index}>{value}</div>)}
      </div>)
  }

  createItems = (period) => {
    let i, dates = [];
    const week = 3600000 * 168;
    for (i = +period.start; i < +period.end; i += week) {
      const date = new Date(i);
      const { monday, sunday } = getMondaySunday(date);
      dates.push(`${monday} - ${sunday}`)
    }

    return dates;
  }

  toggleFocus = (state) => {
    this.setState({ focused: !state })
  }

  createPeriod = (date) => {
    let newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    return {
      start: date,
      end: newDate.getTime(),
    }
  }

  render() {
    const { date, updateTime, focused } = this.state;
    const bgColor = focused ? '#f00' : '#fff';

    return (
      <div>
        <div>
          <input
            type="date"
            ref="input"
            style={{ backgroundColor: bgColor }}
            onChange={(event) => { this.onChange(event.target.value) }}
            onFocus={() => this.toggleFocus(focused)}
            onBlur={() => this.toggleFocus(focused)}
          />
        </div>
        <hr />
        <div>
          {`Последнее изменение: ${new Date(updateTime).toLocaleString()}`}
        </div>
        <hr />
        <div>
          {date
            ? this.renderItems(this.createItems(this.createPeriod(date)))
            : null}
        </div>
      </div>)
  }
}

export default DateRange;
