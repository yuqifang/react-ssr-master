import path from 'path';
import Koa from 'koa';
import Cors from 'koa-cors'; // 目的是解决跨域的问题
import BodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import Convert from 'koa-convert'; // koa-convert最主要的作用是：将koa1包中使用的Generator函数准换成Koa2中的async函数
import routes from './routes';
import Config from './config';
import templating from './templating';
import timeLogger from './middlewares/timeLogger';
import catchError from './middlewares/catchError';

const app = new Koa();

// 中间件处理
app.use(Convert(Cors())); // app.use(cors())的目的是允许跨域
app.use(BodyParser());
app.use(catchError());
app.use(timeLogger());
app.use(serve(`${path.join(__dirname, '..', 'dist/js')}`));
console.log(`${path.join(__dirname, '..', 'dist/js')}`);
// 模板目录
app.use(templating('dist/', {
    noCache: Config.noCache,
    watch: Config.watch
}));
app.use(routes.routes(), routes.allowedMethods());

app.listen(4322);
