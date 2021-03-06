module.exports = function (object, callback) {
    var inc

    inc = function (buffer, start, end, index) {
        var index
        var bite
        var next
        var value

        this.write = function (buffer, start, end) {
            switch (index) {
            case 0:
                value =
                    (object["a"] << 12 & 0xf000) +
                    (object["b"] << 4 & 0xff0) +
                    (object["c"] & 0xf)
                bite = 1
                index = 1
            case 1:
                while (bite != -1) {
                    if (start == end) {
                        return start
                    }
                    buffer[start++] = value >>> bite * 8 & 0xff
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

        if (end - start < 2) {
            return inc.call(this, buffer, start, end, 0)
        }

        value =
            (object["a"] << 12 & 0xf000) +
            (object["b"] << 4 & 0xff0) +
            (object["c"] & 0xf)
        buffer[start] = value >>> 8 & 0xff
        buffer[start + 1] = value & 0xff

        start += 2

        if (next = callback && callback(object)) {
            this.write = next
            return this.write(buffer, start, end)
        }

        return start
    }
}
