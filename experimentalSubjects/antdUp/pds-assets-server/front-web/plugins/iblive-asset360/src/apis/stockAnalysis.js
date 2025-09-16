import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/assets360';

/**
 * @param {} data
 * @returns 市场股票池
 */
export const queryPage = (data) => {
  return request(`${prefix}/market/pool/queryPage`, {
    method: 'POST',
    ...data,
  });
};

/**
 * @param {object} data
 * @returns 加入研究池
 */
export const addToPool = (data) => {
  return request(`${prefix}/research/pool/add`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 查询研究池
 */
export const queryPoolPage = (data) => {
  return request(`${prefix}/research/pool/queryPage`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 从研究池删除
 */
export const removeFromPool = (data) => {
  return request(`${prefix}/research/pool/remove`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 查询问题池问题
 */
export const querySecQuestionPool = (data = {}) => {
  return request(`${prefix}/sec/question/querySecQuestionPool`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 新增问题
 */
export const addSecQuestion = (data) => {
  return request(`${prefix}/sec/question/addQuestion`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 分页查询问题
 */
export const querySecQuestionPage = (data) => {
  return request(`${prefix}/sec/question/queryPage`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 回复问题
 */
export const answerQuestion = (data) => {
  return request(`${prefix}/sec/question/answerQuestion`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 对回复进行点评
 */
export const commentAnswer = (data) => {
  return request(`${prefix}/sec/question/commentAnswer`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 修改问题
 */
export const updateQuestion = (data) => {
  return request(`${prefix}/sec/question/updateQuestion`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 删除问题
 */
export const removeQuestion = (data) => {
  return request(`${prefix}/sec/question/removeQuestion`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 获取标签列表
 */
export const querySecQuestionTag = (data) => {
  return request(`${prefix}/sec/question/querySecQuestionTag`, {
    method: 'POST',
    ...data,
  });
};

/**
 * 获取行情
 */
export const querySector = () => {
  return request(`${prefix}/market/pool/querySector`, {
    method: 'POST',
  });
};
