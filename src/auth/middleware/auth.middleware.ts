import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserReqeustMiddleware } from '@app/auth/interfaces/UserReqeustMiddleware';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';
import {verify} from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly configService:ConfigService,
                private readonly userService:UserService
    ){}
    async use(req: UserReqeustMiddleware, res: any, next: (error?: any) => void) {

        if(!req.headers['authorization']){
            res.user=null
            next()
            return
        }
        const token = req.headers['authorization']?.split(' ')[1]
        try {

            const decode = verify(token,this.configService.get('JWT_KEY'))
            const user = await this.userService.findOne({id:decode.id})
            req.user = user
        }
        catch (err){
            req.user = null
            console.log(this.configService.get('JWT_KEY'),err);
        }
        finally {
            next()
        }
    }

}