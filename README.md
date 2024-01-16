# Art By Color
## Description
[Visit the page](https://haileyph.github.io/Art-By-Color/)

This code allows us to pick a color, and then it will fetch data from the 
[Art Institute of Chicago API](https://api.artic.edu/docs/#introduction) to find the artwork that has the closest 
dominant color to the one we pick and display on the page.

## How it works
### Step 1: Pick a color
We will choose a color X from the input

### Step 2: Search 10 artworks
First we will search for 10 artworks with the closest hue to the picked color
(Hue is the color spectrum of the color).
The API provided the dominant color for each artwork in HSL. Using the search endpoint with the term query for hue value of the artwork's dominant color

### Step 3: Find the closest color
The idea is based on this source on how to [find the closest color](https://stackoverflow.com/questions/33216509/find-closest-colour-match-within-range-of-colours) match within a range of colors

We will loop through all 10 artworks to fetch the HSL value (convert to RGB) of each artwork and 
combine using the provided formula. After that, we will store all the combined values in an array.
Loop through the array to find the smallest value and return the position in the array of this value,
which is also the position of the artwork with closest color in the array of 10 artworks.

### Step 4: Display the artwork
We will display the artwork with the closest color on the page.

## Process Document
Refer to my [process document](https://sheridanc-my.sharepoint.com/:b:/g/personal/phamhang_shernet_sheridancollege_ca/EZzg_F_CCSFDqWGP2x8Nov8BXIaZXm5Ab2WqLHf8dfmAZA?e=iBKzPH) for more details.

## License
[MIT](https://choosealicense.com/licenses/mit/)
