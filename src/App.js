import React from 'react';

class DateRange extends React.Component {
  componentWillMount() {
    const date = this.getTime();
    this.setState({
      date: Date.now(),
      updateTime: date,
    })
  }

  getTime = () => {
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", "https://yandex.com/time/sync.json?geo=213");
    // xhr.send();
    // return new Date(JSON.parse(xmlHttp.responseText).time)
    return new Date(Date.now());
  }

  onChange = (value) => {
    const newDate = new Date(value).getTime();
    if (this.state.date !== newDate) {
      this.setState({ date: newDate })
    }

    const date = this.getTime();
    this.setState({
      updateTime: date,
    })
  }

  renderItems = (items) => {
    return <div>{items.map((value, index) => <div key={index}>{value}</div>)}</div>
  }

  createItems = (period) => {
    let i, dates = [];
    for (i = +period.start; i < +period.end; i += 3600000 * 168) {
      dates.push(i)
    }

    let periods = [];
    for (i = 0; i < dates.length; i++) {
      let date = new Date(dates[i]);
      console.log(date.getDay());
      // console.log(new Date(date.setHours(-96)).getDay());
      switch (date.getDay()) {
        case 1:
          periods[i] = `${new Date(date).toLocaleDateString()} - ${new Date(date.setHours(168)).toLocaleDateString()}`
          break;
        case 2:
          periods[i] = `${new Date(date.setHours(-24)).toLocaleDateString()} - ${new Date(date.setHours(144)).toLocaleDateString()}`
          break;
        case 3:
          periods[i] = `${new Date(date.setHours(-48)).toLocaleDateString()} - ${new Date(date.setHours(120)).toLocaleDateString()}`
          break;
        case 4:
          periods[i] = `${new Date(date.setHours(-48)).toLocaleDateString()} - ${new Date(date.setHours(120)).toLocaleDateString()}`
          break;
        case 5:
          periods[i] = `${new Date(date.setHours(-72)).toLocaleDateString()} - ${new Date(date.setHours(96)).toLocaleDateString()}`
          break;
        case 6:
          periods[i] = `${new Date(date.setHours(-96)).toLocaleDateString()} - ${new Date(date.setHours(144)).toLocaleDateString()}`
          break;
        case 0:
          periods[i] = `${new Date(date.setHours(-120)).toLocaleDateString()} - ${new Date(date.setHours(48)).toLocaleDateString()}`
          break;
        default:
          break;
      }

      //   let len = periods.length, a = periods.length, b;
      //   do {
      //     b = false;
      //     a /= 1.3;
      //     if (a === 9 || a === 10) a = 11;
      //     if (a < 1) a = 1;
      //     for (i = 0; i < len - a; ++i) {
      //       if (periods[i] > periods[i + a]) {
      //         b = true;
      //         let t = periods[i + a];
      //         periods[i + a] = periods[i];
      //         periods[i] = t;
      //       }
      //     }
      //   } while (a > 1 || b);

    }

    return periods;
  }

  toggleFocus = (state) => {
    this.setState({ isFocused: !state })
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
    const { date, updateTime, isFocused } = this.state;
    const day = updateTime.getDate();
    const rawMonth = updateTime.getMonth() + 1;
    const month = rawMonth > 9 ? rawMonth : `0${rawMonth}`;
    const period = this.createPeriod(date);
    const color = isFocused ? '#f00' : '#fff';

    return (
      <div>
        <div>
          <input
            type="date"
            style={{ backgroundColor: color }}
            onChange={(event) => { this.onChange(event.target.value) }}
            onFocus={() => this.toggleFocus(isFocused)}
            onBlur={() => this.toggleFocus(isFocused)}
          />
        </div>
        <div>
          {`Последнее изменение: ${day}.${month}`}
        </div>
        <div>
          {this.renderItems(this.createItems(period))}
        </div>
      </div>)
  }
}


export default DateRange;
