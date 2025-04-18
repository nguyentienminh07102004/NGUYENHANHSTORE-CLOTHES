import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/HttpExceptionFilter.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api/v1");
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
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
    .catch((error) => {
        console.error(error);
    });