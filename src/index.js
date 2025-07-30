function getTiedValue() {
  return Date.now();
}

function getLongTime(locale = 'en-ES') {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'

 }

 return new Date().toLocaleString(locale, options);
}


module.exports = {

    getTiedValue,
    getLongTime
};