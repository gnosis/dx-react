// set last () => any on Array prototype
Array.prototype.last = function getLast() {
  return this[this.length - 1]
}
