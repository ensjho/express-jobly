const request = require("supertest");
const sqlForPartialUpdate = require("../../helpers/partialUpdate");


describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
      
      const {query, values} = sqlForPartialUpdate(
        "companies",
        {name: "Rithm School"},
        "handle",
        "testhandle"
      )

    expect(query).toEqual(
      `UPDATE companies SET name=$1 WHERE handle=$2 RETURNING *`,
      ["Rithm School", "testhandle"]
    )
    expect(values).toEqual(
      ["Rithm School","testhandle"]
    );

  });
});
