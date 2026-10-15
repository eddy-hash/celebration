import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const Lang = createParamDecorator((_d: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const header = (req.headers['accept-language'] || 'sw').toString();
  return header.toLowerCase().startsWith('en') ? 'en' : 'sw';
});
