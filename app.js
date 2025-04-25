const convertBtn = document.getElementById("convert-btn");
let inputEl = document.getElementById("input");
let lengthEl = document.getElementById("length");
convertBtn.addEventListener("click", function () {
  var ddl = document.getElementById("convselect");
  var selectedValue = ddl.options[ddl.selectedIndex].value;
  let baseValue = N(inputEl.value);
    if (selectedValue == "area")
    {
      lengthEl.textContent = `${baseValue.format()} metre(s) = ${baseValue.div(355000000).format()} british empires`;
    }
    else if (selectedValue == "pop")
    {
      lengthEl.textContent = `${baseValue.format()} people = ${baseValue.div(4120000).format()} british empire populations`;
    }
    else if (selectedValue == "volume")
    {
      lengthEl.textContent = `${baseValue.format()} litre(s) = ${baseValue.mul(15).format()} cups of tea`;
    }
});