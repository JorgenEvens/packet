module.exports = function (object, callback) {
    var inc

    inc = function (buffer, start, end, index) {
        var bite
        var next
        var _foo

        this.parse = function (buffer, start, end) {
            switch (index) {
            case 0:
                _foo = 0
                bite = 3
                index = 1
            case 1:
                while (bite != -1) {
                    if (start == end) {
                        return start
                    }
                    _foo += Math.pow(256, bite) * buffer[start++]
                    bite--
                }
                object["foo"] = _foo
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

        if (end - start < 4) {
            return inc.call(this, buffer, start, end, 0)
        }

        object["foo"] =
            buffer[start] * 0x1000000 +
            buffer[start + 1] * 0x10000 +
            buffer[start + 2] * 0x100 +
            buffer[start + 3]

        start += 4

        if (next = callback(object)) {
            this.parse = next
            return this.parse(buffer, start, end)
        }

        return start
    }
}
