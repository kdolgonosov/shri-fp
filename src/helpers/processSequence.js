/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    __,
    allPass,
    andThen,
    gt,
    ifElse,
    length,
    lt,
    modulo,
    not,
    partialRight,
    partial,
    pipe,
    pipeWith,
    prop,
    tap,
    test,
    tryCatch,
} from 'ramda';

const api = new Api();

const square = partialRight(Math.pow, [2]);
const moduloByThree = partialRight(modulo, [3]);

const getResult = prop('result');

const isLengthLessThanTen = pipe(length, lt(__, 10));
const isLengthGreaterThanTwo = pipe(length, gt(__, 2));
const isPositive = pipe(Number, gt(__, 0));
const isNumber = partial(test, [/^\d+(\.\d+)?$/]);
const validateNumber = allPass([isLengthLessThanTen, isLengthGreaterThanTwo, isPositive, isNumber]);
const toRoundedInt = pipe(Number, Math.round);

const numberToBase = api.get('https://api.tech/numbers/base');
const getPromise = (value) => numberToBase({ from: 10, to: 2, number: value.toString() });
const getBinary = pipeWith(andThen, [getPromise, getResult]);
const apiAnimalNamePromise = (id) => api.get(`https://animals.tech/${id}`, {});

const getAnimal = pipeWith(andThen, [apiAnimalNamePromise, getResult]);

const asyncCompose = (handleError) => (f, res) => Promise.resolve(res).then(f).catch(handleError);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const tapWriteLog = tap(writeLog);
    const validationPipeline = pipe(tapWriteLog, validateNumber);
    const pipeline = pipeWith(asyncCompose(handleError), [
        toRoundedInt,
        tapWriteLog,
        getBinary,
        tapWriteLog,
        length,
        tapWriteLog,
        square,
        tapWriteLog,
        moduloByThree,
        tapWriteLog,
        getAnimal,
        handleSuccess,
    ]);
    const safePipeline = tryCatch(pipeline, handleError);
    const handleValidationError = () => handleError('ValidationError');
    const sequence = ifElse(validationPipeline, safePipeline, handleValidationError);
    sequence(value);
};

export default processSequence;
