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

const syncTime = () => {
  fetch('https://yandex.com/time/sync.json?geo=213')
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusText: res.statusText
        });
      }
    })
    .then(res => console.log(res))
    .catch((err) => console.log('Fetch error: ', err.message))
};

class DateRange extends React.Component {
  state = {
    date: '',
    updateTime: '',
    focused: false,
  }

  componentDidMount() {
    this.refs.input.focus()
  }

  onChange = (value) => {
    const { date } = this.state;
    const inputDate = new Date(value).getTime();
    const newDate = date !== inputDate ? inputDate : date;

    this.setState({
      date: newDate,
      updateTime: syncTime() || Date.now(),
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
    const weekMs = 3600000 * 168;
    for (i = +period.start; i < +period.end; i += weekMs) {
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
          {`Последнее изменение: ${updateTime ? new Date(updateTime).toLocaleString() : ''}`}
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
