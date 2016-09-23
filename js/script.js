const hexToRgb = (hex) => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

const checksRGB = (color) => {
  if (color <= 0.03928) {
    return (color / 12.92);
  } else {
    return (Math.pow(((color + 0.055)/1.055), 2.4));
  }
}

const calculateRatio = (color1, color2) => {
  console.log(color1);
  console.log(color2);
  const colorOneR = color1.r/255;
  const colorOneG = color1.g/255;
  const colorOneB = color1.b/255;
  const colorTwoR = color2.r/255;
  const colorTwoG = color2.g/255;
  const colorTwoB = color2.b/255;
  const colorOneRsRGB = checksRGB(colorOneR);
  const colorOneGsRGB = checksRGB(colorOneG);
  const colorOneBsRGB = checksRGB(colorOneB);
  const colorTwoRsRGB = checksRGB(colorTwoR);
  const colorTwoGsRGB = checksRGB(colorTwoG);
  const colorTwoBsRGB = checksRGB(colorTwoB);
  const colorOneL = ((0.2126 * colorOneRsRGB) + (0.7152 * colorOneGsRGB) + (0.0722 * colorOneBsRGB));
  const colorTwoL = ((0.2126 * colorTwoRsRGB) + (0.7152 * colorTwoGsRGB) + (0.0722 * colorTwoBsRGB));
  if (colorOneL > colorTwoL) {
      return ((colorOneL + 0.05)/(colorTwoL + 0.05));
  } else {
      return ((colorTwoL + 0.05)/(colorOneL + 0.05));
  }
}

const contrast = (color) => {
  const colorOneBright = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114))/1000);
  const colorLight = Math.round(((255 * 299) + (255 * 587) + (255 * 114))/1000);
  if (Math.abs(colorOneBright) < (colorLight / 2)) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
}

const colorOne = document.querySelector('#color1');
const colorTwo = document.querySelector('#color2');
const colorOneContainer = document.querySelector('.color1');
const colorTwoContainer = document.querySelector('.color2');
const colorOneTextBox = document.querySelector('.color1 .text-box');
const colorTwoTextBox = document.querySelector('.color2 .text-box');
const scoreBox = document.querySelector('.score');

const updateAll = () => {
  colorOneContainer.style.backgroundColor = colorOne.value;
  colorTwoContainer.style.backgroundColor = colorTwo.value;
  colorOneTextBox.style.backgroundColor = colorTwo.value;
  colorOneTextBox.style.color = colorOne.value;
  colorTwoTextBox.style.backgroundColor = colorOne.value;
  colorTwoTextBox.style.color = colorTwo.value;
  let colorOneHex = hexToRgb(colorOne.value);
  let colorTwoHex = hexToRgb(colorTwo.value);
  scoreBox.querySelector('.numbers').innerHTML = `<span>Score:</span> ${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}`;
  const message = scoreBox.querySelector('.message');
  const verdict = scoreBox.querySelector('.verdict');
  if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.5) {
    verdict.textContent = `You're good`;
    message.innerHTML = `You can use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>`;
   } else {
     verdict.textContent = `NO`;
    message.innerHTML = `You can not use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>`;
  }
}

window.onload = () => {
  updateAll();

  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      updateAll();
    });
  });
};
