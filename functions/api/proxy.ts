interface Env {
  API_BASE_URL?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const proxyServer = url.searchParams.get('proxy_server');

  // 默认源地址
  const DEFAULT_API_URL = 'https://music-dl.sayqz.com/api/';
  let targetBaseUrl = env.API_BASE_URL || DEFAULT_API_URL;

  // 根据 proxy_server 参数选择源
  if (proxyServer === 'gdstudio') {
    targetBaseUrl = 'https://music-api.gdstudio.xyz/api.php';
  } else if (proxyServer === 'tunefree') {
    targetBaseUrl = 'https://music-dl.sayqz.com/api/';
  }

  // 移除 proxy_server 参数，避免转发给上游
  url.searchParams.delete('proxy_server');

  // 参数名称映射:将前端参数转换为对应 API 源的参数名
  const params = new URLSearchParams();

  // 根据不同的代理源进行参数映射
  if (proxyServer === 'tunefree') {
    // TuneFree API 参数映射
    // 参数名: types -> type, name -> keyword, count -> limit
    // 参数值: lyric -> lrc, pic -> cover
    url.searchParams.forEach((value, key) => {
      if (key === 'types') {
        // 转换参数名和参数值
        let typeValue = value;
        if (value === 'lyric') {
          typeValue = 'lrc';
        }
        // pic 保持不变,TuneFree 使用 type=pic
        params.append('type', typeValue);
      } else if (key === 'name') {
        params.append('keyword', value);
      } else if (key === 'count') {
        params.append('limit', value);
      } else {
        params.append(key, value);
      }
    });
  } else {
    // GdStudio 或其他源:保持原参数名
    url.searchParams.forEach((value, key) => {
      params.append(key, value);
    });
  }

  // 构建目标 URL
  const targetUrl = new URL(targetBaseUrl);
  params.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // 读取响应体
    const contentType = response.headers.get('content-type');
    const requestType = params.get('type');

    // 检查是否为 JSON 响应
    if (!contentType || !contentType.includes('application/json')) {
      // 特殊处理：TuneFree 的 type=url 返回音频流而不是 JSON
      if (proxyServer === 'tunefree' && requestType === 'url' && contentType?.includes('audio/')) {
        // 将音频流 URL 转换为 JSON 格式 {url: "..."}
        // 前端期望得到 {url: "...", br: ...} 格式
        const audioUrl = targetUrl.toString();
        const normalizedData = { url: audioUrl };

        const newResponse = new Response(JSON.stringify(normalizedData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          },
        });

        return newResponse;
      }

      // 特殊处理: TuneFree 的 type=lrc 返回纯文本歌词而不是 JSON
      if (proxyServer === 'tunefree' && requestType === 'lrc' && contentType?.includes('text/plain')) {
        // 读取纯文本歌词并包装为 JSON
        const lyricText = await response.text();
        const normalizedData = { lyric: lyricText };

        const newResponse = new Response(JSON.stringify(normalizedData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          },
        });

        return newResponse;
      }

      // 特殊处理: TuneFree 的 type=pic 返回302重定向到图片
      if (proxyServer === 'tunefree' && requestType === 'pic') {
        // 将图片 URL 转换为 JSON 格式 {url: "..."}
        const imageUrl = targetUrl.toString();
        const normalizedData = { url: imageUrl };

        const newResponse = new Response(JSON.stringify(normalizedData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          },
        });

        return newResponse;
      }

      // 其他非 JSON 响应，直接返回
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', '*');

      return newResponse;
    }

    const responseData = await response.json();

    // 响应格式标准化：将 TuneFree 的嵌套格式转换为 GdStudio 兼容格式
    let normalizedData = responseData;

    if (proxyServer === 'tunefree' && responseData.code === 200 && responseData.data) {
      // 获取请求类型以确定如何处理响应
      const requestType = params.get('type'); // TuneFree 使用 'type' 参数

      // 根据不同的 API 类型进行格式转换
      if (requestType === 'search' && responseData.data.results) {
        // 搜索结果: {code: 200, data: {results: [...]}} -> [...]
        // 同时将 platform 字段映射为 source 字段
        normalizedData = responseData.data.results.map((item: any) => ({
          ...item,
          source: item.platform || item.source, // 将 platform 映射为 source
        }));
      } else if (requestType === 'url' && responseData.data.url) {
        // 音乐 URL: {code: 200, data: {url: "...", br: ...}} -> {url: "...", br: ...}
        normalizedData = responseData.data;
      } else if (requestType === 'lyric' && responseData.data.lyric) {
        // 歌词: {code: 200, data: {lyric: "...", tlyric: "..."}} -> {lyric: "...", tlyric: "..."}
        normalizedData = responseData.data;
      } else if (requestType === 'pic' && responseData.data.url) {
        // 封面图: {code: 200, data: {url: "..."}} -> {url: "..."}
        normalizedData = responseData.data;
      } else if (requestType === 'playlist' && responseData.data.tracks) {
        // 歌单: {code: 200, data: {tracks: [...], name: "..."}} -> {tracks: [...], name: "..."}
        // 同时处理 tracks 中的 platform -> source 映射
        const tracks = responseData.data.tracks.map((item: any) => ({
          ...item,
          source: item.platform || item.source,
        }));
        normalizedData = {
          ...responseData.data,
          tracks,
        };
      } else {
        // 其他情况：直接使用 data 字段
        normalizedData = responseData.data;
      }
    }

    // 创建新的响应
    const newResponse = new Response(JSON.stringify(normalizedData), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // 设置 CORS
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    newResponse.headers.set('Content-Type', 'application/json');

    return newResponse;
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Proxy Request Failed', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
