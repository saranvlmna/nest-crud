import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, signupDto } from '../dto';
import { StatusCodes } from 'http-status-codes';
import { Tokens } from 'src/types/token';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: signupDto, @Res() res: any): Promise<Tokens> {
    const user = await this.userService.createUser(body);
    return res.status(StatusCodes.OK).json({
      message: 'user successfuly created',
      data: user,
    });
  }

  @Post('login')
  async signin(@Body() body: loginDto, @Res() res: any): Promise<Tokens> {
    const user = await this.userService.loginUser(body);
    return res.status(StatusCodes.OK).json({
      message: 'user successfully logined',
      data: user,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async listAllUsers(@Res() res: any) {
    const users = await this.userService.findAll();
    return res.status(StatusCodes.OK).json({
      message: 'user fetched successfully',
      data: users,
    });
  }

  @Put('edit/:id')
  async editUser(@Body() body: any, @Param() param: any, @Res() res: any) {
    const result = await this.userService.editUser(body, param.id);
    return res.status(StatusCodes.OK).json({
      message: 'user edited sucessfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  async deleteUser(@Param() param: any, @Res() res: any) {
    const result = await this.userService.deleteUser(param.id);
    return res.status(StatusCodes.OK).json({
      message: 'user deleted successfully',
      data: result,
    });
  }
}
