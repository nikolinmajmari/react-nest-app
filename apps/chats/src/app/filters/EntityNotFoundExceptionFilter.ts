import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from "@nestjs/common";
import {EntityNotFoundError} from "typeorm";
import {Request,Response} from "express";

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  private logger;
  constructor() {
    this.logger = new Logger(EntityNotFoundExceptionFilter.name);
  }
  catch(exception: EntityNotFoundError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.debug(exception.message);
    response.status(HttpStatus.NOT_FOUND)
      .json({
        statusCode: HttpStatus.NOT_FOUND,
        messsage: exception.message,
      })
  }
}
