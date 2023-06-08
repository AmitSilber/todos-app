import { ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: Error | HttpException, host: ArgumentsHost): void;
}
