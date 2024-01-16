////////////////////// STEP 1 // Pick a color

// COLOR PICKER
// Chat-GPT helped me write this code to:
// 1. Create a Color Picker
// 2. Convert the color to RGB and HSL format
// Here is the link to my full chat transcript
// https://chat.openai.com/share/90eebfec-cf7f-4e20-890f-7599be963b64


// When the user first lands the page, the background will be an illustration of a museum view
// The illustrations are from Canva Stock by @sketchify
// https://www.canva.com/features/free-stock-photos/
document.body.style.backgroundImage = 'url("/assets/museum.png")';

// Get the color input - HEX and convert to RGB and HSL
const colorInput = document.getElementById('color-input');
const rgbOutput = document.getElementById('rgb-output');
const hslOutput = document.getElementById('hsl-output');
const hexOutput = document.getElementById('hex-output');
let r,g,b;
let h,s,l;

colorInput.addEventListener('input', () => {
  const selectedColor = colorInput.value;

  // Change the background color to the selected color
  document.body.style.backgroundColor = selectedColor;

  // HEX to RGB
  r = parseInt(selectedColor.substring(1, 3), 16); 
  g = parseInt(selectedColor.substring(3, 5), 16);
  b = parseInt(selectedColor.substring(5, 7), 16);

// The code below is for the slider
//   routput.innerHTML = r; 
//   routput.innerHTML = r; 
//   boutput.innerHTML = b; 
//   rslider.oninput = function() {
//   routput.innerHTML = this.value;
// }
  
  //RGB to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const delta = max - min;
  h = 0;
  s = 0;
  l = (max + min) / 2;

  if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      switch (max) {
          case r / 255:
              h = (g / 255 - b / 255) / delta + (g < b ? 6 : 0);
              break;
          case g / 255:
              h = (b / 255 - r / 255) / delta + 2;
              break;
          case b / 255:
              h = (r / 255 - g / 255) / delta + 4;
              break;
      }
      h = Math.round(h * 60);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
  }

  rgbOutput.textContent = `RGB: (${r}, ${g}, ${b})`;
  hslOutput.textContent = `HSL: (${h}, ${s}%, ${l}%)`;
  hexOutput.textContent = `HEX: ${selectedColor}`;
});

// //SLIDER
// // I wanted to use sliders as color input but it takes up too much code so I just use <input type = color>
// // This helped me create sliders for RGB color
// // https://www.w3schools.com/howto/howto_js_rangeslider.asp

// var rslider = document.getElementById("r-slider");
// var routput = document.getElementById("r-output");
// routput.innerHTML = rslider.value; // Display the default slider value
// rslider.oninput = function() {
//   routput.innerHTML = this.value;
// }
// var gslider = document.getElementById("g-slider");
// var goutput = document.getElementById("g-output");
// goutput.innerHTML = gslider.value; // Display the default slider value
// gslider.oninput = function() {
//   goutput.innerHTML = this.value;
// }
// var bslider = document.getElementById("b-slider");
// var boutput = document.getElementById("b-output");
// boutput.innerHTML = bslider.value; // Display the default slider value
// bslider.oninput = function() {
//   boutput.innerHTML = this.value;
// }



////////////////////// STEP 2 // SEARCH 10 ARTWORKS

// FETCHING ARTWORK
// Fetching artwork using artwork ID will give us a full set of data on the artwork
// Function to fetch artwork details by ID
function fetchArtworkDetails(artworkId) {
    return fetch(`https://api.artic.edu/api/v1/artworks/${artworkId}`)
        .then(response => response.json());
}

//Function to search for artwork by color
function searchArtworks() {
  document.body.style.backgroundImage = '';

  // Since it takes some time to search for artwork by color, I added a loader here
  // I learn how to create a loader from ChatGPT
  // Full chat link: https://chat.openai.com/share/0d0bc6f0-75e7-4989-bbdc-8efb2e20f2ad
  const loader = document.getElementById('loader');
  loader.style.display = 'block';

  //When the searching process is happening, we will move the color picker to the left to make space for the artwork
  const colorPicker = document.getElementById('color-picker');
  colorPicker.style.float = 'left';
  colorPicker.style.margin = '0';

  //This is where we will display our artwork
  const artworkList = document.getElementById('artwork');

  // This array stores the combined value of the r,g,b color of the 
  const colorArr = [];

  // Fetching 10 painting artworks with the same hue as the selected color
  fetch(`https://api.artic.edu/api/v1/artworks/search?query[term][color.h]=${h}&artwork_type_title=Painting&limit=10`)
  .then(response => response.json())
  .then(data => {
      // Clear previous search results
      artworkList.innerHTML = '';


    
    ////////////////////// STEP 3 // FIND CLOSEST COLOR
    
      // Loop through the 10 painting artworks and fetch HSL color
      data.data.forEach(async artwork => {
        const artworkId = artwork.id;
        // Because if we use search endpoint, the API not return the full set data of the artwork.
        // So we cannot fetch the HSL values from the search endpoint.
        // We will fetch the ID of each artwork from the search result and then use that id to fetch data one more time
        // using the function fetchArtworkDetails
        const artworkDetails = await fetchArtworkDetails(artworkId);

        //Create a variable to store the color data, the data is in as object format
        const color = artworkDetails.data.color;
        //Convert the color (currently in HSL format) to RGB
        const colorRGB = hslToRgb(color.h, color.s, color.l);
        console.log(colorRGB); 
        
        //Formula to combine 3 values h,s,l of 2 color (artwork dominant color and input color) into one value and find the smallest value
        colorArr.push(combine(r,g,b,colorRGB.r,colorRGB.g,colorRGB.b));
        console.log(colorArr);

        //Declare variable for the smallest combined value and set the position to 0
        let smallest, 
        pos = 0;
      
        //Loop through the combined value array to find the smallest value and the position in the array of that value
        //Finding the smallest value in an array code provided by 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
        console.log(Math.min(...colorArr));
        for(i=0;i<colorArr.length;i++){
          if(colorArr[i] == Math.min(...colorArr)){
            smallest = colorArr[i];
            pos = i;
          }
        }
        console.log(smallest, pos);

        //Check if the position is within the array range
        if (pos >= 0 && pos < colorArr.length) {
          // Get the selected artwork at the specified position
          const selectedArtwork = data.data[pos];


        
         ////////////////////// STEP 4 // DISPLAY THE ARTWORK
        
          // Fetch the artwork details
          fetchArtworkDetails(selectedArtwork.id)
              .then(artworkDetails => {
                  const title = artworkDetails.data.title;
                  const artist = artworkDetails.data.artist_title;
                
                // The API provides the image of the artwork using the artwork ID
                  const imageUrl = artworkDetails.data.image_id ? `https://www.artic.edu/iiif/2/${artworkDetails.data.image_id}/full/300,/0/default.jpg` : 'No Image Available';
                  
                  const artworkElement = document.createElement('div');
                  artworkElement.classList.add('artwork');
                  artworkElement.innerHTML = `
                      <img class="thumbnail" src="${imageUrl}" alt="${title}">
                      <h2 style="color:${setTextColor(l)}">${title}</h2>
                      <p style="color:${setTextColor(l)}">Artist: ${artist}</p>
                      <p style="color:${setTextColor(l)}">Dominant color: HSL: (${color.h},${color.s},${color.l})</p>
                  `;
                  
                  // Clear previous results and append the selected artwork
                  artworkList.innerHTML = '';
                  artworkList.appendChild(artworkElement);
                    
              })
              .catch(error => {
                  console.error('Error fetching artwork details:', error);
              });
      } else {
          artworkList.innerHTML = 'Artwork not found.';
      }

      // Hide the loader when artwork finishes loading
      loader.style.display = 'none';
       
      });
 
      
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

}

// This code is to make the title and artist name of the artwork readable on all types of background color
// Adapted from this source
//https://codepen.io/ashraftoobler/pen/VeoVPL
function setTextColor(lightness) {
    if (lightness > 50) {
        return "#000"; // Black text for lighter backgrounds
    } else {
        return "#fff"; // White text for darker backgrounds
    }x
}


// Combining 3 values of a color together to find the closest one
// https://stackoverflow.com/questions/33216509/find-closest-colour-match-within-range-of-colours
function combine(r1, g1, b1, r2, g2, b2){
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}


// Function to convert HSL to RGB
// I learned how to convert hsl to rgb from this source
// https://css-tricks.com/converting-color-spaces-in-javascript/
function hslToRgb(h, s, l) {
  h /= 360; // Convert hue to a value between 0 and 1
  s /= 100; // Convert saturation to a value between 0 and 1
  l /= 100; // Convert lightness to a value between 0 and 1

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c/2,
    r = 0,
    g = 0,
    b = 0;
  
  if (0 <= h && h < 60) {
      r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
  
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    r = (r * 255);
    g = (g * 255);
    b = (b * 255);

    return { r, g, b };
}