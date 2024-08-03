export async function onRequest(context) {
    try {
        // Contents of context object
        const {
            request, // same as existing Worker API
            env, // same as existing Worker API
            params, // if filename includes [id] or [[path]]
            waitUntil, // same as ctx.waitUntil in existing Worker API
            next, // used for middleware or to fetch assets
            data, // arbitrary space for passing data between middlewares
        } = context;

        const requestUrl = new URL(request.url); // 解析请求的 URL
        const protocol = requestUrl.protocol; // 获取请求的协议（http 或 https）
        const domain = requestUrl.hostname; // 获取请求的域名
        const port = requestUrl.port; // 获取请求的端口
        const list = await env.img_url.list(); // 从环境变量中获取图片列表

        // 检查是否允许随机选择图片
        if (env.AllowRandom != "true") {
            return new Response(JSON.stringify({ error: "Random is disabled" }), { status: 403 });
        }

        // 检查图片列表是否为空
        if (list.keys.length == 0) {
            return new Response(JSON.stringify({}), { status: 200 });
        } else {
            // 随机选择一张图片
            const randomIndex = Math.floor(Math.random() * list.keys.length);
            const randomKey = list.keys[randomIndex];
            const randomPath = '/file/' + randomKey.name;
            let randomUrl = randomPath;

            const randomType = requestUrl.searchParams.get('type'); // 获取查询参数 'type'

            // 如果 'type' 参数为 'url'，则构建完整的图片 URL
            if (randomType == 'url') {
                if (port) {
                    randomUrl = protocol + '//' + domain + ':' + port + randomPath;
                } else {
                    randomUrl = protocol + '//' + domain + ':' + port + randomPath;
                }
            }
            else{
                if (port) {
                    randomUrl = protocol + '//' + domain + ':' + port + randomPath;
                } else {
                    randomUrl = protocol + '//' + domain + ':' + port + randomPath;
                }
            }
            }

            // 直接重定向到图片 URL
            return Response.redirect(randomUrl, 302);
        }
    } catch (error) {
        // 捕获和记录异常
        console.error('Error occurred:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
