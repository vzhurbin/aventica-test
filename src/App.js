import React from 'react';

// Вынес функции-помощники за пределы класса

// Заменил длинный и многословный метод для создания периодов
const getMondaySunday = (date) => {
  const newDate = new Date(date)
  const weekDay = newDate.getDay();
  // getDay считает дни с 0, начиная с воскресенья
  const daysSinceMonday = weekDay === 0 ? 6 : weekDay - 1;

  const mondayMs = newDate.setDate(newDate.getDate() - daysSinceMonday);
  // newDate теперь понедельник, поэтому воскресенье найти проще
  const sundayMs = newDate.setDate(newDate.getDate() + 6);

  // возвращаем даты в нужном для отображения формате
  return {
    monday: new Date(mondayMs).toLocaleDateString(),
    sunday: new Date(sundayMs).toLocaleDateString(),
  }
}

/* данный API не разрешает запросы с других сайтов
  (не только из-за CORS с localhost, но и с хостинга Firebase),
  поэтому как запасной вариант использовал простой Date.now()

  Использовал более новый/удобный fetch вместо xhr
  и добавил обработку ошибок
*/
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
  // нет необходимости в значениях date и updateTime
  // при первом рендере
  state = {
    date: '',
    updateTime: '',
    focused: false,
  }

  // текущий стандарт использования рефов
  inputRef = React.createRef();

  // расположение методов в порядке, рекомендованном airbnb
  componentDidMount() {
    this.inputRef.current.focus()
  }

  onChange = (value) => {
    const { date } = this.state;
    const inputDate = new Date(value).getTime();
    const newDate = date !== inputDate ? inputDate : date;

    this.setState({
      date: newDate,
      // если апи не сработает, используем запасной вариант
      updateTime: syncTime() || Date.now(),
    })
  }

  renderItems = (items) => {
    return (
      <div>
        {items.map((value, index) => <div key={index}>{value}</div>)}
      </div>)
  }

  // вынес функцию поиска пн-вс
  // не увидел необходимости в доп. сортировке с do/while
  // получился один цикл вместо трех
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

  // добавил метод для управления состоянием фокуса
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

  // использовал jsx вместо createElement
  render() {
    const { date, updateTime, focused } = this.state;
    const bgColor = focused ? '#f00' : '#fff';

    return (
      <div>
        <div>
          <input
            type="date"
            ref={this.inputRef}
            style={{ backgroundColor: bgColor }}
            onChange={(event) => { this.onChange(event.target.value) }}
            onFocus={() => this.toggleFocus(focused)}
            onBlur={() => this.toggleFocus(focused)}
          />
        </div>
        <hr />
        <div>
          {`Последнее изменение: ${
            updateTime
              ? new Date(updateTime).toLocaleString()
              : ''}
          `}
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
