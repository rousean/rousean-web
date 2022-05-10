(function () {
  'use strict';

  const t = 0;

  console.log(t);
  function add(a, b) {
      if (typeof a === "string" || typeof b === "string") {
          return a.toString() + b.toString();
      }
      return a + b;
  }
  const result = add("Semlinker", " Kakuqo");
  result.split(" ");

})();
//# sourceMappingURL=bundle.js.map
