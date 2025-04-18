import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import {Global, Module} from "@nestjs/common";
import * as path from "path";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import {MailerOptions} from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";

@Global()
@Module({
    imports: [MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService): MailerOptions => ({
            transport: {
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: configService.get<string>("GMAIL_APP_USER"),
                    pass: configService.get<string>("GMAIL_APP_PASSWORD"),
                }
            },
            template: {
                dir: path.join(__dirname, "..", "..", "assets", "templates"),
                adapter: new PugAdapter(),
            }
        })
    })]
})
export class MailerConfigurationModule {}
