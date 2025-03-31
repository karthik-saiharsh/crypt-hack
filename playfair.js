// Remove special characters
function remove_special_chars(str) {
  str = str.toLowerCase();
  let res = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) >= 97 && str[i].charCodeAt(0) <= 122)
      res += str[i];
  }
  return res;
}

// get unique characters from key
function unique(key) {
  key = remove_special_chars(key);
  let key_ = "";
  for (let i = 0; i < key.length; i++) {
    if (!key_.includes(key[i])) key_ += key[i];
  }

  return key_;
}

// Function to generate encryption matrix
function get_matrix(key) {
  key = unique(key);

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
    // if (row == 5) break;

    if (!key.includes(char) && i != 106) {
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
function get_digraphs(msg) {
  msg = remove_special_chars(msg);
  msg = msg.replace("j", "i"); // Replace j with i, since j is omitted from the matrix
  let digraphs = [];

  // generate digrams
  let i = 0;
  while (i < msg.length) {
    let digraph = msg[i];

    // Last letter cannot be left alone in an off sized string
    if (i == msg.length - 1) {
      digraph += "x"; // Add a bogus letter
      digraphs.push(digraph);
      i += 1;
      continue;
    }

    // Pair cannot be made with same letter
    if (msg[i] == msg[i + 1]) {
      digraph += "x"; // Add a bogus letter if next letter is same as current one
      digraphs.push(digraph);
      i += 1;
      continue;
    }

    // Otherwise make a Pair
    digraph += msg[i + 1];
    digraphs.push(digraph);
    i += 2;
  }

  return digraphs;
}

// Function to locate position of a digraph in
function search(matrix, digraph) {
  let l1 = digraph[0];
  let l2 = digraph[1];
  let p1 = [-1, -1];
  let p2 = [-1, -1];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] == l1) p1 = [i, j];
      if (matrix[i][j] == l2) p2 = [i, j];
    }
  }

  return [p1, p2];
}

// Function to encrypt raw message and return cipher text
function encrypt(key, msg) {
  let matrix = get_matrix(key);
  let digraphs = get_digraphs(msg);
  let cipher_text = "";

  digraphs.forEach((digraph) => {
    let cipher_digraph = "";
    let position = search(matrix, digraph);

    // If both letters are in same column
    // Then the letter below each one is chosen
    if (position[0][1] == position[1][1]) {
      let col = position[0][1];
      let row1 = (position[0][0] + 1) % 5;
      let row2 = (position[1][0] + 1) % 5;
      cipher_digraph = cipher_digraph + (matrix[row1][col] + matrix[row2][col]);
      cipher_text += cipher_digraph;
    }
    // If both the letters are in the same row
    // then the letter to the right of each one is taken
    else if (position[0][0] == position[1][0]) {
      let row = position[0][0];
      let col1 = (position[0][1] + 1) % 5;
      let col2 = (position[1][1] + 1) % 5;
      cipher_digraph = cipher_digraph + (matrix[row][col1] + matrix[row][col2]);
      cipher_text += cipher_digraph;
    }
    // Else Form a rectangle with the two letters and the letters on the horizontal
    //  opposite corners of the rectangle are taken
    else {
      let l1 = position[0];
      let l2 = position[1];
      cipher_digraph =
        cipher_digraph + (matrix[l1[0]][l2[1]] + matrix[l2[0]][l1[1]]);
      cipher_text += cipher_digraph;
    }
  });

  return cipher_text;
}

function decrypt(key, cipher_text) {
  let matrix = get_matrix(key);
  let digraphs = get_digraphs(cipher_text);
  let raw_text = "";

  console.log(digraphs);

  digraphs.forEach((digraph) => {
    let raw_digraph = "";
    let position = search(matrix, digraph);

    // If both letters are in same column
    // Then the letter below each one is chosen
    if (position[0][1] == position[1][1]) {
      let col = position[0][1];
      let row1 = (position[0][0] + 4) % 5;
      let row2 = (position[1][0] + 4) % 5;
      raw_digraph = raw_digraph + (matrix[row1][col] + matrix[row2][col]);
      raw_text += raw_digraph;
    }
    // If both the letters are in the same row
    // then the letter to the right of each one is taken
    else if (position[0][0] == position[1][0]) {
      let row = position[0][0];
      let col1 = (position[0][1] + 4) % 5;
      let col2 = (position[1][1] + 4) % 5;
      raw_digraph = raw_digraph + (matrix[row][col1] + matrix[row][col2]);
      raw_text += raw_digraph;
    }
    // Else Form a rectangle with the two letters and the letters on the horizontal
    //  opposite corners of the rectangle are taken
    else {
      let l1 = position[0];
      let l2 = position[1];
      raw_digraph = raw_digraph + (matrix[l1[0]][l2[1]] + matrix[l2[0]][l1[1]]);
      raw_text += raw_digraph;
    }
  });

  return raw_text;
}

console.log(encrypt("karthik", "juice"));
console.log(decrypt("karthik", "eobdcz"));
