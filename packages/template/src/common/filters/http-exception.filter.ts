import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Converts every thrown exception into one consistent JSON shape.
 * Non-HttpExceptions (bugs, DB errors) become a generic 500 — their
 * details are logged server-side but never leaked to the client.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? extractMessage(exception)
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status]?.replaceAll('_', ' ') ?? 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

function extractMessage(exception: HttpException): string | string[] {
  const body = exception.getResponse();
  if (typeof body === 'string') return body;
  const message = (body as { message?: string | string[] }).message;
  return message ?? exception.message;
}
