const competitionService = require('../services/competition.service');
const { successResponse } = require('../utils/apiResponse');

const getCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await competitionService.getCompetitionById(id, req.user);
    return successResponse(res, result, 'Competition details retrieved');
  } catch (error) {
    next(error);
  }
};

const listCompetitions = async (req, res, next) => {
  try {
    const list = await competitionService.listCompetitions(req.query);
    return successResponse(res, { competitions: list }, 'Competitions retrieved');
  } catch (error) {
    next(error);
  }
};

const getResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await competitionService.getCompetitionResults(id);
    return successResponse(res, results, 'Competition results retrieved');
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await competitionService.getCompetitionReviews(id);
    return successResponse(res, { reviews }, 'Competition reviews retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompetition,
  listCompetitions,
  getResults,
  getReviews,
};
