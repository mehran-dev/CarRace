export function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

export function isCollide(a, b) {
  let aReact = a.getBoundingClientRect();
  let bReact = b.getBoundingClientRect();
  // console.log(aReact);
  return !(
    aReact.bottom < bReact.top ||
    aReact.top > bReact.bottom ||
    aReact.right < bReact.left ||
    aReact.left > bReact.right
  );
}
