const Block = require("./block");

/**
 * describe is jest specific function
 * @prarams
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("Block", () => {
  let data, lastBlock, newBlock;
  /**
   * beforeEach allows us to run some code before
   * running any test
   * example creating an instance
   */
  beforeEach(() => {
    data = { token: "abc", amount: 10 };
    lastBlock = Block.genesis();
    newBlock = Block.mineBlock(lastBlock, data);
  });
  /**
   * it function is used to write unit tests
   * first param is a description
   * second param is callback arrow function
   */
  it("sets the `data` to match the input", () => {
    /**
     * expect is similar to assert
     * it expects something
     */
    expect(newBlock.data).toEqual(data);
  });

  it("sets the `lastHash` to match the hash of the last block", () => {
    expect(newBlock.lastHash).toEqual(lastBlock.hash);
  });

  it("generates a hash that matches the difficutly", () => {
    // use the dynamic difficulty to match the difficulty
    expect(newBlock.hash.substring(0, newBlock.difficulty)).toEqual(
      "0".repeat(newBlock.difficulty)
    );
  });

  it("lower the difficulty for a slower generated block", () => {
    expect(
      Block.adjustDifficulty(newBlock, newBlock.timestamp + 300000)
    ).toEqual(newBlock.difficulty - 1);
  });

  it("raise the difficulty for a faster generated block", () => {
    expect(Block.adjustDifficulty(newBlock, newBlock.timestamp + 1)).toEqual(
      newBlock.difficulty + 1
    );
  });
});
