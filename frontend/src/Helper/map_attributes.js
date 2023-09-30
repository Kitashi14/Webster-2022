/** @format */

const maps = {
  maptiler: {
    url: "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=gk56D6AEWzhtu1gTTChN",
    attribution:
      "https://api.maptiler.com/maps/basic-v2/tiles.json?key=gk56D6AEWzhtu1gTTChN",
  },

  maptiler_256: {
    url: "https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=gk56D6AEWzhtu1gTTChN",
    attribution:
      "https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=gk56D6AEWzhtu1gTTChN",
  },

  openStreet: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export default maps;
