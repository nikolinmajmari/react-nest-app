export default class Util {

    static token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5tYWptYXJpQGdtYWlsLmNvbSIsInN1YiI6ImI5YjcyYTZjLWUyZjMtNDEzNS1hM2UzLTJlODQ4ZDM0MWEwMCIsImlhdCI6MTY5NDIzMzc2MiwiZXhwIjoxNjk0MjMzODIyfQ.ombDBdQqA8ObcO8JFa5z5BroXnamMhFWkfWTc5yk4Ek";


    static async asyncMap<S, T>(list: S[], mapper: (a: S) => T) {
        return new Promise((resolve) => {
            let currentIndex = 0;
            const result = [];

            function process() {
                // Process a portion of the array
                for (let i = 0; i < 10 && currentIndex < list.length; i++) {
                    result.push(mapper(list[currentIndex]));
                    currentIndex++;
                }
                if (currentIndex < list.length) {
                    setImmediate(process);
                } else {
                    resolve(result);
                }
            }

            process();
        })
    }
}
