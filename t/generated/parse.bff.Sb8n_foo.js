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
                bite = 0
                index = 1
            case 1:
                while (bite != -1) {
                    if (start == end) {
                        return start
                    }
                    _foo += Math.pow(256, bite) * buffer[start++]
                    bite--
                }
                _foo = _foo & 0x80 ? (0xff - _foo + 1) * -1 : _foo
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
        var _foo

        if (end - start < 1) {
            return inc.call(this, buffer, start, end, 0)
        }

        _foo = buffer[start]
        _foo = _foo & 0x80 ? (0xff - _foo + 1) * -1 : _foo
        object["foo"] = _foo

        start += 1

        if (next = callback(object)) {
            this.parse = next
            return this.parse(buffer, start, end)
        }

        return start
    }
}
