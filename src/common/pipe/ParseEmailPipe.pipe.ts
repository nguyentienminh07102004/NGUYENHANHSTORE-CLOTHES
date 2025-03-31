import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {isEmail} from "class-validator";
import {ExceptionVariable} from "../filters/HttpExceptionFilter.filter";

@Injectable()
export class ParseEmailPipe implements PipeTransform<String, String> {
    transform(value: String): String {
        if (!isEmail(value)) {
            throw new BadRequestException(ExceptionVariable.EMAIL_INVALID);
        }
        return value;
    }

}