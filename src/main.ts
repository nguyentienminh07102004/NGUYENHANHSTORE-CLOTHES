import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from "./Exception/HttpExceptionFilter";
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Nguyen Hanh Store')
        .setDescription('Nguyen Hanh Store Clothes')
        .setVersion('1.0')
        .addTag('NguyenHanhStore')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    app.useGlobalFilters(new HttpExceptionFilter()); // không hỗ trợ DI
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        exceptionFactory: errors =>
            new BadRequestException({
                message: errors.map(error => error.constraints)
                    .filter(error => error !== undefined)
                    .map(err => Object.values(err).join(", "))
                    .join(", ")
            })
    }));
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .catch((error) => {
        console.error(error);
    });
