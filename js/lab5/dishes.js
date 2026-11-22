const dishes = [
  {
    "keyword": "gazpacho",
    "name": "Гаспачо",
    "price": 195,
    "category": "soup",
    "count": "350 г",
    "image": "images/gazpacho.jpg",
    "kind": "veg"
  },
  {
    "keyword": "mushroom_soup",
    "name": "Грибной суп-пюре",
    "price": 185,
    "category": "soup",
    "count": "330 г",
    "image": "images/mushroom_soup.jpg",
    "kind": "veg"
  },
  {
    "keyword": "norwegian_soup",
    "name": "Норвежский суп",
    "price": 270,
    "category": "soup",
    "count": "330 г",
    "image": "images/norwegian_soup.jpg",
    "kind": "fish"
  },
  {
    "keyword": "tom_yum",
    "name": "Том Ям с креветками",
    "price": 365,
    "category": "soup",
    "count": "350 г",
    "image": "images/tomyum.jpg",
    "kind": "fish"
  },
  {
    "keyword": "ramen",
    "name": "Рамен с мясом",
    "price": 350,
    "category": "soup",
    "count": "350 г",
    "image": "images/ramen.jpg",
    "kind": "meat"
  },
  {
    "keyword": "chicken_soup",
    "name": "Куриный суп",
    "price": 240,
    "category": "soup",
    "count": "330 г",
    "image": "images/chicken.jpg",
    "kind": "meat"
  },
  {
    "keyword": "fried_potatoes",
    "name": "Жареная картошка с грибами",
    "price": 150,
    "category": "main_dish",
    "count": "250 г",
    "image": "images/friedpotatoeswithmushrooms1.jpg",
    "kind": "veg"
  },
  {
    "keyword": "lasagna",
    "name": "Лазанья",
    "price": 385,
    "category": "main_dish",
    "count": "310 г",
    "image": "images/lasagna.jpg",
    "kind": "meat"
  },
  {
    "keyword": "chicken_cutlets",
    "name": "Котлеты из курицы с картофельным пюре",
    "price": 225,
    "category": "main_dish",
    "count": "280 г",
    "image": "images/chickencutletsandmashedpotatoes.jpg",
    "kind": "meat"
  },
  {
    "keyword": "shrimp_pasta",
    "name": "Паста с креветками",
    "price": 390,
    "category": "main_dish",
    "count": "300 г",
    "image": "images/shrimppasta.jpg",
    "kind": "fish"
  },
  {
    "keyword": "fish_rice",
    "name": "Рыба с рисом",
    "price": 360,
    "category": "main_dish",
    "count": "300 г",
    "image": "images/fishrice.jpg",
    "kind": "fish"
  },
  {
    "keyword": "pizza",
    "name": "Пицца Маргарита",
    "price": 320,
    "category": "main_dish",
    "count": "300 г",
    "image": "images/pizza.jpg",
    "kind": "veg"
  },
  {
    "keyword": "tuna_salad",
    "name": "Салат с тунцом",
    "price": 290,
    "category": "salad",
    "count": "220 г",
    "image": "images/tunasalad.jpg",
    "kind": "fish"
  },
  {
    "keyword": "caesar",
    "name": "Цезарь с курицей",
    "price": 280,
    "category": "salad",
    "count": "220 г",
    "image": "images/caesar.jpg",
    "kind": "meat"
  },
  {
    "keyword": "egg_salad",
    "name": "Салат с яйцом",
    "price": 190,
    "category": "salad",
    "count": "200 г",
    "image": "images/saladwithegg.jpg",
    "kind": "veg"
  },
  {
    "keyword": "caprese",
    "name": "Капрезе",
    "price": 250,
    "category": "salad",
    "count": "200 г",
    "image": "images/caprese.jpg",
    "kind": "veg"
  },
  {
    "keyword": "fries_small",
    "name": "Картофель фри",
    "price": 120,
    "category": "salad",
    "count": "150 г",
    "image": "images/frenchfries1.jpg",
    "kind": "veg"
  },
  {
    "keyword": "fries_large",
    "name": "Картофель фри большой",
    "price": 170,
    "category": "salad",
    "count": "220 г",
    "image": "images/frenchfries2.jpg",
    "kind": "veg"
  },
  {
    "keyword": "orange_juice",
    "name": "Апельсиновый сок",
    "price": 120,
    "category": "drink",
    "count": "300 мл",
    "image": "images/orangejuice.jpg",
    "kind": "cold"
  },
  {
    "keyword": "apple_juice",
    "name": "Яблочный сок",
    "price": 90,
    "category": "drink",
    "count": "300 мл",
    "image": "images/applejuice.jpg",
    "kind": "cold"
  },
  {
    "keyword": "carrot_juice",
    "name": "Морковный сок",
    "price": 110,
    "category": "drink",
    "count": "300 мл",
    "image": "images/carrotjuice.jpg",
    "kind": "cold"
  },
  {
    "keyword": "tea",
    "name": "Чёрный чай",
    "price": 80,
    "category": "drink",
    "count": "250 мл",
    "image": "images/tea.jpg",
    "kind": "hot"
  },
  {
    "keyword": "green_tea",
    "name": "Зелёный чай",
    "price": 80,
    "category": "drink",
    "count": "250 мл",
    "image": "images/greentea.jpg",
    "kind": "hot"
  },
  {
    "keyword": "cappuccino",
    "name": "Капучино",
    "price": 150,
    "category": "drink",
    "count": "250 мл",
    "image": "images/cappuccino.jpg",
    "kind": "hot"
  },
  {
    "keyword": "baklava",
    "name": "Пахлава",
    "price": 140,
    "category": "dessert",
    "count": "80 г",
    "image": "images/baklava.jpg",
    "kind": "small"
  },
  {
    "keyword": "cheesecake",
    "name": "Чизкейк",
    "price": 210,
    "category": "dessert",
    "count": "120 г",
    "image": "images/checheesecake.jpg",
    "kind": "small"
  },
  {
    "keyword": "chocolate_cheesecake",
    "name": "Шоколадный чизкейк",
    "price": 230,
    "category": "dessert",
    "count": "120 г",
    "image": "images/chocolatecheesecake.jpg",
    "kind": "small"
  },
  {
    "keyword": "chocolate_cake",
    "name": "Шоколадный торт",
    "price": 280,
    "category": "dessert",
    "count": "180 г",
    "image": "images/chocolatecake.jpg",
    "kind": "medium"
  },
  {
    "keyword": "donuts",
    "name": "Пончики",
    "price": 200,
    "category": "dessert",
    "count": "180 г",
    "image": "images/donuts.jpg",
    "kind": "medium"
  },
  {
    "keyword": "donuts_large",
    "name": "Пончики большая порция",
    "price": 350,
    "category": "dessert",
    "count": "350 г",
    "image": "images/donuts2.jpg",
    "kind": "large"
  }
];
