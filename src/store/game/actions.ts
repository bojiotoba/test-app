import { getBreeds, getRandomBreed } from '../../services/dogs-api';
import getProbablyAnswers from '../../helpers/randomizer';
import {
  GameActionsTypes,
  REQUEST_ALL_BREEDS,
  SUCCESS_ALL_BREEDS,
  FAIL_ALL_BREEDS,
  REQUEST_NEXT_QUESTION,
  SUCCESS_NEXT_QUESTION,
  FAIL_NEXT_QUESTION,
  INIT_CHOOSE,
  RESTART_QUIZ,
} from './types';

const getAllBreeds = () => (
  async (dispatch: (action: GameActionsTypes) => void) => {
    dispatch({ type: REQUEST_ALL_BREEDS });

    try {
      const breeds = await getBreeds();

      dispatch({
        type: SUCCESS_ALL_BREEDS,
        breeds,
      });
    } catch (err) {
      dispatch({
        type: FAIL_ALL_BREEDS,
        errorMessage: 'Error with network',
      });
    }
  }
);

const initQuestion = () => (
  async (dispatch: (action: GameActionsTypes) => void, getState) => {
    dispatch({ type: REQUEST_NEXT_QUESTION });
    const { breedNames } = getState().game;
    const choices = getProbablyAnswers(breedNames);
    const correctAnswer = choices[Math.floor(Math.random() * choices.length)];
    const splitAnswer = correctAnswer.split(' ');
    const answerLength = splitAnswer.length;
    const breed = splitAnswer[answerLength - 1];
    const subBreed = answerLength === 1 ? null : splitAnswer.slice(0, answerLength - 1).join(' ');

    try {
      const imageUrl = await getRandomBreed(breed, subBreed);
      dispatch({
        correctAnswer,
        choices,
        imageUrl,
        type: SUCCESS_NEXT_QUESTION,
      });
    } catch (err) {
      dispatch({
        type: FAIL_NEXT_QUESTION,
        errorMessage: 'Error with network',
      });
    }
  }
);

const initChoose = (choose: string) => ({
  type: INIT_CHOOSE,
  choose,
});

const restartQuiz = () => ({
  type: RESTART_QUIZ,
});

export default {
  getAllBreeds,
  initQuestion,
  initChoose,
  restartQuiz,
};
