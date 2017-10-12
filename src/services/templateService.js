import RNFetchBlob from 'react-native-fetch-blob';

import _size from 'lodash/size';
import _concat from 'lodash/concat';
import _forEach from 'lodash/forEach';
import _differenceWith from 'lodash/differenceWith';

const getCachedTemplates = (templateIds) => {
  // TODO: implement Caching using RNFetchBlob.
  const cachedTemplates = [];
  _forEach(templateIds, (templateId) => {
    const template = global.templates[templateId];
    if (template) {
      cachedTemplates.push(template);
    }
  })
  return cachedTemplates;
};

const getCachedTemplate = (templateId) => {
  return global.templates[templateId];
}

const cacheTemplate = (templateBundle) => {
  // TODO: implement Caching using RNFetchBlob.
  global.templates[templateBundle.templateId] = templateBundle;
};

export const fetchTemplates = (templateIds) => {
  const cachedTemplates = getCachedTemplates(templateIds);
  const templatesToFetch = _differenceWith(templateIds, cachedTemplates, (original, cached) => original === cached.templateId);

  return new Promise((resolve) => {
    if (_size(templatesToFetch) === 0) {
      resolve({
        success: cachedTemplates,
      });
      return;
    }
    let fetchedTemplatesCount = 0;
    const fetchedTemplates = [];
    const failedTemplates = [];
    _forEach(templatesToFetch, (templateId) => {
      fetchTemplate(templateId, false)
        .then((templateBundle) => {
          fetchedTemplates.push(templateBundle);
          fetchedTemplatesCount += 1;
          if (fetchedTemplatesCount >= _size(templatesToFetch)) {
            resolve({
              success: _concat(cachedTemplates, fetchedTemplates),
              error: failedTemplates
            })
          }
        })
        .catch((error) => {
          failedTemplates.push(templateId);
          fetchedTemplatesCount += 1;
          if (fetchedTemplatesCount >= _size(templatesToFetch)) {
            resolve({
              success: _concat(cachedTemplates, fetchedTemplates),
              error: failedTemplates
            })
          }
        })
    });
  })
};

export const fetchTemplate = (templateId, checkForCache = true) => {
  if (checkForCache) {
    const template = getCachedTemplate(templateId);
    if (template) {
      return new Promise((resolve) => {
        resolve(template);
      })
    }
  }
  
  console.log('fetching template: ---> ', templateId);
  return fetch(`https://spx-publisher.s3.amazonaws.com/components/${templateId}/dist/index.js`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache'
    }
  }).then((response) => {
    const templateBundle = {
      templateId,
      template: eval((response._bodyInit))
    };
    cacheTemplate(templateBundle);
    return templateBundle;
  })
};

export default {
    fetchTemplates,
    fetchTemplate
}