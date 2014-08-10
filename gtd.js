function test() {
  document.getElementById("testTextElement").innerHTML = "oh. wow. javascript.";
}

window.onload = function() {
  document.getElementById("testButton").onclick = test;
}
