import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { MessageResponseDto } from './dto';
import { DecodedUser, JwtGuard } from '@app/shared';
// import { JwtDecodedEntity } from '@app/shared';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'returns a string "hello ${decodedUser.email}"',
  })
  @ApiResponse({ type: Object })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('hello')
  getHello(@DecodedUser() decodedUser: any) {
    return decodedUser;
  }
}
