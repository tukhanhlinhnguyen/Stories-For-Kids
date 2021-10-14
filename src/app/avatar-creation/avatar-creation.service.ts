import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AvatarCreationService {

  humanAvatarAPIStyleOptions = { 
    "style": 
    {
      "transparent": "icon-path",
      "circle": "icon-path"
    },
    "top":
    {
      "longHair": "../../assets/icons/long-hair.png",
      "shortHair": "../../assets/icons/short-hair.png",
      "eyepatch": "../../assets/icons/eye-patch.png",
      "hat": "../../assets/icons/hat.png",
      "hijab": "../../assets/icons/hijab.png",
    },
    "topChance":
    {

    },
    "hatColor":
    {
      "black": "../../assets/icons/black-color.png",
      "blue01": "../../assets/icons/blue01-color.png",
      "blue02": "../../assets/icons/blue02-color.png",
      "blue03": "../../assets/icons/blue03-color.png",
      "gray": "../../assets/icons/gray01-color.png",
    },
    "hairColor": 
    {
      "auburn": "../../assets/icons/auburn-hair.png",
      "black": "../../assets/icons/black-hair.png",
      "blonde": "../../assets/icons/blonde-hair.png",
      "blondeGolden": "../../assets/icons/blonde-golden-hair.png",
      "brown": "../../assets/icons/brown-hair.png",
      "brownDark": "../../assets/icons/dark-brown-hair.png",
      "pastel": "../../assets/icons/pastel-hair.png",
      "pastelPink": "../../assets/icons/pastel-pink-hair.png",
    },
    "accessories":
    {
      "kurt": "../../assets/icons/kurt-accessories.png",
      "prescription01": "../../assets/icons/prescription-01-accessories.png",
      "prescription02": "../../assets/icons/prescription-02-accessories.png",
      "round": "../../assets/icons/round-accessories.png",
      "sunglasses": "../../assets/icons/sunglasses-accessories.png",
      "wayfarers": "../../assets/icons/wayfarers-accessories.png",
    },
    "facialHair":
    {
      "beardLight": "../../assets/icons/beard-light-facial-hair.png",
      "beardMedium": "../../assets/icons/beard-medium-facial-hair.png",
      "beardMajestic": "../../assets/icons/beard-majestic-facial-hair.png",
      "fancy": "../../assets/icons/beard-fancy-facial-hair.png",
      "magnum": "../../assets/icons/beard-magnum-facial-hair.png",
    },
    "facialHairColor": {
      "auburn": "../../assets/icons/auburn-color.png",
      "black": "../../assets/icons/black-color.png",
      "blonde": "../../assets/icons/blonde-color.png",
      "blondeGolden": "../../assets/icons/blonde-golden-color.png",
      "brown": "../../assets/icons/brown-color.png",
      "brownDark": "../../assets/icons/brown-dark-color.png",
      "pastelPink": "../../assets/icons/pastel-pink-color.png",
      "platinum": "../../assets/icons/platinum-color.png",
      "red": "../../assets/icons/red-color.png",
      "gray": "../../assets/icons/gray01-color.png"
    },
    "accessoriesColor": {
      "black": "../../assets/icons/black-color.png",
      "blue01": "../../assets/icons/blue01-color.png",
      "blue02": "../../assets/icons/blue02-color.png",
      "blue03": "../../assets/icons/blue03-color.png", 
      "gray01": "../../assets/icons/gray01-color.png",
      "gray02": "../../assets/icons/gray02-color.png",
      "heather": "../../assets/icons/heather-color.png",
      "pastel": "../../assets/icons/pastel-color.png",
      "pastelBlue": "../../assets/icons/pastelBlue-color.png",
      "pastelGreen": "../../assets/icons/pastelGreen-color.png",
      "pastelOrange": "../../assets/icons/pastelOrange-color.png",
      "pastelRed": "../../assets/icons/pastelRed-color.png",
      "pastelYellow": "../../assets/icons/pastelYellow-color.png",
      "pink": "../../assets/icons/pink-color.png",
      "red": "../../assets/icons/red-color.png",
      "white": "../../assets/icons/white-color.png"
    },
    "clothes": {
      "blazer": "../../assets/icons/blazer-clothing.png",
      "blazerAndSweater": "../../assets/icons/blazer-shirt-clothing.png",
      "sweater": "../../assets/icons/sweater-clothing.png",
      "shirt": "../../assets/icons/shirt-clothing.png",
      "graphicShirt": "../../assets/icons/graphic-shirt-clothing.png",
      "shirtCrewNeck": "../../assets/icons/crew-neck-shirt-clothing.png",
      "shirtVNeck": "../../assets/icons/v-neck-shirt-clothing.png",
      "hoodie": "../../assets/icons/hoodie-clothing.png",
      "overall": "../../assets/icons/overalls-clothing.png"
    },
    "clothesColor": {
      "black": "../../assets/icons/black-color.png",
      "blue01": "../../assets/icons/blue01-color.png",
      "blue02": "../../assets/icons/blue02-color.png",
      "blue03": "../../assets/icons/blue03-color.png",
      "gray": "../../assets/icons/gray01-color.png",
    },
    "eyes": {
      "close": "../../assets/icons/close-eyes.png",
      "cry": "../../assets/icons/cry-eyes.png",
      "default": "../../assets/icons/default-eyes.png",
      "dizzy": "../../assets/icons/dizzy-eyes.png",
      "roll": "../../assets/icons/rolling-eyes.png",
      "happy": "../../assets/icons/happy-eyes.png",
      "hearts": "../../assets/icons/hearts-eyes.png",
      "side": "../../assets/icons/side-eyes.png",
      "squint": "../../assets/icons/squint-eyes.png",
      "surprised": "../../assets/icons/surprised-eyes.png",
      "wink": "../../assets/icons/wink-eyes.png",
      "winkWacky": "../../assets/icons/wink-wacky-eyes.jpg"
    },
    "eyebrow": {
      "angry": "../../assets/icons/angry-eyebrow.png",
      "default": "../../assets/icons/default-eyebrow.png",
      "flat": "../../assets/icons/flat-eyebrow.png",
      "raised": "../../assets/icons/raised-eyebrow.png",
      "sad": "../../assets/icons/sad-eyebrow.png",
      "unibrow": "../../assets/icons/unibrow-eyebrow.png",
      "up": "../../assets/icons/up-eyebrow.png",
      "frown": "../../assets/icons/frown-eyebrow.png"
    },
    "mouth": {
      "concerned": "../../assets/icons/concerned-mouth.png",
      "default": "../../assets/icons/default-mouth.png",
      "disbelief": "../../assets/icons/disbelief-mouth.png",
      "eating": "../../assets/icons/eating-mouth.png",
      "grimace": "../../assets/icons/grimace-mouth.png",
      "sad": "../../assets/icons/sad-mouth.png",
      "scream": "../../assets/icons/scream-mouth.png",
      "smile": "../../assets/icons/smile-mouth.png",
      "tongue": "../../assets/icons/tongue-mouth.png",
      "vomit": "../../assets/icons/vomit-mouth.png"
    },
    "skin": {
      "tanned": "../../assets/icons/tanned-color.png",
      "yellow": "../../assets/icons/yellow-color.png",
      "pale": "../../assets/icons/pale-color.png",
      "light": "../../assets/icons/light-color.png",
      "brown": "../../assets/icons/brown-color.png",
      "darkBrown": "../../assets/icons/dark-brown-color.png",
      "black": "../../assets/icons/black-color.png"
    },
    "clotheGraphics": {
      "skullOutline": "../../assets/icons/skull-outline-graphics.png",
      "skull": "../../assets/icons/skull-graphics.png",
      "resist": "../../assets/icons/resist-graphics.png",
      "pizza": "../../assets/icons/pizza-graphics.png",
      "hola": "../../assets/icons/hola-graphics.png",
      "diamond": "../../assets/icons/diamond-graphics.png",
      "deer": "../../assets/icons/deer-graphics.png",
      "cumbia": "../../assets/icons/cumbia-graphics.png",
      "bear": "../../assets/icons/bear-graphics.png",
      "bat": "../../assets/icons/bat-graphics.png"
    }
  }



  humanAvatarAPIChanceStyleOptions = {
    "facialHair": {
      "facialHairChance": 100
    },
    "accessories": {
      "accessoriesChance": 100
    }
  }

  robotAvatarAPIStyleOptions = {
    "colors": {
      "amber": "../../assets/icons/auburn-color.png",
      "blue": "../../assets/icons/blue01-color.png",
      "blueGrey": "../../assets/icons/blue-gray-color.png",
      "brown": "../../assets/icons/brown-color.png",
      "cyan": "../../assets/icons/cyan-color.png",
      "deepOrange": "../../assets/icons/deep-orange-color.png",
      "deepPurple": "../../assets/icons/deep-purple-color.png",
      "green": "../../assets/icons/green-color.png",
      "grey": "../../assets/icons/gray01-color.png",
      "indigo": "../../assets/icons/indigo-color.png",
      "lightGreen": "../../assets/icons/light-green-color.png",
      "lime": "../../assets/icons/lime-color.png",
      "orange": "../../assets/icons/orange-color.png",
      "pink": "../../assets/icons/pink-color.png",
      "purple": "../../assets/icons/purple-color.png",
      "red": "../../assets/icons/red-color.png",
      "teal": "../../assets/icons/teal-color.png",
      "yellow": "../../assets/icons/yellow-color.png"
    },
    "colorful": {
      "true": "true",
      "false": "false"
    },
    "primaryColorLevel": {
      "50": "50",
      "100": "100",
      "200": "200",
      "300": "300",
      "400": "400",
      "500": "500",
      "600": "600",
      "700": "700",
      "800": "800",
      "900": "900"
    },
    "secondaryColorLevel": {
      "50": "50",
      "100": "100",
      "200": "200",
      "300": "300",
      "400": "400",
      "500": "500",
      "600": "600",
      "700": "700",
      "800": "800",
      "900": "900"
    },
    "textureChance": {
      "true": "100",
      "false": "0"
    },
    "mouthChance": {
      "true": "100",
      "false": "0"
    },
    "sidesChance": {
      "true": "100",
      "false": "0"
    },
    "topChance": {
      "true": "100",
      "false": "0"
    }
  }

  robotAvatarAPIButtonStyleOptions = {
    "colorful": {},
    "primaryColorLevel": {},
    "secondaryColorLevel": {},
    "textureChance": {},
    // "mouthChance": {},
    // "sidesChance": {},
    // "topChance": {}
  }

  constructor(private http: HttpClient) { }

  getExistingAvatarData(userAvatarId: string){
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatarData/" + userAvatarId)
  }
}
