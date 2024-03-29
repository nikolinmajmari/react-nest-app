/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app/app.module';
import {AppWsAdapter} from "./events/app-ws.adapter";
import {EntityNotFoundExceptionFilter} from "./app/filters/EntityNotFoundExceptionFilter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.useWebSocketAdapter(new AppWsAdapter())
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));

    //
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle("Chat API")
        .setDescription("Handles channelsApi for chatting and media")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
