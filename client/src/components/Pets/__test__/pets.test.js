/* eslint-disable jest/valid-title */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import catsMock from "../../../mocks/cats.json";
import Pets from "../Pets";

//mocking->faking

const server = setupServer(
  rest.get("http://localhost:4000/cats", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(catsMock));
  })
);

describe("Test Pets Component", () => {
  // beforeEach(() => {
  //   render(<Pets />);
  // });

  beforeAll(() => server.listen());

  // Reset handlers so that each test could alter them
  // without affecting other, unrelated tests.
  afterEach(() => server.resetHandlers());

  // Don't forget to clean up afterwards.
  afterAll(() => server.close());

  test("Test initial Render 5 cards of cats", async () => {
    render(<Pets />);
    const cards = await screen.findAllByRole("article");
    expect(cards.length).toBe(5);
  });
  test("Test render only Female cates with Female filter", async () => {
    render(<Pets />);
    const cards = await screen.findAllByRole("article");
    userEvent.selectOptions(screen.getByLabelText(/Gender/i),'female')
    expect(screen.getAllByRole('article').length).toBe(3);
    expect(screen.getAllByRole('article')).toStrictEqual(
      [cards[0],
      cards[2],
      cards[4]])

  });


});
// favorite testing
test("Test render only Favoured cats with filter after marking one as favorite",async()=>
{
  render(<Pets />);
  const cards = await screen.findAllByRole('article');
  const  outLineHearts=screen.getAllByAltText('outline hearts');
     if(outLineHearts.length>0){
      userEvent.click(outLineHearts[0]);
     }


  userEvent.selectOptions( screen.getByText(/Favourite/i),'favoured');
  expect(screen.getAllByRole('article').length).toBe(3);


}
);