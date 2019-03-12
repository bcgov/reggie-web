'use strict';

const { OpenShiftClientX } = require('pipeline-cli');
const path = require('path');

module.exports = () => {
  const oc = new OpenShiftClientX();
  oc.globalArgs.namespace = `devhub-${oc.options.env}`;
  const templateFile = path.resolve(__dirname, '../../openshift/dc.yaml');
  const appName = 'reggie-web';
  const buildNamespace = 'devhub-tools';
  const buildVersion = `build-v${oc.options.pr}`;
  const deploymentVersion = `${oc.options.env}-1.0.0`;
  // remove pr in prefix for test and prod environemnt:
  const projectPrefix =
    oc.options.env === 'dev' ? `-${oc.options.env}-${oc.options.pr}` : `-${oc.options.env}`;

  const extraParam = {
    REACT_APP_API_BASE_URL_VALUE:
      oc.options.env === 'prod'
        ? 'https://reggie-api-prod-devhub-prod.pathfinder.gov.bc.ca'
        : 'https://reggie-api-test-devhub-test.pathfinder.gov.bc.ca',
    REACT_APP_ROCKETCHAT_URL_VALUE:
      oc.options.env === 'prod'
        ? 'https://chat.pathfinder.gov.bc.ca/'
        : 'https://chat-test.pathfinder.gov.bc.ca/',
  };

  const objects = oc.process(oc.toFileUrl(templateFile), {
    param: {
      ...{
        NAME: appName,
        SUFFIX: projectPrefix,
        VERSION: `${deploymentVersion}`,
      },
      ...extraParam,
    },
  });

  oc.applyBestPractices(objects);
  oc.applyRecommendedLabels(objects, appName, oc.options.env, oc.options.pr);
  oc.fetchSecretsAndConfigMaps(objects);
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion);
  oc.applyAndDeploy(objects, `${appName}${projectPrefix}`);
};
