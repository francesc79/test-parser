import {Parser, ParserError} from '../src/Parser';
import install from 'jasmine-es6';

install();

describe("Test Parser with context object", () => {
  let context;

  beforeEach(() => {
    context = {
      name: "pippo",
      age: 18,
      address: {
        city: "New York"
      },
      books: [
        {
          title: "Treasure Island",
          pages: 312
        },
        {
          title: "Oliver Twist",
          pages: 299
        }
      ],
      currentBook: 1,
    };
  });        
         
  it('TestCase Validation address[1] (in realtà è ammesso ma "1" è da intendersi come il valore in Context.1)', () => {
    let query = "address[1]";
    expect(() => Parser.parse(context, query))
      .toThrow (new ParserError("ERR_CODE_301","Query Element with value 'address[1]' is not valid"));
  });

  it('TestCase Validation "address[\'city\']”: NON AMMESSO', () => {
    let query = "address['city']";
    expect(() => Parser.parse(context, query))
      .toThrow (new ParserError("ERR_CODE_301","Query Element with value 'address['city']' is not valid"));
  });  

  it('TestCase "name" = "pippo"', () => {
    let query = "name";
    expect(Parser.parse(context, query)).toBe("pippo");
  });

  it('TestCase "address.city" = "New York"', () => {
    let query = "address.city";
    expect(Parser.parse(context, query)).toBe("New York");
  });

  it('TestCase "books[currentBook].pages" = 299', () => {
    let query = "books[currentBook].pages";
    expect(Parser.parse(context, query)).toBe(299);
  });

});
