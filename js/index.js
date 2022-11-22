// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const minWeightInput = document.querySelector('.minweight__input'); // поле с нижней границей веса
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с верхней границей веса
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// массив цветов для установки границы карточки и сортировки по цвету спектра
const colorSet = [
  {nameRu: 'красный', nameEng: 'red'},
  {nameRu: 'розово-красный', nameEng: 'carmazin'},
  {nameRu: 'оранжевый', nameEng: 'orange'},
  {nameRu: 'светло-коричневый', nameEng: 'lightbrown'},
  {nameRu: 'желтый', nameEng: 'yellow'},
  {nameRu: 'зеленый', nameEng: 'green'},
  {nameRu: 'фиолетовый', nameEng: 'violet'}
];


// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);
  }


  for (let i = 0; i < fruits.length; i++) {
    // создали элемент li
    
    const fruitItem = document.createElement("li");
    //определяем цвет границы карточки по цвету фрукта
    let colorIndex = colorSet.findIndex(colorEl => colorEl.nameRu == fruits[i].color);
    if (colorIndex != -1) {
      fruitItem.className = `fruit__item fruit_` + colorSet[colorIndex].nameEng;
    } else {
      fruitItem.className = `class="fruit__item fruit_red` ;
    }
    //добавили элемент в конец
    fruitsList.appendChild(fruitItem);

    //заполнение карточки
    const fruitInfo = document.createElement("div");
    fruitInfo.className = `fruit__info`;
    fruitItem.appendChild(fruitInfo);
    fruitInfo.insertAdjacentHTML('beforeend',`<div>index: ` + i.toString() + ` </div>`);
    fruitInfo.insertAdjacentHTML('beforeend',`<div>kind: ` + fruits[i].kind + ` </div>`); 
    fruitInfo.insertAdjacentHTML('beforeend',`<div>color: ` + fruits[i].color + ` </div>`);
    fruitInfo.insertAdjacentHTML('beforeend',`<div>weight: ` + fruits[i].weight + ` </div>`);
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    let randomIndex = getRandomInt(0, fruits.length-1);
    result.push(fruits[randomIndex]);
    fruits.splice(randomIndex, 1);
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    return (item.weight >= Number(minWeightInput.value) && item.weight <= Number(maxWeightInput.value));
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

//функция сравнения по цвету, true если a>b
const comparationColor = (a, b) => {
  // берем индексы в эталонном массиве
  let indexA = colorSet.findIndex(colorEl => colorEl.nameRu == a);
  let indexB = colorSet.findIndex(colorEl => colorEl.nameRu == b);

  if (indexA != -1 && indexB != -1 && indexA > indexB) {
    return true;
  } else {
    return false;
  }  
};

// функция обмена элементов
function swap(items, firstIndex, secondIndex){
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}

// функция разделитель
function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)],
      i = left,
      j = right;
  while (i <= j) {
     while (comparationColor(pivot.color, items[i].color)) {
        i++;
      }
      while (comparationColor(items[j].color, pivot.color)) {
        j--;
      }
      if (i <= j) {
        swap(items, i, j);
        i++;
        j--;
      }
  }
  return i;
}

const sortAPI = {
  //сортировка пузырьком
  bubbleSort(arr, comparation) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (comparation(arr[j].color, arr[j+1].color)) {
          let tmpArr = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = tmpArr;
        }
      }
    }
  },

  // алгоритм быстрой сортировки
  quickSort(arr, comparation) {
    function quickSortArr(items, left, right) {
      var index;
      if (items.length > 1) {
          left = typeof left != "number" ? 0 : left;
          right = typeof right != "number" ? items.length - 1 : right;
          index = partition(items, left, right);
          if (left < index - 1) {
              quickSortArr(items, left, index - 1);
          }
          if (index < right) {
              quickSortArr(items, index, right);
          }
      }
      return items;
    }
    quickSortArr(arr, 0, arr.length - 1)
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind == 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if (String(kindInput.value) == "" || String(colorInput.value) == "" || Number(weightInput.value) == 0) {
    alert("Не все поля заполнены!");
  } else {
    let arr = [
      {kind: String(kindInput.value), color: String(colorInput.value), weight: Number(weightInput.value)}
    ];
    console.log(arr);
    fruits.push(arr[0]);
  }
  display();
});
