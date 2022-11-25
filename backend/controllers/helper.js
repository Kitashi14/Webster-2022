//functions to be used at various places

//for removing spaces at last and end
const removeSpaces = (data) => {
  //removing spaces at start
  var st = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] === " ") st++;
    else break;
  }
  //removing spaces from last
  var end = data.length - 1;
  for (var i = end; i >= 0; i--) {
    if (data[i] === " ") end--;
    else break;
  }
  let updatedData = "";
  for (var i = st; i <= end; i++) {
    updatedData = updatedData + data[i];
  }

  return updatedData;
};

exports.removeSpaces= removeSpaces;
