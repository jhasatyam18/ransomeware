import { rest } from 'msw';

export function withoutErrorResponse(URL, RESP) {
  return rest.get(URL, (req, res, ctx) => res(
    ctx.json(
      RESP,
    ),
  ));
}

export const withErrorResponse = (URL) => rest.get(URL, (req, res, ctx) => res(ctx.status(403), ctx.json({ message: 'ssh' })));
