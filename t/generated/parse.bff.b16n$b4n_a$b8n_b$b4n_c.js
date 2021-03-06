module.exports = function (object, callback) {
    var inc

    inc = function (buffer, start, end, index) {
        var bite
        var next
        var value

        this.parse = function (buffer, start, end) {
            switch (index) {
            case 0:
                value = 0
                bite = 1
                index = 1
            case 1:
                while (bite != -1) {
                    if (start == end) {
                        return start
                    }
                    value += Math.pow(256, bite) * buffer[start++]
                    bite--
                }
                object["a"] = value >>> 12 & 0xf
                object["b"] = value >>> 4 & 0xff
                object["c"] = value & 0xf
            }

            if (next = callback(object)) {
                this.parse = next
                return this.parse(buffer, start, end)
            }

            return start
        }

        return this.parse(buffer, start, end)
    }

    return function (buffer, start, end) {
        var next
        var value

        if (end - start < 2) {
            return inc.call(this, buffer, start, end, 0)
        }

        value =
            buffer[start] * 0x100 +
            buffer[start + 1]
        object["a"] = value >>> 12 & 0xf
        object["b"] = value >>> 4 & 0xff
        object["c"] = value & 0xf

        start += 2

        if (next = callback(object)) {
            this.parse = next
            return this.parse(buffer, start, end)
        }

        return start
    }
}
