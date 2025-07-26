import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

export class MyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) { }
}
