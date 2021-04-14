function datefilter(time) {
  const mydate = new Date(time)
  const y = mydate.getFullYear()
  const m = mydate.getMonth() + 1
  const d = mydate.getDate()
  const hour = mydate.getHours()
  const min = mydate.getMinutes()
  const second = mydate.getSeconds()
  return `${y}-${m}-${d} ${hour}:${min}:${second}`
}

export default { datefilter }
