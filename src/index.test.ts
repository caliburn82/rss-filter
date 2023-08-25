import { handler } from "./index";

it('still works', async () => {
  await handler()
    .then((response) => {
      expect(response.statusCode).toBe(200);
      console.log(response.body);
    });
});
