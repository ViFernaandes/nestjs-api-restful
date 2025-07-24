import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const now = Date.now();

    console.log('TimingConnectionInterceptor executado ANTES.');

    await new Promise(resolve => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap(data => {
        const finalTime = Date.now();
        const elapsed = finalTime - now;
        console.log(
          `TimingConnectionInterceptor: levou ${elapsed} para executar.`,
        );
        console.log(data);
      }),
    );
  }
}
