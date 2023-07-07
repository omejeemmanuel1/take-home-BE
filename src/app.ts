import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import Users from './routes/users';
import Products from './routes/products';
import { connectDb, sequelize } from './config/database';

 

const app = express();

app.use(
  cors({
    origin:true,
    credentials: true,
  })
);


app.set('view engine', 'ejs'); // Replace 'ejs' with your desired view engine


app.set('views', path.join(__dirname, 'views')); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/user', Users);
app.use('/product', Products);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


//DB connection
const syncDatabase = async () => {
  await connectDb();
  sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully');
  });
};

syncDatabase();
// error handler
app.use(function (err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
