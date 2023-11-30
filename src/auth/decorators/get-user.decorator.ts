import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    ( data, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user)
            throw new InternalServerErrorException(`user not found (request)`);

        if (!data) {
            return user;
        }

        if ( !Array.isArray( data ) ) {
            return user[data]
        }

        if( Array.isArray( data )){
            return data.reduce( (acc, el) =>{
                acc[el] = user[el];
                return acc;
            },{});
        }

    }
)