// PrefetchLazyPathsPlugin.ts
export const PrefetchLazyPathsPlugin = (paths: string[] = [], timeout: number = 1000) => {
    console.log(1111111111)
    return {
        name: 'prefetch-lazy-paths-plugin',
        async transform(code, id) {
            if (paths.length) {
                for(let path of paths) {
                    if (id.includes(path)) {
                        return `
                            ${code};
                            const timeout = ${timeout};
                            const lazyPages = ${JSON.stringify(paths)};
                            setTimeout(() => {
                              lazyPages.forEach(item => fetch(item));
                            }, timeout);
                        `
                    }
                }
            }
            return code;
        }
    }
}