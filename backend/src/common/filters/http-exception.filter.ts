import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any).requestId ?? null;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message || 'Error';
      const responseBody = exception.getResponse();

      const log = {
        level: status >= 500 ? 'error' : 'warn',
        msg: 'http_exception',
        status,
        path: request.url,
        method: request.method,
        requestId,
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(log));

      return response.status(status).json({
        code: this.mapCode(status, message),
        message,
        details: typeof responseBody === 'object' ? responseBody : {},
        traceId: requestId,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(JSON.stringify({
      level: 'error',
      msg: 'unhandled_exception',
      path: request.url,
      method: request.method,
      requestId,
      timestamp: new Date().toISOString(),
    }));

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error',
      details: {},
      traceId: requestId,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapCode(status: number, message: string) {
    if (status === HttpStatus.UNAUTHORIZED) return 'AUTH_UNAUTHORIZED';
    if (status === HttpStatus.FORBIDDEN) return 'AUTH_FORBIDDEN';
    if (status === HttpStatus.NOT_FOUND) return 'RESOURCE_NOT_FOUND';
    if (status === HttpStatus.CONFLICT) return 'RESOURCE_CONFLICT';
    if (status === HttpStatus.BAD_REQUEST) return 'VALIDATION_ERROR';
    if (status >= 500) return 'INTERNAL_SERVER_ERROR';
    return 'ERROR';
  }
}
