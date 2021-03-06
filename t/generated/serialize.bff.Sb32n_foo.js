module.exports = function (object, callback) {
    var inc

    inc = function (buffer, start, end, index) {
        var index
        var bite
        var next
        var _foo

        this.write = function (buffer, start, end) {
            switch (index) {
            case 0:
                _foo = object["foo"]
                bite = 3
                index = 1
            case 1:
                while (bite != -1) {
                    if (start == end) {
                        return start
                    }
                    buffer[start++] = _foo >>> bite * 8 & 0xff
                    bite--
                }
            }

            if (next = callback && callback(object)) {
                this.write = next
                return this.write(buffer, start, end)
            }

            return start
        }

        return this.write(buffer, start, end)
    }

    return function (buffer, start, end) {
        var next
        var value

        if (end - start < 4) {
            return inc.call(this, buffer, start, end, 0)
        }

        value = object["foo"]
        buffer[start] = value >>> 24 & 0xff
        buffer[start + 1] = value >>> 16 & 0xff
        buffer[start + 2] = value >>> 8 & 0xff
        buffer[start + 3] = value & 0xff

        start += 4

        if (next = callback && callback(object)) {
            this.write = next
            return this.write(buffer, start, end)
        }

        return start
    }
}
