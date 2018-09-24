// set last () => any on Array prototype
Array.prototype.__last = function getLast() {
  return this[this.length - 1]
}
