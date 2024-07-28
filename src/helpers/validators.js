/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    __,
    any,
    equals,
    allPass,
    compose,
    complement,
    countBy,
    both,
    pipe,
    identity,
    prop,
    partialRight,
    getType,
    gte,
    values,
    length,
    filter,
    converge,
} from 'ramda';

const getTriangleColor = prop('triangle');
const getSquareColor = prop('square');
const getCircleColor = prop('circle');
const getStarColor = prop('star');

const isRed = equals('red');
const isBlue = equals('blue');
const isOrange = equals('orange');
const isGreen = equals('green');
const isWhite = equals('white');

const countColor = (color) => pipe(values, filter(equals(color)), length);
const countRedShapes = countColor('red');
const countBlueShapes = countColor('blue');
const countOrangeShapes = countColor('orange');
const countGreenShapes = countColor('green');
const countWhiteShapes = countColor('white');

const isRedSquare = pipe(getSquareColor, isRed);
const isBlueSquare = pipe(getSquareColor, isBlue);
const isOrangeSquare = pipe(getSquareColor, isOrange);
const isGreenSquare = pipe(getSquareColor, isGreen);
const isWhiteSquare = pipe(getSquareColor, isWhite);

const isRedTriangle = pipe(getTriangleColor, isRed);
const isBlueTriangle = pipe(getTriangleColor, isBlue);
const isOrangeTriangle = pipe(getTriangleColor, isOrange);
const isGreenTriangle = pipe(getTriangleColor, isGreen);
const isWhiteTriangle = pipe(getTriangleColor, isWhite);

const isRedCircle = pipe(getCircleColor, isRed);
const isBlueCircle = pipe(getCircleColor, isBlue);
const isOrangeCircle = pipe(getCircleColor, isOrange);
const isGreenCircle = pipe(getCircleColor, isGreen);
const isWhiteCircle = pipe(getCircleColor, isWhite);

const isRedStar = pipe(getStarColor, isRed);
const isBlueStar = pipe(getStarColor, isBlue);
const isOrangeStar = pipe(getStarColor, isOrange);
const isGreenStar = pipe(getStarColor, isGreen);
const isWhiteStar = pipe(getStarColor, isWhite);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle]);

// 2. Как минимум две фигуры зеленые.
const atLeastTwo = partialRight(gte, [2]);
export const validateFieldN2 = pipe(countGreenShapes, atLeastTwo);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRedShapes, countBlueShapes]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).

const countNonWhiteColors = compose(countBy(identity), filter(complement(isWhite)), values);
const atLeastThreeOfSameColor = pipe(countNonWhiteColors, values, any(gte(__, 3)));
export const validateFieldN5 = atLeastThreeOfSameColor;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const exactlyTwoGreenShapes = pipe(countGreenShapes, equals(2));
const exactlyOneRedShape = pipe(countRedShapes, equals(1));
export const validateFieldN6 = allPass([
    isGreenTriangle,
    exactlyTwoGreenShapes,
    exactlyOneRedShape,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
    isOrangeCircle,
    isOrangeSquare,
    isOrangeTriangle,
    isOrangeStar,
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = complement(isWhiteStar);
export const validateFieldN8 = both(isNotRedStar, isNotWhiteStar);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
    isGreenCircle,
    isGreenSquare,
    isGreenTriangle,
    isGreenStar,
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = converge(equals, [getTriangleColor, getSquareColor]);
