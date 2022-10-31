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
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, signupDto } from '../dto';
import { StatusCodes } from 'http-status-codes';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() body: signupDto, @Res() res: any): object {
    this.userService.createUser(body);
    return res.status(StatusCodes.OK).json({
      message: 'user successfuly created',
    });
  }

  @Post('login')
  async signin(@Body() body: any, @Res() res: any) {
    const user = await this.userService.loginUser(body);
    return res.status(StatusCodes.OK).json({
      message: 'user successfully logined',
      data: user,
    });
  }

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
