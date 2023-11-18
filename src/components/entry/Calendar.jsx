'use client'

import { Badge, Calendar } from 'antd'
const getListData = (value) => {
  let listData
  switch (value.date()) {
    case 8:
      listData = [
        {
          type: 'warning',
          content: 'Semana santa'
        },
        {
          type: 'success',
          content: 'Dia del entierro.'
        }
      ]
      break
    case 10:
      listData = [
        {
          type: 'warning',
          content: 'Otra festividad'
        },
        {
          type: 'success',
          content: 'Dia del maestro'
        },
        {
          type: 'error',
          content: 'Congreso nacional'
        }
      ]
      break
    case 15:
      listData = [
        {
          type: 'warning',
          content: 'Congreso nacional'
        },
        {
          type: 'success',
          content: 'Otra festividad'
        },
        {
          type: 'error',
          content: 'Otra festividad'
        },
        {
          type: 'error',
          content: 'Congreso nacional'
        },
        {
          type: 'error',
          content: 'Navidad'
        },
        {
          type: 'error',
          content: 'Fin de año'
        }
      ]
      break
    default:
  }
  return listData || []
}
const getMonthData = (value) => {
  if (value.month() === 0) {
    return 'Titulo'
  }
}
const App = () => {
  const monthCellRender = (value) => {
    const num = getMonthData(value)
    return num
      ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
        )
      : null
  }
  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge className='py-1 px-2 rounded-full hover:bg-white/10 transition-colors' status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    )
  }

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current)
    if (info.type === 'month') return monthCellRender(current)
    return info.originNode
  }
  return <Calendar cellRender={cellRender} />
}
export default App
