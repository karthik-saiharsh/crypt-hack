// Function to generate encryption matrix
function get_matrix(key) {
  key = key.toLowerCase();

  // Matrix for ciphering
  let matrix = [
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
  ];

  let row = 0;
  let col = 0;

  // Put the key into the matrix
  for (let i = 0; i < key.length; i++) {
    matrix[row][col] = key[i];

    // Update Matrix pointer
    if (col < 4) col += 1;
    else {
      col = 0;
      row += 1;
    }
  }

  // Add the other alphabets into the Matrix
  for (let i = 97; i <= 122; i++) {
    let char = String.fromCharCode(i);

    // break out if
    if (row == 5) break;

    if (!key.includes(char)) {
      matrix[row][col] = char;

      if (col < 4) col += 1;
      else {
        col = 0;
        row += 1;
      }
    }
  }

  return matrix;
}

// Function to generate digrams from raw message
function get_digrams(msg) {
  let digrams = [];

  // generate digrams
  let i = 0;
  while (i < msg.length) {
    let digram = msg[i];

    // Last letter cannot be left alone in an off sized string
    if (i == msg.length - 1) {
      digram += "z"; // Add a bogus letter
      digrams.push(digram);
      i += 1;
      continue;
    }

    // Pair cannot be made with same letter
    if (msg[i] == msg[i + 1]) {
      digram += "x"; // Add a bogus letter if next letter is same as current one
      digrams.push(digram);
      i += 1;
      continue;
    }

    // Otherwise make a Pair
    digram += msg[i + 1];
    digrams.push(digram);
    i += 2;
  }

  return digrams;
}
