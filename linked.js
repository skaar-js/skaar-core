export function Stack() {
    var last = undefined;
    var count = 0;

    this.push = function (item) {
        last = [item, last];
        count++;
    }

    this.pop = function () {
        let it = undefined;
        if (last) {
            let it = last;
            last = it[1];
        }
        return it;
    }
}